import { useEffect, useRef, useState } from "react";
import { checkoutApiUrl, type CheckoutCustomer } from "@/lib/checkout";
import {
  createOrder,
  createPayment,
  openEpay,
  refreshOrder,
  type OrderAccess,
} from "@/lib/checkoutApi";
import { type CartItem } from "@/lib/cart";
import type { OrderRequest, PublicOrder } from "@shared/checkout";

const STORAGE_KEY = "aca-checkout-sandbox-v1";
function savedAccess(): OrderAccess | undefined {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (
      typeof saved?.orderId === "string" &&
      /^[a-f0-9]{64}$/.test(saved?.token)
    )
      return saved;
  } catch {
    /* Storage may be unavailable; current tab still works. */
  }
}
const statusText: Record<PublicOrder["status"], string> = {
  awaiting_review: "Ожидает проверки менеджером",
  confirmed: "Условия подтверждены менеджером",
  payment_pending: "Ожидаем результат тестового платежа",
  authorized: "Средства авторизованы; списание не подтверждено",
  paid: "Тестовая оплата подтверждена банком",
  failed: "Банк не подтвердил оплату",
  cancelled: "Платёж отменён",
  refunded: "Банк сообщил о возврате",
};

/** Mounted only with explicit sandbox configuration; never shown on normal checkout. */
export function CheckoutSandbox(props: {
  customer: CheckoutCustomer;
  items: CartItem[];
  validate: () => boolean;
}) {
  if (!checkoutApiUrl()) return null;
  return <SandboxOrder {...props} />;
}
function SandboxOrder({
  customer,
  items,
  validate,
}: {
  customer: CheckoutCustomer;
  items: CartItem[];
  validate: () => boolean;
}) {
  const [access, setAccess] = useState<OrderAccess | undefined>(savedAccess);
  const [order, setOrder] = useState<PublicOrder>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const inFlight = useRef(false);
  const pending = useRef<{ fingerprint: string; token: string } | undefined>(
    undefined
  );
  const execute = async (action: () => Promise<void>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch {
      setError(
        "Не удалось получить подтверждение сервера. Статус оплаты неизвестен. Обновите статус или обратитесь к менеджеру; повторный заказ для оплаты не создавайте."
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const update = (next: PublicOrder) => {
    setAccepted(false);
    setOrder(next);
  };
  useEffect(() => {
    if (access) void execute(async () => update(await refreshOrder(access)));
  }, [access?.orderId]);
  const submit = () =>
    execute(async () => {
      if (!validate()) return;
      const input: OrderRequest = {
        provider: "halyk-epay",
        cartVersion: 1,
        items: items.map(
          ({ productId, productHandle, variantId, quantity }) => ({
            productId,
            productHandle,
            variantId,
            quantity,
          })
        ),
        customer: {
          ...customer,
          email: customer.email.trim(),
          bin: customer.bin.replace(/\s/g, ""),
          consent: true,
        },
      };
      const fingerprint = JSON.stringify(input);
      if (!pending.current || pending.current.fingerprint !== fingerprint) {
        pending.current = {
          fingerprint,
          token: Array.from(crypto.getRandomValues(new Uint8Array(32)), byte =>
            byte.toString(16).padStart(2, "0")
          ).join(""),
        };
      }
      const result = await createOrder(input, pending.current.token);
      const nextAccess = {
        orderId: result.orderId,
        token: pending.current.token,
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextAccess));
      } catch {
        /* No bank tokens are persisted in the browser. */
      }
      setAccess(nextAccess);
      update(result);
    });
  const quote = order?.confirmation;
  const payable =
    order &&
    quote &&
    ["confirmed", "payment_pending"].includes(order.status) &&
    Date.parse(quote.expiresAt) > Date.now();
  return (
    <section
      className="mt-6 rounded border border-[#FFC000]/50 p-5"
      aria-label="Тестирование Halyk epay"
    >
      <h2 className="text-xl font-bold text-[#FFC000]">
        Тестовая среда Halyk epay
      </h2>
      <p className="mt-2 text-sm text-gray-300">
        Только тестовые данные и тестовые карты банка. Реальная оплата
        недоступна.
      </p>
      {!access ? (
        <button
          type="button"
          disabled={busy || items.length === 0}
          onClick={() => void submit()}
          className="mt-3 min-h-12 rounded border px-4 disabled:opacity-40"
        >
          Передать тестовый заказ на проверку
        </button>
      ) : (
        <>
          <p className="mt-3 break-all text-sm">Заказ: {access.orderId}</p>
          <p className="mt-2" role="status">
            {order ? statusText[order.status] : "Получаем статус заказа…"}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void execute(async () => update(await refreshOrder(access)))
            }
            className="mt-3 min-h-12 rounded border px-4 disabled:opacity-40"
          >
            Обновить статус заказа
          </button>
          {quote && (
            <div className="mt-4 grid gap-2 text-sm">
              <p className="font-bold">
                Итого с доставкой и согласованными налогами:{" "}
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "KZT",
                  minimumFractionDigits: 2,
                }).format(quote.amountMinor / 100)}
              </p>
              <p>Поставка: {quote.supplyTerms}</p>
              <p>Доставка: {quote.deliveryTerms}</p>
              <p>
                Предложение действует до:{" "}
                {new Date(quote.expiresAt).toLocaleString("ru-RU")}
              </p>
              <p>
                Состав заказа зафиксирован при отправке. Изменения корзины не
                меняют этот заказ.
              </p>
              <ul>
                {order.items.map(item => (
                  <li key={`${item.productId}:${item.variantId}`}>
                    {item.productHandle}
                    {item.variantId ? ` / ${item.variantId}` : ""} —{" "}
                    {item.quantity} шт.
                  </li>
                ))}
              </ul>
            </div>
          )}
          {payable && (
            <>
              <label className="mt-4 flex gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={event => setAccepted(event.target.checked)}
                />
                Принимаю подтверждённый состав, сумму и сроки заказа
              </label>
              <button
                type="button"
                disabled={busy || !accepted}
                onClick={() =>
                  void execute(async () => {
                    if (!accepted || !order) return;
                    await openEpay(await createPayment(access, order));
                  })
                }
                className="mt-3 min-h-12 rounded bg-[#FFC000] px-4 font-bold text-black disabled:opacity-40"
              >
                Перейти к тестовой оплате
              </button>
            </>
          )}
        </>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#FFD24A]">
          {error}
        </p>
      )}
    </section>
  );
}

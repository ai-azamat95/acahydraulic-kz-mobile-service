import { type FormEvent, useRef, useState } from "react";
import { CreditCard, LockKeyhole, MessageCircle, PackageCheck, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

import { CommerceHeader } from "@/components/cart/CommerceHeader";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { formatKzt } from "@/lib/cart";
import {
  checkoutWhatsappText,
  createPayment,
  paymentApiUrl,
  validateCheckout,
  type CheckoutCustomer,
  type CheckoutErrors,
} from "@/lib/checkout";

const WHATSAPP_NUMBER = "77714177925";

const initialCustomer: CheckoutCustomer = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  deliveryMethod: "transport-company",
  deliveryAddress: "",
  bin: "",
  comment: "",
  consent: false,
};

const fieldClass = "mt-2 min-h-12 w-full rounded border border-white/15 bg-[#0f0f0f] px-3 text-base text-white placeholder:text-gray-600 focus:border-[#FFC000] focus:outline-none";

export default function Checkout() {
  const { items, summary } = useCart();
  const [customer, setCustomer] = useState(initialCustomer);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [paymentError, setPaymentError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const providerConfigured = Boolean(paymentApiUrl());
  const paymentEnabled = providerConfigured && summary.canRequestOnlinePayment;

  const setField = <Key extends keyof CheckoutCustomer>(key: Key, value: CheckoutCustomer[Key]) => {
    setCustomer((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors = validateCheckout(customer, items);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.setTimeout(() => errorSummaryRef.current?.focus(), 0);
      return false;
    }
    return true;
  };

  const sendToWhatsApp = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(checkoutWhatsappText(customer, items))}`, "_blank", "noopener,noreferrer");
  };

  const startPayment = async () => {
    if (!paymentEnabled || !validate()) return;
    setPaymentError("");
    setPaymentLoading(true);
    try {
      const { consent: _consent, ...customerPayload } = customer;
      const payment = await createPayment({
        cartVersion: 1,
        items: items.map(({ productId, productHandle, variantId, quantity }) => ({ productId, productHandle, variantId, quantity })),
        customer: customerPayload,
        returnUrl: `${window.location.origin}/checkout?payment=return`,
      });
      window.location.assign(payment.paymentUrl);
    } catch {
      setPaymentError("Не удалось создать платёж. Корзина не списана — отправьте заказ менеджеру или попробуйте позже.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto">
      <SEO title="Оформление заказа — ACA Hydraulic" description="Оформление заказа запчастей ACA Hydraulic с проверкой совместимости, цены и способа доставки." canonical="/checkout" noIndex />
      <CommerceHeader backHref="/cart" backLabel="Вернуться в корзину" />
      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#FFC000]">Шаг 2 из 3</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">Оформление заказа</h1>
        <p className="mt-3 max-w-3xl leading-7 text-gray-400">Оставьте контакты и способ доставки. Мы не списываем деньги, пока защищённый сервер не подтвердит товары и сумму.</p>

        {items.length === 0 ? (
          <section className="mt-10 rounded border border-white/10 bg-[#151515] p-8 text-center">
            <PackageCheck className="mx-auto h-12 w-12 text-[#FFC000]" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">В корзине нет товаров</h2>
            <Link href="/catalog" className="mt-6 inline-flex min-h-12 items-center rounded bg-[#FFC000] px-6 font-extrabold text-black">Перейти в каталог</Link>
          </section>
        ) : (
          <form onSubmit={sendToWhatsApp} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start" noValidate>
            <div className="grid gap-6">
              {Object.keys(errors).length > 0 && (
                <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="rounded border border-[#FFC000]/50 bg-[#FFC000]/5 p-4 outline-none focus:ring-2 focus:ring-[#FFC000]">
                  <p className="font-bold text-[#FFC000]">Проверьте данные заказа</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-200">{Object.values(errors).filter(Boolean).map((error) => <li key={error}>{error}</li>)}</ul>
                </div>
              )}

              <section className="rounded border border-white/10 bg-[#151515] p-5 md:p-7" aria-labelledby="contact-title">
                <h2 id="contact-title" className="text-2xl font-bold">1. Контактные данные</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-medium text-gray-200">Имя получателя <span className="text-[#FFC000]">*</span>
                    <input value={customer.fullName} onChange={(event) => setField("fullName", event.target.value)} autoComplete="name" className={fieldClass} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
                    {errors.fullName && <span id="fullName-error" className="mt-1 block text-xs text-[#FFD24A]">{errors.fullName}</span>}
                  </label>
                  <label className="text-sm font-medium text-gray-200">Телефон <span className="text-[#FFC000]">*</span>
                    <input type="tel" inputMode="tel" value={customer.phone} onChange={(event) => setField("phone", event.target.value)} placeholder="+7 700 000 00 00" autoComplete="tel" className={fieldClass} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
                    {errors.phone && <span id="phone-error" className="mt-1 block text-xs text-[#FFD24A]">{errors.phone}</span>}
                  </label>
                  <label className="text-sm font-medium text-gray-200">Email
                    <input type="email" value={customer.email} onChange={(event) => setField("email", event.target.value)} autoComplete="email" className={fieldClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                    {errors.email && <span id="email-error" className="mt-1 block text-xs text-[#FFD24A]">{errors.email}</span>}
                  </label>
                  <label className="text-sm font-medium text-gray-200">БИН компании
                    <input inputMode="numeric" value={customer.bin} onChange={(event) => setField("bin", event.target.value)} placeholder="12 цифр, если нужен счёт" className={fieldClass} aria-invalid={Boolean(errors.bin)} aria-describedby={errors.bin ? "bin-error" : undefined} />
                    {errors.bin && <span id="bin-error" className="mt-1 block text-xs text-[#FFD24A]">{errors.bin}</span>}
                  </label>
                </div>
              </section>

              <section className="rounded border border-white/10 bg-[#151515] p-5 md:p-7" aria-labelledby="delivery-title">
                <h2 id="delivery-title" className="text-2xl font-bold">2. Доставка</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-medium text-gray-200">Город <span className="text-[#FFC000]">*</span>
                    <input value={customer.city} onChange={(event) => setField("city", event.target.value)} autoComplete="address-level2" className={fieldClass} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined} />
                    {errors.city && <span id="city-error" className="mt-1 block text-xs text-[#FFD24A]">{errors.city}</span>}
                  </label>
                  <label className="text-sm font-medium text-gray-200">Способ получения <span className="text-[#FFC000]">*</span>
                    <select value={customer.deliveryMethod} onChange={(event) => setField("deliveryMethod", event.target.value as CheckoutCustomer["deliveryMethod"])} className={fieldClass}>
                      <option value="transport-company">Транспортная компания</option>
                      <option value="courier">Доставка по адресу</option>
                      <option value="pickup">Самовывоз по согласованию</option>
                    </select>
                  </label>
                </div>
                {customer.deliveryMethod !== "pickup" && (
                  <label className="mt-5 block text-sm font-medium text-gray-200">Адрес или отделение <span className="text-[#FFC000]">*</span>
                    <input value={customer.deliveryAddress} onChange={(event) => setField("deliveryAddress", event.target.value)} autoComplete="street-address" className={fieldClass} aria-invalid={Boolean(errors.deliveryAddress)} aria-describedby={errors.deliveryAddress ? "deliveryAddress-error" : undefined} />
                    {errors.deliveryAddress && <span id="deliveryAddress-error" className="mt-1 block text-xs text-[#FFD24A]">{errors.deliveryAddress}</span>}
                  </label>
                )}
                <label className="mt-5 block text-sm font-medium text-gray-200">Комментарий к заказу
                  <textarea value={customer.comment} onChange={(event) => setField("comment", event.target.value)} rows={4} placeholder="Модель техники, серийный номер, нужная дата или пожелания по доставке" className={`${fieldClass} py-3`} />
                </label>
              </section>
            </div>

            <aside className="rounded border border-white/10 bg-[#151515] p-5 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold">3. Проверка и оплата</h2>
              <ul className="mt-4 grid gap-3 border-b border-white/10 pb-4">
                {items.map((item) => <li key={item.id} className="flex justify-between gap-4 text-sm"><span className="line-clamp-2 text-gray-300">{item.title} × {item.quantity}</span><span className="shrink-0 font-bold text-white">{item.unitPriceKzt === null ? "Расчёт" : formatKzt(item.unitPriceKzt * item.quantity)}</span></li>)}
              </ul>
              <div className="mt-4 flex items-end justify-between gap-4"><span className="text-sm text-gray-400">Подтверждённая сумма</span><strong className="text-2xl text-[#FFC000]">{formatKzt(summary.totalKzt)}</strong></div>
              {summary.quoteLineCount > 0 && <p className="mt-2 text-xs leading-5 text-gray-400">{summary.quoteLineCount} поз. требуют проверки цены. Онлайн-оплата для смешанного заказа недоступна.</p>}

              <label className="mt-5 flex min-h-11 items-start gap-3 text-sm leading-6 text-gray-300">
                <input type="checkbox" checked={customer.consent} onChange={(event) => setField("consent", event.target.checked)} className="mt-1 h-5 w-5 accent-[#FFC000]" aria-invalid={Boolean(errors.consent)} />
                <span>Согласен на обработку данных для оформления заказа и обратной связи. <Link href="/privacy" className="text-[#FFC000] underline">Политика конфиденциальности</Link>.</span>
              </label>
              {errors.consent && <p className="mt-1 text-xs text-[#FFD24A]">{errors.consent}</p>}

              <button type="submit" className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-4 font-extrabold text-black hover:bg-[#E6AC00]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Отправить заказ менеджеру
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-gray-500"><span className="h-px flex-1 bg-white/10" />или онлайн<span className="h-px flex-1 bg-white/10" /></div>

              <button
                type="button"
                onClick={() => void startPayment()}
                disabled={!paymentEnabled || paymentLoading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded border border-white/20 px-4 font-bold text-white hover:border-[#FFC000] disabled:cursor-not-allowed disabled:opacity-45"
                aria-describedby="payment-status"
              >
                {paymentLoading ? <LockKeyhole className="h-5 w-5 animate-pulse" aria-hidden="true" /> : <CreditCard className="h-5 w-5" aria-hidden="true" />}
                {paymentLoading ? "Создаём безопасный платёж…" : "Оплатить онлайн"}
              </button>
              <div id="payment-status" className="mt-3 flex items-start gap-2 text-xs leading-5 text-gray-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC000]" aria-hidden="true" />
                <span>{!providerConfigured ? "Онлайн-оплата подготовлена, но ещё не подключена: нужен договор эквайринга и защищённый платёжный сервер." : summary.quoteLineCount > 0 ? "Сначала менеджер подтвердит цены всех позиций и сформирует сумму." : "Платёж создаётся сервером после повторной проверки цен. Реквизиты карты ACA Hydraulic не получает."}</span>
              </div>
              {paymentError && <p className="mt-3 text-sm text-[#FFD24A]" role="alert">{paymentError}</p>}
            </aside>
          </form>
        )}
      </main>
    </div>
  );
}

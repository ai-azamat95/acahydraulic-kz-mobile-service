import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { CheckoutService } from "./service";
import { OrderStore } from "./store";
import { fakeGateway, input, terms, token } from "./test-fixtures";

let store: OrderStore;
let gateway: ReturnType<typeof fakeGateway>;
let service: CheckoutService;
const acceptance = { confirmationVersion: 1, acceptConfirmedTerms: true };
beforeEach(() => {
  store = new OrderStore(":memory:");
  gateway = fakeGateway();
  service = new CheckoutService(store, gateway, () => {});
});
afterEach(() => {
  store.close();
  vi.restoreAllMocks();
});
function confirmed() {
  const order = service.create(input, token);
  service.confirm(order.orderId, terms(), "manager-test");
  return order.orderId;
}
function bankResult(id: string, statusName: string, override = {}) {
  gateway.result = {
    resultCode: "100",
    transaction: {
      id: "bank-transaction",
      invoiceID: store.get(id).attempt!.invoiceId,
      amount: terms().amountMinor / 100,
      currency: "KZT",
      terminalID: gateway.terminalId,
      statusName,
      ...override,
    },
  };
}
describe("manager-approved orders", () => {
  it("creates only awaiting_review orders and is idempotent", () => {
    const first = service.create(input, token);
    expect(service.create(input, token)).toEqual(first);
    expect(first.status).toBe("awaiting_review");
    expect(first).not.toHaveProperty("accessHash");
    expect(() =>
      service.create(
        { ...input, items: [{ ...input.items[0], quantity: 3 }] },
        token
      )
    ).toThrow("IDEMPOTENCY_CONFLICT");
  });
  it.each([
    { amount: 1 },
    { confirmation: terms() },
    { provider: "kaspi-webpay" },
    { customer: { ...input.customer, consent: false } },
    { items: [] },
    { items: [{ ...input.items[0], quantity: -1 }] },
    { items: [{ ...input.items[0], quantity: 1.5 }] },
    { items: [input.items[0], input.items[0]] },
    { items: [{ ...input.items[0], unitPriceKzt: 1 }] },
  ])("rejects invalid or price-bearing browser input %j", patch =>
    expect(() => service.create({ ...input, ...patch }, token)).toThrow()
  );
  it("cannot access another order", () => {
    const id = service.create(input, token).orderId;
    expect(() => service.get(id, "b".repeat(64))).toThrow("ORDER_NOT_FOUND");
    expect(() => service.get(id, "")).toThrow("ORDER_NOT_FOUND");
  });
  it("rejects payment before manager approval without contacting bank", async () => {
    const id = service.create(input, token).orderId;
    await expect(service.startPayment(id, token, acceptance)).rejects.toThrow(
      "ORDER_NOT_CONFIRMED"
    );
    expect(gateway.createSession).not.toHaveBeenCalled();
  });
  it.each([
    { compatibilityConfirmed: false },
    { availabilityConfirmed: false },
    { amountMinor: 0 },
    { amountMinor: 1.1 },
    { currency: "USD" },
    { supplyTerms: "" },
  ])("requires all manager terms %j", patch => {
    const id = service.create(input, token).orderId;
    expect(() =>
      service.confirm(id, { ...terms(), ...patch }, "manager")
    ).toThrow();
  });
  it("rejects stale terms, missing acceptance, expired quotes and bank-invoice orders", async () => {
    const id = confirmed();
    await expect(
      service.startPayment(id, token, {
        ...acceptance,
        acceptConfirmedTerms: false,
      })
    ).rejects.toThrow();
    service.confirm(id, terms(), "manager");
    await expect(service.startPayment(id, token, acceptance)).rejects.toThrow(
      "ORDER_NOT_CONFIRMED"
    );
    const expired = store.get(id);
    expired.confirmation!.expiresAt = new Date(0).toISOString();
    store.save(expired);
    await expect(
      service.startPayment(id, token, { ...acceptance, confirmationVersion: 2 })
    ).rejects.toThrow("QUOTE_EXPIRED");
    const offline = service.create(
      { ...input, provider: "bank-invoice" },
      "b".repeat(64)
    );
    service.confirm(offline.orderId, terms(), "manager");
    await expect(
      service.startPayment(offline.orderId, "b".repeat(64), acceptance)
    ).rejects.toThrow("PROVIDER_NOT_ONLINE");
  });
  it("reuses one invoice and locks manager edits after the first attempt", async () => {
    const id = confirmed();
    const first = await service.startPayment(id, token, acceptance);
    expect(await service.startPayment(id, token, acceptance)).toEqual(first);
    expect(gateway.createSession).toHaveBeenCalledOnce();
    expect(() => service.confirm(id, terms(), "manager")).toThrow(
      "ORDER_LOCKED"
    );
  });
  it("concurrent calls cannot create two sessions", async () => {
    const id = confirmed();
    const results = await Promise.allSettled([
      service.startPayment(id, token, acceptance),
      service.startPayment(id, token, acceptance),
    ]);
    expect(
      results.filter(result => result.status === "fulfilled")
    ).toHaveLength(1);
    expect(gateway.createSession).toHaveBeenCalledOnce();
  });
  it("ambiguous bank errors leave a durable reservation and block automatic retry", async () => {
    const id = confirmed();
    vi.mocked(gateway.createSession).mockRejectedValueOnce(
      new Error("timeout")
    );
    await expect(service.startPayment(id, token, acceptance)).rejects.toThrow(
      "timeout"
    );
    await expect(service.startPayment(id, token, acceptance)).rejects.toThrow(
      "PAYMENT_ALREADY_STARTED"
    );
    expect(store.get(id).status).toBe("payment_pending");
    expect(gateway.createSession).toHaveBeenCalledOnce();
  });
});
describe("bank reconciliation", () => {
  it.each(["NEW", "FINGERPRINT", "3D", "VERIFIED", "UNKNOWN"])(
    "does not mark %s paid",
    async status => {
      const id = confirmed();
      await service.startPayment(id, token, acceptance);
      bankResult(id, status);
      expect((await service.refresh(id, token)).status).toBe("payment_pending");
    }
  );
  it.each([
    ["AUTH", "authorized"],
    ["CHARGE", "paid"],
    ["REFUND", "refunded"],
    ["CANCEL", "cancelled"],
    ["REJECT", "failed"],
  ])("maps %s to %s", async (bank, expected) => {
    const id = confirmed();
    await service.startPayment(id, token, acceptance);
    bankResult(id, bank);
    expect((await service.refresh(id, token)).status).toBe(expected);
  });
  it.each([
    { amount: 1 },
    { currency: "USD" },
    { terminalID: "other-terminal" },
    { invoiceID: "999999" },
  ])("rejects mismatched bank evidence %j", async override => {
    const id = confirmed();
    await service.startPayment(id, token, acceptance);
    bankResult(id, "CHARGE", override);
    await expect(service.refresh(id, token)).rejects.toThrow(
      "PAYMENT_MISMATCH"
    );
    expect(store.get(id).status).toBe("payment_pending");
  });
  it("rejects spoofed callbacks, handles duplicate delivery and requires the status API", async () => {
    const id = confirmed();
    await service.startPayment(id, token, acceptance);
    const attempt = store.get(id).attempt!;
    const callback = {
      invoiceId: attempt.invoiceId,
      secret_hash: attempt.secretHash,
      terminal: gateway.terminalId,
      amount: terms().amountMinor / 100,
      currency: "KZT",
      code: "ok",
    };
    await expect(
      service.callback({ ...callback, secret_hash: "fake" })
    ).rejects.toThrow("CALLBACK_INVALID");
    await service.callback(callback);
    expect(store.get(id).status).toBe("payment_pending");
    bankResult(id, "CHARGE");
    await service.callback(callback);
    await service.callback(callback);
    expect(store.get(id).status).toBe("paid");
    bankResult(id, "AUTH");
    await service.callback(callback);
    expect(store.get(id).status).toBe("paid");
    bankResult(id, "REFUND");
    await service.callback(callback);
    expect(store.get(id).status).toBe("refunded");
    bankResult(id, "CHARGE");
    await service.callback(callback);
    expect(store.get(id).status).toBe("refunded");
  });
  it("keeps pending on missing/uncertain bank result", async () => {
    const id = confirmed();
    await service.startPayment(id, token, acceptance);
    for (const resultCode of ["101", "102", "103", "107", "999"]) {
      gateway.result = { resultCode, transaction: null };
      expect((await service.refresh(id, token)).status).toBe("payment_pending");
    }
  });
});
it("persists session and invoice uniqueness across server restarts", async () => {
  const directory = mkdtempSync(path.join(tmpdir(), "aca-checkout-"));
  const filename = path.join(directory, "orders.sqlite");
  const firstStore = new OrderStore(filename);
  try {
    const firstService = new CheckoutService(firstStore, gateway, () => {});
    const id = firstService.create(input, token).orderId;
    firstService.confirm(id, terms(), "manager");
    const firstSession = await firstService.startPayment(id, token, acceptance);
    firstStore.close();
    const secondStore = new OrderStore(filename);
    try {
      const secondService = new CheckoutService(secondStore, gateway, () => {});
      expect(await secondService.startPayment(id, token, acceptance)).toEqual(
        firstSession
      );
      const secondId = secondService.create(input, "b".repeat(64)).orderId;
      secondService.confirm(secondId, terms(), "manager");
      const secondSession = await secondService.startPayment(
        secondId,
        "b".repeat(64),
        acceptance
      );
      expect(secondSession.payment.invoiceId.slice(-6)).not.toBe(
        firstSession.payment.invoiceId.slice(-6)
      );
    } finally {
      secondStore.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

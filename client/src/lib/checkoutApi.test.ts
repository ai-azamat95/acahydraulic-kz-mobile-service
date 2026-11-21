import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createOrder, createPayment, refreshOrder } from "./checkoutApi";
import { input } from "../../../server/checkout/test-fixtures";
import type { PublicOrder } from "@shared/checkout";
const access = {
  orderId: "10000000-0000-4000-8000-000000000001",
  token: "a".repeat(64),
};
const order: PublicOrder = {
  orderId: access.orderId,
  provider: "halyk-epay",
  status: "confirmed",
  items: input.items,
  confirmation: {
    amountMinor: 12345,
    currency: "KZT",
    compatibilityConfirmed: true,
    availabilityConfirmed: true,
    deliveryTerms: "Delivery included",
    supplyTerms: "21 days",
    version: 2,
    confirmedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
};
function session() {
  return {
    orderId: access.orderId,
    provider: "halyk-epay",
    environment: "sandbox",
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    payment: {
      invoiceId: "100001",
      terminal: "sandbox-terminal",
      amount: 123.45,
      currency: "KZT",
      description: "test",
      language: "rus",
      backLink: "https://acahydraulic.kz/checkout?payment=return",
      failureBackLink: "https://acahydraulic.kz/checkout?payment=return",
      postLink: "https://api.example.kz/api/checkout/epay/postlink",
      failurePostLink: "https://api.example.kz/api/checkout/epay/postlink",
      auth: {
        access_token: "fake",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "payment",
        refresh_token: "",
      },
    },
  };
}
beforeEach(() => {
  vi.stubEnv("VITE_CHECKOUT_MODE", "sandbox");
  vi.stubEnv("VITE_CHECKOUT_API_URL", "https://api.example.kz/api/checkout");
  vi.stubGlobal("window", { location: { origin: "https://acahydraulic.kz" } });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("checkout client protocol", () => {
  it("creates a review request with no amount, redirect URL or approval", async () => {
    const transport = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            ...order,
            status: "awaiting_review",
            confirmation: undefined,
          })
        )
      );
    await createOrder(input, access.token);
    const [url, options] = transport.mock.calls[0];
    expect(url).toBe("https://api.example.kz/api/checkout/orders");
    expect(JSON.parse(String(options?.body))).toEqual(input);
    expect(options?.headers).toHaveProperty(
      "Authorization",
      `Bearer ${access.token}`
    );
  });
  it("sends only confirmation version and acceptance for payment", async () => {
    const transport = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(JSON.stringify(session())));
    await createPayment(access, order);
    expect(JSON.parse(String(transport.mock.calls[0][1]?.body))).toEqual({
      confirmationVersion: 2,
      acceptConfirmedTerms: true,
    });
  });
  it("blocks payment of unconfirmed orders without network", async () => {
    const transport = vi.spyOn(globalThis, "fetch");
    await expect(
      createPayment(access, {
        ...order,
        status: "awaiting_review",
        confirmation: undefined,
      })
    ).rejects.toThrow("ORDER_NOT_CONFIRMED");
    expect(transport).not.toHaveBeenCalled();
  });
  it.each(["amount", "redirect", "environment", "expiry"])(
    "rejects %s tampering in the session",
    async kind => {
      const result = session();
      if (kind === "amount") result.payment.amount = 1;
      if (kind === "redirect")
        result.payment.backLink = "https://evil.example/";
      if (kind === "environment") result.environment = "production";
      if (kind === "expiry") result.expiresAt = new Date(0).toISOString();
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(result))
      );
      await expect(createPayment(access, order)).rejects.toThrow();
    }
  );
  it("does not confuse a returned browser with bank confirmation", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ...order, status: "payment_pending" }))
    );
    expect((await refreshOrder(access)).status).toBe("payment_pending");
  });
});

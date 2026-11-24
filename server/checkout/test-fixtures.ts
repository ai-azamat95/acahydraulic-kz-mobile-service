// Shared fixtures are explicitly fake and never contact the bank.
import { vi } from "vitest";
import type { EpaySession, OrderRequest } from "../../shared/checkout";
import type { EpayGateway, EpayStatus } from "./epay";
import type { StoredOrder } from "./store";
export const token = "a".repeat(64);
export const input: OrderRequest = {
  provider: "halyk-epay",
  cartVersion: 1,
  items: [{ productId: "pump-1", productHandle: "pump", quantity: 2 }],
  customer: {
    fullName: "Test Customer",
    phone: "+7 700 000 00 00",
    email: "",
    city: "Астана",
    deliveryMethod: "pickup",
    deliveryAddress: "",
    bin: "",
    comment: "",
    consent: true,
  },
};
export const terms = () => ({
  amountMinor: 256000000,
  currency: "KZT",
  compatibilityConfirmed: true,
  availabilityConfirmed: true,
  deliveryTerms: "Доставка включена до Астаны",
  supplyTerms: "21 день после согласования",
  expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
});
export function fakeGateway(): EpayGateway & { result: EpayStatus } {
  const gateway = {
    terminalId: "sandbox-terminal",
    result: { resultCode: "107" } as EpayStatus,
    assertReady: vi.fn(),
    createSession: vi.fn(
      async (order: StoredOrder): Promise<EpaySession> => ({
        provider: "halyk-epay",
        environment: "sandbox",
        orderId: order.id,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        payment: {
          invoiceId: order.attempt!.invoiceId,
          terminal: "sandbox-terminal",
          amount: order.confirmation!.amountMinor / 100,
          currency: "KZT",
          description: "Test order",
          language: "rus",
          backLink: "https://acahydraulic.kz/checkout?payment=return",
          failureBackLink: "https://acahydraulic.kz/checkout?payment=return",
          postLink: "https://api.example.kz/api/checkout/epay/postlink",
          failurePostLink: "https://api.example.kz/api/checkout/epay/postlink",
          auth: {
            access_token: "fake-payment-token",
            token_type: "Bearer",
            expires_in: 3600,
            scope: "payment",
            refresh_token: "",
          },
        },
      })
    ),
    checkStatus: vi.fn(async () => gateway.result),
  };
  return gateway;
}

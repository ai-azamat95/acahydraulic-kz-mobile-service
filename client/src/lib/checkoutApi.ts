import { z } from "zod";
import { checkoutApiUrl } from "./checkout";
import {
  orderRequestSchema,
  type EpaySession,
  type OrderRequest,
  type PublicOrder,
} from "@shared/checkout";

export type OrderAccess = { orderId: string; token: string };
const publicOrderSchema = z.object({
  orderId: z.uuid(),
  provider: z.enum(["halyk-epay", "bank-invoice"]),
  status: z.enum([
    "awaiting_review",
    "confirmed",
    "payment_pending",
    "authorized",
    "paid",
    "failed",
    "cancelled",
    "refunded",
  ]),
  items: orderRequestSchema.shape.items,
  confirmation: z
    .object({
      amountMinor: z.number().int().positive(),
      currency: z.literal("KZT"),
      version: z.number().int().positive(),
      compatibilityConfirmed: z.literal(true),
      availabilityConfirmed: z.literal(true),
      deliveryTerms: z.string(),
      supplyTerms: z.string(),
      expiresAt: z.iso.datetime(),
      confirmedAt: z.iso.datetime(),
    })
    .optional(),
});
async function request(path: string, token: string, body?: unknown) {
  const endpoint = checkoutApiUrl();
  if (!endpoint) throw new Error("CHECKOUT_DISABLED");
  const response = await fetch(`${endpoint}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
    credentials: "omit",
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("CHECKOUT_REQUEST_FAILED");
  return response.json();
}
export async function createOrder(
  input: OrderRequest,
  token: string
): Promise<PublicOrder> {
  return publicOrderSchema.parse(
    await request("/orders", token, orderRequestSchema.parse(input))
  );
}
export async function refreshOrder(access: OrderAccess): Promise<PublicOrder> {
  const order = publicOrderSchema.parse(
    await request(
      `/orders/${encodeURIComponent(access.orderId)}/status`,
      access.token,
      {}
    )
  );
  if (order.orderId !== access.orderId) throw new Error("ORDER_MISMATCH");
  return order;
}
const httpsUrl = z.url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
});
const sessionSchema = z
  .object({
    provider: z.literal("halyk-epay"),
    environment: z.literal("sandbox"),
    orderId: z.uuid(),
    expiresAt: z.iso.datetime(),
    payment: z
      .object({
        invoiceId: z.string().regex(/^\d{6,15}$/),
        terminal: z.string().min(1),
        amount: z.number().positive(),
        currency: z.literal("KZT"),
        description: z.string().min(1),
        language: z.literal("rus"),
        backLink: httpsUrl,
        failureBackLink: httpsUrl,
        postLink: httpsUrl,
        failurePostLink: httpsUrl,
        auth: z
          .object({
            access_token: z.string().min(1),
            token_type: z.literal("Bearer"),
            expires_in: z.number().int().positive(),
            scope: z.string(),
            refresh_token: z.string(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();
export async function createPayment(
  access: OrderAccess,
  order: PublicOrder
): Promise<EpaySession> {
  if (
    order.orderId !== access.orderId ||
    !order.confirmation ||
    !["confirmed", "payment_pending"].includes(order.status)
  )
    throw new Error("ORDER_NOT_CONFIRMED");
  const session = sessionSchema.parse(
    await request(
      `/orders/${encodeURIComponent(access.orderId)}/payments`,
      access.token,
      {
        confirmationVersion: order.confirmation.version,
        acceptConfirmedTerms: true,
      }
    )
  );
  const callbackUrl = `${checkoutApiUrl()}/epay/postlink`;
  if (
    session.orderId !== access.orderId ||
    Date.parse(session.expiresAt) <= Date.now() ||
    Math.abs(session.payment.amount * 100 - order.confirmation.amountMinor) >
      0.00001 ||
    new URL(session.payment.backLink).origin !== window.location.origin ||
    new URL(session.payment.failureBackLink).origin !==
      window.location.origin ||
    session.payment.postLink !== callbackUrl ||
    session.payment.failurePostLink !== callbackUrl
  )
    throw new Error("PAYMENT_SESSION_INVALID");
  return session;
}
const SDK_URL = "https://test-epay.epayment.kz/payform/payment-api.js";
let sdkPromise: Promise<void> | undefined;
export async function openEpay(session: EpaySession) {
  if (!checkoutApiUrl() || session.environment !== "sandbox")
    throw new Error("CHECKOUT_DISABLED");
  const bankWindow = window as typeof window & {
    halyk?: { pay: (payment: EpaySession["payment"]) => void };
  };
  sdkPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      sdkPromise = undefined;
      reject(new Error("EPAY_SDK_FAILED"));
    };
    const timeout = setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timeout);
      if (!bankWindow.halyk?.pay) fail();
      else resolve();
    };
    document.head.append(script);
  });
  await sdkPromise;
  if (Date.parse(session.expiresAt) <= Date.now())
    throw new Error("PAYMENT_EXPIRED");
  bankWindow.halyk!.pay(session.payment);
}

import { z } from "zod";

export const paymentProviderSchema = z.enum(["halyk-epay", "bank-invoice"]);
export type CheckoutPaymentProvider = z.infer<typeof paymentProviderSchema>;
export const orderRequestSchema = z
  .object({
    provider: paymentProviderSchema,
    cartVersion: z.literal(1),
    items: z
      .array(
        z
          .object({
            productId: z.string().trim().min(1).max(150),
            productHandle: z
              .string()
              .regex(/^[a-zA-Z0-9_-]+$/)
              .max(250),
            variantId: z.string().trim().min(1).max(150).optional(),
            quantity: z.number().int().min(1).max(99),
          })
          .strict()
      )
      .min(1)
      .max(100)
      .refine(
        items =>
          new Set(
            items.map(item => `${item.productId}:${item.variantId ?? ""}`)
          ).size === items.length,
        "Duplicate items"
      ),
    customer: z
      .object({
        fullName: z.string().trim().min(2).max(150),
        phone: z
          .string()
          .trim()
          .max(40)
          .refine(value => /^\d{10,15}$/.test(value.replace(/\D/g, ""))),
        email: z.union([z.literal(""), z.email().max(254)]),
        city: z.string().trim().min(2).max(150),
        deliveryMethod: z.enum(["pickup", "courier", "transport-company"]),
        deliveryAddress: z.string().trim().max(500),
        bin: z.union([z.literal(""), z.string().regex(/^\d{12}$/)]),
        comment: z.string().max(2000),
        consent: z.literal(true),
      })
      .strict()
      .refine(
        value =>
          value.deliveryMethod === "pickup" || value.deliveryAddress.length >= 5
      ),
  })
  .strict();
export type OrderRequest = z.infer<typeof orderRequestSchema>;

// Integer tiyn; includes delivery and all taxes agreed with the customer.
export const orderConfirmationSchema = z
  .object({
    amountMinor: z.number().int().positive().max(1_000_000_000_00),
    currency: z.literal("KZT"),
    compatibilityConfirmed: z.literal(true),
    availabilityConfirmed: z.literal(true),
    deliveryTerms: z.string().trim().min(5).max(1000),
    supplyTerms: z.string().trim().min(5).max(1000),
    expiresAt: z.iso.datetime(),
  })
  .strict();
export type OrderConfirmation = z.infer<typeof orderConfirmationSchema> & {
  version: number;
  confirmedBy: string;
  confirmedAt: string;
};
export type OrderStatus =
  | "awaiting_review"
  | "confirmed"
  | "payment_pending"
  | "authorized"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";
export type PublicOrder = {
  orderId: string;
  provider: CheckoutPaymentProvider;
  status: OrderStatus;
  items: OrderRequest["items"];
  confirmation?: Omit<OrderConfirmation, "confirmedBy">;
};
export const paymentStartSchema = z
  .object({
    confirmationVersion: z.number().int().positive(),
    acceptConfirmedTerms: z.literal(true),
  })
  .strict();
export type EpaySession = {
  provider: "halyk-epay";
  environment: "sandbox";
  orderId: string;
  expiresAt: string;
  payment: {
    invoiceId: string;
    terminal: string;
    amount: number;
    currency: "KZT";
    description: string;
    language: "rus";
    backLink: string;
    failureBackLink: string;
    postLink: string;
    failurePostLink: string;
    auth: {
      access_token: string;
      token_type: "Bearer";
      expires_in: number;
      scope: string;
      refresh_token: string;
    };
  };
};

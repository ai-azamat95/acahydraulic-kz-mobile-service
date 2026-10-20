import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  orderConfirmationSchema,
  orderRequestSchema,
  paymentStartSchema,
  type PublicOrder,
  type OrderRequest,
} from "../../shared/checkout";
import { CheckoutError } from "./errors";
import { OrderStore, hash, secretEquals, type StoredOrder } from "./store";
import type { EpayGateway } from "./epay";

const accessSchema = z.string().regex(/^[a-f0-9]{64}$/);
const callbackSchema = z.object({
  invoiceId: z.string().regex(/^\d{6,15}$/),
  secret_hash: z.string().min(1).max(200),
  terminal: z.string(),
  amount: z.number().finite(),
  currency: z.literal("KZT"),
});
export function publicOrder(order: StoredOrder): PublicOrder {
  const confirmation = order.confirmation;
  return {
    orderId: order.id,
    provider: order.request.provider,
    status: order.status,
    items: order.request.items,
    ...(confirmation
      ? {
          confirmation: {
            amountMinor: confirmation.amountMinor,
            currency: confirmation.currency,
            version: confirmation.version,
            compatibilityConfirmed: true,
            availabilityConfirmed: true,
            deliveryTerms: confirmation.deliveryTerms,
            supplyTerms: confirmation.supplyTerms,
            expiresAt: confirmation.expiresAt,
            confirmedAt: confirmation.confirmedAt,
          },
        }
      : {}),
  };
}
function amountMatches(amount: number, expectedMinor: number) {
  return (
    Number.isFinite(amount) && Math.abs(amount * 100 - expectedMinor) < 0.00001
  );
}
export class CheckoutService {
  constructor(
    private store: OrderStore,
    private gateway: EpayGateway,
    private validateItems: (items: OrderRequest["items"]) => void
  ) {}
  create(input: unknown, accessToken: string) {
    accessSchema.parse(accessToken);
    const request = orderRequestSchema.parse(input);
    this.validateItems(request.items);
    const requestHash = hash(JSON.stringify(request));
    return this.store.transaction(() => {
      const existing = this.store.findByAccessHash(hash(accessToken));
      if (existing) {
        if (existing.requestHash !== requestHash)
          throw new CheckoutError("IDEMPOTENCY_CONFLICT");
        return publicOrder(existing);
      }
      const order: StoredOrder = {
        id: randomUUID(),
        request,
        requestHash,
        accessHash: hash(accessToken),
        status: "awaiting_review",
        createdAt: new Date().toISOString(),
      };
      this.store.insert(order);
      this.store.audit(order.id, "created", "customer", order.createdAt);
      return publicOrder(order);
    });
  }
  private authorized(id: string, token: string) {
    // Uniform failure for absent orders and wrong capabilities.
    if (!accessSchema.safeParse(token).success)
      throw new CheckoutError("ORDER_NOT_FOUND", 404);
    const order = this.store.get(id);
    if (!secretEquals(order.accessHash, hash(token)))
      throw new CheckoutError("ORDER_NOT_FOUND", 404);
    return order;
  }
  get(id: string, token: string) {
    return publicOrder(this.authorized(id, token));
  }
  listForManager() {
    return this.store
      .list()
      .map(order => ({
        ...publicOrder(order),
        customer: order.request.customer,
        createdAt: order.createdAt,
      }));
  }
  confirm(id: string, input: unknown, actor: string) {
    const terms = orderConfirmationSchema.parse(input);
    if (!actor.trim()) throw new CheckoutError("MANAGER_REQUIRED", 403);
    if (
      Date.parse(terms.expiresAt) < Date.now() + 86400000 ||
      Date.parse(terms.expiresAt) > Date.now() + 30 * 86400000
    ) {
      throw new CheckoutError("QUOTE_EXPIRY_INVALID");
    }
    return this.store.transaction(() => {
      const order = this.store.get(id);
      if (
        order.attempt ||
        !["awaiting_review", "confirmed"].includes(order.status)
      )
        throw new CheckoutError("ORDER_LOCKED");
      this.validateItems(order.request.items);
      order.confirmation = {
        ...terms,
        version: (order.confirmation?.version ?? 0) + 1,
        confirmedBy: actor,
        confirmedAt: new Date().toISOString(),
      };
      order.status = "confirmed";
      this.store.save(order);
      this.store.audit(id, "confirmed", actor, order.confirmation.confirmedAt);
      return publicOrder(order);
    });
  }
  async startPayment(id: string, token: string, input: unknown) {
    const acceptance = paymentStartSchema.parse(input);
    this.authorized(id, token);
    this.gateway.assertReady();
    const reserved = this.store.transaction(() => {
      const order = this.authorized(id, token);
      const quote = order.confirmation;
      if (order.request.provider !== "halyk-epay")
        throw new CheckoutError("PROVIDER_NOT_ONLINE");
      if (!quote || quote.version !== acceptance.confirmationVersion)
        throw new CheckoutError("ORDER_NOT_CONFIRMED");
      if (Date.parse(quote.expiresAt) <= Date.now())
        throw new CheckoutError("QUOTE_EXPIRED");
      if (order.attempt) {
        const session = order.attempt.session;
        if (
          order.status === "payment_pending" &&
          session &&
          Date.parse(session.expiresAt) > Date.now()
        )
          return { order, session };
        throw new CheckoutError("PAYMENT_ALREADY_STARTED");
      }
      if (order.status !== "confirmed")
        throw new CheckoutError("ORDER_NOT_CONFIRMED");
      order.attempt = {
        invoiceId: this.store.allocateInvoice(id),
        secretHash: randomBytes(32).toString("hex"),
        terminalId: this.gateway.terminalId,
      };
      order.status = "payment_pending";
      this.store.save(order);
      this.store.audit(
        id,
        "payment_reserved",
        "customer",
        new Date().toISOString()
      );
      return { order, session: undefined };
    });
    if (reserved.session) return reserved.session;
    // Reserve durably before contacting the bank. Timeouts/restarts never create
    // a second invoice. Recovery uses reconciliation, not automatic retry.
    const session = await this.gateway.createSession(reserved.order);
    this.store.transaction(() => {
      const current = this.store.get(id);
      current.attempt!.session = session;
      this.store.save(current);
    });
    return session;
  }
  async refresh(id: string, token: string) {
    const order = this.authorized(id, token);
    if (order.attempt) await this.reconcile(id);
    return publicOrder(this.store.get(id));
  }
  async refreshForManager(id: string) {
    await this.reconcile(id);
    return publicOrder(this.store.get(id));
  }
  private async reconcile(id: string) {
    const before = this.store.get(id);
    if (!before.attempt || !before.confirmation) return;
    const result = await this.gateway.checkStatus(before.attempt.invoiceId);
    // Not-found, in-progress and unknown results must not become success/failure.
    if (result.resultCode !== "100" || !result.transaction) return;
    const transaction = result.transaction;
    if (
      transaction.invoiceID !== before.attempt.invoiceId ||
      transaction.terminalID !== before.attempt.terminalId ||
      transaction.currency !== "KZT" ||
      !amountMatches(transaction.amount, before.confirmation.amountMinor)
    ) {
      throw new CheckoutError("PAYMENT_MISMATCH", 502);
    }
    this.store.transaction(() => {
      const order = this.store.get(id);
      if (
        order.attempt!.transactionId &&
        order.attempt!.transactionId !== transaction.id
      )
        throw new CheckoutError("TRANSACTION_MISMATCH", 502);
      const statuses = {
        CHARGE: "paid",
        AUTH: "authorized",
        REFUND: "refunded",
        CANCEL: "cancelled",
        CANCEL_OLD: "cancelled",
        FAILED: "failed",
        REJECT: "failed",
      } as const;
      const next = statuses[transaction.statusName as keyof typeof statuses];
      if (!next) return;
      // Delayed callbacks and concurrent polls cannot downgrade settled money.
      if (
        order.status === "refunded" ||
        (order.status === "paid" && next !== "refunded")
      )
        return;
      order.attempt!.transactionId = transaction.id;
      if (order.status !== next) {
        order.status = next;
        this.store.audit(
          id,
          `bank_${next}`,
          "epay-status-api",
          new Date().toISOString()
        );
      }
      this.store.save(order);
    });
  }
  async callback(input: unknown) {
    const callback = callbackSchema.parse(input);
    const order = this.store.findByInvoice(callback.invoiceId);
    if (
      !order?.attempt ||
      !order.confirmation ||
      !secretEquals(order.attempt.secretHash, callback.secret_hash)
    ) {
      throw new CheckoutError("CALLBACK_INVALID", 403);
    }
    if (
      callback.terminal !== order.attempt.terminalId ||
      !amountMatches(callback.amount, order.confirmation.amountMinor)
    ) {
      throw new CheckoutError("CALLBACK_INVALID", 403);
    }
    // The payload (including code=ok) never marks an order paid by itself.
    await this.reconcile(order.id);
  }
}

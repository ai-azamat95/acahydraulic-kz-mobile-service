import { z } from "zod";
import type { EpaySession } from "../../shared/checkout";
import type { StoredOrder } from "./store";
import { CheckoutError } from "./errors";

// Deliberately no live endpoints in this implementation.
export const EPAY_SANDBOX = {
  token: "https://test-epay-oauth.epayment.kz/oauth2/token",
  status: "https://test-epay-api.epayment.kz/check-status/payment/transaction/",
} as const;
export type EpayConfig = {
  mode: string;
  clientId?: string;
  clientSecret?: string;
  terminalId?: string;
  siteOrigin: string;
  publicApiUrl: string;
};
const authSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal("Bearer"),
  expires_in: z.number().int().positive().max(86400),
  scope: z.string(),
  refresh_token: z.string().default(""),
});
const statusSchema = z.object({
  resultCode: z.string(),
  transaction: z
    .object({
      id: z.string().min(1),
      invoiceID: z.string(),
      amount: z.number().finite().nonnegative(),
      currency: z.string(),
      terminalID: z.string(),
      statusName: z.string(),
    })
    .nullable()
    .optional(),
});
export type EpayStatus = z.infer<typeof statusSchema>;
export interface EpayGateway {
  readonly terminalId: string;
  assertReady(): void;
  createSession(order: StoredOrder): Promise<EpaySession>;
  checkStatus(invoiceId: string): Promise<EpayStatus>;
}
export class HalykSandboxGateway implements EpayGateway {
  constructor(
    private config: EpayConfig,
    private transport: typeof fetch = fetch
  ) {}
  get terminalId() {
    return this.config.terminalId ?? "";
  }
  assertReady() {
    if (this.config.mode !== "sandbox")
      throw new CheckoutError("LIVE_PAYMENTS_DISABLED", 503);
    if (
      ![
        this.config.clientId,
        this.config.clientSecret,
        this.config.terminalId,
      ].every(value => value?.trim())
    ) {
      throw new CheckoutError("EPAY_NOT_CONFIGURED", 503);
    }
    for (const value of [this.config.siteOrigin, this.config.publicApiUrl]) {
      let url: URL;
      try {
        url = new URL(value);
      } catch {
        throw new CheckoutError("EPAY_URL_INVALID", 503);
      }
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
      )
        throw new CheckoutError("EPAY_URL_INVALID", 503);
    }
  }
  private async token(fields: Record<string, string>) {
    this.assertReady();
    const body = new FormData();
    for (const [key, value] of Object.entries({
      grant_type: "client_credentials",
      client_id: this.config.clientId!,
      client_secret: this.config.clientSecret!,
      terminal: this.terminalId,
      ...fields,
    }))
      body.append(key, value);
    try {
      const response = await this.transport(EPAY_SANDBOX.token, {
        method: "POST",
        body,
        signal: AbortSignal.timeout(10000),
        redirect: "error",
      });
      if (!response.ok) throw new Error("upstream");
      return authSchema.parse(await response.json());
    } catch {
      throw new CheckoutError("EPAY_UNAVAILABLE", 502);
    }
  }
  async createSession(order: StoredOrder): Promise<EpaySession> {
    this.assertReady();
    const { confirmation, attempt } = order;
    if (!confirmation || !attempt || attempt.terminalId !== this.terminalId)
      throw new CheckoutError("ORDER_NOT_CONFIRMED");
    const postLink = `${this.config.publicApiUrl.replace(/\/$/, "")}/epay/postlink`;
    const amount = confirmation.amountMinor / 100;
    const auth = await this.token({
      scope: "payment",
      invoiceID: attempt.invoiceId,
      secret_hash: attempt.secretHash,
      amount: amount.toFixed(2),
      currency: "KZT",
      postLink,
      failurePostLink: postLink,
    });
    if (auth.scope.trim() !== "payment")
      throw new CheckoutError("EPAY_TOKEN_SCOPE_INVALID", 502);
    // A short quote cannot invalidate an already issued bank token. Refuse release
    // if the quote is shorter than the token; reserved attempt stays locked.
    const expiresAt = new Date(
      Date.now() + auth.expires_in * 1000
    ).toISOString();
    if (Date.parse(expiresAt) > Date.parse(confirmation.expiresAt))
      throw new CheckoutError("QUOTE_VALIDITY_TOO_SHORT");
    const backLink = `${new URL(this.config.siteOrigin).origin}/checkout?payment=return`;
    return {
      provider: "halyk-epay",
      environment: "sandbox",
      orderId: order.id,
      expiresAt,
      payment: {
        invoiceId: attempt.invoiceId,
        terminal: this.terminalId,
        amount,
        currency: "KZT",
        description: `ACA order ${attempt.invoiceId}`,
        language: "rus",
        backLink,
        failureBackLink: backLink,
        postLink,
        failurePostLink: postLink,
        auth,
      },
    };
  }
  async checkStatus(invoiceId: string): Promise<EpayStatus> {
    if (!/^\d{6,15}$/.test(invoiceId))
      throw new CheckoutError("INVOICE_INVALID");
    const auth = await this.token({
      scope:
        "webapi usermanagement email_send verification statement statistics payment",
    });
    try {
      const response = await this.transport(
        `${EPAY_SANDBOX.status}${invoiceId}`,
        {
          headers: { Authorization: `Bearer ${auth.access_token}` },
          signal: AbortSignal.timeout(10000),
          redirect: "error",
        }
      );
      if (!response.ok) throw new Error("upstream");
      return statusSchema.parse(await response.json());
    } catch {
      throw new CheckoutError("EPAY_UNAVAILABLE", 502);
    }
  }
}

import { describe, expect, it, vi } from "vitest";
import { HalykSandboxGateway, EPAY_SANDBOX } from "./epay";
import { input, terms } from "./test-fixtures";
import type { StoredOrder } from "./store";
const config = {
  mode: "sandbox",
  clientId: "fake-client",
  clientSecret: "fake-secret",
  terminalId: "fake-terminal",
  siteOrigin: "https://acahydraulic.kz",
  publicApiUrl: "https://api.example.kz/api/checkout",
};
const auth = {
  access_token: "fake-token",
  token_type: "Bearer",
  expires_in: 3600,
  scope: "payment",
  refresh_token: "",
};
function stored(): StoredOrder {
  return {
    id: "fake-order",
    request: input,
    requestHash: "",
    accessHash: "",
    status: "payment_pending",
    createdAt: new Date().toISOString(),
    confirmation: {
      ...terms(),
      currency: "KZT",
      compatibilityConfirmed: true,
      availabilityConfirmed: true,
      version: 1,
      confirmedBy: "manager",
      confirmedAt: new Date().toISOString(),
    },
    attempt: {
      invoiceId: "100001",
      secretHash: "fake-callback-secret",
      terminalId: "fake-terminal",
    },
  };
}
describe("Halyk sandbox protocol", () => {
  it.each(["production", "live", "", "disabled"])(
    "rejects %s even with credentials",
    async mode => {
      const transport = vi.fn();
      const gateway = new HalykSandboxGateway({ ...config, mode }, transport);
      await expect(gateway.createSession(stored())).rejects.toThrow(
        "LIVE_PAYMENTS_DISABLED"
      );
      expect(transport).not.toHaveBeenCalled();
    }
  );
  it("blocks missing credentials and non-HTTPS URLs", () => {
    expect(() =>
      new HalykSandboxGateway({ ...config, clientSecret: "" }).assertReady()
    ).toThrow("EPAY_NOT_CONFIGURED");
    expect(() =>
      new HalykSandboxGateway({
        ...config,
        publicApiUrl: "http://example.kz",
      }).assertReady()
    ).toThrow("EPAY_URL_INVALID");
  });
  it("binds a per-payment OAuth token to server amount, invoice, terminal and secret_hash", async () => {
    const transport = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(auth), { status: 200 }));
    const session = await new HalykSandboxGateway(
      config,
      transport
    ).createSession(stored());
    const [url, options] = transport.mock.calls[0];
    expect(url).toBe(EPAY_SANDBOX.token);
    const fields = Object.fromEntries((options.body as FormData).entries());
    expect(fields).toMatchObject({
      grant_type: "client_credentials",
      scope: "payment",
      invoiceID: "100001",
      amount: "2560000.00",
      currency: "KZT",
      terminal: "fake-terminal",
      secret_hash: "fake-callback-secret",
      postLink: `${config.publicApiUrl}/epay/postlink`,
    });
    expect(session.payment).toMatchObject({
      amount: 2560000,
      invoiceId: "100001",
      terminal: "fake-terminal",
      auth,
    });
    expect(JSON.stringify(session)).not.toContain("fake-secret");
    expect(JSON.stringify(session)).not.toContain("fake-callback-secret");
    expect(session.payment).not.toHaveProperty("recurrent");
    expect(options.redirect).toBe("error");
  });
  it("does not expose an overprivileged token to the browser", async () => {
    const transport = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ...auth, scope: "payment webapi" }))
      );
    await expect(
      new HalykSandboxGateway(config, transport).createSession(stored())
    ).rejects.toThrow("EPAY_TOKEN_SCOPE_INVALID");
  });
  it("keeps status-service credentials out of the payment session", async () => {
    const transport = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(auth)))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ resultCode: "107", transaction: null }))
      );
    expect(
      await new HalykSandboxGateway(config, transport).checkStatus("100001")
    ).toEqual({ resultCode: "107", transaction: null });
    expect(transport.mock.calls[1][0]).toBe(`${EPAY_SANDBOX.status}100001`);
    expect(transport.mock.calls[1][1].headers).toEqual({
      Authorization: "Bearer fake-token",
    });
    const fields = Object.fromEntries(
      (transport.mock.calls[0][1].body as FormData).entries()
    );
    expect(fields.terminal).toBe("fake-terminal");
  });
  it("sanitizes upstream errors and invalid token responses", async () => {
    for (const response of [
      new Response("secret bank details", { status: 500 }),
      new Response(JSON.stringify({ access_token: "x" })),
    ]) {
      await expect(
        new HalykSandboxGateway(
          config,
          vi.fn().mockResolvedValue(response)
        ).createSession(stored())
      ).rejects.toThrow("EPAY_UNAVAILABLE");
    }
  });
});

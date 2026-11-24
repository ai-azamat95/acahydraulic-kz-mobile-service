import express from "express";
import type { Server } from "node:http";
import { once } from "node:events";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createCheckoutRouter } from "./router";
import { registerCheckout } from "./register";
import { CheckoutService } from "./service";
import { OrderStore } from "./store";
import { fakeGateway, input, terms, token } from "./test-fixtures";
let server: Server;
let store: OrderStore;
let origin: string;
const managerToken = "test-manager-".repeat(4);
beforeEach(async () => {
  store = new OrderStore(":memory:");
  const app = express();
  app.use(
    "/api/checkout",
    createCheckoutRouter(new CheckoutService(store, fakeGateway(), () => {}), {
      siteOrigin: "https://acahydraulic.kz",
      managerToken,
      managerId: "test-manager",
    })
  );
  await registerCheckout(app, {});
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  origin = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}/api/checkout`;
});
afterEach(async () => {
  server.closeAllConnections();
  await new Promise<void>(resolve => server.close(() => resolve()));
  store.close();
});
async function post(
  path: string,
  body: unknown,
  auth = token,
  extraHeaders = {}
) {
  return fetch(`${origin}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}
describe("checkout HTTP boundary", () => {
  it("requires manager authentication and keeps customer data and bank tokens private", async () => {
    const created = await post("/orders", input);
    const order = await created.json();
    expect(created.status).toBe(201);
    expect(created.headers.get("cache-control")).toBe("no-store");
    expect(order).not.toHaveProperty("customer");
    expect(
      (await post(`/manager/orders/${order.orderId}/confirm`, terms())).status
    ).toBe(403);
    expect(
      (
        await post(
          `/manager/orders/${order.orderId}/confirm`,
          terms(),
          managerToken
        )
      ).status
    ).toBe(200);
    expect((await fetch(`${origin}/orders/${order.orderId}`)).status).toBe(404);
    const managers = await fetch(`${origin}/manager/orders`, {
      headers: { Authorization: `Bearer ${managerToken}` },
    });
    expect((await managers.json())[0]).toHaveProperty(
      "customer.fullName",
      "Test Customer"
    );
  });
  it("rejects wrong origins, invalid payloads and direct amount-based payment calls", async () => {
    expect(
      (await post("/orders", input, token, { Origin: "https://evil.example" }))
        .status
    ).toBe(403);
    expect((await post("/orders", { ...input, amount: 1 })).status).toBe(400);
    expect((await post("/payments", { amount: 1 })).status).toBe(503);
  });
  it("does not turn a return URL or a forged callback into a payment", async () => {
    expect(
      (
        await post("/epay/postlink", {
          invoiceId: "100001",
          secret_hash: "fake",
          terminal: "fake",
          amount: 1,
          currency: "KZT",
          code: "ok",
        })
      ).status
    ).toBe(403);
    const order = await (await post("/orders", input)).json();
    const status = await (
      await post(`/orders/${order.orderId}/status`, { payment: "success" })
    ).json();
    expect(status.status).toBe("awaiting_review");
    expect(
      (
        await post(`/orders/${order.orderId}/payments`, {
          confirmationVersion: 1,
          acceptConfirmedTerms: true,
        })
      ).status
    ).toBe(409);
  });
});

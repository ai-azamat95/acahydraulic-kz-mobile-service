import type { Express } from "express";
import { isAbsolute } from "node:path";
import { HalykSandboxGateway } from "./epay";
import { CheckoutService } from "./service";
import { createCheckoutRouter } from "./router";
import { catalogValidator } from "./catalog";
import { OrderStore } from "./store";

export async function registerCheckout(app: Express, env = process.env) {
  // Neither an API URL nor bank keys alone can enable payments.
  if (env.CHECKOUT_MODE !== "sandbox") {
    app.use("/api/checkout", (_req, res) =>
      res
        .status(503)
        .set("Cache-Control", "no-store")
        .json({ error: "CHECKOUT_DISABLED" })
    );
    return;
  }
  const {
    CHECKOUT_DATABASE_PATH: filename,
    CHECKOUT_SITE_ORIGIN: siteOrigin,
    CHECKOUT_PUBLIC_API_URL: publicApiUrl,
    CHECKOUT_MANAGER_TOKEN: managerToken,
    CHECKOUT_MANAGER_ID: managerId,
    CHECKOUT_CATALOG_PATH: catalogPath,
  } = env;
  if (
    !catalogPath ||
    !isAbsolute(catalogPath) ||
    !filename ||
    !isAbsolute(filename) ||
    !siteOrigin ||
    !publicApiUrl ||
    !managerToken ||
    managerToken.length < 32 ||
    !managerId
  ) {
    throw new Error("CHECKOUT_SANDBOX_CONFIG_REQUIRED");
  }
  for (const value of [siteOrigin, publicApiUrl]) {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error("CHECKOUT_HTTPS_REQUIRED");
  }
  if (new URL(siteOrigin).origin !== siteOrigin)
    throw new Error("CHECKOUT_SITE_ORIGIN_INVALID");
  const gateway = new HalykSandboxGateway({
    mode: env.CHECKOUT_MODE,
    clientId: env.HALYK_EPAY_CLIENT_ID,
    clientSecret: env.HALYK_EPAY_CLIENT_SECRET,
    terminalId: env.HALYK_EPAY_TERMINAL_ID,
    siteOrigin,
    publicApiUrl,
  });
  const store = new OrderStore(filename);
  app.use(
    "/api/checkout",
    createCheckoutRouter(
      new CheckoutService(store, gateway, catalogValidator(catalogPath)),
      { siteOrigin, managerToken, managerId }
    )
  );
}

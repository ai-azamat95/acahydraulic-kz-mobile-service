import "dotenv/config";
import express from "express";
import { registerCheckout } from "./register";

// Optional standalone sandbox API, separate from the GitHub Pages deployment.
async function startCheckout() {
  const app = express();
  app.disable("x-powered-by");
  await registerCheckout(app);
  const port = Number(process.env.CHECKOUT_PORT || 3100);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("CHECKOUT_PORT_INVALID");
  app.listen(port, "127.0.0.1", () =>
    console.log(
      `Checkout API listening on loopback port ${port}; live payments disabled`
    )
  );
}
startCheckout().catch(() => {
  console.error(
    "Checkout failed to start. Check sandbox server configuration."
  );
  process.exitCode = 1;
});

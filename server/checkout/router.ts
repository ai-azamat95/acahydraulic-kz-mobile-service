import {
  Router,
  json,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { ZodError } from "zod";
import { CheckoutError } from "./errors";
import { secretEquals } from "./store";
import type { CheckoutService } from "./service";

function bearer(req: Request) {
  return req.get("authorization")?.match(/^Bearer ([^\s]+)$/)?.[1] ?? "";
}
export function createCheckoutRouter(
  service: CheckoutService,
  options: { siteOrigin: string; managerToken: string; managerId: string }
) {
  if (options.managerToken.length < 32 || !options.managerId.trim())
    throw new Error("CHECKOUT_MANAGER_CONFIG_REQUIRED");
  const router = Router();
  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  router.use((req, res, next) => {
    const origin = req.get("origin");
    if (origin && origin !== options.siteOrigin)
      return res.status(403).json({ error: "ORIGIN_DENIED" });
    if (origin) {
      res.set("Access-Control-Allow-Origin", options.siteOrigin);
      res.set("Vary", "Origin");
      res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
  router.use(json({ limit: "32kb" }));
  // Single-process sandbox rate limit, no raw IP/token retained in logs.
  const buckets = new Map<string, { count: number; until: number }>();
  router.use((req, res, next) => {
    const now = Date.now();
    buckets.forEach((value, key) => {
      if (value.until < now) buckets.delete(key);
    });
    const key = req.ip ?? "unknown";
    const bucket = buckets.get(key) ?? { count: 0, until: now + 60000 };
    bucket.count++;
    buckets.set(key, bucket);
    if (bucket.count > 120 || buckets.size > 10000)
      return res.status(429).json({ error: "RATE_LIMITED" });
    next();
  });
  const run =
    (handler: (req: Request, res: Response) => unknown) =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve()
        .then(() => handler(req, res))
        .catch(next);
    };
  const manager = (req: Request, _res: Response, next: NextFunction) => {
    if (!secretEquals(bearer(req), options.managerToken))
      return next(new CheckoutError("MANAGER_REQUIRED", 403));
    next();
  };
  router.post(
    "/orders",
    run((req, res) =>
      res.status(201).json(service.create(req.body, bearer(req)))
    )
  );
  router.get(
    "/orders/:id",
    run((req, res) => res.json(service.get(req.params.id, bearer(req))))
  );
  router.post(
    "/orders/:id/status",
    run(async (req, res) =>
      res.json(await service.refresh(req.params.id, bearer(req)))
    )
  );
  router.post(
    "/orders/:id/payments",
    run(async (req, res) =>
      res.json(await service.startPayment(req.params.id, bearer(req), req.body))
    )
  );
  router.get(
    "/manager/orders",
    manager,
    run((_req, res) => res.json(service.listForManager()))
  );
  router.post(
    "/manager/orders/:id/status",
    manager,
    run(async (req, res) =>
      res.json(await service.refreshForManager(req.params.id))
    )
  );
  router.post(
    "/manager/orders/:id/confirm",
    manager,
    run((req, res) =>
      res.json(service.confirm(req.params.id, req.body, options.managerId))
    )
  );
  router.post(
    "/epay/postlink",
    run(async (req, res) => {
      await service.callback(req.body);
      res.status(200).json({ received: true });
    })
  );
  router.use(
    (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (error instanceof CheckoutError)
        return res.status(error.status).json({ error: error.code });
      if (error instanceof ZodError || error instanceof SyntaxError)
        return res.status(400).json({ error: "INVALID_REQUEST" });
      if (
        typeof error === "object" &&
        error &&
        "type" in error &&
        error.type === "entity.too.large"
      )
        return res.status(413).json({ error: "REQUEST_TOO_LARGE" });
      // Never expose bank responses, tokens, customer data or stack traces.
      res.status(500).json({ error: "CHECKOUT_UNAVAILABLE" });
    }
  );
  return router;
}

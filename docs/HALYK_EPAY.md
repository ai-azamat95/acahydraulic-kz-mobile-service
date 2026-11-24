# Halyk epay — sandbox integration, 2026-10-20

## State and scope

Base reviewed: main `877ab423ba36ddfa850a708522db4a199c5e5b0e`, including PR #157.
The user reports Halyk accepted the application for internal approval on October
20; this is not final acquiring approval. No bank-issued credentials were used.
This PR contains a working sandbox API, persisted orders, manager confirmation,
frontend test flow, and mocked protocol/HTTP tests. It does not deploy the API,
change DNS, enable real payments, send customer/bank messages, or take payments.

The website currently deploys static assets through `.github/workflows/pages.yml`.
The old `/payments` client contract had no server implementation in this repo;
setting an API URL could bypass the intended manager-review flow. That contract is
replaced, not mapped to an unverified legacy Kaspi API.

## Official documentation reviewed

- https://epayment.kz/docs/platezhnaya-stranica — OAuth, per-payment secret_hash,
  invoice restrictions, payment JS and postlink.
- https://epayment.kz/en-US/docs/platezhnaya-stranica — payment-scoped token.
- https://epayment.kz/docs/check-status-payment — authenticated status and states.

The RU page shows a broad scope in its example, while the EN page specifies
`payment`. The browser-bound token deliberately requests only `payment`.
Status-service tokens stay server-side. Confirm this least-privilege scope with
Halyk during sandbox acceptance. No public example credentials are embedded.

## Running without working bank keys

Requirements: Node 22.13+ (or Node 24), pinned pnpm from package.json. The store uses
Node's built-in `node:sqlite`; no new package dependencies. No schema changes to
the existing MySQL users/leads database.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm checkout:build
```

Tests use fake transports and temporary databases; they never call Halyk. With no
configuration, `/api/checkout` returns 503 `CHECKOUT_DISABLED`, the public UI only
shows WhatsApp/invoice options, and no bank script is loaded. Order intake and
manager confirmation can be exercised without bank keys; session creation returns
503 `EPAY_NOT_CONFIGURED` without reserving an invoice.

Optional isolated HTTPS sandbox deployment, separate from the static site:

| Server environment | Meaning |
| --- | --- |
| `CHECKOUT_MODE=sandbox` | Explicit test-only enablement; all other modes disabled |
| `CHECKOUT_DATABASE_PATH` | Absolute SQLite filename on a private persistent volume |
| `CHECKOUT_CATALOG_PATH` | Absolute path to matching `catalog-data` snapshot |
| `CHECKOUT_SITE_ORIGIN` | Exact HTTPS frontend origin, no trailing slash |
| `CHECKOUT_PUBLIC_API_URL` | Public HTTPS URL ending `/api/checkout` |
| `CHECKOUT_MANAGER_TOKEN` | At least 32 characters, generated cryptographically, server/operator only |
| `CHECKOUT_MANAGER_ID` | Auditable operator identifier, not supplied by the customer |
| `CHECKOUT_PORT` | Loopback listener port, default 3100 |
| `HALYK_EPAY_CLIENT_ID` | Test ClientID issued/approved by Halyk |
| `HALYK_EPAY_CLIENT_SECRET` | Test ClientSecret, server secrets only |
| `HALYK_EPAY_TERMINAL_ID` | Dedicated test TerminalID |

The database parent directory must exist with owner-only access. Run
`pnpm checkout:start` behind an HTTPS reverse proxy. The API binds loopback.
It also mounts in the existing optional Express server before large-body parsers.
Use one sandbox instance and one database per dedicated terminal; never reset or
clone the invoice sequence while reusing the same terminal. Exactly six-digit
invoice IDs ensure last-six-digit uniqueness. Exhaustion fails closed.

Frontend build variables, only for the isolated test frontend:
`VITE_CHECKOUT_MODE=sandbox`, `VITE_CHECKOUT_API_URL=https://<sandbox-api>/api/checkout`.
Do not put ClientSecret or manager credentials in any `VITE_*` variable.
Default GitHub Pages deployment receives no new variables or secrets.

## HTTP contract

All customer endpoints use `Authorization: Bearer <64-character random hex token>`.
The frontend generates this capability; the server stores only its SHA-256 hash.
Reusing it with the same validated request returns the same order. Reusing it with
changed details returns 409. Responses are `Cache-Control: no-store`.

| Method/path relative to API | Access | Result |
| --- | --- | --- |
| `POST /orders` | Customer capability | Persist `awaiting_review`; no payment |
| `GET /orders/:id` | Matching customer capability | Safe order/confirmed terms |
| `POST /orders/:id/status` | Matching customer capability | Reconcile with bank if attempt exists |
| `POST /orders/:id/payments` | Matching customer capability | Sandbox session only after confirmation |
| `GET /manager/orders` | Manager bearer token | Most recent 100 orders with contact details |
| `POST /manager/orders/:id/status` | Manager bearer token | Reconcile when customer has lost tab access |
| `POST /manager/orders/:id/confirm` | Manager bearer token | Validate and version confirmed terms |
| `POST /epay/postlink` | Per-attempt callback secret | Verify, reconcile, acknowledge |

Order input is defined by `shared/checkout.ts`. No amount/price/approval/return URL
is accepted from the customer. Unknown properties are rejected. Consent must be
true. Quantities must be integers 1–99, at most 100 unique lines. IDs, handles and
variants must match the server's catalogue snapshot; multiple variants require
an explicit selection. Snapshot prices/availability are not treated as confirmed
commercial terms. The manager must check supplier evidence before confirmation.

Manager confirmation body (illustrative test values, not a customer offer):

```json
{
  "amountMinor": 256000000,
  "currency": "KZT",
  "compatibilityConfirmed": true,
  "availabilityConfirmed": true,
  "deliveryTerms": "Delivery included to the agreed destination",
  "supplyTerms": "21 days after agreed start date",
  "expiresAt": "2026-11-01T00:00:00Z"
}
```

`amountMinor` is integer tiyn: 256000000 = 2560000.00 KZT. The manager must include
all delivery costs and applicable taxes. Set expiry 1–30 days ahead (the example
expires; use a fresh date in tests). The confirmation version increments with
changes. Payment input is only
`{"confirmationVersion":1,"acceptConfirmedTerms":true}`. Once a bank attempt is
reserved, order terms cannot change. The quote must cover the issued token's
lifetime; otherwise the session is not released and requires reconciliation.

The operator uses a secured API client; no public admin form or manager key in the
browser. A manager UI and production staff authentication are not part of this PR.

## Failures, retries and returns

- Reserve invoice and callback secret in a synchronous database transaction before
  OAuth. Double-clicks/concurrent calls cannot allocate another invoice.
- Successful session responses are persisted and reused until token expiry.
- Timeouts, process crashes during token issuance or expired sessions leave the
  attempt locked. Check bank status; do not create another payable order until the
  bank confirms the earlier attempt cannot charge. No automatic retry/reissue,
  capture, cancellation or refund operations are implemented in this PR.
- Browser capability is saved in sessionStorage for the same tab's return. Payment
  tokens are not stored in browser storage. Closing the tab loses access; operator
  reconciliation remains possible through the protected manager status endpoint. Account recovery/payment
  links require a future authenticated delivery design before production.
- Callbacks check secret_hash, invoice, amount, KZT and terminal, then query bank
  status; callback success fields alone are insufficient. Duplicate notifications
  are safe. Delayed AUTH/NEW cannot undo paid/refunded states. Unknown/resultCode
  error/not-found statuses retain the existing state and must be investigated.
- `AUTH` is authorization only. `CHARGE` is paid. Refund/cancel/failure are separate
  states. There is no browser-side order fulfillment or automatic cart clearing.
- Customer polling/return status query also handles missing callbacks. If a callback
  fails due to bank outage it gets an error for retry; confirm Halyk retry policy.
  Scheduled reconciliation/outbox and operational alerting remain production work.
- SQLite file permissions are 0600. Keep the directory private; backup/restore the
  database including the invoice sequence. It contains PII and scoped bank tokens.
  Encrypt the volume/backups and define retention before using real customer data.
- Exact-origin CORS, bearer-only auth, 32 KB bodies and single-process rate limiting
  protect the sandbox boundary. Reverse-proxy limits and production identity/access
  control must be reviewed for the final hosting design.

## Bank/hosting items still required before production

1. Written final approval, merchant legal entity confirmation and issued test/live
   TerminalID, ClientID, ClientSecret; secure delivery outside source control.
2. Halyk confirmation of payment token scope, charge vs. authorization mode, callback
   format/retries, approved return/callback domains and any IP/network restrictions.
3. Sandbox acceptance using bank test cards: success, refusal, 3DS cancellation,
   interrupted return, duplicate/reordered/missing postlink, wrong amount/terminal,
   outage/timeout, token expiry, restart, and refund/partial-refund semantics. Current
   mocked tests are not bank acceptance. Bonus/partial payments are not enabled;
   mismatch fails closed until Halyk confirms amount semantics for this terminal.
4. Agreed production API host, persistent storage/backup, staff authentication,
   recovery links, reconciliation job, monitoring and fulfilment controls. GitHub
   Pages alone cannot run this service.
5. A separately reviewed live adapter/activation change after the above. This
   implementation cannot use live endpoints even if someone sets mode=production.

No final approval or bank acceptance is implied by passing local tests or CI.

## Verification performed for this change

- Frozen-lockfile installation with pnpm 10.4.1 completed; no dependency/lockfile change.
- `pnpm check` passed.
- Full Vitest suite: 17 files, 149 tests passed (single-thread pool locally).
- `pnpm build` and `pnpm checkout:build` passed. Existing catalogue JSON import
  attribute/chunk-size warnings remain; these are not payment failures.
- The compiled standalone API was started locally: production mode returned 503;
  sandbox validated a real catalogue product, persisted manager confirmation,
  refused payment with no bank keys without reserving an attempt, and restored
  the confirmed order after restart.
- Post-change HTTP/router tests and `git diff --check` passed.
- Browser visual/E2E acceptance was not completed locally: the Playwright Chromium
  download returned an invalid archive. This is not claimed as a browser pass.
- All banking responses in tests were mocks; no bank endpoint was called. Issued
  test parameters and actual Halyk sandbox acceptance are still required.

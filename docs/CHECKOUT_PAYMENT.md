# Checkout architecture

Current implementation: [Halyk epay sandbox](./HALYK_EPAY.md), prepared 2026-10-20.

The public catalogue is deployed to GitHub Pages. It has no payment server and must
never contain acquiring secrets. `VITE_CHECKOUT_API_URL` alone no longer enables
online payment. Kaspi is not selected or called by Checkout.

Default flow: cart → contact/delivery details → WhatsApp manager handoff or bank
invoice request → manager verifies compatibility, availability, final price and
supply/delivery terms. Catalogue totals are preliminary, including fixed-price
items. Existing WhatsApp contact and merchant details remain in place.

The optional sandbox flow uses a separate HTTPS API and persisted order snapshot:

1. Browser submits identifiers/variants/quantities/contact details and consent.
   It cannot submit a price or approval. Server verifies catalogue identities.
2. Order is saved as `awaiting_review`. A separate manager bearer credential is
   required to confirm terms. No bank call is made at this stage.
3. Manager confirms final KZT amount including delivery/taxes, compatibility,
   availability, supply/delivery terms, and quote expiry. Confirmation is versioned.
4. Customer views and accepts the specific confirmed snapshot. Cart changes do
   not change that order. Server rejects expired/stale/unconfirmed terms.
5. Server reserves one invoice durably, then requests a sandbox payment token.
   The browser receives only the payment-scoped token and opens Halyk's test form.
6. Bank postlink is authenticated with the per-attempt `secret_hash`. A separate
   server-to-server status request verifies invoice, terminal, currency, amount
   and transaction identity. Only `CHARGE` means paid; `AUTH` means authorized.
   Browser redirects and callback `code=ok` never establish payment success.

No real payment can be enabled in this version: only sandbox endpoints exist in
the adapter, and every other server mode returns disabled. There is no deployment
or bank approval implied by this code. See the integration guide for operational
requirements and remaining bank acceptance tests.

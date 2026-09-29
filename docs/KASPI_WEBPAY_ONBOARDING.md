# Kaspi online payment onboarding for ACA Hydraulic

## Confirmed provider

ACA selected Kaspi for online checkout. The implementation identifier sent by the browser is `kaspi-webpay`.

Official onboarding source: <https://kaspi.kz/webpay/partnership>

The official public page says the merchant must:

1. Submit an online application.
2. Sign an agreement.
3. Start accepting payments after connection.

It also states that commission depends on the company's field of activity. Do not publish a commission amount until Kaspi confirms ACA's terms.

## What ACA must obtain from Kaspi

Before the backend adapter can be implemented and enabled, obtain the official integration package containing:

- approved legal entity and merchant identifier;
- test and production endpoints;
- test and production credentials, certificates, or other issued secrets;
- request-signing and response-verification rules;
- payment creation and status-check schemas;
- callback or webhook URL requirements and signature verification rules;
- allowed return URLs and any IP allow-list requirements;
- expiration, cancellation, refund, and reconciliation rules.

Exact Kaspi field names and algorithms must come from the issued documentation. Do not copy unofficial API examples into production.

## ACA backend requirements

The public website must send only `provider`, product/variant identifiers, quantity, customer data, and return URL to the ACA backend. It must never send or decide the final charge amount.

The backend must:

1. Re-read every product and variant from ACA's authoritative KZT price source.
2. Reject unavailable, changed, or quote-only items.
3. Recalculate items and delivery server-side.
4. Create an idempotent ACA order before requesting a Kaspi payment.
5. Store Kaspi credentials only in server-side secret storage.
6. Verify the official Kaspi response and callback signature.
7. Mark an order paid only after server-to-server confirmation.
8. Keep an audit log without storing full payment credentials.
9. Support manual reconciliation and safe retry without creating duplicate charges.

## Activation checklist

- [ ] Kaspi application approved and agreement signed.
- [ ] ACA received official technical documentation and test credentials.
- [ ] Authoritative sale prices in KZT approved for automatically payable products.
- [ ] Protected backend and persistent order storage deployed.
- [ ] Kaspi adapter implemented from the issued specification.
- [ ] Callback signature, idempotency, timeout, retry, and duplicate-charge tests passed.
- [ ] Successful test payment and failed/cancelled payment paths verified.
- [ ] Refund and daily reconciliation procedure assigned to an employee.
- [ ] Production credentials added to server secret storage.
- [ ] `VITE_CHECKOUT_API_URL` enabled only after the production read-back test passes.

Until every required item is complete, the checkout keeps Kaspi visibly selected but disables online payment. Customers can still submit the order to the manager through WhatsApp.

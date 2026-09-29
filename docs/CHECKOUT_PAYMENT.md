# ACA Hydraulic checkout and payment boundary

The catalogue UI supports a persisted cart, checkout data collection, a WhatsApp order handoff, and a protected online-payment step. ACA selected `kaspi-webpay` as the intended provider.

Online payment is intentionally disabled until `VITE_CHECKOUT_API_URL` points to a protected backend. GitHub Pages must never contain acquiring credentials or decide the charge amount.

Kaspi's official public onboarding page is <https://kaspi.kz/webpay/partnership>. It describes three onboarding steps: submit an application, sign the agreement, and start accepting payments. The public page does not expose the technical API contract, signature algorithm, test endpoint, or credential names. Implement those details only from the integration package issued to ACA after approval; do not infer them from third-party examples.

## Browser request

`POST {VITE_CHECKOUT_API_URL}/payments`

```json
{
  "provider": "kaspi-webpay",
  "cartVersion": 1,
  "items": [
    {
      "productId": "supplier-product-id",
      "productHandle": "catalog-handle",
      "variantId": "optional-variant-id",
      "quantity": 1
    }
  ],
  "customer": {
    "fullName": "Customer name",
    "phone": "+7 700 000 00 00",
    "email": "optional@example.kz",
    "city": "Astana",
    "deliveryMethod": "transport-company",
    "deliveryAddress": "Terminal or address",
    "bin": "optional 12 digits",
    "comment": "Optional"
  },
  "returnUrl": "https://acahydraulic.kz/checkout?payment=return"
}
```

No client-supplied price or total is sent. The backend must:

1. Look up each product and variant from an authoritative ACA source.
2. Reject unavailable, changed, or quote-only lines.
3. Recalculate the KZT amount and delivery server-side.
4. Store an idempotent order before calling the selected acquiring provider.
5. Return an HTTPS payment URL and verify the provider webhook signature before marking the order paid.

For Kaspi, the backend adapter remains blocked until ACA receives the official merchant identifier, test/production endpoints, credentials or certificates, request-signing rules, callback requirements, and payment-status semantics. See [`KASPI_WEBPAY_ONBOARDING.md`](./KASPI_WEBPAY_ONBOARDING.md).

## Browser response

```json
{
  "orderId": "ACA-2026-000001",
  "paymentUrl": "https://provider.example/payment/session-id",
  "expiresAt": "2026-09-28T19:00:00Z"
}
```

The current catalogue's supplier price source must be reconciled to an authoritative KZT price before enabling the environment variable. Quote-only items remain eligible for manager-assisted checkout but not automatic payment.

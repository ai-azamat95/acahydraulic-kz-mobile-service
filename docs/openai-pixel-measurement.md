# OpenAI Pixel: contact intent
Pixel ID: RAqt8xZo4eBECsuc32zrtP

## Implemented
The shared analytics gate loads the SDK only with marketing consent and outside internal/bot traffic. Debug logging is disabled in production. Revoking consent calls the SDK consent API and clears its cookies. Existing Google, Yandex and TikTok flows remain independent.

Custom events (case-sensitive):
- whatsapp_click: a trusted click on a wa.me anchor.
- phone_click: a trusted click on a tel anchor; not a completed call.
- form_whatsapp_click: validated B2B/calculator form hands off a prepared message to WhatsApp.
- checkout_whatsapp_click: validated checkout hands off to WhatsApp.

These are contact intent, NOT received/qualified leads or purchases. No lead_created or order_created event is emitted. The checked B2B and checkout paths do not persist an inquiry or confirm receipt; they open WhatsApp. A genuine lead conversion needs a confirmed server/CRM acceptance event, implemented separately. Do not label a WhatsApp open as a received inquiry.

## Ads Manager
Create Custom event settings on this pixel using the exact names above. Do not select all contact events as interchangeable confirmed leads. Choose intent optimization only if explicitly approved with that definition. For real inquiry optimization, first implement and validate lead_created after server-confirmed acceptance, then create its matching setting. A clicks campaign needs a new campaign to change objective.

## Verify after deployment
1. Run node tests/openai-pixel.test.cjs.
2. No consent, marketing refusal, aca_internal=1 and automated sessions must not load the SDK or send events.
3. Grant marketing consent: one SDK script and init; click WhatsApp and phone once each and check one corresponding event. Check validated B2B/calculator/checkout handoffs separately.
4. Invalid forms must send nothing. Do not send real test inquiries to staff.
5. Revoke marketing consent: no further events; regrant without a second SDK or init.
6. Check event reception on this pixel in Ads Manager. Local VM tests verify logic only, not production transport or attribution.
7. Confirm deployed HTML still includes /analytics-gate.js; confirm live reception before enabling a conversion-optimized campaign.

Reference: https://developers.openai.com/ads/measurement-pixel

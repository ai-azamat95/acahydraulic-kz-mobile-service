# TikTok → ACA Hydraulic website

## Verified 2026-10-01

- Website Pixel ID: `D6M5H3JC77U9JTU04Q60`. Account ownership still needs Events Manager verification.
- Connected advertiser with returned campaigns: `TOO ACA Hydraulic` (`7543350121870884881`). A second connected advertiser is `ACA Hydraulic 0827` (`7543316995476209681`).
- Existing “Заявки на ремонт” campaign links to the homepage with TikTok UTM tags.
- Production is deployed as static HTML to GitHub Pages. The repository's server-side Events API code does not establish a running production backend.

## Website changes

- The existing Pixel loads only with marketing consent; internal/automated traffic is excluded.
- SPA navigation calls Pixel page() once after a route change. Initial load is owned by analytics-gate.js.
- WhatsApp/phone anchors are measured centrally as Contact intent. Legacy per-component hooks no longer send duplicate server events.
- The B2B form opens WhatsApp programmatically and reports Contact; the calculator's anchor is measured centrally. Neither reports SubmitForm or revenue to TikTok.
- Campaign labels and ttclid survive same-tab navigation in sessionStorage after marketing consent. New tagged visits replace the prior campaign. Opt-out removes persisted attribution.
- B2B form/calculator prepared WhatsApp text includes campaign labels, excluding ttclid. This measures the source only if the visitor sends the prepared message; it is not an automatic inbox integration.
- Google Ads conversion behavior, service prices and promises are unchanged.

## Links ready to use

Profile:
`https://acahydraulic.kz/?utm_source=tiktok&utm_medium=organic&utm_campaign=profile`

Excavator test creative:
`https://acahydraulic.kz/services/excavator-repair/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=excavator_repair&utm_content=cat_hot_01`

Use a distinct utm_content for each creative. Keep parameter values free of personal data. Existing campaign macros should be verified in Ads Manager before reuse.

## Remaining account steps

1. Verify Pixel ownership/permissions on the intended advertiser and linked @acaservice01 identity for Spark Ads.
2. In Events Manager test initial pageview, SPA navigation, WhatsApp, calculator and B2B Contact events. Test no-consent and withdrawal flows. Do not optimize against SubmitForm until a confirmed submitted lead exists.
3. Check Event Builder/automatic-event rules: a WhatsApp click must not independently be mapped to SubmitForm.
4. Apply matching landing URLs/UTMs to the chosen ads after reviewing each concrete ad change. Do not start campaigns or change spend during tracking setup.
5. Actual submitted forms require a deployed receiver with verified delivery/storage. Only after successful persistence send SubmitForm; Pixel/API copies need the same event_id. Configure Events API secrets on that backend, never in static frontend code.
6. Record received messages, qualified requests and paid diagnostics separately. Contact is not a paid client and does not establish ROAS.

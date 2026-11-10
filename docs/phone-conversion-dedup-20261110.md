# Phone intent: one measurement path per click

Publication of this scheme was approved on 10 November 2026. Google Ads settings are not part of this change.

## Change

The existing GA4 phone event is imported into Google Ads. When analytics consent is allowed, keep that event and do not also emit the direct Ads phone action for the same physical click. Keep the direct action for marketing-only consent, since GA4 is intentionally not loaded then.

| Consent | GA4 phone event | Direct Ads phone | Yandex phone goal |
| --- | --- | --- | --- |
| No choice / neither | No | No | No |
| Analytics only | Yes | No | Yes |
| Marketing only | No | Yes | No |
| Analytics + marketing | Yes | No | Yes |
| Internal / automated | No | No | No |

The production change is one condition in `client/index.html`. Phone links, GA4 event name, Yandex, form/WhatsApp paths and Google Ads settings remain unchanged. There is no time-based or session-wide suppression: separate physical phone clicks remain separate events.

## Scope and limits

- ONE_PER_CLICK applies within each Ads action, not across different actions. This fixes dual client-side emission, not person or lead deduplication.
- Separate clicks before and after a consent change can still populate both Ads actions.
- With analytics consent, measurement in Ads depends on GA4 collection/import. Selective GA4 blocking or an import failure can lose measurement previously captured directly.
- The source actions have different attribution windows. This change does not equalize their reporting or rewrite historical totals.
- A telephone-link click is contact intent, not a connected call, qualified lead, order or sale.
- No Ads goals, budgets, bids or advertisements are changed. The existing GA4 import must remain enabled for this scheme.

## Verification

On refreshed main `45fc2c3`:

- Regression reproduced before the fix: three assertions failed on simultaneous GA4 and direct Ads emission.
- All 101 Vitest tests, TypeScript check and production build passed after the change.
- Three contact-deduplication and seven site-audit Node tests passed.
- Static route generation succeeded, including catalogue/brand landings.
- Focused Chromium QA passed 16 checks on the built homepage and Rexroth landing. All vendor requests and external contact navigation were blocked; Google/Yandex calls were captured locally, with no real conversions or messages.
- Tests cover absent/denied/partial/full consent, withdrawal, repeated clicks, excluded traffic, blocked trackers, preserved Yandex and unchanged form/catalogue paths.
- The older homepage-wide browser script passed its first 15 phone/WhatsApp checks, then stopped at an existing stale `input#location` selector after the floating-label update. That older script is not claimed as a full pass.
- Live Google ingestion is deliberately not exercised by QA. Local emission tests do not verify external ingestion or attribution.

## Local browser check

1. Build and generate static routes.
2. Serve `dist/public` on localhost.
3. Run `PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs PREVIEW_URL=http://127.0.0.1:5187 node scripts/verify-phone-consent.mjs`.

The script refuses non-local origins and blocks external requests and contact navigation. Results are saved in `docs/phone-conversion-artifacts/browser-checks.json`.

## Release checks and rollback

Before merge, verify the current base, CI and enabled GA4 import. After the approved deployment, verify the expected commit and the built tracker on the homepage and Rexroth landing without generating conversions. Observe normal subsequent traffic after the ordinary import delay; do not reinterpret historical events as confirmed duplicate people.

Rollback is reverting this source condition and its test expectations through the normal review/deployment process. No Ads settings need restoration because this change does not modify them.

# Floating service fields — review build

## Scope and base

Prepared in an isolated checkout on `feat/floating-form-fields-20261108` from exact upstream main `8f9fb113f0e8902b3d49cc525d718a3f18fcb976` (published PR #180). Its tree is `e25f66b6a5d6db44633cc6712614ddbf0d8bd446`. Other local checkouts and pending homepage work were not modified.

The visual direction follows the approved reference: rounded dark fields and visible floating labels. This is an adaptation to ACA's existing palette, not a pixel-identical recreation of the Instagram reel.

- `B2BLeadForm`: shared dark surface, rounded 64px fields, persistent associated labels, optional examples on focus, clear required-field legend, and matching company/consent panels. The homepage modal's 44px close button stays reachable while scrolling.
- `CostCalculator`: the same field components throughout the six-step diagnostic intake. Select labels and long labels remain raised so they cannot collide with selected values. Select appearance is normalized for WebKit while preserving the native choice control.
- Inputs use 16px text; telephone type/input mode and appropriate autocomplete are present. Labels use unique per-instance IDs. Textareas remain resizable; focus visibility, reduced motion and forced-colors support are included.
- Existing paid-diagnostic wording, consent gating, WhatsApp message assembly, inquiry ID and measurement handlers are unchanged. No prices, final commitments, guarantees, payment details or access settings were changed.
- Existing overlay 90 / dialog 100 / select 110 layers and focus restoration from #180 are unchanged.

## Other forms reviewed

Catalog filters, checkout and Industrial AI already use dark controls and real labels. They were deliberately not changed by global selectors. Checkout retains its validation, autocomplete, error relationships and error-summary focus. Contacts contains no data-entry form. Only the two service-intake flows opt into these styles.

## Verification

- `pnpm check`: passed.
- Production build: passed. Existing Vite chunk-size advisory remains; there is no new build failure.
- Vitest single-thread: 13 files / 92 tests passed.
- Full Node regression suite after route generation: 291 tests passed, including three new floating-field source regressions.
- Catalog public, SEO, landing and site checks: passed. Site scan covers 12,797 files.
- Strict sitemap SEO audit: 12,495 unique URLs, no issues.
- Chromium 158: existing dialog regression at 320×740, 360×800, 390×844, 500×817, 768×1024, 1024×768, 1440×900, 1920×1080 and 844×390. Covers layer hit testing, dropdowns, Tab/Shift+Tab focus containment, Escape, Enter/reopen, focus return, close button, outside dismissal and the cookie panel.
- Chromium 158 and Playwright WebKit 27.2: field regressions at 320×740, 390×844, 768×1024, 1440×900 and 844×390. Covers associated/visible labels, label/value separation, empty/focused/filled/cleared states, expanded company fields, phone/email validation, consent enable/disable/reset, repeated opening, reduced motion, all calculator steps, Back, reset and synthetic message contents.
- At 390px, shrinking the viewport to 420px checks space for a software keyboard and scrolling the focused phone field into view. This is a viewport simulation, not a physical-phone keyboard test.
- Network guards block external traffic and all non-GET requests. `window.open` and analytics are replaced with in-memory captures in the tests. No real enquiry, WhatsApp message, telephone call or conversion was sent.
- Local review server smoke: HTTP 200, form opens, CSP/no-send safeguards active.
- `git diff --check`: passed.

A WebKit-specific native-select padding issue was caught during testing and corrected with scoped `appearance: none` and a visible dropdown indicator. The complete form suite was rerun after that change.

Not tested: physical iOS/Android devices, VoiceOver/TalkBack, real browser autofill, Firefox, production deployment, or remote CI. WebKit verification does not imply a test of the user's installed Safari application.

## Review locally

The local-only server is available on the Mac at `http://127.0.0.1:5183/`. Open “Описать поломку” or scroll to the diagnostic intake. External navigation, WhatsApp openings, analytics and HTTP mutations are disabled in this review server; this guard is not in the production bundle.

If the server has stopped, run from this checkout:

```sh
node scripts/preview-service-forms.mjs
```

Local QA evidence is under `ui-check/dialog-layers/`, `ui-check/floating-fields/` and `ui-check/floating-fields-webkit/`. These are private local artifacts, not a published preview.

To rerun after a production build:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/verify-dialog-layers.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/verify-floating-fields.mjs
```

The new form suite is also added to the existing homepage browser CI workflow.

## Publication boundary

No push, PR, merge or deployment was performed. The public website remains unchanged. Remote CI has not run for this branch. Publication of the homepage still requires separate owner approval.

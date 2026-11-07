# Dialog layers and homepage logo color — 2026-11-07

## Scope

Prepared on `fix/dialog-layer-logo-palette-20261107` from exact upstream `f59a2f0f1e4879f36c30f35092d1b5312c91d122` (PR #179). Existing local homepage and repair-intake work was not modified. The new reference-proportioned SVG and authentic social icons in upstream were retained.

- Dialog backdrop is at 90 and dialog content at 100, above quick navigation (60), menu layers (70/80) and cookie controls (70/80).
- Portaled select options are at 110 so equipment and urgency dropdowns remain above the form.
- Escape/close/outside dismissal returns keyboard focus to the homepage's form opener. It can be reopened with Enter.
- Header and footer share the same SVG. Only its two fills changed to the current homepage palette: gold `#dfb76c` and light text `#e3e4eb`. Paths, dimensions and proportions are byte-equivalent after color normalization. Other page themes were not recolored.
- Added source regressions and `scripts/verify-dialog-layers.mjs`; added the browser regression and relevant path triggers to homepage CI.

## Verification

- `pnpm check`: passed.
- Vitest single-thread: 13 files, 92 tests passed.
- Full Node regression suite after production route generation: 288 tests passed.
- `pnpm build`, SPA/case/video/catalog/landing/merchant/Industrial AI route generation and Markdown alternates: passed.
- Catalog public, SEO, landing and public-site checks: passed. Public-site scan: 12,796 files, no supplier-brand or sensitive supplier-field occurrences.
- `git diff --check`: passed.
- Browser script checks 320×740, 360×800, 390×844, 500×817, 768×1024, 1024×768, 1440×900, 1920×1080, and 844×390: modal bounds, hit testing over the nav, stacking order, dropdown selection, focus trap and return, Escape, Enter/reopen, close button, outside dismissal, and menu Escape. Also checks an open consent panel beneath the form.
- All external browser traffic and all non-GET requests are blocked. No form submission, WhatsApp message, phone call or analytics event is sent.
- Browser artifacts are written to `ui-check/dialog-layers/`; screenshots cover form and homepage at 390, 500 and 1440 px. These are local QA artifacts, not a public preview.

Run the browser regression after the production build:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/verify-dialog-layers.mjs
```

## Publication boundary

No push, PR, merge or production deployment was performed. Remote CI has not run for this change. Safari and physical phones were not tested. Publication requires owner approval.

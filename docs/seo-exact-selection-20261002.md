# Exact engine and pump selection — 2026-10-02

Scope: strengthen existing K19/C8.3 pages and the hydraulic-pump category for qualified orders. Keep current URLs and 25 engine families; do not invent stock, prices, reviews or completed work. Engine requests ask for ESN and CPL when available. Pump selection asks for the full execution and connections before an offer. Link the existing CAT 432E sale and XCMG XZ200 supply/installation cases with distinct labels.

Manufacturer references for variant names (not interchangeability or ACA availability):
- https://www.cummins.com/en-na/engines/products/k19 — KT19, KTA19, KTTA19.
- https://www.cummins.com/en-na/engines/products/6ct6cta83 — 6CT/6CTA8.3.

## Source and overlap audit

Isolated checkout based on main 3875676. Older projects checkout was ba54eb5; another Documents checkout reported febc627. Original checkouts were not edited. No repository AGENTS.md or .agents/skills were present in the fresh clone. Read project-manager skill; existing repository docs concern catalogue import, checkout and historic lead processing.

PR 96 adds catalogue SEO deployment regression checks; PR 97 changes TikTok contacts and attribution. This change does not edit either workflow or TikTok hooks. Main already publishes the NTA855 Shantui case and article; no duplicates added.

## Analytics observations and limits

Current public gate source contains GA4 G-XZB9KZ4VCH, Ads AW-17847190636, Metrica 109131701 and TikTok D6M5H3JC77U9JTU04Q60. GA4 and Metrica require analytics consent; Ads and TikTok require marketing consent. Internal marker and webdriver/bot exclusions prevent vendor loading. Pages build has no Measurement ID environment override: the public script supplies these IDs. VITE_ENABLE_TIKTOK_EVENTS_API is not enabled by the Pages workflow on main; PR 97 is addressing the static-site TikTok flow.

These observations do not prove that GA4 receives production events, that the ID matches the exported property, or why September/October export rows are missing. No production analytics events were deliberately generated. Need authorized GA4 property/stream comparison and a human-browser network/DebugView check with consent and no internal marker. Consent settings are unchanged. Maps listings, channel ownership, external campaign configuration and search indexing remain outside this code verification.

## Verification

Local build and TypeScript check; generated SPA, case and category route copies; engine static tests, pump selection HTML test, catalogue landing validation and consent gate tests. Built HTML validation is not independent browser QA or production collection proof. Initial build failures were local sandbox cache writes and disk exhaustion; cleaned only this task's generated files and repeated checks. Dependency tree copied from the existing local checkout; a frozen-lockfile fresh install was not run. CI must validate the lockfile environment.

# Homepage production integration — 2026-11-06

User authorized publication after receiving the four screenshots. This supersedes the earlier local-only restriction; it does not establish pixel-perfect visual approval.

## Provenance and rollback

- Previous production / rollback base: `ba6df5ac047722ab83f812f1aec0e201cdb3462e`.
- Applied only the homepage delta `e24807d5cca84136864ec33f8637d9aac00518e5` relative to its parent, not the snapshot-restoration commit or old local history.
- Git fetch twice disconnected/timed out. An isolated integration directory was built from the current GitHub main recursive tree: all 1,550 file blobs verified against Git object SHA1. Unchanged files reused locally; mismatches fetched by immutable raw URL. The homepage patch applied cleanly, including the small catalog root-replacement correction on the newer catalog generator.
- Latest Rexroth media and quick-search stock corrections remain intact. No unrelated open PRs were merged. Original working branch/tree left untouched.
- Publish through a dedicated PR with a real GitHub commit whose parent is the exact production base. No forced ref updates.
- Rollback after merge: create a new branch from then-current main, `git revert -m 1 <homepage-merge-SHA>`, review the diff, merge normally and verify Pages. Do not reset/force main or revert unrelated later changes. Release SHA and workflow are recorded in the external final release report.

## Fresh integrated checks

- TypeScript and production build passed (existing bundle-size/import-attribute warnings only).
- Static route generation, case/video/catalog/landing and Markdown generation passed.
- Vitest: 92/92; Node tests: 284/284, no skips.
- Landing validation: 258 pages; public-site scan: 12,794 files, no supplier identity leaks.
- Strict SEO audit: 12,495 unique sitemap URLs, zero issues.
- Chromium: five viewport sizes, eight screenshots, menu/modal open and Escape, one H1/four sections, no overflow/map label intersections/page errors.
- 25 isolated contact/consent scenarios passed; services/catalog/cases navigation and browser Back passed. Outbound requests/contact navigation intercepted; no actual inquiry, message or ad event sent.
- All 67 unique homepage hrefs classified. 59 internal URL variants including additional requested routes returned HTTP 200 locally; projects retains canonical/meta redirect to cases. Same-page anchors resolve. External social/video/mail/tel/WhatsApp destinations inspected without sending messages/calls.

The earlier verification and rollback documents describe the original local implementation, not this production integration. Production HTTP and browser results are recorded separately after deployment. Advertising configuration and event names were not changed.

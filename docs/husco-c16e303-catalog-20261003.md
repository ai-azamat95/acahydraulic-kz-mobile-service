# HUSCO C16E303 catalogue evidence

Base: fd322ccd51e2626673ce54ef2be4752f80c90873 (main, 2026-10-03).

One product: HUSCO 6600-F163 A00, C16E303, F18/22233. Read directly on the owner's IMG_5341.HEIC nameplate; it also says Made in England. The source folder identifies Hidromek 102B and the rear distributor. Machine compatibility remains subject to the full nameplate, machine serial number and configuration check.

The approved cropped JPEG depicts the nameplate of a removed job unit. It is not a photograph of a new item being offered. The public caption explicitly identifies the removed unit and says the supplied configuration and condition are agreed separately. The earlier upload rejection was resolved only after the owner explicitly approved publication to the GitHub repository and site; no workaround was used. No condition, current stock, warranty or fixed lead-time claim is made. Price fields are null; structured data contains no Offer.

Deduplication: all 42 search-index chunks at the pinned base were read through GitHub API (10,394 entries). No HUSCO/Hidromek/C16E303/6600-F163/F18-22233 matches; the product map has no matching handle. Existing XCMG 803001730 is unchanged.

Implementation: existing owner-catalogue source, indexed into chunk 001, full search and product map by the normal preparation step. Category summaries now count all memberships, so main-control-valves and control-valves each include the product. Both React and static fallback display the verified nameplate facts; selection instructions cover valves rather than pumps.

Validation: initial local Node v26.8.2 run passed 5 tests: existing owner product refresh tests plus HUSCO metadata, repeat-prepare/category/search/map and generated route/canonical/sitemap/JSON-LD checks. Repeat local testing was interrupted; subsequent writes failed with No space left on device. Full app build, TypeScript and interactive browser verification are not completed locally. PR workflow prepares owner data, runs focused tests and builds/validates catalogue routes. Treat CI results separately from the initial local result.

No merge or deployment is authorized by this draft. No other cloud media was downloaded. The earlier failed publishing attempt was not located in the two related readable Codex threads, so its cause remains unknown.

## Production pipeline correction

Independent review confirmed that the original pages workflow built the committed 10,394-product snapshot without applying the owner dataset. Prior PR/browser checks had prepared/injected data and therefore did not establish production publication readiness. The browser fixture also skipped category-summary updates.

Production now runs the normal prepare-public-catalog script before Vite build. Source input assertions compare every owner field across product map, item chunk, chunk search, full index and all category-summary counts. After normal route generation, the same assertions inspect dist/public plus owner canonical URLs, sitemap entries, category links and JSON-LD. Browser CI uses the same normal preparation including summaries, rather than an injected fixture. Regression tests reject unprepared inputs, preserve a legacy row and price, verify repeat preparation, and enforce workflow ordering. Snapshot CI also runs the repository's pnpm check type check.

This correction must pass current-head CI before acceptance; earlier green checks alone were insufficient. No production deployment or merge was performed.

## Authorized image addition

The owner explicitly approved publishing IMG_5341.HEIC in the site GitHub repository and on acahydraulic.kz. The already inspected nameplate excerpt is a 900 × 655 JPEG from that single photograph. JPEG APP1 (EXIF/XMP), APP13 (IPTC) and comments were removed; source was not modified. Only the approved asset is added. The public caption and alt text identify a removed job unit rather than a new offered item. Remaining job media are excluded. Image loading, schema image URLs, metadata stripping and production inputs are checked by the updated tests. No merge/deployment performed here.

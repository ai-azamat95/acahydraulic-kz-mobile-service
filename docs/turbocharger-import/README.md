# Turbocharger catalogue import

- Source fingerprint (SHA-256): `53829f20763f1fd3efe53eb515469d38d865f43a20f37493177a1a3598fbdc71`.
- Five pages; physical product rows per page: **36 / 29 / 34 / 26 / 28**; **153 rows**, **152 exact unique PN**.
- Every source row maps to one photo cell by PDF coordinates, with exactly one embedded image fully contained within that cell (1pt rounding tolerance). All five pages were independently reviewed visually, including multiline engine cells and the two parallel tables.
- `rows.json` records page, side, table, physical row, all four cell rectangles, image xref/rectangle, extracted-image SHA256, output path/hash and card handle. `rows.csv` is the compact extraction manifest. Neither contains supplier prices.
- `8980928220` occurs twice (page 3 left table 2 row 3; page 4 left table 3 row 2), both with engine `4LE2`. One product, two images in source order. No conflicting engine records or unresolved mappings. `49189-00570` is one physical row with three engine lines, not three products.
- Preserve literal PN, including `320/06016`, `65.09100-7198`, `042599204KZ`; only URL handles use lowercase hyphen normalization. Engine text is transcribed, not repaired or independently certified. Photos are catalogue illustrations assigned by the source, not proof of a physically inspected item.
- **152 inquiry-only cards** inserted through the existing supplier catalogue pipeline in `engine-fuel`. No new landing-page layout, no manufacturer/origin/OEM or stock assertions. All price fields are null, including variants; rendered price is «Цена по запросу». No offer/price structured data or Merchant feed additions.
- **12 PN overlap existing branded catalogue variants**. Those existing products, brands, photos, identifiers and prices are deliberately unchanged; this import adds one unbranded source card per unique source PN rather than pretending the variants are the same manufactured item. All **12,141** pre-existing product objects compare equal apart from computed chunk location.
- Existing grid, search, filters, detail page, WhatsApp number and consent-aware contact tracking are reused. WhatsApp titles contain the exact PN.
- Rollback: revert the import PR via a normal follow-up PR; never reset or force-push main. Base main: `0072274c9d1abf2ef9edc6bd916bbe536326edba`.

## Checks
`node --test tests/turbocharger-import.test.mjs` checks row/card/photo containment, image hashes, exact PN, null prices, unavailable status, forbidden identity/claims, category/search indexes, canonical static routes and sitemap. The test runs in the Pages workflow after catalogue route generation.

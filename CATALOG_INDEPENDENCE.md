# Independent catalogue operations

The public ACA Hydraulic catalogue is a versioned snapshot. Normal GitHub Pages deployments must never fetch supplier data or supplier-hosted images.

## Runtime contract

- Product JSON is committed under `client/public/catalog-data`.
- Every remote gallery image uses one explicit ACA-controlled `CATALOG_IMAGE_BASE_URL`; supplier hosts are rejected.
- Object keys are deterministic and product-scoped: `catalog/v2/{productId}/{galleryPosition}-{sourceHash}.webp`.
- `catalog-image-manifest.json` records the product ID, gallery position, object key, source hash, content hash, byte size and content type. It does not expose supplier URLs.
- `pnpm catalog:verify-public` rejects supplier names, supplier hosts, missing image-manifest entries and galleries outside ACA-managed storage.

## Normal deployment

`.github/workflows/pages.yml` builds only the committed snapshot. A supplier outage cannot break an ACA deployment or remove images from an already published catalogue.

## Controlled refresh

`.github/workflows/catalog-refresh.yml` is manual. It imports the source catalogue, verifies titles/SKUs/prices/galleries, mirrors images to ACA storage, strips private audit data, performs the independent-snapshot checks and opens a pull request. The refresh does not publish directly.

The active zero-cost image store is the public repository `ai-azamat95/acahydraulic-catalog-images`, published at `https://ai-azamat95.github.io/acahydraulic-catalog-images/`. Future automated refreshes require one GitHub secret:

- `CATALOG_IMAGES_TOKEN`: a fine-grained token with read/write Contents access only to `acahydraulic-catalog-images`.

The S3-compatible backend remains available for a later move to dedicated object storage. Its credentials should be limited to one bucket; keep account-wide Cloudflare or S3 credentials out of GitHub.

For the zero-cost bootstrap, the filesystem backend can publish optimized WebP files from a dedicated ACA GitHub Pages repository. Use `CATALOG_IMAGE_WEBP_SIZE=1000` and `CATALOG_IMAGE_WEBP_QUALITY=70`; the resulting URLs remain product-scoped and independently versioned. A fine-grained token for that image repository is required only for automated future refreshes.

## Recovery and idempotency

Object paths include a hash of the source URL. Re-running a failed refresh checks existing objects and skips matches, while changed source images receive a new key. Catalog JSON is rewritten only after every selected upload succeeds, preventing partially migrated galleries.

The current snapshot publishes 31,807 product-scoped gallery files for 10,393 products. The optimized image payload is 735,698,822 bytes; the integrity manifest and catalogue checks report no missing or unreferenced managed files.

## Pixel-level supplier hygiene

- `scripts/audit-catalog-image-text.swift` scans real catalogue images with Apple Vision OCR. `--small-text` is the full-catalog gate; `--accurate` is used for targeted confirmation.
- `scripts/clean-catalog-supplier-marks.py` removes only OCR-confirmed rectangles from the original photo with classical OpenCV inpainting or a sampled background fill. It does not generate replacement product imagery.
- The initial full audit covered 31,807 images. Every OCR match was cleaned and a second full `--small-text` scan completed with zero supplier-text matches and zero decode failures.
- A separate visual-template scan removed the repeated small circular supplier seal that text OCR could not reliably read.
- `scripts/rebuild-catalog-image-manifest.mjs` recalculates every content hash and byte size after approved image edits.
- `.github/workflows/catalog-integrity.yml` verifies all stored files weekly and checks a deterministic live GitHub Pages sample.

Two products intentionally remain without images because their exact source records contain no image or video preview. Do not substitute a similar part or generate a replacement image:

- `4063712 / 6743-81-9141` fuel shutoff solenoid;
- `PVQ10-A2R-SE1S-20-CM7D-12` Vickers hydraulic pump.

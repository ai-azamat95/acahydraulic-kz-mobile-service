# Independent catalogue operations

The public ACA Hydraulic catalogue is a versioned snapshot. Normal GitHub Pages deployments must never fetch supplier data or supplier-hosted images.

## Runtime contract

- Product JSON is committed under `client/public/catalog-data`.
- Every remote gallery image uses one explicit ACA-controlled `CATALOG_IMAGE_BASE_URL`; supplier hosts are rejected.
- Object keys are deterministic and product-scoped: `catalog/v1/{productId}/{galleryPosition}-{sourceHash}`.
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

The completed first migration published 31,676 product-scoped gallery files for 10,393 products. The optimized image payload is 732,304,996 bytes; the integrity manifest and catalogue checks report no missing or unreferenced managed files.

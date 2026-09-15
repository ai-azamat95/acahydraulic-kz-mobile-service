import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const catalogDir = path.resolve('client/public/catalog-data');
const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
const audit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.pumpAuditFile), 'utf8'));
const products = [];

for (let page = 1; page <= manifest.chunkCount; page += 1) {
  const fileName = `products-${String(page).padStart(3, '0')}.json`;
  products.push(...JSON.parse(fs.readFileSync(path.join(catalogDir, fileName), 'utf8')));
}

const pumps = products.filter((product) => product.category === 'hydraulic-pumps');
const uniqueIds = new Set(pumps.map((product) => product.id));
const uniqueHandles = new Set(pumps.map((product) => product.handle));
const approvedImageHost = (value) => {
  const hostname = new URL(value).hostname;
  return hostname === 'sinocmp.com' || hostname === 'cdn.shopify.com' || hostname.endsWith('.shopify.com');
};

assert.equal(audit.passed, true, 'supplier comparison must pass');
assert.equal(audit.failures.length, 0, 'supplier comparison must have no failures');
assert.equal(audit.unexpectedProducts, 0, 'no keyword-only products may enter the pump category');
assert.equal(audit.importedProducts, audit.uniqueSourceProducts, 'every supplier pump must be imported');
assert.equal(audit.exactTitleAndHandleMatches, audit.uniqueSourceProducts, 'titles and handles must match exactly');
assert.equal(audit.exactSkuMatches, audit.uniqueSourceProducts, 'SKU lists must match exactly');
assert.equal(audit.exactGalleryMatches, audit.uniqueSourceProducts, 'image galleries must match exactly');
assert.equal(pumps.length, audit.uniqueSourceProducts, 'rendered pump data must match the audited count');
assert.equal(uniqueIds.size, pumps.length, 'pump source IDs must be unique');
assert.equal(uniqueHandles.size, pumps.length, 'pump handles must be unique');

for (const product of pumps) {
  assert(product.title.trim(), `blank title for ${product.id}`);
  assert.equal(product.sourceUrl, `https://sinocmp.com/products/${product.handle}`);
  assert(product.variants.length > 0, `missing variants for ${product.handle}`);
  assert(product.variants.every((variant) => variant.sku.trim()), `blank source SKU for ${product.handle}`);
  assert(product.gallery.every(approvedImageHost), `foreign image URL for ${product.handle}`);
  assert.equal(product.imageUrl, product.gallery[0] || null, `primary image mismatch for ${product.handle}`);
}

const skuProducts = new Map();
for (const product of pumps) {
  for (const variant of product.variants) {
    const matches = skuProducts.get(variant.sku) || [];
    matches.push({ id: product.id, handle: product.handle, title: product.title });
    skuProducts.set(variant.sku, matches);
  }
}
const duplicateSourceSkus = [...skuProducts]
  .filter(([, matches]) => matches.length > 1)
  .map(([sku, matches]) => ({ sku, products: matches }));

console.log(JSON.stringify({
  passed: true,
  pumps: pumps.length,
  exactTitles: audit.exactTitleAndHandleMatches,
  exactSkus: audit.exactSkuMatches,
  exactGalleries: audit.exactGalleryMatches,
  productsWithoutSourceImages: audit.productsWithoutSourceImages,
  duplicateSourceSkus,
}, null, 2));

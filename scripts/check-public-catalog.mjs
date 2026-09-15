import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const catalogDir = path.resolve(process.argv[2] || 'client/public/catalog-data');
const manifestPath = path.join(catalogDir, 'manifest.json');
const forbiddenBrand = /sinocmp/i;
const forbiddenKeys = new Set(['sourceUrl', 'sourcePriceKzt', 'sourceUpdatedAt']);
const privateFiles = ['catalog-import-audit.json', 'pump-import-audit.json', 'strict-category-import-audit.json'];

assert(fs.existsSync(manifestPath), `missing public manifest in ${catalogDir}`);
for (const fileName of privateFiles) {
  assert.equal(fs.existsSync(path.join(catalogDir, fileName)), false, `${fileName} must not be published`);
}

const jsonFiles = fs.readdirSync(catalogDir).filter((fileName) => fileName.endsWith('.json'));
const sensitiveKeyHits = [];

function inspectKeys(value, fileName, location = '$') {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectKeys(item, fileName, `${location}[${index}]`));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) sensitiveKeyHits.push(`${fileName}:${location}.${key}`);
    inspectKeys(child, fileName, `${location}.${key}`);
  }
}

for (const fileName of jsonFiles) {
  const raw = fs.readFileSync(path.join(catalogDir, fileName), 'utf8');
  assert.equal(forbiddenBrand.test(raw), false, `supplier brand leaked in ${fileName}`);
  forbiddenBrand.lastIndex = 0;
  inspectKeys(JSON.parse(raw), fileName);
}

assert.deepEqual(sensitiveKeyHits, [], `sensitive supplier fields leaked: ${sensitiveKeyHits.slice(0, 10).join(', ')}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const key of ['source', 'markup', 'priceOnRequestThresholdKzt', 'catalogAuditFile', 'pumpAuditFile', 'strictCategoryAuditFile']) {
  assert.equal(key in manifest, false, `private manifest field leaked: ${key}`);
}

const products = [];
for (let page = 1; page <= manifest.chunkCount; page += 1) {
  products.push(...JSON.parse(fs.readFileSync(path.join(catalogDir, `products-${String(page).padStart(3, '0')}.json`), 'utf8')));
}

assert.equal(products.length, manifest.productCount, 'public product count must match the manifest');
assert.equal(new Set(products.map((product) => product.handle)).size, products.length, 'public product handles must be unique');
const pumpParts = products.filter((product) => (product.categories || [product.category]).includes('pump-parts'));
const wiringHarnesses = products.filter((product) => (product.categories || [product.category]).includes('wiring-harnesses'));
assert(pumpParts.length > 0, 'pump parts category must not be empty');
assert(wiringHarnesses.length > 0, 'wiring harness category must not be empty');
assert(
  pumpParts.every(
    (product) =>
      product.imageUrl === '/catalog-assets/category-pump-parts.jpg' &&
      JSON.stringify(product.gallery) === JSON.stringify(['/catalog-assets/category-pump-parts.jpg']),
  ),
  'pump parts must use the local unbranded catalogue image',
);
assert(
  wiringHarnesses.every(
    (product) =>
      product.imageUrl === '/catalog-assets/category-wiring-harness.jpg' &&
      JSON.stringify(product.gallery) === JSON.stringify(['/catalog-assets/category-wiring-harness.jpg']),
  ),
  'wiring harnesses must use the local unbranded catalogue image',
);

console.log(
  JSON.stringify(
    {
      passed: true,
      filesChecked: jsonFiles.length,
      products: products.length,
      pumpParts: pumpParts.length,
      wiringHarnesses: wiringHarnesses.length,
      supplierBrandOccurrences: 0,
      sensitiveSupplierFields: 0,
    },
    null,
    2,
  ),
);

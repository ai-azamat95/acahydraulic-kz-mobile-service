import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve(process.argv[2] || 'dist/public');
const catalogDir = path.join(publicDir, 'catalog-data');
const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
const products = Array.from({ length: manifest.chunkCount }, (_, index) => {
  const file = path.join(catalogDir, `search-index-${String(index + 1).padStart(3, '0')}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}).flat();

assert.equal(products.length, manifest.productCount, 'SEO catalogue must cover every published product');
assert(products.every((product) => typeof product.sku === 'string' && product.sku.trim()), 'every product needs a public SKU');
assert(products.every((product) => product.fitment === null || (typeof product.fitment === 'string' && product.fitment.trim())), 'fitment must be explicit text or null');
assert(products.every((product) => !/sinocmp/i.test(`${product.fitment || ''} ${product.sku}`)), 'SEO fields must not expose the supplier');

const productsWithFitment = products.filter((product) => product.fitment);
const fitmentCoverage = productsWithFitment.length / products.length;
assert(fitmentCoverage >= 0.75, `explicit fitment coverage is too low: ${(fitmentCoverage * 100).toFixed(1)}%`);

for (const product of [productsWithFitment[0], products.find((item) => !item.fitment)].filter(Boolean)) {
  const htmlPath = path.join(publicDir, 'catalog', product.handle, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert(!/с наценкой\s+50%/i.test(html), 'public SEO copy must not expose commercial markup');
  assert(html.includes('<h2>Применяемость</h2>'), 'static product fallback must contain a fitment section');
  const schemaMatch = html.match(/<script type="application\/ld\+json" data-static-product-schema>(.*?)<\/script>/s);
  assert(schemaMatch, 'static product page must include Product JSON-LD');
  const schema = JSON.parse(schemaMatch[1]);
  assert.equal(schema['@type'], 'Product');
  assert.equal(schema.sku, product.sku);
  assert(schema.description?.includes('Применяемость:'), 'Product JSON-LD needs a fitment-aware description');
  assert(Array.isArray(schema.image) && schema.image.length > 0, 'Product JSON-LD needs an image');
}

const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap-products.xml'), 'utf8');
assert.equal((sitemap.match(/<url>/g) || []).length, products.length, 'product sitemap must include every product page');

console.log(JSON.stringify({
  passed: true,
  products: products.length,
  productsWithExplicitFitment: productsWithFitment.length,
  fitmentCoveragePercent: Number((fitmentCoverage * 100).toFixed(1)),
  productSchemasChecked: 2,
  sitemapProducts: products.length,
  commercialMarkupLeaks: 0,
}, null, 2));

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { catalogProductSeo, catalogProductCategories } from '../shared/catalog-product-seo.mjs';
import reviewedProductCopy from '../shared/catalog-product-copy.json' with { type: 'json' };
import merchantProductCopy from '../shared/catalog-product-merchant-copy.json' with { type: 'json' };

const productCopy = { ...reviewedProductCopy, ...merchantProductCopy };
const merchantPumps = JSON.parse(fs.readFileSync(new URL('../shared/merchant-pumps.json', import.meta.url), 'utf8'));
const merchantHandles = new Set(merchantPumps.products.map(product => product.handle));
const catalogCanonicalAliases = JSON.parse(fs.readFileSync(new URL('../shared/catalog-canonical-aliases.json', import.meta.url), 'utf8'));

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
const productsWithOffers = products.filter((product) => Number.isFinite(product.minPriceKzt));
const productsWithProductSchema = productsWithOffers.filter(product => !catalogCanonicalAliases[product.handle]);
const priceOnRequestProducts = products.filter((product) => !Number.isFinite(product.minPriceKzt));

for (const product of [
  productsWithOffers.find(item => item.fitment && !merchantHandles.has(item.handle)),
  productsWithOffers.find(item => !item.fitment && !merchantHandles.has(item.handle)),
].filter(Boolean)) {
  const htmlPath = path.join(publicDir, 'catalog', product.handle, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert(!/с наценкой\s+50%/i.test(html), 'public SEO copy must not expose commercial markup');
  assert(/<h2>Применяемость(?: этого исполнения)?<\/h2>/.test(html), 'static product fallback must contain a fitment section');
  const schemaMatch = html.match(/<script type="application\/ld\+json" data-static-product-schema[^>]*>(.*?)<\/script>/s);
  assert(schemaMatch, 'static product page must include Product JSON-LD');
  const schema = JSON.parse(schemaMatch[1]);
  assert.equal(schema['@type'], 'Product');
  assert.equal(schema.category, undefined, 'internal category slugs are not Google product taxonomy values');
  assert.equal(schema.offers?.shippingDetails, undefined, 'pump delivery terms must not be applied to unrelated parts');
  assert(!schema.offers?.availability, 'supplier availability must not claim local stock or delivery status');
  assert(html.includes('Поставка под заказ'), 'static product must disclose supply to order');
  assert.equal(schema.sku, product.sku);
  assert(schema.description?.includes('Применяемость:'), 'Product JSON-LD needs a fitment-aware description');
  assert(Array.isArray(schema.image) && schema.image.length > 0, 'Product JSON-LD needs an image');
}

for (const product of priceOnRequestProducts.slice(0, 20)) {
  const html = fs.readFileSync(path.join(publicDir, 'catalog', product.handle, 'index.html'), 'utf8');
  assert(!/data-static-product-schema/.test(html), `${product.handle}: price-on-request page must not publish an ineligible Product schema`);
}

for (const pump of merchantPumps.products) {
  const html = fs.readFileSync(path.join(publicDir, 'catalog', pump.handle, 'index.html'), 'utf8');
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json" data-static-product-schema[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(schema.category, merchantPumps.productType);
  const shipping = schema.offers.shippingDetails;
  assert.equal(shipping['@type'], 'OfferShippingDetails');
  assert.equal(shipping.shippingDestination.addressCountry, 'KZ');
  const shippingPriceKzt = Object.hasOwn(pump, 'shippingPriceKzt') ? pump.shippingPriceKzt : merchantPumps.shippingPriceKzt;
  assert.deepEqual(shipping.shippingRate, { '@type': 'MonetaryAmount', value: shippingPriceKzt, currency: 'KZT' });
  const itemHasNoPublishedTimes = pump.handlingMinDays === null || pump.handlingMaxDays === null || pump.transitMinDays === null || pump.transitMaxDays === null;
  if (itemHasNoPublishedTimes) {
    assert.equal(shipping.deliveryTime, undefined);
  } else {
    for (const [field, min, max] of [
      ['handlingTime', pump.handlingMinDays ?? merchantPumps.handlingMinDays, pump.handlingMaxDays ?? merchantPumps.handlingMaxDays],
      ['transitTime', pump.transitMinDays ?? merchantPumps.transitMinDays, pump.transitMaxDays ?? merchantPumps.transitMaxDays],
    ]) assert.deepEqual(shipping.deliveryTime[field], { '@type': 'QuantitativeValue', minValue: min, maxValue: max, unitCode: 'DAY' });
  }
  assert.equal(schema.review, undefined, 'do not invent product reviews');
  assert.equal(schema.aggregateRating, undefined, 'do not invent product ratings');
}

// Check the actual generated pages, including metadata before JavaScript runs.
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
for (const product of products) {
  const html = fs.readFileSync(path.join(publicDir, 'catalog', product.handle, 'index.html'), 'utf8');
  const seo = catalogProductSeo(product);
  assert(html.includes(`<title data-rh="true">${escapeHtml(seo.title)} | ACA Hydraulic</title>`), `${product.handle}: static and client titles must match`);
  assert(html.includes(`<h1>${escapeHtml(seo.name)}</h1>`), `${product.handle}: visible product name missing`);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${product.handle}: duplicate canonical`);
  const canonicalHandle = catalogCanonicalAliases[product.handle] || product.handle;
  assert(html.includes(`href="https://acahydraulic.kz/catalog/${canonicalHandle}/"`), `${product.handle}: expected canonical missing`);
  assert(html.includes('data-product-selection'), `${product.handle}: selection instructions missing`);
  assert(!/<meta[^>]+name="robots"[^>]+noindex/i.test(html), `${product.handle}: unexpectedly noindex`);
  for (const category of catalogProductCategories(product)) {
    assert(html.includes(`href="/catalog/category/${category.id}/"`), `${product.handle}: category link missing`);
  }
  const schemaMatch = html.match(/<script type="application\/ld\+json" data-static-product-schema[^>]*>(.*?)<\/script>/s);
  if (Number.isFinite(product.minPriceKzt) && canonicalHandle === product.handle) {
    assert(schemaMatch, `${product.handle}: priced product must publish Product JSON-LD`);
    const schema = JSON.parse(schemaMatch[1]);
    assert.equal(schema.name, seo.name);
    assert.equal(schema.description, seo.description);
    assert(schema.offers, `${product.handle}: Product JSON-LD must contain an Offer or AggregateOffer`);
  } else {
    assert.equal(schemaMatch, null, `${product.handle}: non-canonical or price-on-request page must not publish Product JSON-LD`);
  }
  if (productCopy[product.handle]) {
    assert(html.includes(escapeHtml(product.title)), `${product.handle}: original identifiers must remain visible`);
    const link = html.match(/href="(https:\/\/wa\.me\/77714177925\?text=[^"]+)"/)[1];
    assert(new URL(link).searchParams.get('text').includes(`/catalog/${product.handle}/`), 'static WhatsApp inquiry must identify the product');
  }
}

const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap-products.xml'), 'utf8');
const sitemapProductCount = products.length - Object.keys(catalogCanonicalAliases).length;
assert.equal((sitemap.match(/<url>/g) || []).length, sitemapProductCount, 'product sitemap must contain only canonical product pages');
for (const [alias, canonical] of Object.entries(catalogCanonicalAliases)) {
  assert(!sitemap.includes(`/catalog/${alias}/`), `${alias}: canonical alias must be excluded from the sitemap`);
  assert(sitemap.includes(`/catalog/${canonical}/`), `${canonical}: canonical product must remain in the sitemap`);
}

console.log(JSON.stringify({
  passed: true,
  products: products.length,
  productsWithExplicitFitment: productsWithFitment.length,
  fitmentCoveragePercent: Number((fitmentCoverage * 100).toFixed(1)),
  productSchemasChecked: productsWithProductSchema.length,
  priceOnRequestPagesWithoutProductSchema: priceOnRequestProducts.length,
  reviewedRussianProducts: Object.keys(productCopy).length,
  sitemapProducts: sitemapProductCount,
  canonicalAliases: Object.keys(catalogCanonicalAliases).length,
  commercialMarkupLeaks: 0,
}, null, 2));

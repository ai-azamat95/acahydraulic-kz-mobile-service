import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const handle = 'handok-h5v80dtp-12t-ykskr-9k00-korean-hydraulic-pump';
const publishedProductPath = `dist/public/catalog/${handle}/index.html`;
const published = fs.existsSync(publishedProductPath);

test('HANDOK product publishes price, identifiers, real gallery and included Kazakhstan delivery', { skip: !published }, () => {
  const html = fs.readFileSync(publishedProductPath, 'utf8');
  assert.match(html, /<h1>Гидронасос HANDOK H5V80DTP-12T \/ K5V80DTP YKSKR-9K00 — корейский аналог<\/h1>/);
  assert.match(html, /2 530 000 ₸/);
  assert.match(html, /доставка по Казахстану включена/i);
  assert.match(html, /YKSKR-9K00/);
  assert.match(html, /Made in Korea/);
  assert.match(html, /catalog-assets\/handok-h5v80dtp-12t\/handok-h5v80dtp-12t-main\.webp/);
  assert.match(html, /blog\/k5v80dtp-handok-hitachi-zx160w/);

  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  const product = schemas.find(schema => schema['@type'] === 'Product');
  assert(product, 'Product schema is required');
  assert.equal(product.brand.name, 'HANDOK');
  assert.equal(product.mpn, 'YKSKR-9K00');
  assert.equal(product.offers.price, 2530000);
  assert.equal(product.offers.shippingDetails.shippingRate.value, 0);
  assert.equal(product.offers.shippingDetails.shippingDestination.addressCountry, 'KZ');
  assert.equal(product.image.length, 8);
});

test('HANDOK product is present in the hydraulic pump catalogue bootstrap', { skip: !published }, () => {
  const index = JSON.parse(fs.readFileSync('dist/public/catalog-data/search-index-001.json', 'utf8'));
  const product = index.find(item => item.handle === handle);
  assert(product, 'HANDOK product is missing from the hydraulic pump catalogue');
  assert.equal(product.category, 'hydraulic-pumps');
  assert.equal(product.minPriceKzt, 2530000);
  assert.equal(product.imageUrl, '/catalog-assets/handok-h5v80dtp-12t/handok-h5v80dtp-12t-main.webp');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ownerCatalogProductByHandle } from '../scripts/catalog-owner-products.mjs';
import { catalogProductCategories, catalogProductSeo } from '../shared/catalog-product-seo.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const handle = 'danfoss-90m075-90-420-fixed-displacement-hydraulic-motor';
const product = ownerCatalogProductByHandle(handle);
const assetPrefix = '/catalog-assets/danfoss-90m075-90-420/';

test('Danfoss 90M075 card is classified as a motor and preserves exact nameplate evidence', () => {
  assert(product);
  assert.equal(product.id, 'ACA-DANFOSS-90M075-90-420');
  assert.equal(product.brand, 'Danfoss');
  assert.equal(product.model, '90M075NC0N8N0C6W00NNN0000E6');
  assert.equal(product.sku, '90-420');
  assert.equal(product.mpn, '90-420');
  assert.deepEqual(product.categories, ['hydraulic-motors']);
  assert.deepEqual(catalogProductCategories(product).map((category) => category.id), ['hydraulic-motors']);

  const searchable = JSON.stringify(product);
  for (const value of [
    '90M075NC0N8N0C6W00NNN0000E6',
    '90-M-075-NC-0-N-8-N-0-C6-W-00-NNN-00-00-E6',
    '90-420',
    '90420',
    'C261802422',
    '75 см³/об',
    'Made in P.R.C.',
  ]) assert(searchable.includes(value), value);

  assert.match(product.catalogTitle, /Гидромотор Danfoss Series 90 90M075/);
  assert.match(product.productType, /Фиксированный аксиально-поршневой гидромотор/);
  assert.match(product.ownerEvidence.facts.join(' '), /21 зуб/);
  assert.match(product.ownerEvidence.facts.join(' '), /16 бар, 7 л\/мин/);
  assert.doesNotMatch(product.catalogTitle, /насос/i);
  assert(!product.categories.includes('hydraulic-pumps'));
  assert(!product.categories.includes('piston-pumps'));
  assert.equal(product.available, false);
  assert.equal(product.minPriceKzt, null);
  assert.equal(product.maxPriceKzt, null);
  assert.equal(product.ownerInventory, undefined);
  assert.equal(product.ownerProduct, undefined);
  assert.equal(product.ownerSale, undefined);
  assert.equal(product.approvedSale, undefined);
  assert.equal(product.variants[0].available, false);
  assert.equal(product.variants[0].priceKzt, null);
});

test('Danfoss 90M075 card uses six distinct real WebP images', () => {
  assert.equal(product.gallery.length, 6);
  assert.equal(product.imageUrl, product.gallery[0]);
  assert(product.gallery.every((image) => image.startsWith(assetPrefix)));

  const digests = product.gallery.map((image) => {
    const file = path.join(root, 'client/public', image);
    assert(fs.existsSync(file), file);
    const bytes = fs.readFileSync(file);
    assert(bytes.length > 20_000, file);
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    return createHash('sha256').update(bytes).digest('hex');
  });

  assert.equal(new Set(digests).size, product.gallery.length);
});

test('Danfoss 90M075 SEO keeps motor intent and price-on-request state', () => {
  const seo = catalogProductSeo(product);
  assert.match(seo.name, /Danfoss/);
  assert.match(seo.name, /90M075/);
  assert.match(seo.name, /90-420/);
  assert.match(seo.description, /гидромотор/i);
  assert.match(seo.description, /Цена по запросу/);
  assert.doesNotMatch(seo.description, /В наличии/);
  assert(seo.title.length <= 70, seo.title);
  assert(seo.metaDescription.length <= 180, seo.metaDescription);
});

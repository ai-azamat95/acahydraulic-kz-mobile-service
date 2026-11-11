import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { ownerCatalogProductByHandle } from '../scripts/catalog-owner-products.mjs';
import { catalogProductCategories, catalogProductSeo, catalogProductSelection } from '../shared/catalog-product-seo.mjs';
import priorityCopy from '../shared/catalog-product-priority-copy.json' with { type: 'json' };
import archivedCopy from '../shared/catalog-product-phase3-copy.json' with { type: 'json' };
import { createPhase3Copy } from '../scripts/create-catalog-product-phase3.mjs';
import { loadProducts } from '../scripts/create-catalog-product-phase2.mjs';

const handle = 'hydraulic-pump-564-9801-5649801-fits-for-caterpillar-e336-336-345-340';
const product = ownerCatalogProductByHandle(handle);
const readCatalog = file => JSON.parse(fs.readFileSync(new URL(`../client/public/catalog-data/${file}`, import.meta.url), 'utf8'));

test('CAT fan-pump update preserves the existing identity without invented fitment or sale terms', () => {
  assert.equal(product.id, '8721030250658');
  assert.equal(product.sku, 'ACA-250718-18');
  assert.equal(product.variants[0].id, '45686824272034');
  assert.equal(product.variants[0].sku, product.sku);
  assert.equal(product.mpn, '564-9801');
  assert.equal(product.brand, 'Caterpillar');
  assert.deepEqual(catalogProductCategories(product).map(category => category.id), ['hydraulic-pumps']);
  for (const record of [product, ...product.variants]) assert.equal(record.available, false);
  assert.equal(product.minPriceKzt, null);
  assert.equal(product.maxPriceKzt, null);
  assert.equal(product.variants[0].priceKzt, null);
  for (const key of ['ownerInventory', 'ownerProduct', 'ownerSale', 'approvedSale']) assert.equal(product[key], undefined);
  const visibleCopy = JSON.stringify({ ...product, handle: undefined, ...priorityCopy[handle] });
  assert.doesNotMatch(visibleCopy, /\b(?:E336|336|345|340)\b|InStock|в наличии|Made in|гарантия \d|\d+\s*(?:бар|л\/мин|см³)/i);
  assert.match(visibleCopy, /серийн[а-я ]+номер/);
  assert.match(visibleCopy, /старого насоса/);
});

test('all four CAT owner photos are distinct local WebP assets', () => {
  assert.equal(product.gallery.length, 4);
  assert.equal(product.imageUrl, product.gallery[0]);
  const digests = product.gallery.map(image => {
    assert(image.startsWith('/catalog-assets/cat-564-9801/'));
    const bytes = fs.readFileSync(new URL(`../client/public${image}`, import.meta.url));
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    assert(bytes.length < 150_000);
    return createHash('sha256').update(bytes).digest('hex');
  });
  assert.equal(new Set(digests).size, 4);
});

test('prepared catalogue and search indexes replace the old card exactly once with its real gallery', () => {
  const manifest = readCatalog('manifest.json');
  const chunk = readCatalog('product-map.json')[handle];
  assert.equal(chunk, 1);
  const products = Array.from({ length: manifest.chunkCount }, (_, i) => readCatalog(`products-${String(i + 1).padStart(3, '0')}.json`)).flat();
  assert.equal(products.filter(row => String(row.id) === product.id).length, 1);
  assert.equal(products.filter(row => row.handle === handle).length, 1);
  for (const rows of [products, readCatalog(manifest.indexFile), readCatalog('search-index-001.json'), readCatalog(manifest.categoryIndexFiles['hydraulic-pumps'])]) {
    const matches = rows.filter(row => row.handle === handle);
    assert.equal(matches.length, 1);
    assert.deepEqual(matches[0].gallery, product.gallery);
    assert.equal(matches[0].imageUrl, product.imageUrl);
    assert.equal(matches[0].minPriceKzt, null);
  }
});

test('manual SEO copy replaces the former machine claims and keeps price on request', () => {
  const seo = catalogProductSeo(product);
  assert.equal(seo.name, 'Оригинальный насос вентилятора CAT 564-9801');
  assert(seo.title.length <= 70);
  assert(seo.metaDescription.length <= 170);
  assert.match(seo.description, /564-9801 \(5649801\)/);
  assert.match(seo.description, /Цена и наличие по запросу/);
  assert.match(catalogProductSelection(product), /вал[а-я]*, фланц[а-я]*, порт[а-я]*/);
  assert.equal(priorityCopy[handle].modifiedDate, '2026-11-11');
});

test('phase3 generation preserves the historical owner slot without hiding unrelated review drift', () => {
  const products = loadProducts();
  const generated = createPhase3Copy(products);
  assert.deepEqual(generated, archivedCopy);
  assert.equal(JSON.stringify(generated, null, 2), JSON.stringify(archivedCopy, null, 2));
  const otherHandle = Object.keys(archivedCopy).find(key => key !== handle);
  const changed = products.map(row => row.handle === otherHandle ? { ...row, fitment: 'Komatsu PC999TEST' } : row);
  assert.notDeepEqual(createPhase3Copy(changed)[otherHandle], archivedCopy[otherHandle]);
  assert.equal(createPhase3Copy(products.filter(row => row.handle !== handle))[handle], undefined);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  applySupplierCatalogProducts,
  SUPPLIER_CATALOG_SUPPLEMENT,
  supplierCatalogProducts,
} from '../scripts/catalog-supplier-products.mjs';

function product(number, overrides = {}) {
  return {
    id: `supplement-${number}`,
    handle: `supplement-${number}`,
    title: `Replacement part ${number}`,
    catalogTitle: `Запчасть ${number}`,
    brand: 'Replacement manufacturer',
    applicationBrand: 'Machine manufacturer',
    category: 'engine-fuel',
    categories: ['engine-fuel', 'engine-fuel'],
    available: false,
    minPriceKzt: null,
    maxPriceKzt: null,
    imageUrl: null,
    gallery: [],
    variants: [{ id: `variant-${number}`, available: false, priceKzt: null }],
    ...overrides,
  };
}

const legacyProduct = {
  id: 'legacy',
  handle: 'legacy',
  category: 'hydraulic-pumps',
  available: true,
  minPriceKzt: 125000,
  maxPriceKzt: 125000,
  imageUrl: '/catalog-assets/legacy.webp',
  gallery: ['/catalog-assets/legacy.webp'],
  variants: [{ id: 'legacy-variant', available: true, priceKzt: 125000 }],
  chunk: 1,
};

function write(dir, name, value) {
  fs.writeFileSync(path.join(dir, name), JSON.stringify(value));
}

function read(dir, name) {
  return JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-supplier-products-'));
  write(dir, 'manifest.json', { productCount: 1, pageSize: 250, chunkCount: 1, indexFile: 'search-index.json' });
  write(dir, 'product-map.json', { legacy: 1 });
  write(dir, 'category-summary.json', { 'hydraulic-pumps': { count: 1, imageUrl: legacyProduct.imageUrl } });
  write(dir, 'products-001.json', [legacyProduct]);
  write(dir, 'search-index-001.json', [{ id: 'legacy', handle: 'legacy', category: 'hydraulic-pumps', minPriceKzt: 125000, chunk: 1, reviewedLegacyField: true }]);
  write(dir, 'search-index.json', read(dir, 'search-index-001.json'));
  return dir;
}

function snapshot(dir) {
  return Object.fromEntries(fs.readdirSync(dir).sort().map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]));
}

function verifyRepresentations(dir, expectedCount) {
  const manifest = read(dir, 'manifest.json');
  const rows = [];
  const indexes = [];
  for (let chunk = 1; chunk <= manifest.chunkCount; chunk += 1) {
    const suffix = String(chunk).padStart(3, '0');
    const chunkProducts = read(dir, `products-${suffix}.json`);
    const chunkIndex = read(dir, `search-index-${suffix}.json`);
    assert.deepEqual(chunkIndex.map(product => product.handle), chunkProducts.map(product => product.handle));
    assert(chunkProducts.every(product => product.chunk === chunk));
    assert(chunkIndex.every(product => product.chunk === chunk && !('variants' in product)));
    rows.push(...chunkProducts);
    indexes.push(...chunkIndex);
  }
  assert.equal(rows.length, expectedCount);
  assert.equal(manifest.productCount, expectedCount);
  assert.equal(new Set(rows.map(product => product.handle)).size, expectedCount);
  assert.equal(new Set(rows.map(product => product.id)).size, expectedCount);
  assert.deepEqual(read(dir, 'product-map.json'), Object.fromEntries(rows.map(product => [product.handle, product.chunk])));
  assert.deepEqual(read(dir, 'search-index.json').map(product => product.handle).sort(), indexes.map(product => product.handle).sort());
  return rows;
}

test('supplier supplement uses bounded chunks and preserves legacy prices, indexes and application branding on repeat runs', () => {
  const dir = fixture();
  try {
    const products = Array.from({ length: 501 }, (_, index) => product(index));
    const result = applySupplierCatalogProducts(dir, { products });
    assert.equal(result.chunks, 3);
    assert.equal(result.chunkCount, 4);
    assert.deepEqual([2, 3, 4].map(chunk => read(dir, `products-${String(chunk).padStart(3, '0')}.json`).length), [250, 250, 1]);
    const rows = verifyRepresentations(dir, 502);
    assert.deepEqual(rows[0], legacyProduct);
    assert.equal(read(dir, 'search-index-001.json')[0].reviewedLegacyField, true);
    assert.equal(read(dir, 'category-summary.json')['engine-fuel'].count, 501);
    assert.equal(read(dir, 'category-summary.json')['hydraulic-pumps'].count, 1);
    const inserted = rows[1];
    assert.equal(inserted.brand, 'Replacement manufacturer');
    assert.equal(inserted.applicationBrand, 'Machine manufacturer');
    assert.equal(inserted.catalogSupplement, SUPPLIER_CATALOG_SUPPLEMENT);
    const first = snapshot(dir);
    assert.equal(applySupplierCatalogProducts(dir, { products }).added, 0);
    assert.deepEqual(snapshot(dir), first);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a public snapshot with duplicate and moved supplement rows is rebuilt without stale chunks, maps or category counts', () => {
  const dir = fixture();
  try {
    const old = product('old', { catalogSupplement: SUPPLIER_CATALOG_SUPPLEMENT, category: 'attachments', categories: ['attachments'], chunk: 1 });
    write(dir, 'products-001.json', [legacyProduct, old]);
    write(dir, 'products-002.json', [{ ...old, chunk: 2 }]);
    write(dir, 'products-003.json', [product('removed', { catalogSupplement: SUPPLIER_CATALOG_SUPPLEMENT, chunk: 3 })]);
    write(dir, 'search-index-002.json', [old]);
    write(dir, 'search-index-003.json', [old]);
    write(dir, 'search-index.json', [...read(dir, 'search-index.json'), old, old]);
    write(dir, 'manifest.json', { productCount: 999, pageSize: 250, chunkCount: 3 });
    write(dir, 'product-map.json', { legacy: 1, 'supplement-old': 2, 'supplement-removed': 3, 'outdated-alias': 3 });
    write(dir, 'category-summary.json', { 'hydraulic-pumps': { count: 999, imageUrl: legacyProduct.imageUrl }, attachments: { count: 2, imageUrl: null }, 'engine-fuel': { count: 1, imageUrl: null } });

    applySupplierCatalogProducts(dir, { products: [product('old', { legacyHandles: ['outdated-alias'] })] });
    const rows = verifyRepresentations(dir, 2);
    assert.equal(rows[1].chunk, 2);
    assert.equal(fs.existsSync(path.join(dir, 'products-003.json')), false);
    assert.equal(fs.existsSync(path.join(dir, 'search-index-003.json')), false);
    assert.equal(read(dir, 'category-summary.json').attachments.count, 0);
    assert.equal(read(dir, 'category-summary.json')['engine-fuel'].count, 1);
    const first = snapshot(dir);
    applySupplierCatalogProducts(dir, { products: [product('old', { legacyHandles: ['outdated-alias'] })] });
    assert.deepEqual(snapshot(dir), first);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('withdrawing all supplement products removes their chunks and supports fixtures without a category summary', () => {
  const dir = fixture();
  try {
    fs.unlinkSync(path.join(dir, 'category-summary.json'));
    fs.unlinkSync(path.join(dir, 'search-index.json'));
    applySupplierCatalogProducts(dir, { products: [product(1)], updateCategorySummary: false });
    const versionWithProduct = read(dir, 'manifest.json').dataVersion;
    applySupplierCatalogProducts(dir, { products: [], updateCategorySummary: false });
    assert.notEqual(read(dir, 'manifest.json').dataVersion, versionWithProduct, 'withdrawing a product must invalidate cached catalogue requests');
    assert.deepEqual(verifyRepresentations(dir, 1), [legacyProduct]);
    assert.equal(fs.existsSync(path.join(dir, 'products-002.json')), false);
    assert.equal(fs.existsSync(path.join(dir, 'category-summary.json')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('invalid confirmed claims, duplicate identities and legacy collisions fail before any snapshot writes', () => {
  const dir = fixture();
  try {
    const before = snapshot(dir);
    const invalidProducts = [
      [product(1, { available: true })],
      [product(1, { minPriceKzt: 100 })],
      [product(1, { maxPriceKzt: 100 })],
      [product(1, { variants: [{ available: true, priceKzt: null }] })],
      [product(1, { variants: [{ available: false, priceKzt: 100 }] })],
      [product(1), product(1)],
      [product(1), product(2, { legacyHandles: ['supplement-1'] })],
      [product(1, { handle: 'legacy' })],
      [product(1, { id: 'legacy' })],
      [product(1, { legacyHandles: ['legacy'] })],
      [product(1, { ownerProduct: { confirmedOn: '2026-10-15' } })],
      [product(1, { category: '../unsafe', categories: ['../unsafe'] })],
    ];
    for (const products of invalidProducts) {
      assert.throws(() => applySupplierCatalogProducts(dir, { products }));
      assert.deepEqual(snapshot(dir), before);
    }
    const reviewedPricedPump = supplierCatalogProducts.find(product => product.minPriceKzt !== null);
    assert(reviewedPricedPump);
    assert.throws(() => applySupplierCatalogProducts(dir, { products: [{ ...reviewedPricedPump, catalogTitle: 'Tampered reviewed record' }] }));
    assert.deepEqual(snapshot(dir), before);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('committed supplier inputs use inquiry-only commercial terms and the preparation pipeline adds them before category indexes', () => {
  const dir = fixture();
  try {
    applySupplierCatalogProducts(dir);
    verifyRepresentations(dir, 1 + supplierCatalogProducts.length);
    const prepareScript = fs.readFileSync(new URL('../scripts/prepare-public-catalog.mjs', import.meta.url), 'utf8');
    assert(prepareScript.indexOf('applySupplierCatalogProducts(catalogDir)') < prepareScript.indexOf('const categoryIndexes = createCategorySearchIndexes'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

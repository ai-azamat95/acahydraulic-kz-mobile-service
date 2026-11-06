import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyOwnerCatalogProducts, ownerCatalogProducts } from '../scripts/catalog-owner-products.mjs';
import { reconcileCatalogImageManifest } from '../scripts/lib/catalog-image-manifest.mjs';

test('owner product is inserted into every public catalogue representation without duplication', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-products-'));
  try {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ productCount: 1, pageSize: 250, chunkCount: 1 }));
    fs.writeFileSync(path.join(dir, 'product-map.json'), JSON.stringify({ supplier: 1 }));
    fs.writeFileSync(path.join(dir, 'category-summary.json'), JSON.stringify({ 'hydraulic-pumps': { count: 1, imageUrl: null } }));
    fs.writeFileSync(path.join(dir, 'products-001.json'), JSON.stringify([{ id: 'supplier', handle: 'supplier', category: 'hydraulic-pumps' }]));
    fs.writeFileSync(path.join(dir, 'search-index-001.json'), JSON.stringify([{ id: 'supplier', handle: 'supplier', category: 'hydraulic-pumps', chunk: 1 }]));
    fs.writeFileSync(path.join(dir, 'search-index.json'), JSON.stringify([{ id: 'supplier', handle: 'supplier', category: 'hydraulic-pumps', chunk: 1 }]));

    applyOwnerCatalogProducts(dir);
    const first = ['manifest.json', 'product-map.json', 'category-summary.json', 'products-001.json', 'search-index-001.json', 'search-index.json']
      .map(file => fs.readFileSync(path.join(dir, file), 'utf8'));
    applyOwnerCatalogProducts(dir);
    const second = ['manifest.json', 'product-map.json', 'category-summary.json', 'products-001.json', 'search-index-001.json', 'search-index.json']
      .map(file => fs.readFileSync(path.join(dir, file), 'utf8'));
    assert.deepEqual(second, first);

    const product = ownerCatalogProducts[0];
    const fullProduct = JSON.parse(second[3]).find(item => item.handle === product.handle);
    assert.equal(fullProduct.minPriceKzt, 2530000);
    assert.equal(fullProduct.ownerProduct.shippingIncluded, true);
    assert.equal(fullProduct.gallery.length, 8);
    assert.equal(JSON.parse(second[0]).productCount, 1 + ownerCatalogProducts.length);
    assert.equal(JSON.parse(second[2])['hydraulic-pumps'].count, 1 + ownerCatalogProducts.filter(product => (product.categories || [product.category]).includes('hydraulic-pumps')).length);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('browser fixture can add owner products without an ignored category summary', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-products-browser-'));
  try {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ productCount: 1, pageSize: 250, chunkCount: 1 }));
    fs.writeFileSync(path.join(dir, 'product-map.json'), JSON.stringify({ supplier: 1 }));
    fs.writeFileSync(path.join(dir, 'products-001.json'), JSON.stringify([{ id: 'supplier', handle: 'supplier', category: 'hydraulic-pumps' }]));
    fs.writeFileSync(path.join(dir, 'search-index-001.json'), JSON.stringify([{ id: 'supplier', handle: 'supplier', category: 'hydraulic-pumps', chunk: 1 }]));

    applyOwnerCatalogProducts(dir, { updateCategorySummary: false });

    assert.equal(fs.existsSync(path.join(dir, 'category-summary.json')), false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')).productCount, 1 + ownerCatalogProducts.length);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'product-map.json'), 'utf8'))[ownerCatalogProducts[0].handle], 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('owner product replaces matching imported and legacy rows across catalogue chunks', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-products-replacement-'));
  try {
    const rexroth = ownerCatalogProducts.find(product => product.id === '8705188397218');
    assert(rexroth, 'Reviewed Rexroth owner product is required');
    const discardedHandle = rexroth.legacyHandles[0];
    const unrelated = { id: 'supplier', handle: 'supplier', category: 'other-parts', categories: ['other-parts'], imageUrl: null, chunk: 1 };
    const staleBranchRow = { id: 'ACA-REXROTH-R901147102-PGH4-032', handle: discardedHandle, category: 'gear-pumps', categories: ['hydraulic-pumps', 'gear-pumps'], imageUrl: '/stale.webp', chunk: 1 };
    const importedRow = { id: rexroth.id, handle: rexroth.handle, category: 'gear-pumps', categories: ['gear-pumps'], imageUrl: 'https://example.test/imported.webp', chunk: 2 };

    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ productCount: 3, pageSize: 250, chunkCount: 2, indexFile: 'search-index.json' }));
    fs.writeFileSync(path.join(dir, 'product-map.json'), JSON.stringify({ supplier: 1, [discardedHandle]: 1, [rexroth.handle]: 2 }));
    fs.writeFileSync(path.join(dir, 'category-summary.json'), JSON.stringify({
      'other-parts': { count: 1, imageUrl: null },
      'gear-pumps': { count: 2, imageUrl: '/stale.webp' },
      'hydraulic-pumps': { count: 1, imageUrl: '/stale.webp' },
    }));
    fs.writeFileSync(path.join(dir, 'products-001.json'), JSON.stringify([unrelated, staleBranchRow]));
    fs.writeFileSync(path.join(dir, 'products-002.json'), JSON.stringify([importedRow]));
    fs.writeFileSync(path.join(dir, 'search-index-001.json'), JSON.stringify([unrelated, staleBranchRow]));
    fs.writeFileSync(path.join(dir, 'search-index-002.json'), JSON.stringify([importedRow]));
    fs.writeFileSync(path.join(dir, 'search-index.json'), JSON.stringify([unrelated, staleBranchRow, importedRow]));

    const snapshot = () => Object.fromEntries(fs.readdirSync(dir).sort().map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]));
    const replacement = applyOwnerCatalogProducts(dir);
    assert.equal(replacement.added, ownerCatalogProducts.length - 1);
    const first = snapshot();
    applyOwnerCatalogProducts(dir);
    assert.deepEqual(snapshot(), first, 'Owner product replacement must be idempotent');

    const productRows = ['products-001.json', 'products-002.json'].flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
    const indexRows = ['search-index-001.json', 'search-index-002.json'].flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
    const fullIndex = JSON.parse(fs.readFileSync(path.join(dir, 'search-index.json'), 'utf8'));
    const productMap = JSON.parse(fs.readFileSync(path.join(dir, 'product-map.json'), 'utf8'));
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    const summary = JSON.parse(fs.readFileSync(path.join(dir, 'category-summary.json'), 'utf8'));

    for (const rows of [productRows, indexRows, fullIndex]) {
      assert.equal(rows.filter(product => product.handle === rexroth.handle).length, 1);
      assert.equal(rows.some(product => product.handle === discardedHandle), false);
      assert.equal(new Set(rows.map(product => product.handle)).size, rows.length);
      assert.equal(new Set(rows.map(product => String(product.id))).size, rows.length);
    }
    assert.equal(productMap[rexroth.handle], 1);
    assert.equal(productMap[discardedHandle], undefined);
    assert.equal(manifest.productCount, 1 + ownerCatalogProducts.length);

    const expectedCounts = {};
    for (const product of productRows) {
      for (const category of new Set(product.categories?.length ? product.categories : [product.category])) {
        expectedCounts[category] = (expectedCounts[category] || 0) + 1;
      }
    }
    for (const [category, count] of Object.entries(expectedCounts)) assert.equal(summary[category].count, count, category);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('public preparation removes image-manifest entries no longer referenced after an owner product replacement', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-images-'));
  const imageBaseUrl = 'https://images.acahydraulic.test/catalog';
  const keptKey = 'v2/kept.webp';
  try {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({
      chunkCount: 1,
      imageBaseUrl,
      imageManifestFile: 'catalog-image-manifest.json',
      mirroredImageCount: 2,
      mirroredProductCount: 2,
    }));
    fs.writeFileSync(path.join(dir, 'products-001.json'), JSON.stringify([{
      id: 'kept-product',
      imageUrl: `${imageBaseUrl}/${keptKey}`,
      gallery: ['/catalog-assets/owner-product.webp'],
    }]));
    fs.writeFileSync(path.join(dir, 'catalog-image-manifest.json'), JSON.stringify({
      version: 1,
      generatedAt: '2026-11-06T00:00:00.000Z',
      imageBaseUrl,
      productCount: 2,
      imageCount: 2,
      totalBytes: 30,
      entries: [
        { productId: 'kept-product', key: keptKey, bytes: 10 },
        { productId: 'replaced-product', key: 'v2/orphan.webp', bytes: 20 },
      ],
    }));

    const result = reconcileCatalogImageManifest(dir);
    assert.deepEqual(result, { reconciled: true, removed: 1, imageCount: 1, productCount: 1, totalBytes: 10 });
    const first = Object.fromEntries(fs.readdirSync(dir).sort().map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]));
    const imageManifest = JSON.parse(first['catalog-image-manifest.json']);
    assert.equal(imageManifest.generatedAt, '2026-11-06T00:00:00.000Z');
    assert.deepEqual(imageManifest.entries.map(entry => entry.key), [keptKey]);
    assert.equal(JSON.parse(first['manifest.json']).mirroredImageCount, 1);
    assert.equal(JSON.parse(first['manifest.json']).mirroredProductCount, 1);

    assert.equal(reconcileCatalogImageManifest(dir).removed, 0);
    assert.deepEqual(Object.fromEntries(fs.readdirSync(dir).sort().map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')])), first);

    fs.writeFileSync(path.join(dir, 'products-001.json'), JSON.stringify([{
      id: 'missing-product',
      gallery: [`${imageBaseUrl}/v2/missing.webp`],
    }]));
    assert.throws(() => reconcileCatalogImageManifest(dir), /missing referenced images: v2\/missing\.webp/i);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('image-manifest reconciliation fails closed when catalogue image base URLs disagree', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-image-base-'));
  try {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({
      chunkCount: 1,
      imageBaseUrl: 'https://images.acahydraulic.test/catalog',
      imageManifestFile: 'catalog-image-manifest.json',
      mirroredImageCount: 1,
      mirroredProductCount: 1,
    }));
    fs.writeFileSync(path.join(dir, 'products-001.json'), JSON.stringify([]));
    fs.writeFileSync(path.join(dir, 'catalog-image-manifest.json'), JSON.stringify({
      imageBaseUrl: 'https://unexpected.example/catalog',
      productCount: 1,
      imageCount: 1,
      totalBytes: 10,
      entries: [{ productId: 'protected-product', key: 'v2/protected.webp', bytes: 10 }],
    }));
    const before = Object.fromEntries(['manifest.json', 'catalog-image-manifest.json'].map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]));

    assert.throws(() => reconcileCatalogImageManifest(dir), /base URLs must match/);
    assert.deepEqual(Object.fromEntries(['manifest.json', 'catalog-image-manifest.json'].map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')])), before);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { applyOwnerCatalogProducts, ownerCatalogProductByHandle, ownerCatalogProducts } from '../scripts/catalog-owner-products.mjs';
import { catalogProductCategories, catalogProductSelection, catalogProductSeo } from '../shared/catalog-product-seo.mjs';

const handle = 'husco-6600-e163-a00-c16e303-f18-22233-hydraulic-control-valve';
const legacyHandle = 'husco-6600-f163-a00-c16e303-f18-22233-hydraulic-control-valve';
const product = ownerCatalogProductByHandle(handle);
const root = fileURLToPath(new URL('../', import.meta.url));

test('HUSCO records exact nameplate evidence and the completed HIDROMEK fitment without inventing an offer', () => {
  assert(product);
  assert.equal(product.brand, 'HUSCO');
  assert.equal(product.model, '6600-E163 A00');
  assert.equal(product.mpn, 'C16E303');
  assert.equal(product.minPriceKzt, null);
  assert.equal(product.maxPriceKzt, null);
  assert.equal(product.available, false);
  assert.equal(product.variants[0].priceKzt, null);
  assert.equal(product.variants[0].available, false);
  assert.equal(product.ownerProduct, undefined);
  assert.equal(product.ownerSale, undefined);
  assert.equal(product.approvedSale, undefined);
  assert.equal(product.ownerCase.casePath, '/cases/hidromek-102b-zamena-gidroraspredelitelya-husco-c16e303');
  assert.deepEqual(product.legacyHandles, [legacyHandle]);
  assert.match(product.ownerEvidence.facts.join(' '), /F18\/22233/);
  assert.match(product.ownerEvidence.photoCaption, /Фото снятого узла из выполненной работы/);
  assert.match(product.ownerEvidence.photoAlt, /Шильдик снятого гидрораспределителя HUSCO/);
  assert.match(product.fitment, /завершённом кейсе/);
  assert.match(product.fitment, /запустили/);
  assert.match(catalogProductSelection(product), /серийный номер/);
  assert.match(catalogProductSelection(product), /состояние предлагаемого изделия/);
  assert.match(catalogProductSeo(product).description, /Цена по запросу/);
  assert.deepEqual(catalogProductCategories(product).map(item => item.id).sort(), ['control-valves', 'main-control-valves']);
  assert.equal(product.gallery.length, 3);
  for (const imagePath of product.gallery) {
    const image = fs.readFileSync(path.join(root, 'client/public', imagePath));
    assert.equal(image.subarray(0, 4).toString(), 'RIFF');
    assert.equal(image.subarray(8, 12).toString(), 'WEBP');
  }
});

test('HUSCO survives prepare refresh in full/chunk search, map and both categories exactly once', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-husco-catalog-'));
  try {
    const write = (file, value) => fs.writeFileSync(path.join(dir, file), JSON.stringify(value));
    const read = file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    write('manifest.json', { productCount: 0, chunkCount: 1 });
    write('product-map.json', {});
    write('category-summary.json', {});
    for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) write(file, []);
    applyOwnerCatalogProducts(dir);
    const first = fs.readdirSync(dir).map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]);
    applyOwnerCatalogProducts(dir);
    assert.deepEqual(fs.readdirSync(dir).map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]), first);
    for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) {
      const matches = read(file).filter(item => item.handle === handle);
      assert.equal(matches.length, 1);
      assert.deepEqual(matches[0].categories, ['main-control-valves', 'control-valves']);
      assert.equal(matches[0].minPriceKzt, null);
      for (const query of ['C16E303', 'F18/22233', '6600-E163', 'Hidromek', '102B', 'Гидромек']) {
        assert(JSON.stringify(matches[0]).toLowerCase().includes(query.toLowerCase()), query);
      }
    }
    assert.equal(read('product-map.json')[handle], 1);
    for (const category of product.categories) {
      const expected = ownerCatalogProducts.filter(candidate => (candidate.categories || [candidate.category]).includes(category)).length;
      assert.equal(read('category-summary.json')[category].count, expected);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('HUSCO preparation replaces the incorrect legacy F163 URL without duplicating the product', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-husco-migration-'));
  try {
    const legacy = { id: 'ACA-HUSCO-6600-F163-A00-C16E303', handle: legacyHandle, category: 'main-control-valves', categories: ['main-control-valves', 'control-valves'], variants: [] };
    const write = (file, value) => fs.writeFileSync(path.join(dir, file), JSON.stringify(value));
    const read = file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    write('manifest.json', { productCount: 1, chunkCount: 1 });
    write('product-map.json', { [legacyHandle]: 1 });
    write('category-summary.json', { 'main-control-valves': { count: 1 }, 'control-valves': { count: 1 } });
    for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) write(file, [legacy]);
    applyOwnerCatalogProducts(dir);
    assert.equal(read('manifest.json').productCount, ownerCatalogProducts.length);
    assert.equal(read('product-map.json')[legacyHandle], undefined);
    assert.equal(read('product-map.json')[handle], 1);
    for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) {
      const rows = read(file);
      assert.equal(rows.filter(item => item.handle === legacyHandle).length, 0);
      assert.equal(rows.filter(item => item.handle === handle).length, 1);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('generated HUSCO route has a self canonical, evidence and no ineligible Product schema', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-husco-route-'));
  try {
    const out = path.join(dir, 'dist/public');
    fs.mkdirSync(path.join(out, 'catalog-data'), { recursive: true });
    fs.writeFileSync(path.join(out, 'index.html'), '<html><head><title>ACA</title></head><body><div id="root"></div></body></html>');
    fs.writeFileSync(path.join(out, 'catalog-data/manifest.json'), JSON.stringify({ chunkCount: 1, importedAt: '2026-10-03T00:00:00Z' }));
    fs.writeFileSync(path.join(out, 'catalog-data/search-index-001.json'), JSON.stringify([product]));
    const run = spawnSync(process.execPath, [path.join(root, 'scripts/create-catalog-route-copies.mjs')], { cwd: dir, encoding: 'utf8', timeout: 15000 });
    assert.equal(run.status, 0, run.stderr);
    const html = fs.readFileSync(path.join(out, 'catalog', handle, 'index.html'), 'utf8');
    const canonical = `https://acahydraulic.kz/catalog/${handle}/`;
    assert(html.includes(`rel="canonical" href="${canonical}"`));
    assert.match(html, /Цена по запросу/);
    assert(html.includes(product.ownerEvidence.photoCaption));
    assert(html.includes(product.ownerEvidence.photoAlt));
    assert(html.includes(product.imageUrl));
    for (const category of product.categories) assert(html.includes(`/catalog/category/${category}/`));
    assert.doesNotMatch(html, /data-static-product-schema/);
    assert.doesNotMatch(html, /"@type":"Product"/);
    assert.doesNotMatch(html, /HANDOK|Новый насос в сборе|2 530 000/);
    assert(fs.readFileSync(path.join(out, 'sitemap-products.xml'), 'utf8').includes(canonical));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

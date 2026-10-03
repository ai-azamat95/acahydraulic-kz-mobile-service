import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { applyOwnerCatalogProducts, ownerCatalogProductByHandle } from '../scripts/catalog-owner-products.mjs';
import { catalogProductCategories, catalogProductSelection, catalogProductSeo } from '../shared/catalog-product-seo.mjs';

const handle = 'husco-6600-f163-a00-c16e303-f18-22233-hydraulic-control-valve';
const product = ownerCatalogProductByHandle(handle);
const root = fileURLToPath(new URL('../', import.meta.url));

test('HUSCO records nameplate evidence without inventing an offer or machine fitment', () => {
  assert(product);
  assert.equal(product.brand, 'HUSCO');
  assert.equal(product.model, '6600-F163 A00');
  assert.equal(product.mpn, 'C16E303');
  assert.equal(product.minPriceKzt, null);
  assert.equal(product.maxPriceKzt, null);
  assert.equal(product.available, false);
  assert.equal(product.variants[0].priceKzt, null);
  assert.equal(product.variants[0].available, false);
  assert.equal(product.ownerProduct, undefined);
  assert.equal(product.ownerSale, undefined);
  assert.equal(product.approvedSale, undefined);
  assert.match(product.ownerEvidence.facts.join(' '), /F18\/22233/);
  assert.match(product.ownerEvidence.photoCaption, /Маркировка проверена по фото снятого узла/);
  assert.match(product.fitment, /материалах выполненной работы/);
  assert.match(catalogProductSelection(product), /серийный номер/);
  assert.match(catalogProductSelection(product), /состояние предлагаемого изделия/);
  assert.match(catalogProductSeo(product).description, /Цена по запросу/);
  assert.deepEqual(catalogProductCategories(product).map(item => item.id).sort(), ['control-valves', 'main-control-valves']);
  assert.equal(product.imageUrl, null);
  assert.deepEqual(product.gallery, []);
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
      for (const query of ['C16E303', 'F18/22233', '6600-F163', 'Hidromek', '102B', 'Гидромек']) {
        assert(JSON.stringify(matches[0]).toLowerCase().includes(query.toLowerCase()), query);
      }
    }
    assert.equal(read('product-map.json')[handle], 1);
    for (const category of product.categories) assert.equal(read('category-summary.json')[category].count, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('generated HUSCO route has a self canonical, category links and evidence caption with no Offer or NewCondition', () => {
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
    for (const category of product.categories) assert(html.includes(`/catalog/category/${category}/`));
    const schema = JSON.parse(html.match(/data-static-product-schema[^>]*>([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema.brand.name, 'HUSCO');
    assert.equal(schema.mpn, 'C16E303');
    assert.equal(schema.offers, undefined);
    assert.equal(schema.itemCondition, undefined);
    assert.doesNotMatch(html, /HANDOK|Новый насос в сборе|2 530 000/);
    assert(fs.readFileSync(path.join(out, 'sitemap-products.xml'), 'utf8').includes(canonical));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

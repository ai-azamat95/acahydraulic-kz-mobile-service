import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyOwnerCatalogProducts, ownerCatalogProducts } from '../scripts/catalog-owner-products.mjs';

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
    assert.equal(JSON.parse(second[0]).productCount, 2);
    assert.equal(JSON.parse(second[2])['hydraulic-pumps'].count, 2);
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
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')).productCount, 2);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'product-map.json'), 'utf8'))[ownerCatalogProducts[0].handle], 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

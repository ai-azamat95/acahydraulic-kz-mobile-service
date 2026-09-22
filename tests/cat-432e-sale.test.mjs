import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sale from '../shared/cat-432e-sale.json' with { type: 'json' };
import { applyOwnerSale, applyOwnerCatalogSales } from '../scripts/catalog-owner-sales.mjs';

const product = () => ({ id: sale.id, handle: sale.handle, category: 'hydraulic-pumps', title: 'Supplier title', variants: [{ id: 'v1', priceKzt: null }], gallery: ['https://example.com/supplier.jpg'] });

test('owner-confirmed sale has exact price and real media without inheriting unrelated terms', () => {
  const result = applyOwnerSale(product());
  assert.equal(result.minPriceKzt, 1230000);
  assert.equal(result.variants[0].priceKzt, 1230000);
  assert.equal(result.ownerSale.condition, 'new');
  assert.equal(result.approvedSale, undefined);
  assert.equal(result.available, undefined);
  assert.equal(result.brand, undefined);
  assert.deepEqual(result.gallery, [sale.image]);
  assert.deepEqual(applyOwnerSale(result), result);
  const unrelated = { ...product(), id: 'other' };
  assert.equal(applyOwnerSale(unrelated), unrelated);
  assert.throws(() => applyOwnerSale({ ...product(), handle: 'different' }), /changed identity/);
  assert.throws(() => applyOwnerSale({ ...product(), variants: [{}, {}] }), /Review owner sale variants/);
});

test('fresh imports and repeated preparation keep every catalog representation in sync', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-sale-'));
  try {
    const files = ['products-001.json', 'search-index-001.json', 'search-index.json'];
    for (let run = 0; run < 2; run++) {
      for (const file of files) fs.writeFileSync(path.join(dir, file), JSON.stringify([product()]));
      applyOwnerCatalogSales(dir);
      const before = files.map(file => fs.readFileSync(path.join(dir, file), 'utf8'));
      applyOwnerCatalogSales(dir);
      assert.deepEqual(files.map(file => fs.readFileSync(path.join(dir, file), 'utf8')), before);
      for (const raw of before) assert.equal(JSON.parse(raw)[0].ownerSale.casePath, sale.casePath);
    }
    fs.writeFileSync(path.join(dir, 'search-index.json'), '[]');
    const before = fs.readFileSync(path.join(dir, files[0]), 'utf8');
    assert.throws(() => applyOwnerCatalogSales(dir), /Expected one owner sale/);
    assert.equal(fs.readFileSync(path.join(dir, files[0]), 'utf8'), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('case publishes one Article entity from the shared SEO component', () => {
  const html = fs.readFileSync(`dist/public${sale.casePath}/index.html`, 'utf8');
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  const articles = schemas.filter(schema => schema['@type'] === 'Article');
  assert.equal(articles.length, 1);
  assert.equal(articles[0]['@id'], `https://acahydraulic.kz${sale.casePath}/#article`);
  assert.equal(articles[0].headline, sale.caseTitle);
});

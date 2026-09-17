import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { approvedPumpPrices, applyApprovedPrice, applyApprovedCatalogPrices } from '../scripts/catalog-approved-prices.mjs';

const products = () => approvedPumpPrices.map(offer => ({ ...offer, category: 'hydraulic-pumps', minPriceKzt: null, maxPriceKzt: null, variants: [{ id: `${offer.id}-v`, priceKzt: null }] }));

test('approved assemblies get exact prices and condition without inventing stock or manufacturer', () => {
  for (const product of products()) {
    const result = applyApprovedPrice(product);
    assert.equal(result.minPriceKzt, product.priceKzt);
    assert.equal(result.maxPriceKzt, product.priceKzt);
    assert.equal(result.variants[0].priceKzt, product.priceKzt);
    assert.equal(result.approvedSale.condition, 'new');
    assert.equal(result.approvedSale.prepaymentPercent, 100);
    assert.equal(result.available, undefined);
    assert.equal(result.brand, undefined);
    assert.equal(product.minPriceKzt, null);
    assert.deepEqual(applyApprovedPrice(result), result);
  }
});

test('kits, unreviewed assemblies and K5V160DTP do not inherit series prices', () => {
  for (const title of ['K3V112DT repair kit', 'K3V112DTP hydraulic pump', 'K5V160DTP hydraulic pump']) {
    const product = { id: 'unapproved', title, minPriceKzt: 123, maxPriceKzt: 123 };
    assert.equal(applyApprovedPrice(product), product);
  }
});

test('supplier identity or variant changes require review', () => {
  const product = products()[0];
  assert.throws(() => applyApprovedPrice({ ...product, handle: 'replacement-kit' }), /changed identity/);
  assert.throws(() => applyApprovedPrice({ ...product, category: 'repair-kits' }), /changed category/);
  assert.throws(() => applyApprovedPrice({ ...product, variants: [...product.variants, { id: 'new' }] }), /Review new variants/);
});

test('all catalog representations stay consistent across repeated preparation and fresh imports', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-approved-prices-'));
  try {
    const source = products();
    const indexes = source.map(({ variants, ...row }) => row);
    const fixtures = { 'products-001.json': source, 'search-index-001.json': indexes, 'search-index.json': indexes };
    for (let run = 0; run < 2; run++) {
      for (const [file, rows] of Object.entries(fixtures)) fs.writeFileSync(path.join(dir, file), JSON.stringify(rows));
      applyApprovedCatalogPrices(dir);
      const first = Object.keys(fixtures).map(file => fs.readFileSync(path.join(dir, file), 'utf8'));
      applyApprovedCatalogPrices(dir);
      const second = Object.keys(fixtures).map(file => fs.readFileSync(path.join(dir, file), 'utf8'));
      assert.deepEqual(second, first);
      for (const raw of first) for (const row of JSON.parse(raw)) assert.equal(row.minPriceKzt, row.priceKzt);
    }
    fs.writeFileSync(path.join(dir, 'search-index.json'), '[]');
    const before = fs.readFileSync(path.join(dir, 'products-001.json'), 'utf8');
    assert.throws(() => applyApprovedCatalogPrices(dir), /Expected one/);
    assert.equal(fs.readFileSync(path.join(dir, 'products-001.json'), 'utf8'), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { legacyPublicProducts } from '../scripts/prepare-legacy-public-catalog.mjs';
import { publicSupplierFindings } from '../scripts/lib/public-supplier-guard.mjs';

test('legacy client projection excludes private pricing inputs without recalculating retail', () => {
  const input = [{ id: 'TEST-PRODUCT', title: 'Test product', priceKzt: 'PUBLIC_RETAIL',
    sourcePrice: 'PRIVATE_SENTINEL', sourceCurrency: 'PRIVATE_SENTINEL',
    markupPercent: 'PRIVATE_SENTINEL', supplierCost: 'PRIVATE_SENTINEL',
    unknownFutureInternalField: 'PRIVATE_SENTINEL' }];
  const result = legacyPublicProducts(input);
  assert.deepEqual(result, [{ id: 'TEST-PRODUCT', title: 'Test product', priceKzt: 'PUBLIC_RETAIL' }]);
  assert(!JSON.stringify(result).includes('PRIVATE_SENTINEL'));
  assert.equal(input[0].sourcePrice, 'PRIVATE_SENTINEL', 'internal records remain intact');
});

test('committed legacy public catalogue preserves items and existing retail fields', () => {
  const source = JSON.parse(fs.readFileSync('client/src/data/catalog.generated.json', 'utf8'));
  const publicRows = JSON.parse(fs.readFileSync('client/src/data/catalog.public.json', 'utf8'));
  assert.deepEqual(publicRows, legacyPublicProducts(source));
  assert.deepEqual(publicSupplierFindings(JSON.stringify(publicRows)), []);
  assert.equal(publicRows.length, source.length);
  for (let index = 0; index < source.length; index++) {
    assert.equal(publicRows[index].id, source[index].id);
    assert.equal(publicRows[index].priceKzt, source[index].priceKzt);
  }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  isPrivateSupplierKey,
  publicJsonFiles,
  publicSupplierFindings,
  scanPublicSupplierDirectory,
} from '../scripts/lib/public-supplier-guard.mjs';

const sentinel = 'PRIVATE_SENTINEL';

test('recognizes source, purchase and supplier financial aliases without rejecting retail prices', () => {
  for (const key of [
    'sourcePriceKzt', 'sourcePricesKzt', 'sourcePriceExclTaxEur', 'sourcePriceEur',
    'source_unit_price', 'sourceCost', 'supplierPrice', 'supplier_cost_kzt',
    'vendorPrice', 'purchasePrice', 'purchase_cost', 'procurementPrice',
    'buyingPrice', 'buyPrice', 'wholesale_price', 'costPrice', 'unitCost', 'landedCost',
    'markupPercent', 'controllerMarkup', 'monitorMarkupPercent', 'sourceUrl', 'sourceUpdatedAt',
  ]) assert.equal(isPrivateSupplierKey(key), true, key);
  for (const key of [
    'price', 'priceKzt', 'minPriceKzt', 'maxPriceKzt', 'priceCurrency',
    'catalogPriceNote', 'approvedSale', 'item_id', 'catalog_source', 'cost', 'shippingCost',
    'markup', // Syntax-highlighter property; the catalogue manifest separately forbids this key.
  ]) assert.equal(isPrivateSupplierKey(key), false, key);
});

test('finds quoted JSON, JSON-LD, minified JS and escaped serialized keys without reporting values', () => {
  const snippets = [
    `{"sourcePriceExclTaxEur":"${sentinel}"}`,
    `<script type="application/ld+json">{"offers":{"purchase_price":"${sentinel}"}}</script>`,
    `window.catalog={sourcePricesKzt:"${sentinel}",supplierCost:"${sentinel}"};`,
    `const nested={"entry":{"sourceUrl":"${sentinel}",sourceUpdatedAt:"${sentinel}"}};`,
    `const encoded="{\\"sourcePriceEur\\":\\"${sentinel}\\"}";`,
  ];
  for (const text of snippets) {
    const findings = publicSupplierFindings(text);
    assert(findings.length > 0);
    assert(findings.every(finding => finding.reason === 'private supplier field'));
    assert(!JSON.stringify(findings).includes(sentinel), 'financial values must not reach diagnostics');
  }
});

test('retains supplier identity protection and allows approved retail JSON-LD', () => {
  assert.deepEqual(publicSupplierFindings('HYDRAUVISION'), [{ reason: 'supplier brand' }]);
  assert.deepEqual(publicSupplierFindings('sinocmp'), [{ reason: 'supplier brand' }]);
  assert.deepEqual(publicSupplierFindings(JSON.stringify({
    '@type': 'Offer', price: 'PUBLIC_RETAIL', priceCurrency: 'KZT',
    priceKzt: 'PUBLIC_RETAIL', minPriceKzt: 'PUBLIC_RETAIL', maxPriceKzt: 'PUBLIC_RETAIL',
  })), []);
});

test('recursively checks nested category indexes and JS assets while ignoring binary files', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-public-guard-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, 'catalog-data/category-indexes'), { recursive: true });
  fs.mkdirSync(path.join(directory, 'assets'));
  fs.writeFileSync(path.join(directory, 'catalog-data/manifest.json'), '{}');
  fs.writeFileSync(path.join(directory, 'catalog-data/category-indexes/pumps.json'),
    JSON.stringify([{ offer: { sourcePriceExclTaxEur: sentinel } }]));
  fs.writeFileSync(path.join(directory, 'assets/app.js'), `const a={purchaseCost:"${sentinel}"};`);
  fs.writeFileSync(path.join(directory, 'assets/photo.webp'), Buffer.from('sourcePriceEur:PRIVATE_SENTINEL'));
  assert.deepEqual(publicJsonFiles(path.join(directory, 'catalog-data')), [
    path.join('category-indexes', 'pumps.json'), 'manifest.json',
  ]);
  const result = scanPublicSupplierDirectory(directory);
  assert.equal(result.filesChecked, 3);
  assert.deepEqual(result.failures.map(finding => finding.key).sort(), ['purchaseCost', 'sourcePriceExclTaxEur']);
  assert(result.failures.some(finding => finding.file.includes('category-indexes')));
  assert(!JSON.stringify(result).includes(sentinel));
});

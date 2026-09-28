import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const dataDir = path.resolve('client/public/catalog-data');

test('catalog contains a unique complete product index', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, 'manifest.json'), 'utf8'));
  const index = fs.readdirSync(dataDir)
    .filter((file) => /^search-index-\d+\.json$/.test(file))
    .flatMap((file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8')));
  assert.equal(index.length, manifest.productCount);
  assert.equal(new Set(index.map((product) => product.handle)).size, index.length);
  assert(index.length > 10_000);
  assert.equal(manifest.imageOwnership, 'aca-managed');
  assert.equal('markup' in manifest, false, 'private pricing policy must not be published');
});

test('catalog prices use the Kazakhstan source market currency', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, 'manifest.json'), 'utf8'));
  assert.equal(manifest.currency, 'KZT');
});

test('every published numeric price is valid without exposing source cost', () => {
  const files = fs.readdirSync(dataDir).filter((file) => /^products-\d+\.json$/.test(file));
  assert(files.length > 40);
  let variantCount = 0;
  for (const file of files) {
    const products = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    for (const product of products) {
      for (const variant of product.variants) {
        variantCount += 1;
        if (variant.priceKzt === null) continue;
        assert(Number.isFinite(variant.priceKzt) && variant.priceKzt > 0, `${product.handle}: invalid public price`);
        assert.equal('sourcePriceKzt' in variant, false, `${product.handle}: source cost must remain private`);
      }
    }
  }
  assert(variantCount > 10_000);
});

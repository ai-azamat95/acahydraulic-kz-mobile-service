import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ownerCatalogProducts } from './catalog-owner-products.mjs';

export function verifyOwnerCatalogInputs(catalogDir, { routeDir } = {}) {
  const read = file => JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8'));
  const map = read('product-map.json');
  const index = read('search-index.json');
  const summary = read('category-summary.json');
  for (const owner of ownerCatalogProducts) {
    assert(Number.isInteger(map[owner.handle]), 'Missing owner product map entry: ' + owner.handle);
    const chunk = String(map[owner.handle]).padStart(3, '0');
    const representations = [
      ['products', read('products-' + chunk + '.json'), true],
      ['search chunk', read('search-index-' + chunk + '.json'), false],
      ['full search', index, false],
    ];
    for (const [label, rows, full] of representations) {
      const matches = rows.filter(product => product.handle === owner.handle);
      assert.equal(matches.length, 1, 'Expected exactly one owner product in ' + label + ': ' + owner.handle);
      for (const field of Object.keys(owner).filter(field => full || field !== 'variants')) {
        assert.deepEqual(matches[0][field], owner[field], 'Owner product field differs in ' + label + ': ' + owner.handle + '.' + field);
      }
    }
    if (routeDir) {
      const html = fs.readFileSync(path.join(routeDir, 'catalog', owner.handle, 'index.html'), 'utf8');
      const canonical = 'https://acahydraulic.kz/catalog/' + owner.handle + '/';
      assert(html.includes('rel="canonical" href="' + canonical + '"'), 'Missing owner route canonical: ' + owner.handle);
      assert(fs.readFileSync(path.join(routeDir, 'sitemap-products.xml'), 'utf8').includes(canonical), 'Missing owner sitemap entry: ' + owner.handle);
      for (const category of owner.categories || [owner.category]) assert(html.includes('/catalog/category/' + category + '/'), 'Missing owner route category: ' + owner.handle);
      const schemaMatch = html.match(/data-static-product-schema[^>]*>([\s\S]*?)<\/script>/);
      if (owner.minPriceKzt === null) {
        assert.equal(schemaMatch, null, 'Price-on-request owner route must not publish ineligible Product schema');
        assert.match(html, /Цена по запросу/);
      } else {
        assert(schemaMatch, 'Missing owner product schema: ' + owner.handle);
        const schema = JSON.parse(schemaMatch[1]);
        assert.equal(schema.mpn, owner.mpn, 'Owner route MPN differs');
        if (owner.ownerEvidence) assert.equal(schema.itemCondition, undefined, 'Job evidence must not imply a new supplied item');
      }
      if (owner.ownerEvidence) {
        assert(html.includes(owner.ownerEvidence.photoCaption), 'Owner evidence caption missing');
      }
    }
    for (const category of new Set(owner.categories?.length ? owner.categories : [owner.category])) {
      const expected = index.filter(product => (product.categories || [product.category]).includes(category)).length;
      assert.equal(summary[category]?.count, expected, 'Owner category summary differs: ' + category);
    }
  }
  return { passed: true, ownerProducts: ownerCatalogProducts.length, catalogDir };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalogDir = path.resolve(process.argv[2] || 'client/public/catalog-data');
  console.log(JSON.stringify(verifyOwnerCatalogInputs(catalogDir, { routeDir: process.argv.includes('--routes') ? path.dirname(catalogDir) : undefined })));
}

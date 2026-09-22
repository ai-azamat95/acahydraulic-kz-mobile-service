import assert from 'node:assert/strict';
import { applyOwnerSale } from '../scripts/catalog-owner-sales.mjs';
import test from 'node:test';
import fs from 'node:fs';
import copy from '../shared/catalog-product-copy.json' with { type: 'json' };
import { catalogProductName, catalogProductSeo, catalogProductCategories, catalogProductSelection } from '../shared/catalog-product-seo.mjs';

const dir = 'client/public/catalog-data';
const products = fs.readdirSync(dir).filter(file => /^search-index-\d+\.json$/.test(file))
  .flatMap(file => JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8')));
const codes = text => text.toUpperCase().match(/\b[A-Z0-9]+(?:[-.][A-Z0-9]+)*\b/g)?.filter(word => /\d/.test(word)) || [];

test('reviewed Russian names preserve every source part number and equipment model', () => {
  assert.equal(Object.keys(copy).length, 11);
  for (const [handle, content] of Object.entries(copy)) {
    const imported = products.find(item => item.handle === handle);
    const product = imported && applyOwnerSale(imported);
    assert(product, `${handle} must exist in the current catalog`);
    for (const code of codes(product.title)) assert(codes(content.name).includes(code), `${handle} lost ${code}`);
    for (const code of codes(content.name)) assert(codes(product.title).includes(code), `${handle} invented ${code}`);
    assert(/[а-яё]/i.test(content.name));
    assert(content.title.length <= 65, handle);
    assert(content.description.length >= 110 && content.description.length <= 180, handle);
    assert(!/в наличии|гарантия|оригинал|за \d+ дн/i.test(content.description), 'SEO copy must not invent commercial terms');
    assert.equal(catalogProductName(product), content.name);
    assert.equal(catalogProductName(product, 'en'), product.title);
    assert.equal(catalogProductName(product, 'kz'), product.title);
  }
});

test('unreviewed parts retain their names and use neutral selection instructions', () => {
  const product = { handle: 'unreviewed-valve', title: 'Hydraulic Motor Flow Control Valve', category: 'hydraulic-motors', minPriceKzt: null };
  assert.equal(catalogProductName(product), product.title);
  assert.match(catalogProductSelection(product), /фотографию детали/);
  assert.doesNotMatch(catalogProductSelection(product), /тормозной клапан/);
  assert.match(catalogProductSeo(product).description, /Цена по запросу/);
});

test('product navigation deduplicates only valid catalog categories', () => {
  assert.deepEqual(catalogProductCategories({ category: 'not-a-category' }), []);
  assert.deepEqual(catalogProductCategories({ category: 'engine-fuel', categories: ['fuel-pumps', 'fuel-pumps', 'missing'] }).map(item => item.id), ['fuel-pumps']);
});

test('all catalog items have useful metadata without mutating imported data', () => {
  for (const product of products) {
    const original = JSON.stringify(product);
    const seo = catalogProductSeo(product);
    assert(seo.name && seo.title && seo.description, product.handle);
    assert(seo.title.length <= 110 || Object.hasOwn(copy, product.handle), product.handle);
    assert.equal(JSON.stringify(product), original);
    assert(catalogProductSelection(product));
  }
});

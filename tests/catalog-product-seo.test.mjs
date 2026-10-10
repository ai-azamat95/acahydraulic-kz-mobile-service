import assert from 'node:assert/strict';
import { applyOwnerSale } from '../scripts/catalog-owner-sales.mjs';
import test from 'node:test';
import fs from 'node:fs';
import reviewedCopy from '../shared/catalog-product-copy.json' with { type: 'json' };
import merchantCopy from '../shared/catalog-product-merchant-copy.json' with { type: 'json' };
import pilotCopy from '../shared/catalog-product-pilot-copy.json' with { type: 'json' };
import catalogAliases from '../shared/catalog-canonical-aliases.json' with { type: 'json' };
import ownerProducts from '../shared/catalog-owner-products.json' with { type: 'json' };
import { catalogProductName, catalogProductSeo, catalogProductCategories, catalogProductHasReviewedCopy, catalogProductSelection } from '../shared/catalog-product-seo.mjs';

const previousCopy = { ...reviewedCopy, ...merchantCopy };
const copy = { ...previousCopy, ...pilotCopy };

const dir = 'client/public/catalog-data';
const products = [
  ...fs.readdirSync(dir).filter(file => /^search-index-\d+\.json$/.test(file))
    .flatMap(file => JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'))),
  ...ownerProducts,
];
const codes = text => text.toUpperCase().match(/\b[A-Z0-9]+(?:[-.][A-Z0-9]+)*\b/g)?.filter(word => /\d/.test(word)) || [];

test('reviewed Russian names preserve every source part number and equipment model', () => {
  assert.equal(Object.keys(copy).length, 131);
  for (const [handle, content] of Object.entries(copy)) {
    const imported = products.find(item => item.handle === handle);
    const product = imported && applyOwnerSale(imported);
    assert(product, `${handle} must exist in the current catalog`);
    const productIdentity = [product.title, product.catalogTitle, product.fitment].filter(Boolean).join(' ');
    for (const code of codes(productIdentity)) assert(codes(content.name).includes(code), `${handle} lost ${code}`);
    for (const code of codes(content.name)) assert(codes(productIdentity).includes(code), `${handle} invented ${code}`);
    assert(/[а-яё]/i.test(content.name));
    assert(content.title.length <= 65, handle);
    assert(content.description.length >= 110 && content.description.length <= 180, handle);
    assert(!/в наличии|гарантия|оригинал|за \d+ дн/i.test(content.description), 'SEO copy must not invent commercial terms');
    assert.equal(catalogProductName(product), content.name);
    assert.equal(catalogProductName(product, 'en'), product.title);
    assert.equal(catalogProductName(product, 'kz'), product.title);
    assert.equal(catalogProductHasReviewedCopy(product), true);
    assert.equal(catalogProductHasReviewedCopy(product, 'en'), false);
  }
});

test('Russian catalogue pilot contains 100 canonical, evidence-backed product pages', () => {
  assert.equal(Object.keys(pilotCopy).length, 100);
  assert.deepEqual(
    Object.values(pilotCopy).reduce((counts, content) => {
      counts[content.selectionCategory] = (counts[content.selectionCategory] || 0) + 1;
      return counts;
    }, {}),
    {
      'hydraulic-pumps': 50,
      'fuel-injectors': 20,
      'fuel-pumps': 15,
      'wiring-harnesses': 15,
    },
  );

  const primaryCodesByCategory = new Map();
  for (const [handle, content] of Object.entries(pilotCopy)) {
    assert(!Object.hasOwn(previousCopy, handle), `${handle}: pilot must not replace previously reviewed copy`);
    assert(!Object.hasOwn(catalogAliases, handle), `${handle}: canonical aliases do not belong in the pilot`);
    const product = products.find(item => item.handle === handle);
    assert(product?.imageUrl, `${handle}: product image is required`);
    assert(product?.fitment, `${handle}: explicit fitment is required`);
    assert(product?.sku, `${handle}: public SKU is required`);
    assert.doesNotMatch(content.name, /\b(?:Hydraulic|Fuel|Injection|Pump|Injector|Wiring|Harness|Fits|for)\b/i, `${handle}: public Russian name contains untranslated generic words`);

    const primaryCode = codes(product.title)[0];
    const categoryCodes = primaryCodesByCategory.get(content.selectionCategory) || new Set();
    assert(!categoryCodes.has(primaryCode), `${handle}: duplicate primary code ${primaryCode} in ${content.selectionCategory}`);
    categoryCodes.add(primaryCode);
    primaryCodesByCategory.set(content.selectionCategory, categoryCodes);
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
    assert.doesNotMatch(seo.description, /\.\./, `${product.handle}: SEO description has duplicated punctuation`);
    assert.equal(JSON.stringify(product), original);
    assert(catalogProductSelection(product));
  }
});

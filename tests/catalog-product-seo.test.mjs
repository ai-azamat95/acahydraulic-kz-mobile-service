import assert from 'node:assert/strict';
import { applyOwnerSale } from '../scripts/catalog-owner-sales.mjs';
import test from 'node:test';
import fs from 'node:fs';
import reviewedCopy from '../shared/catalog-product-copy.json' with { type: 'json' };
import merchantCopy from '../shared/catalog-product-merchant-copy.json' with { type: 'json' };
import pilotCopy from '../shared/catalog-product-pilot-copy.json' with { type: 'json' };
import phase2Copy from '../shared/catalog-product-phase2-copy.json' with { type: 'json' };
import catalogAliases from '../shared/catalog-canonical-aliases.json' with { type: 'json' };
import ownerProducts from '../shared/catalog-owner-products.json' with { type: 'json' };
import { catalogOfferHasConfirmedSupply, catalogProductName, catalogProductSeo, catalogProductCategories, catalogProductHasReviewedCopy, catalogProductSelection } from '../shared/catalog-product-seo.mjs';
import { createPhase2Copy, familyExclusionPatterns, makeCopy, partCodes } from '../scripts/create-catalog-product-phase2.mjs';

const previousCopy = { ...reviewedCopy, ...merchantCopy };
const copyBeforePhase2 = { ...previousCopy, ...pilotCopy };
const copy = { ...copyBeforePhase2, ...phase2Copy };
const rejectedPhase2Handles = [
  'hydraulic-pump-regulator-14536038-for-volvo-ec460-ec480-excavator',
  'hydraulic-pump-regulator-k3v112-lq10v01004f1-for-kobelco-excavator-sk200-6e-sk250-6e',
  'k5v140dtp-hydraulic-pump-regulator-lc10v01005f4-for-kobelco-excavator-sk330-8',
  '0445120236-komatsu-injector-bosh-for-pc350-7-6d114',
  '194-4102-1944102-common-rail-fuel-pump-valve-for-cat-caterpillar-c-9-engine',
  '231-1664-wiring-harness',
  '31n8-10051-k3v140dt-hydraulic-pump-parts-for-hyundai-ec290-ec290b',
  'gear-pump-a10vd43-for-cat-e70b-307b-307c-308c-hitachi-ex60-2-ex60-3-excavator',
  '0445120216-common-rail-fuel-injector-for-bosch-cummins-diesel-4jj1-engine',
];

const dir = 'client/public/catalog-data';
const products = [
  ...fs.readdirSync(dir).filter(file => /^search-index-\d+\.json$/.test(file))
    .flatMap(file => JSON.parse(fs.readFileSync(`${dir}/${file}`, 'utf8'))),
  ...ownerProducts,
];
const codes = text => text.toUpperCase().match(/\b[A-Z0-9]+(?:[-./][A-Z0-9]+)*\b/g)?.filter(word => /\d/.test(word) && !/^(?:\d+V|\d+PCS?|\d+T)$/i.test(word)) || [];
const normalizedIdentity = text => text.toUpperCase().replace(/[^A-Z0-9]/g, '');

test('reviewed Russian names preserve every source part number and equipment model', () => {
  assert.equal(Object.keys(copy).length, 431);
  for (const [handle, content] of Object.entries(copy)) {
    const imported = products.find(item => item.handle === handle);
    const product = imported && applyOwnerSale(imported);
    assert(product, `${handle} must exist in the current catalog`);
    const productIdentity = [product.title, product.catalogTitle, product.fitment].filter(Boolean).join(' ');
    for (const code of codes(productIdentity)) assert(normalizedIdentity(content.name).includes(normalizedIdentity(code)), `${handle} lost ${code}`);
    for (const code of codes(content.name)) assert(normalizedIdentity(productIdentity).includes(normalizedIdentity(code)), `${handle} invented ${code}`);
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

test('phase-two Russian catalogue cohort is deterministic and evidence-backed', () => {
  assert.equal(Object.keys(phase2Copy).length, 300);
  for (const handle of rejectedPhase2Handles) assert(!Object.hasOwn(phase2Copy, handle), `${handle}: component must not be published as a complete assembly`);
  assert.deepEqual(
    Object.values(phase2Copy).reduce((counts, content) => {
      counts[content.selectionCategory] = (counts[content.selectionCategory] || 0) + 1;
      return counts;
    }, {}),
    {
      'hydraulic-pumps': 82,
      'gear-pumps': 35,
      'piston-pumps': 20,
      'fuel-injectors': 60,
      'fuel-pumps': 40,
      'wiring-harnesses': 25,
      'hydraulic-motors': 15,
      'control-valves': 8,
      'final-drives': 10,
      controllers: 5,
    },
  );

  const normalizedPartCodes = new Set();
  for (const [handle, content] of Object.entries(phase2Copy)) {
    assert(!Object.hasOwn(copyBeforePhase2, handle), `${handle}: phase two must not replace reviewed copy`);
    assert(!Object.hasOwn(catalogAliases, handle), `${handle}: canonical aliases do not belong in phase two`);
    const product = products.find(item => item.handle === handle);
    assert(product?.imageUrl, `${handle}: product image is required`);
    assert(product?.fitment, `${handle}: explicit fitment is required`);
    assert(product?.sku, `${handle}: public SKU is required`);
    assert.equal(content.sourceTitle, product.title, `${handle}: source title changed after review`);
    assert((product.categories?.length ? product.categories : [product.category]).includes(content.selectionCategory), `${handle}: category mismatch`);
    assert.doesNotMatch(product.title, familyExclusionPatterns[content.selectionCategory], `${handle}: component must not be presented as a complete assembly`);
    assert(content.title.length <= 49, `${handle}: leave room for the site name in the HTML title`);
    assert.doesNotMatch(content.name, /\b(?:Hydraulic|Fuel|Injection|Pump|Injector|Wiring|Harness|Fits|for|Excavator|Engine|Machine|Truck|Loader|Controller|Motor|Valve|Parts?|Series|Diesel|Bus|Genuine|Assy|Assembly|Mini|Industrial|Forklift|Wheel|Dozer|Crawler|Skid|Steer)\b/i, `${handle}: untranslated generic word`);
    assert.doesNotMatch(content.name, /\bдля\s*$/i, `${handle}: fitment must not be empty`);
    const sourceIdentifiers = [...partCodes(product), ...codes(product.fitment || '')];
    for (const code of sourceIdentifiers) assert(codes(content.name).includes(code), `${handle}: exact source code or model ${code} was not preserved`);
    const productPartCodes = [...new Map(partCodes(product)
      .map(code => ({ raw: code, normalized: normalizedIdentity(code) }))
      .map(code => [code.normalized, code])).values()];
    for (const { raw, normalized } of productPartCodes) {
      assert(!normalizedPartCodes.has(normalized), `${handle}: duplicate cross-reference code ${raw}`);
      normalizedPartCodes.add(normalized);
    }
  }

  assert.deepEqual(phase2Copy, createPhase2Copy());
  const preview = (handle, family) => makeCopy(products.find(product => product.handle === handle), family);
  assert.match(preview('1pc-fuel-injector-300-2952-239-0734-for-cat-skid-steers-236b-246b-246c-248b-252b-262b-262c-267b-268b-272c-277b-277c-287b-287c', 'fuel-injectors').name, /^Комплект из 4 топливных форсунок/);
  assert.match(preview('1pc-injector-314-9985-for-caterpillar-c3-4-3044c-loader-908h', 'fuel-injectors').name, /^Комплект из 4 топливных форсунок/);
  assert.doesNotMatch(preview('0005714-pump-wire', 'wiring-harnesses').name, /\b4JJ1\b/);
  assert.doesNotMatch(preview('0281020079-32g87-31030-bosch-controller', 'controllers').name, /\bD04FR\b/);
  assert.doesNotMatch(preview('106-0138-cpu-controller', 'controllers').name, /\b322\b/);
  assert.doesNotMatch(phase2Copy['gear-pump-13t-2902440-1852d-for-hitachi-zx85-zax80-ex100-2-ex120-2-excavator'].name, /\b13T\b/);
  assert.match(phase2Copy['9233096-pusher-head-control-valve-block-for-hitachi-zax200-zax450-zax600-zax160lc'].name, /^Блок клапанов управления/);
});

test('only a current ACA merchant offer is exposed as confirmed supply', () => {
  assert.equal(catalogOfferHasConfirmedSupply({ availability: 'in_stock' }), true);
  assert.equal(catalogOfferHasConfirmedSupply({ availability: 'preorder' }), false);
  assert.equal(catalogOfferHasConfirmedSupply(undefined), false);
  assert.equal(catalogOfferHasConfirmedSupply({ available: true }), false, 'supplier availability is not ACA stock evidence');
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

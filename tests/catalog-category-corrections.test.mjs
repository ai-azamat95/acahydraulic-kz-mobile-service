import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import phase2Copy from '../shared/catalog-product-phase2-copy.json' with { type: 'json' };
import phase3Copy from '../shared/catalog-product-phase3-copy.json' with { type: 'json' };
import {
  catalogCategoryCorrections as corrections, deferredCatalogCategoryCorrections as deferred,
  correctCatalogProductCategories, reviewedCategorySourceProducts, reviewedPumpSourceProducts,
} from '../shared/catalog-category-corrections.mjs';
import { applyCatalogCategoryCorrections } from '../scripts/catalog-category-corrections.mjs';
import { createPhase2Copy } from '../scripts/create-catalog-product-phase2.mjs';
import { createPhase3Copy } from '../scripts/create-catalog-product-phase3.mjs';
import { createCategorySearchIndexes } from '../scripts/lib/catalog-category-indexes.mjs';
import { catalogProductName } from '../shared/catalog-product-seo.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const dir = 'client/public/catalog-data';
const manifest = read(`${dir}/manifest.json`);
const products = Array.from({ length: manifest.chunkCount }, (_, i) => read(`${dir}/products-${String(i + 1).padStart(3, '0')}.json`)).flat();
const byId = new Map(products.map(product => [String(product.id), product]));
const pumpCategories = ['hydraulic-pumps', 'gear-pumps', 'piston-pumps'];
const withoutCategories = ({ category, categories, ...rest }) => rest;

test('review is limited to 41 evidence-backed typed corrections', () => {
  assert.equal(Object.keys(corrections).length, 41);
  assert.equal(Object.keys(deferred).length, 0);
  const categories = new Set(read('shared/catalog-landings.json').categories.map(item => item.id));
  for (const [id, correction] of Object.entries(corrections)) {
    assert(byId.has(id), id);
    assert.equal(byId.get(id).title, correction.evidenceTitle, id);
    assert(categories.has(correction.category));
    assert(correction.categories.includes(correction.category));
    assert.equal(new Set(correction.categories).size, correction.categories.length);
    assert(correction.categories.every(category => categories.has(category)));
    const titlePatterns = {
      'hydraulic-motors': /motor/i, 'pump-parts': /housing|kit|regulator|pump parts?/i,
      'control-valves': /valve/i, 'main-control-valves': /control valve assy/i,
      'fuel-pumps': /fuel injection pump/i, 'piston-pumps': /hydraulic piston pump/i,
      'other-parts': /gear\s?box/i,
    };
    assert.match(correction.evidenceTitle, titlePatterns[correction.category]);
  }
  for (const id of Object.keys(deferred)) {
    assert.match(byId.get(id).title, /gear\s?box/i);
    assert.equal(correctCatalogProductCategories(byId.get(id)), byId.get(id));
  }
  const unknown = { id: 'not-reviewed', title: 'Hydraulic Motor Flow Control Valve', category: 'hydraulic-motors' };
  assert.equal(correctCatalogProductCategories(unknown), unknown);
});

test('correction preserves identity, price, image, variants and every non-taxonomy field', () => {
  for (const [id, correction] of Object.entries(corrections)) {
    const original = { ...byId.get(id), category: correction.previousCategory, categories: [correction.previousCategory] };
    const corrected = correctCatalogProductCategories(original);
    assert.equal(original.category, correction.previousCategory);
    assert.deepEqual(withoutCategories(corrected), withoutCategories(original), id);
    assert.match(catalogProductName(corrected), /[а-яё]/i, `${id}: corrected category needs a Russian catalogue name`);
    assert.equal(correctCatalogProductCategories(corrected), corrected, id);
  }
});

test('the actual fresh-import normalizer applies the same ID corrections without changing gallery or pricing logic', () => {
  const importer = fs.readFileSync('scripts/import-sinocmp-catalog.mjs', 'utf8');
  const code = importer.slice(importer.indexOf('function normalizeProduct('), importer.indexOf('\nfunction writeJson('));
  for (const [id, correction] of Object.entries(corrections)) {
    const original = byId.get(id);
    const input = { ...original, variants: [{ id: 'v', sku: original.sku, title: 'Default Title', price: 100, available: true }] };
    const context = {
      input, detectCategory: () => correction.previousCategory, publicText: value => String(value || ''),
      productMarkup: () => 1.5, publicSku: value => value, markedUpPrice: value => Number(value) * 1.5,
      publicHandle: value => value, extractFitment: () => original.fitment,
      publicProductGallery: (_, categories) => categories.includes('pump-parts') ? ['/catalog-assets/category-pump-parts.jpg'] : original.gallery,
      correctCatalogProductCategories: value => value,
    };
    const execute = () => JSON.parse(vm.runInNewContext(`${code}\nJSON.stringify(normalizeProduct(input, 1, new Map(), new Map(), new Set(), new Set()))`, context));
    const baseline = execute();
    context.correctCatalogProductCategories = correctCatalogProductCategories;
    const actual = execute();
    assert.equal(actual.category, correction.category, id);
    assert.deepEqual(actual.categories, correction.categories, id);
    assert.deepEqual(withoutCategories(actual), withoutCategories(baseline), id);
    assert.deepEqual(actual.gallery, original.gallery, id);
  }
});

test('supplier audit memberships exclude reviewed valves and include reviewed motors/fuel pumps from other collections', () => {
  const rows = Object.keys(corrections).map(id => byId.get(id));
  const source = [{ products: rows }];
  const valves = rows.filter(product => corrections[product.id].previousCategory === 'hydraulic-motors');
  const motors = reviewedCategorySourceProducts('hydraulic-motors', valves, source);
  assert.deepEqual(motors.map(product => product.id).sort(), rows.filter(product => corrections[product.id].category === 'hydraulic-motors').map(product => product.id).sort());
  assert.deepEqual(reviewedCategorySourceProducts('fuel-pumps', [], source).map(product => product.id), ['8539233157282']);
  const importer = fs.readFileSync('scripts/import-sinocmp-catalog.mjs', 'utf8');
  const code = importer.slice(importer.indexOf('function strictCategorySourceProducts('), importer.indexOf('\nasync function fetchJson('));
  const actual = vm.runInNewContext(`${code}\nstrictCategorySourceProducts('hydraulic-motors', 'hydraulic-motor', collections)`, {
    collections: [{ handle: 'hydraulic-motor', products: valves }, { handle: 'other', products: rows }], reviewedCategorySourceProducts,
  });
  assert.deepEqual(actual.map(product => product.id).sort(), motors.map(product => product.id).sort());
});

test('pump source auditing counts corrected pump types while retaining raw supplier collection counts', () => {
  const rows = [...Object.entries(corrections).map(([id, item]) => ({ ...byId.get(id), category: item.previousCategory })),
    ...Object.keys(deferred).map(id => byId.get(id)), { id: 'ordinary', category: 'hydraulic-pumps' }];
  const handles = { 'hydraulic-pumps': 'hydraulic-pump-assembly', 'gear-pumps': 'gear-pump', 'piston-pumps': 'piston-pump' };
  const collections = Object.entries(handles).map(([category, handle]) => [handle, rows.filter(product => product.category === category)]);
  const result = reviewedPumpSourceProducts(collections, product => product.category);
  assert.deepEqual(result.collections, { 'hydraulic-pump-assembly': 1, 'gear-pump': 0, 'piston-pump': 1 });
  assert.deepEqual(result.sourceCollections, { 'hydraulic-pump-assembly': 20, 'gear-pump': 6, 'piston-pump': 5 });
  assert.deepEqual(result.products.map(product => product.id).sort(), ['ordinary', '8831560679586'].sort());
});

test('snapshot preparation repairs product/index records, summary images and cache version exactly once', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-category-corrections-'));
  const valve = { id: '8852455424162', handle: 'valve', title: 'Flow Control Valve', category: 'hydraulic-motors', categories: ['hydraulic-motors'], minPriceKzt: 107250, imageUrl: '/valve.jpg' };
  const ordinary = { id: 'ordinary', handle: 'motor', category: 'hydraulic-motors', categories: ['hydraulic-motors'], minPriceKzt: null, imageUrl: '/motor.jpg' };
  const write = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value));
  write('manifest.json', { importedAt: 'fixed', productCount: 2, chunkCount: 1, indexFile: 'search-index.json', categorySummaryFile: 'category-summary.json' });
  for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) write(file, [valve, ordinary]);
  write('category-summary.json', { 'hydraulic-motors': { count: 2, imageUrl: '/valve.jpg' }, 'control-valves': { count: 0, imageUrl: null } });
  assert.equal(applyCatalogCategoryCorrections(root).changed, 1);
  const corrected = read(path.join(root, 'products-001.json'));
  assert.deepEqual(withoutCategories(corrected[0]), withoutCategories(valve));
  assert.deepEqual(corrected[1], ordinary);
  assert.deepEqual(read(path.join(root, 'search-index.json')), corrected);
  assert.deepEqual(read(path.join(root, 'search-index-001.json')), corrected);
  assert.deepEqual(read(path.join(root, 'category-summary.json')), { 'hydraulic-motors': { count: 1, imageUrl: '/motor.jpg' }, 'control-valves': { count: 1, imageUrl: '/valve.jpg' } });
  const nextManifest = read(path.join(root, 'manifest.json'));
  assert.equal(nextManifest.importedAt, 'fixed');
  assert.equal(nextManifest.productCount, 2);
  assert.match(nextManifest.dataVersion, /^catalog-[0-9a-f]{16}$/);
  const before = fs.readdirSync(root).map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]);
  assert.equal(applyCatalogCategoryCorrections(root).changed, 0);
  assert.deepEqual(fs.readdirSync(root).map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]), before);
  createCategorySearchIndexes({ catalogDir: root });
  assert.deepEqual(read(path.join(root, 'category-indexes/control-valves.json')).map(product => product.id), [valve.id]);
  assert.deepEqual(read(path.join(root, 'category-indexes/hydraulic-motors.json')).map(product => product.id), ['ordinary']);
});

test('committed records, search indexes, category memberships and affected counters agree for reviewed IDs', () => {
  const fullIndex = new Map(read(`${dir}/${manifest.indexFile}`).map(product => [product.id, product]));
  const categoryIds = new Set([...Object.values(corrections).flatMap(item => [item.previousCategory, ...item.categories])]);
  const summary = read(`${dir}/category-summary.json`);
  const categories = new Map([...categoryIds].map(id => [id, read(`${dir}/${manifest.categoryIndexFiles[id]}`)]));
  assert.equal(products.length, manifest.productCount);
  for (const [id, correction] of Object.entries(corrections)) {
    const product = byId.get(id), index = fullIndex.get(id);
    const chunk = read(`${dir}/search-index-${String(product.chunk).padStart(3, '0')}.json`).find(item => item.id === id);
    for (const row of [product, index, chunk]) {
      assert.equal(row.category, correction.category, id);
      assert.deepEqual(row.categories, correction.categories, id);
      for (const key of ['title', 'handle', 'minPriceKzt', 'maxPriceKzt']) assert.deepEqual(row[key], product[key], `${id}:${key}`);
    }
    for (const [category, rows] of categories) assert.equal(rows.some(row => row.id === id), correction.categories.includes(category), `${id}:${category}`);
    if (!pumpCategories.includes(correction.category)) assert(!product.categories.some(category => pumpCategories.includes(category)), id);
    if (correction.category !== 'hydraulic-motors') assert(!product.categories.includes('hydraulic-motors'), id);
  }
  for (const [category, rows] of categories) {
    const expected = products.filter(product => (product.categories || [product.category]).includes(category));
    assert.equal(summary[category].count, expected.length, category);
    assert.deepEqual(rows.map(product => product.id).sort(), expected.map(product => product.id).sort(), category);
    assert(!summary[category].imageUrl || expected.some(product => product.imageUrl === summary[category].imageUrl), category);
  }
});

test('taxonomy corrections do not replace the fixed reviewed SEO cohorts', () => {
  const regeneratedPhase2 = createPhase2Copy();
  const regeneratedPhase3 = createPhase3Copy();
  assert.deepEqual(regeneratedPhase2, phase2Copy);
  assert.deepEqual(regeneratedPhase3, phase3Copy);
  for (const id of Object.keys(corrections)) {
    const handle = byId.get(id).handle;
    assert.equal(Object.hasOwn(regeneratedPhase2, handle), false, `phase2:${id}`);
    assert.equal(Object.hasOwn(regeneratedPhase3, handle), false, `phase3:${id}`);
  }
});

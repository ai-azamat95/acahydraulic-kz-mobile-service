import assert from 'node:assert/strict';
import { applyOwnerSale } from '../scripts/catalog-owner-sales.mjs';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import reviewedCopy from '../shared/catalog-product-copy.json' with { type: 'json' };
import merchantCopy from '../shared/catalog-product-merchant-copy.json' with { type: 'json' };
import pilotCopy from '../shared/catalog-product-pilot-copy.json' with { type: 'json' };
import phase2Copy from '../shared/catalog-product-phase2-copy.json' with { type: 'json' };
import phase3Copy from '../shared/catalog-product-phase3-copy.json' with { type: 'json' };
import priorityCopy from '../shared/catalog-product-priority-copy.json' with { type: 'json' };
import catalogAliases from '../shared/catalog-canonical-aliases.json' with { type: 'json' };
import ownerProducts from '../shared/catalog-owner-products.json' with { type: 'json' };
import { catalogOfferHasConfirmedSupply, catalogProductName, catalogProductSeo, catalogProductCategories, catalogProductHasReviewedCopy, catalogProductImageIsPlaceholder, catalogProductSelection } from '../shared/catalog-product-seo.mjs';
import { createPhase2Copy, cleanFitment, detectedBrand, familyExclusionPatterns, identityCodesForFamily, makeCopy, normalizedPartCodesForFamily, partCodes, validCandidate } from '../scripts/create-catalog-product-phase2.mjs';
import { createPhase3Copy, hasHonestPhase3PrimaryImage, phase3AllowedHandles, phase3ModifiedDate, phase3Quotas, rejectedPhase3Handles } from '../scripts/create-catalog-product-phase3.mjs';

const previousCopy = { ...reviewedCopy, ...merchantCopy };
const copyBeforePhase2 = { ...previousCopy, ...pilotCopy };
const copy = { ...copyBeforePhase2, ...phase2Copy };
const copyBeforePhase3 = { ...copy, ...merchantCopy };
const copyWithPhase3 = { ...copyBeforePhase3, ...phase3Copy };
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
const fullSearchIndex = JSON.parse(fs.readFileSync(`${dir}/search-index.json`, 'utf8'));
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

test('phase-three Russian catalogue cohort is deterministic, distinct and evidence-backed', () => {
  assert.equal(Object.keys(phase3Copy).length, 500);
  assert.equal(Object.keys(copyWithPhase3).length, 931);
  assert.deepEqual(
    Object.values(phase3Copy).reduce((counts, content) => {
      counts[content.reviewFamily] = (counts[content.reviewFamily] || 0) + 1;
      return counts;
    }, {}),
    phase3Quotas,
  );
  assert.deepEqual(phase3Copy, createPhase3Copy());

  for (const [family, allowedHandles] of Object.entries(phase3AllowedHandles)) {
    const actual = Object.entries(phase3Copy)
      .filter(([, content]) => content.reviewFamily === family)
      .map(([handle]) => handle)
      .sort();
    assert.deepEqual(actual, [...allowedHandles].sort(), `${family}: explicit review allowlist changed`);
  }

  for (const handle of rejectedPhase3Handles) assert(!Object.hasOwn(phase3Copy, handle), `${handle}: rejected source must remain excluded`);
  assert(!Object.hasOwn(phase3Copy, '9233692-hydraulic-motor-excavator-final-drive-for-zax200-3-zax210-5g'));

  const fields = ['name', 'title', 'description'];
  for (const field of fields) {
    const values = Object.values(phase3Copy).map(content => content[field].toLocaleLowerCase('ru').replace(/\s+/g, ' ').trim());
    assert.equal(new Set(values).size, values.length, `phase-three ${field} values must be unique`);
  }

  const productByHandle = new Map(products.map(product => [product.handle, product]));
  const codeOwners = new Map();
  for (const handle of Object.keys(copyBeforePhase3)) {
    const product = productByHandle.get(handle);
    if (!product) continue;
    for (const code of normalizedPartCodesForFamily(product, '', { splitCrossReferences: true })) codeOwners.set(code, handle);
  }

  let categoryPlaceholders = 0;
  for (const [handle, content] of Object.entries(phase3Copy)) {
    assert(!Object.hasOwn(copyBeforePhase3, handle), `${handle}: phase three must not replace reviewed copy`);
    assert(!Object.hasOwn(catalogAliases, handle), `${handle}: canonical aliases do not belong in phase three`);
    const product = productByHandle.get(handle);
    assert(product?.imageUrl, `${handle}: product image is required`);
    assert(product?.fitment, `${handle}: explicit fitment is required`);
    assert(product?.sku, `${handle}: public SKU is required`);
    assert.equal(content.sourceTitle, product.title, `${handle}: source title changed after review`);
    assert.equal(content.modifiedDate, phase3ModifiedDate, `${handle}: wrong review date`);
    assert(validCandidate(product, content.reviewFamily, copyBeforePhase3), `${handle}: source no longer passes family evidence gates`);
    assert((product.categories?.length ? product.categories : [product.category]).includes(content.selectionCategory), `${handle}: selection category mismatch`);
    assert.doesNotMatch(product.title, familyExclusionPatterns[content.reviewFamily], `${handle}: component must not be presented as an assembly`);
    assert(content.title.length <= 49, `${handle}: title must leave room for the site name`);
    assert(content.description.length >= 110 && content.description.length <= 180, `${handle}: description length`);
    assert.match(content.description, /(?:Сверим|Проверим)/, `${handle}: verification step missing`);
    assert.match(content.description, /до оплаты/i, `${handle}: prepayment verification boundary missing`);
    assert(content.description.includes(content.primaryCode), `${handle}: primary code missing from description`);
    assert(content.name.includes(content.primaryCode), `${handle}: primary code missing from name`);
    assert.doesNotMatch(`${handle} ${content.sourceTitle} ${content.name} ${content.description}`, /\b(?:programmed|genuine|second[ -]?hand|brand new|free shipping|used|reconditioned|remanufactured|refurbished)\b/i, `${handle}: risky supplier claim leaked`);
    assert.doesNotMatch(content.description, /в наличии|оригинал|гарантия\s+\d|за\s+\d+\s*дн/i, `${handle}: commercial terms must not be invented`);

    const sourceCodes = identityCodesForFamily(product, content.reviewFamily);
    const normalizedIdentity = `${product.title} ${product.catalogTitle || ''} ${product.fitment}`.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const normalizedName = content.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    for (const code of sourceCodes) assert(normalizedName.includes(code.toUpperCase().replace(/[^A-Z0-9]/g, '')), `${handle}: source identifier ${code} missing`);
    for (const code of codes(content.name)) assert(normalizedIdentity.includes(code.toUpperCase().replace(/[^A-Z0-9]/g, '')), `${handle}: invented identifier ${code}`);
    const evidenceToken = codes(cleanFitment(product.fitment))[0] || detectedBrand(product);
    assert(evidenceToken && content.description.toLocaleLowerCase('ru').includes(evidenceToken.toLocaleLowerCase('ru')), `${handle}: fitment evidence missing from description`);

    for (const code of normalizedPartCodesForFamily(product, content.reviewFamily, { splitCrossReferences: true })) {
      assert(!codeOwners.has(code), `${handle}: duplicate cross-reference code ${code} from ${codeOwners.get(code)}`);
      codeOwners.set(code, handle);
    }

    assert(hasHonestPhase3PrimaryImage(product), `${handle}: repeated or unmanaged primary image`);
    if (catalogProductImageIsPlaceholder(product)) categoryPlaceholders += 1;
  }
  assert.equal(categoryPlaceholders, 20, 'only the reviewed rebuild-kit and cylinder-head category illustrations are allowed');

  const preview = (handle, family) => makeCopy(productByHandle.get(handle), family);
  assert.equal(preview('nt855-engine-assembly-inline-6-4-stroke-cycle-diesel', 'engine-assemblies').primaryCode, 'NT855');
  assert.doesNotMatch(preview('nt855-engine-assembly-inline-6-4-stroke-cycle-diesel', 'engine-assemblies').name, /(?:^|\s)(?:6|4-STROKE-CYCLE)(?:\s|$)/i);
  assert.equal(preview('qsb4-5-inline-4-cylinder-4-5-liter-engine-assembly', 'engine-assemblies').primaryCode, 'QSB4.5');
  assert.doesNotMatch(preview('qsb4-5-inline-4-cylinder-4-5-liter-engine-assembly', 'engine-assemblies').name, /(?:4-CYLINDER|\s4\.5\s)/i);
  assert.equal(preview('d902-complete-cylinder-head-for-kubota-kx41-3-bx23s-bx24-bx1880-bx2360-bx2370d-bx2380-zd323-zd1021-tractor-mower', 'cylinder-heads').primaryCode, 'D902');
  assert.equal(preview('3t72-rebuild-kit', 'engine-rebuild-kits').primaryCode, '3T72');
  assert.equal(preview('4-cylinder-overhaul-rebuild-kit-for-kubota-v1505-v1505t-v1505d-engine', 'engine-rebuild-kits').primaryCode, 'V1505');
});

test('only a current ACA merchant offer is exposed as confirmed supply', () => {
  assert.equal(catalogOfferHasConfirmedSupply({ availability: 'in_stock' }), true);
  assert.equal(catalogOfferHasConfirmedSupply({ availability: 'preorder' }), false);
  assert.equal(catalogOfferHasConfirmedSupply(undefined), false);
  assert.equal(catalogOfferHasConfirmedSupply({ available: true }), false, 'supplier availability is not ACA stock evidence');
});

test('the first pump and injector result pages have reviewed Russian product names', () => {
  assert.equal(Object.keys(priorityCopy).length, 7);
  for (const [handle, content] of Object.entries(priorityCopy)) {
    const product = products.find(item => item.handle === handle);
    assert(product, `${handle}: priority product must exist`);
    assert(/[а-яё]/i.test(content.name), `${handle}: Russian name is required`);
    assert.doesNotMatch(content.name, /\b(?:Hydraulic|Fuel|Pump|Injector|for|Engine|Truck|Excavator)\b/i, `${handle}: untranslated generic word`);
    assert(content.title.length <= 65, `${handle}: title is too long`);
    assert(content.description.length >= 110 && content.description.length <= 180, `${handle}: description length`);
    assert.doesNotMatch(content.description, /в наличии|оригинал|гарантия\s+\d|за\s+\d+\s*дн/i, `${handle}: invented commercial promise`);
    assert.equal(catalogProductName(product), content.name);
  }

  for (const categoryId of ['hydraulic-pumps', 'fuel-injectors']) {
    const firstPage = fullSearchIndex.filter(product => (product.categories?.length ? product.categories : [product.category]).includes(categoryId)).slice(0, 10);
    assert(firstPage.every(product => /[а-яё]/i.test(catalogProductName(product))), `${categoryId}: first page still contains an untranslated title`);
  }
});

test('the competing 2181-1950D5 listing consolidates into the reviewed canonical pump page', () => {
  const canonical = '2181-1950d5-excavator-hydraulic-pump-for-k3v112dtp-for-r225-9t-dx225-r265-275-9-jcb220';
  const duplicate = '2181-1950d5-excavator-hydraulic-pump-k3v112dtp-for-r225-9t-dx225';
  const product = products.find(item => item.handle === canonical);

  assert.equal(catalogAliases[duplicate], canonical);
  assert(product, 'canonical 2181-1950D5 product must exist');
  assert.match(catalogProductName(product), /^Гидронасос 2181-1950D5 \/ K3V112DTP/);
  assert.equal(catalogProductHasReviewedCopy(product), true);
});

test('category artwork is distinguishable from product-specific photography', () => {
  assert.equal(catalogProductImageIsPlaceholder({ imageUrl: '/catalog-assets/category-engine-rebuild-kit.jpg' }), true);
  assert.equal(catalogProductImageIsPlaceholder({ imageUrl: '/catalog-assets/priority-products/catalog/v2/1/01.webp' }), false);
  assert.equal(catalogProductImageIsPlaceholder({ imageUrl: 'https://ai-azamat95.github.io/acahydraulic-catalog-images/catalog/v2/1/01.webp' }), false);
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
  const product = { handle: 'unreviewed-valve', title: 'Hydraulic Motor Flow Control Valve', category: 'control-valves', minPriceKzt: null };
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

test('static product pages place optional price notes below the price as escaped text', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-catalog-price-note-'));
  try {
    const publicDir = path.join(root, 'dist/public');
    const catalogDir = path.join(publicDir, 'catalog-data');
    fs.mkdirSync(catalogDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, 'index.html'), '<!doctype html><html><head><title>ACA</title></head><body><div id="root"></div></body></html>');
    fs.writeFileSync(path.join(catalogDir, 'manifest.json'), JSON.stringify({ chunkCount: 1, importedAt: '2026-10-17T00:00:00Z' }));
    const note = 'Расчётная цена <уточнить> & "согласовать" \'до оплаты\'.';
    const escapedNote = 'Расчётная цена &lt;уточнить&gt; &amp; &quot;согласовать&quot; &#39;до оплаты&#39;.';
    const fixture = { title: 'Гидронасос TEST-123', sku: 'TEST-123', category: 'hydraulic-pumps', categories: ['hydraulic-pumps'], fitment: null, minPriceKzt: 125000, maxPriceKzt: 125000, imageUrl: null, tags: [] };
    const cases = [
      { ...fixture, id: 'priced-note', handle: 'priced-note', catalogPriceNote: note },
      { ...fixture, id: 'unpriced-note', handle: 'unpriced-note', minPriceKzt: null, maxPriceKzt: null, catalogPriceNote: note },
      { ...fixture, id: 'no-note', handle: 'no-note' },
      { ...fixture, id: 'empty-note', handle: 'empty-note', catalogPriceNote: '' },
    ];
    fs.writeFileSync(path.join(catalogDir, 'search-index-001.json'), JSON.stringify(cases));
    execFileSync(process.execPath, [path.resolve('scripts/create-catalog-route-copies.mjs')], { cwd: root, stdio: 'pipe' });

    for (const product of cases) {
      const html = fs.readFileSync(path.join(publicDir, 'catalog', product.handle, 'index.html'), 'utf8');
      if (product.catalogPriceNote) {
        assert.match(html, /<p><strong>Цена [^<]+<\/strong><\/p>\s*<p data-catalog-price-note>/, product.handle);
        assert.ok(html.includes(`<p data-catalog-price-note>${escapedNote}</p>`), product.handle);
        assert.equal(html.split('data-catalog-price-note').length - 1, 1, product.handle);
        assert.ok(!html.includes(note), 'the note must not become executable HTML');
      } else {
        assert.doesNotMatch(html, /data-catalog-price-note/, product.handle);
      }
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const catalogDir = 'client/public/catalog-data';
const manifest = JSON.parse(fs.readFileSync(`${catalogDir}/manifest.json`, 'utf8'));
const products = [];
for (let page = 1; page <= manifest.chunkCount; page += 1) {
  products.push(...JSON.parse(fs.readFileSync(`${catalogDir}/products-${String(page).padStart(3, '0')}.json`, 'utf8')));
}

const productCopy = JSON.parse(fs.readFileSync('shared/catalog-product-copy.json', 'utf8'));
const landings = JSON.parse(fs.readFileSync('shared/catalog-landings.json', 'utf8'));
const seoContent = JSON.parse(fs.readFileSync('shared/catalog-seo-content.json', 'utf8'));
const categorySummary = JSON.parse(fs.readFileSync(`${catalogDir}/category-summary.json`, 'utf8'));

const expectedProducts = [
  ['8706122940578', 'fuel-common-rail-pipe-438-3416-4383416-for-caterpillar-cat-engine-c6-4-c6-6-excavator-320d-323d', '438-3416'],
  ['7101156982946', '6754-71-1210-komatsu-pc200-8-common-rail-assy', '6754-71-1210'],
  ['9233402888354', 'fuel-common-rail-095600-6860-23810-0e020-23810-11040-for-toyota-hilux-1gd-2gd-engine', '095600-6860'],
  ['9232018833570', 'common-rail-assembly-23810-0e010-238100e010-for-toyota-fortuner-hilux-innova-1gdftv-2gdftv-engine', '23810-0E010'],
  ['9230515994786', 'fuel-common-rail-438-3414-4383414-for-caterpillar-c4-4-engine', '438-3414'],
  ['9222001098914', 'fuel-common-rail-095440-1720-8-98152950-2-for-isuzu-6hk1-engine', '095440-1720'],
  ['9221970591906', 'fuel-common-rail-095440-0350-8-97306063-0-for-isuzu-4hk1-engine-hitachi-zx200-3-zx210-3-zx240-3-excavator', '095440-0350'],
  ['9221970526370', 'fuel-common-rail-375-2649-0445226128-0445226129-for-cat-c7-1-engine-323-320-323-excavator-924k-loader', '375-2649'],
  ['8679835009186', 'fuel-common-rail-assembly-8-98152950-2-for-isuzu-6hk1-engine-hitachi', '8-98152950-2'],
  ['8475808891042', 'fuel-common-rail-pipe-0445224040-for-kobelco-excavator-sk130-8-sk140-8', '0445224040'],
  ['8475814920354', 'fuel-common-rail-pipe-0445226047-20980481-for-volvo-trucks', '0445226047'],
  ['8475811872930', 'fuel-common-rail-pipe-0445226188-for-deutz-d6e-engine', '0445226188'],
  ['8475806957730', 'fuel-common-rail-pipe-3963815-for-cummins-diesel-engine-isl-isc-8-3', '3963815'],
  ['7601097801890', '358-6634-3586634-common-fuel-rail-for-caterpillar-320d-320d-gc-excavator', '358-6634'],
  ['7102574067874', '20798896-volvo', '20798896'],
];
const injector = ['8837524848802', 'common-rail-fuel-injector-8973060634-for-hitachi-zx200-3-engine-4hk1', '8973060634'];

test('publishes the curated Common Rail category with supplier photos and Russian copy', () => {
  const indexedById = new Map(products.map((product) => [String(product.id), product]));
  for (const [id, handle, oem] of expectedProducts) {
    const product = indexedById.get(id);
    assert(product, `${id} must remain in the public catalogue`);
    assert.equal(product.handle, handle);
    assert(product.categories.includes('fuel-common-rails'), `${handle} must be listed as a Common Rail product`);
    assert(product.imageUrl?.startsWith('https://ai-azamat95.github.io/acahydraulic-catalog-images/'), `${handle} must use ACA-managed source photography`);
    assert(product.gallery.length > 0, `${handle} must keep at least one source photo`);
    assert(productCopy[handle], `${handle} must have reviewed Russian copy`);
    assert(productCopy[handle].name.includes(oem), `${handle} copy must preserve OEM ${oem}`);
    assert.equal(productCopy[handle].selectionCategory, 'fuel-common-rails');
    assert(!/sinocmp/i.test(JSON.stringify(productCopy[handle])), `${handle} must not expose the supplier identity`);
  }

  const railIds = products
    .filter((product) => product.categories.includes('fuel-common-rails'))
    .map((product) => String(product.id))
    .sort();
  assert.deepEqual(railIds, expectedProducts.map(([id]) => id).sort());
  assert.equal(categorySummary['fuel-common-rails'].count, expectedProducts.length);
  assert(categorySummary['fuel-common-rails'].imageUrl.startsWith('https://ai-azamat95.github.io/acahydraulic-catalog-images/'));
});

test('keeps the supplier-misclassified item under injectors, not fuel rails', () => {
  const [id, handle, oem] = injector;
  const product = products.find((item) => String(item.id) === id);
  assert(product);
  assert(product.categories.includes('fuel-injectors'));
  assert(!product.categories.includes('fuel-common-rails'));
  assert(product.gallery.length > 1, 'the curated injector may retain its real detail gallery');
  assert(productCopy[handle].name.includes(oem));
  assert.equal(productCopy[handle].selectionCategory, 'fuel-injectors');
});

test('ships complete SEO and selection content for the new category', () => {
  const landing = landings.categories.find((item) => item.id === 'fuel-common-rails');
  assert(landing);
  assert(landing.title.includes('Common Rail'));
  assert(landing.description.length >= 140);
  assert(seoContent['fuel-common-rails'].queries.length >= 4);
  assert.match(seoContent['fuel-common-rails'].selection, /OEM-номер/);
  const categoryAsset = fs.readFileSync('client/public/catalog-assets/category-fuel-common-rail.webp');
  assert.equal(categoryAsset.subarray(0, 4).toString('ascii'), 'RIFF');
});

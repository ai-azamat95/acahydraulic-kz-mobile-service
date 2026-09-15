import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const catalogDir = path.resolve('client/public/catalog-data');
const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
const audit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.catalogAuditFile), 'utf8'));
const strictCategoryAudit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.strictCategoryAuditFile), 'utf8'));
const categorySummary = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.categorySummaryFile), 'utf8'));
const products = [];

for (let page = 1; page <= manifest.chunkCount; page += 1) {
  const fileName = `products-${String(page).padStart(3, '0')}.json`;
  products.push(...JSON.parse(fs.readFileSync(path.join(catalogDir, fileName), 'utf8')));
}

assert.equal(audit.passed, true, 'full supplier comparison must pass');
assert.equal(audit.failures.length, 0, 'full supplier comparison must have no failures');
assert.equal(audit.marketCurrency, 'KZT', 'source market must return KZT prices');
assert.equal(audit.markup, 1.5, 'catalog markup must be exactly 50 percent');
assert.equal(audit.uniqueSourceProducts, audit.expectedPublishedProducts, 'all currently published supplier products must be fetched');
assert.equal(audit.importedProducts, audit.uniqueSourceProducts, 'every supplier product must be imported');
assert.equal(audit.exactTitleAndHandleMatches, audit.uniqueSourceProducts, 'all titles and handles must match');
assert.equal(audit.exactSkuMatches, audit.uniqueSourceProducts, 'all SKU lists must match');
assert.equal(audit.exactGalleryMatches, audit.uniqueSourceProducts, 'all image galleries must match');
assert.equal(audit.priceOnRequestThresholdKzt, 10_000_000, 'high supplier placeholder prices must require a quote');
assert.equal(audit.exactMarkupPrices + audit.priceOnRequestVariants, audit.sourceVariantCount, 'every source price must be checked');
assert.equal(products.length, audit.uniqueSourceProducts, 'published product data must match the audited source count');
assert.equal(new Set(products.map((product) => product.id)).size, products.length, 'source product IDs must be unique');
assert.equal(new Set(products.map((product) => product.handle)).size, products.length, 'product handles must be unique');
assert(products.every((product) => (product.categories || [product.category]).includes(product.category)), 'every product must include its primary category');
assert(
  Object.values(categorySummary).reduce((total, category) => total + category.count, 0) >= products.length,
  'every product must be assigned to at least one catalog category',
);

const flowControlValve = products.find((product) => product.handle === '0-16-gpm-1-2-npt-hydraulic-motor-flow-control-valve-w-relief');
assert(flowControlValve, 'known flow control valve must be present');
assert.equal(flowControlValve.category, 'hydraulic-motors', 'every product in the supplier hydraulic motor collection must stay in that category');

assert.equal(strictCategoryAudit.passed, true, 'strict supplier collection comparison must pass');
const hydraulicMotorAudit = strictCategoryAudit.categories['hydraulic-motors'];
assert(hydraulicMotorAudit, 'hydraulic motor collection audit must be present');
assert.equal(hydraulicMotorAudit.collection, 'hydraulic-motor');
assert.equal(hydraulicMotorAudit.importedProducts, hydraulicMotorAudit.sourceProducts, 'every supplier hydraulic motor must be imported');
assert.deepEqual(hydraulicMotorAudit.missingProductIds, [], 'no supplier hydraulic motors may be missing');
assert.deepEqual(hydraulicMotorAudit.unexpectedProductIds, [], 'no keyword-only products may enter the hydraulic motor category');
assert.equal(categorySummary['hydraulic-motors'].count, hydraulicMotorAudit.sourceProducts, 'rendered hydraulic motor count must match the supplier collection');

const mainControlValveAudit = strictCategoryAudit.categories['main-control-valves'];
assert(mainControlValveAudit, 'main control valve collection audit must be present');
assert.equal(mainControlValveAudit.collection, 'main-control-valve');
assert.equal(mainControlValveAudit.importedProducts, mainControlValveAudit.sourceProducts, 'every supplier main control valve must be imported');
assert.deepEqual(mainControlValveAudit.missingProductIds, [], 'no supplier main control valves may be missing');
assert.deepEqual(mainControlValveAudit.unexpectedProductIds, [], 'no keyword-only products may enter the main control valve category');
assert.equal(categorySummary['main-control-valves'].count, mainControlValveAudit.sourceProducts, 'rendered main control valve count must match the supplier collection');

const engineCylinderBlock = products.find((product) => product.handle === '04294187-d7e-engine-cylinder-block');
assert(engineCylinderBlock, 'known engine cylinder block must be present');
assert.equal(engineCylinderBlock.category, 'engine-fuel', 'engine cylinder block must not be classified as a pump part');

console.log(
  JSON.stringify(
    {
      passed: true,
      products: products.length,
      variants: audit.sourceVariantCount,
      exactTitles: audit.exactTitleAndHandleMatches,
      exactSkus: audit.exactSkuMatches,
      exactGalleries: audit.exactGalleryMatches,
      exactMarkupPrices: audit.exactMarkupPrices,
      priceOnRequestVariants: audit.priceOnRequestVariants,
      productsWithoutSourceImages: audit.productsWithoutSourceImages,
      categoryCounts: Object.fromEntries(Object.entries(categorySummary).map(([category, summary]) => [category, summary.count])),
    },
    null,
    2,
  ),
);

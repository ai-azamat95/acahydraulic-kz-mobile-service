import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const catalogDir = path.resolve(process.env.CATALOG_DIR || 'client/public/catalog-data');
const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
const audit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.catalogAuditFile), 'utf8'));
const strictCategoryAudit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.strictCategoryAuditFile), 'utf8'));
const controllerAudit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.controllerAuditFile), 'utf8'));
const monitorAudit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.monitorAuditFile), 'utf8'));
const wiringHarnessGalleryAudit = JSON.parse(fs.readFileSync(path.join(catalogDir, manifest.wiringHarnessAuditFile), 'utf8'));
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
assert.equal(audit.controllerMarkup, 1.8, 'controller collection markup must be exactly 80 percent');
assert.equal(audit.controllerCollection, 'controller', 'controller pricing must use the exact supplier collection');
assert.equal(manifest.monitorMarkup, 1.5, 'monitor collection markup must be exactly 50 percent');
assert.equal(audit.uniqueSourceProducts, audit.expectedPublishedProducts, 'all currently published supplier products must be fetched');
assert.equal(audit.importedProducts, audit.uniqueSourceProducts, 'every supplier product must be imported');
assert.equal(audit.exactTitleAndHandleMatches, audit.uniqueSourceProducts, 'all titles and handles must match');
assert.equal(audit.exactSkuMatches, audit.uniqueSourceProducts, 'all SKU lists must match');
assert.equal(audit.exactGalleryMatches, audit.uniqueSourceProducts, 'all image galleries must match');
assert.equal(audit.priceOnRequestThresholdKzt, 10_000_000, 'high supplier placeholder prices must require a quote');
assert.equal(audit.exactMarkupPrices + audit.priceOnRequestVariants, audit.sourceVariantCount, 'every source price must be checked');
assert.equal(
  audit.exactControllerMarkupPrices + audit.controllerPriceOnRequestVariants,
  audit.controllerSourceVariantCount,
  'every controller source price must use the controller-specific markup',
);
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

const wiringHarnessAudit = strictCategoryAudit.categories['wiring-harnesses'];
assert(wiringHarnessAudit, 'wiring harness collection audit must be present');
assert.equal(wiringHarnessAudit.collection, 'wiring-harness');
assert.equal(wiringHarnessAudit.importedProducts, wiringHarnessAudit.sourceProducts, 'every supplier wiring harness must be imported');
assert.deepEqual(wiringHarnessAudit.missingProductIds, [], 'no supplier wiring harnesses may be missing');
assert.deepEqual(wiringHarnessAudit.unexpectedProductIds, [], 'no keyword-only products may enter the wiring harness category');
assert.equal(categorySummary['wiring-harnesses'].count, wiringHarnessAudit.sourceProducts, 'rendered wiring harness count must match the supplier collection');
assert.equal(wiringHarnessGalleryAudit.passed, true, 'wiring harness gallery comparison must pass');
assert.equal(wiringHarnessGalleryAudit.collection, 'wiring-harness');
assert.equal(wiringHarnessGalleryAudit.category, 'wiring-harnesses');
assert.equal(wiringHarnessGalleryAudit.sourceProducts, wiringHarnessAudit.sourceProducts, 'gallery audit must cover every source wiring harness');
assert.equal(wiringHarnessGalleryAudit.importedProducts, wiringHarnessAudit.importedProducts, 'gallery audit must cover every imported wiring harness');
assert.equal(wiringHarnessGalleryAudit.exactGalleryMatches, wiringHarnessGalleryAudit.sourceProducts, 'every wiring harness gallery must match its source product');
assert.equal(wiringHarnessGalleryAudit.exactSkuMatches, wiringHarnessGalleryAudit.sourceProducts, 'every wiring harness SKU list must match its source product');
assert.equal(
  wiringHarnessGalleryAudit.publishedImages,
  wiringHarnessGalleryAudit.rawSourceImages -
    wiringHarnessGalleryAudit.excludedVisibleSupplierMarkImages -
    wiringHarnessGalleryAudit.excludedVerifiedDuplicateImages,
  'every clean, unique source wiring harness image must be published',
);
assert(wiringHarnessGalleryAudit.excludedVisibleSupplierMarkImages > 0, 'visible supplier marks must be excluded');
assert(wiringHarnessGalleryAudit.excludedVerifiedDuplicateImages > 0, 'verified duplicate wiring harness images must be excluded');
assert(wiringHarnessGalleryAudit.mirroredImages > 0, 'supplier-named wiring harness images must be mirrored locally');
assert.equal(wiringHarnessGalleryAudit.productsWithoutSourceImages, 0, 'every source wiring harness must have at least one image');
assert.equal(wiringHarnessGalleryAudit.failures.length, 0, 'wiring harness gallery audit must have no failures');

const wiring1931 = products.find((product) => product.handle === '0001931-external-wiring-harness-fits-hitachi-excavator-ex200-5');
assert(wiring1931, '0001931 wiring harness must be present');
assert.equal(wiring1931.gallery.length, 4, '0001931 must retain four clean detail images');
const wiring2104 = products.find((product) => product.handle === '0002104-external-wiring-harness-fits-hitachi-excavator-ex200-5');
assert(wiring2104, '0002104 wiring harness must be present');
assert.equal(wiring2104.gallery.length, 5, '0002104 must retain five clean, unique detail images');

const fuelInjectorAudit = strictCategoryAudit.categories['fuel-injectors'];
assert(fuelInjectorAudit, 'fuel injector collection audit must be present');
assert.equal(fuelInjectorAudit.collection, 'fuel-injector');
assert.equal(fuelInjectorAudit.importedProducts, fuelInjectorAudit.sourceProducts, 'every supplier fuel injector must be imported');
assert.deepEqual(fuelInjectorAudit.missingProductIds, [], 'no supplier fuel injectors may be missing');
assert.deepEqual(fuelInjectorAudit.unexpectedProductIds, [], 'no keyword-only products may enter the fuel injector category');
assert.equal(categorySummary['fuel-injectors'].count, fuelInjectorAudit.sourceProducts, 'rendered fuel injector count must match the supplier collection');
const fuelInjectors = products.filter((product) => (product.categories || [product.category]).includes('fuel-injectors'));
assert(
  fuelInjectors.every(
    (product) =>
      product.gallery.length === 1 &&
      product.imageUrl === product.gallery[0] &&
      product.imageUrl !== '/catalog-assets/category-fuel-injector.jpg',
  ),
  'every fuel injector must use its source product primary image instead of the shared category placeholder',
);
assert(
  new Set(fuelInjectors.map((product) => product.imageUrl)).size >= Math.floor(fuelInjectors.length * 0.95),
  'fuel injector primary images must remain product-specific apart from legitimate supplier duplicates',
);

const fuelPumpAudit = strictCategoryAudit.categories['fuel-pumps'];
assert(fuelPumpAudit, 'fuel pump collection audit must be present');
assert.equal(fuelPumpAudit.collection, 'fuel-pump');
assert.equal(fuelPumpAudit.importedProducts, fuelPumpAudit.sourceProducts, 'every supplier fuel pump must be imported');
assert.deepEqual(fuelPumpAudit.missingProductIds, [], 'no supplier fuel pumps may be missing');
assert.deepEqual(fuelPumpAudit.unexpectedProductIds, [], 'no keyword-only products may enter the fuel pump category');
assert.equal(categorySummary['fuel-pumps'].count, fuelPumpAudit.sourceProducts, 'rendered fuel pump count must match the supplier collection');

const engineRebuildKitAudit = strictCategoryAudit.categories['engine-rebuild-kits'];
assert(engineRebuildKitAudit, 'engine rebuild kit collection audit must be present');
assert.equal(engineRebuildKitAudit.collection, 'engine-overhaul-rebuild-kit');
assert.equal(engineRebuildKitAudit.importedProducts, engineRebuildKitAudit.sourceProducts, 'every supplier engine rebuild kit must be imported');
assert.deepEqual(engineRebuildKitAudit.missingProductIds, [], 'no supplier engine rebuild kits may be missing');
assert.deepEqual(engineRebuildKitAudit.unexpectedProductIds, [], 'no keyword-only products may enter the engine rebuild kit category');
assert.equal(categorySummary['engine-rebuild-kits'].count, engineRebuildKitAudit.sourceProducts, 'rendered engine rebuild kit count must match the supplier collection');

assert.equal(controllerAudit.passed, true, 'controller collection comparison must pass');
assert.equal(controllerAudit.collection, 'controller');
assert.equal(controllerAudit.markup, 1.8, 'controller prices must be source price plus 80 percent');
assert(controllerAudit.sourceProducts > 0, 'controller collection must not be empty');
assert.equal(controllerAudit.importedProducts, controllerAudit.sourceProducts, 'every supplier controller must be imported');
assert.equal(controllerAudit.failures.length, 0, 'controller import must have no failures');
assert.equal(
  controllerAudit.exactMarkupPrices + controllerAudit.priceOnRequestVariants,
  controllerAudit.sourceVariantCount,
  'every controller variant price must be checked',
);
const controllerIds = new Set(controllerAudit.sourceProductIds);
const controllers = products.filter((product) => controllerIds.has(product.id));
assert.equal(controllers.length, controllerAudit.sourceProducts, 'rendered controller count must match the supplier collection');
assert(
  controllers.every((product) => (product.categories || [product.category]).includes('controllers')),
  'every exact controller collection product must appear in the controllers category',
);

assert.equal(monitorAudit.passed, true, 'monitor collection comparison must pass');
assert.equal(monitorAudit.collection, 'monitor');
assert.equal(monitorAudit.category, 'monitors');
assert.equal(monitorAudit.markup, 1.5, 'monitor prices must be source price plus 50 percent');
assert(monitorAudit.sourceProducts > 0, 'monitor collection must not be empty');
assert.equal(monitorAudit.importedProducts, monitorAudit.sourceProducts, 'every supplier monitor must be imported');
assert.equal(monitorAudit.failures.length, 0, 'monitor import must have no failures');
assert.equal(
  monitorAudit.exactMarkupPrices + monitorAudit.priceOnRequestVariants,
  monitorAudit.sourceVariantCount,
  'every monitor variant price must be checked',
);
const monitorIds = new Set(monitorAudit.sourceProductIds);
const monitors = products.filter((product) => monitorIds.has(product.id));
assert.equal(monitors.length, monitorAudit.sourceProducts, 'rendered monitor count must match the supplier collection');
assert(monitors.every((product) => (product.categories || [product.category]).includes('monitors')), 'every monitor must appear in the monitors category');
assert.equal(categorySummary.monitors.count, monitorAudit.sourceProducts, 'monitor category must match the exact supplier collection');

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
      controllers: controllerAudit.sourceProducts,
      controllerVariants: controllerAudit.sourceVariantCount,
      controllerMarkup: controllerAudit.markup,
      monitors: monitorAudit.sourceProducts,
      monitorVariants: monitorAudit.sourceVariantCount,
      monitorMarkup: monitorAudit.markup,
      wiringHarnesses: wiringHarnessGalleryAudit.sourceProducts,
      wiringHarnessImages: wiringHarnessGalleryAudit.publishedImages,
      locallyMirroredWiringHarnessImages: wiringHarnessGalleryAudit.mirroredImages,
      wiringHarnessesWithoutImages: wiringHarnessGalleryAudit.productsWithoutSourceImages,
      excludedVisibleSupplierMarkImages: wiringHarnessGalleryAudit.excludedVisibleSupplierMarkImages,
      excludedVerifiedDuplicateWiringHarnessImages: wiringHarnessGalleryAudit.excludedVerifiedDuplicateImages,
      wiringHarnessesWithoutPublishedImages: wiringHarnessGalleryAudit.productsWithoutPublishedImages,
      productsWithoutSourceImages: audit.productsWithoutSourceImages,
      categoryCounts: Object.fromEntries(Object.entries(categorySummary).map(([category, summary]) => [category, summary.count])),
    },
    null,
    2,
  ),
);

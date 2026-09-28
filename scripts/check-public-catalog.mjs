import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { isExcludedCatalogImage } from './lib/catalog-image-hygiene.mjs';

const catalogDir = path.resolve(process.argv[2] || 'client/public/catalog-data');
const manifestPath = path.join(catalogDir, 'manifest.json');
const forbiddenBrand = /sinocmp/i;
const forbiddenSupplierHost = /https:\/\/(?:[^/]+\.)?(?:sinocmp\.com|shopify\.com)\//i;
const forbiddenKeys = new Set(['sourceUrl', 'sourcePriceKzt', 'sourceUpdatedAt']);
const privateFiles = [
  'catalog-import-audit.json',
  'pump-import-audit.json',
  'strict-category-import-audit.json',
  'controller-import-audit.json',
  'monitor-import-audit.json',
  'wiring-harness-import-audit.json',
];

assert(fs.existsSync(manifestPath), `missing public manifest in ${catalogDir}`);
for (const fileName of privateFiles) {
  assert.equal(fs.existsSync(path.join(catalogDir, fileName)), false, `${fileName} must not be published`);
}

const jsonFiles = fs.readdirSync(catalogDir).filter((fileName) => fileName.endsWith('.json'));
const sensitiveKeyHits = [];

function inspectKeys(value, fileName, location = '$') {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectKeys(item, fileName, `${location}[${index}]`));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) sensitiveKeyHits.push(`${fileName}:${location}.${key}`);
    inspectKeys(child, fileName, `${location}.${key}`);
  }
}

for (const fileName of jsonFiles) {
  const raw = fs.readFileSync(path.join(catalogDir, fileName), 'utf8');
  assert.equal(forbiddenBrand.test(raw), false, `supplier brand leaked in ${fileName}`);
  forbiddenBrand.lastIndex = 0;
  assert.equal(forbiddenSupplierHost.test(raw), false, `supplier image host leaked in ${fileName}`);
  forbiddenSupplierHost.lastIndex = 0;
  inspectKeys(JSON.parse(raw), fileName);
}

assert.deepEqual(sensitiveKeyHits, [], `sensitive supplier fields leaked: ${sensitiveKeyHits.slice(0, 10).join(', ')}`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert.equal(manifest.imageOwnership, 'aca-managed', 'catalogue images must be stored in ACA-managed storage');
assert.match(manifest.imageBaseUrl || '', /^https:\/\//i, 'ACA-managed image base URL must use HTTPS');
assert.equal(forbiddenSupplierHost.test(manifest.imageBaseUrl), false, 'ACA-managed image base URL cannot use a supplier host');
forbiddenSupplierHost.lastIndex = 0;
assert.equal(typeof manifest.imageManifestFile, 'string', 'catalog image integrity manifest is required');
assert.equal(Number.isInteger(manifest.mirroredImageCount), true, 'mirrored image count is required');
for (const key of [
  'source',
  'markup',
  'controllerMarkup',
  'monitorMarkup',
  'priceOnRequestThresholdKzt',
  'catalogAuditFile',
  'pumpAuditFile',
  'strictCategoryAuditFile',
  'controllerAuditFile',
  'monitorAuditFile',
  'wiringHarnessAuditFile',
]) {
  assert.equal(key in manifest, false, `private manifest field leaked: ${key}`);
}

const products = [];
for (let page = 1; page <= manifest.chunkCount; page += 1) {
  products.push(...JSON.parse(fs.readFileSync(path.join(catalogDir, `products-${String(page).padStart(3, '0')}.json`), 'utf8')));
}

assert.equal(products.length, manifest.productCount, 'public product count must match the manifest');
assert.equal(new Set(products.map((product) => product.handle)).size, products.length, 'public product handles must be unique');
const pumpParts = products.filter((product) => (product.categories || [product.category]).includes('pump-parts'));
const wiringHarnesses = products.filter((product) => (product.categories || [product.category]).includes('wiring-harnesses'));
const fuelInjectors = products.filter((product) => (product.categories || [product.category]).includes('fuel-injectors'));
const fuelPumps = products.filter((product) => (product.categories || [product.category]).includes('fuel-pumps'));
const engineRebuildKits = products.filter((product) => (product.categories || [product.category]).includes('engine-rebuild-kits'));
const controllers = products.filter((product) => (product.categories || [product.category]).includes('controllers'));
const monitors = products.filter((product) => (product.categories || [product.category]).includes('monitors'));
const imageBaseUrl = new URL(manifest.imageBaseUrl);
const imageBasePath = `${imageBaseUrl.pathname.replace(/\/+$/, '')}/`;
function managedImageKey(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl) return null;
  if (imageUrl.startsWith('/')) return `local:${imageUrl}`;
  const parsed = new URL(imageUrl);
  if (parsed.origin !== imageBaseUrl.origin || !parsed.pathname.startsWith(imageBasePath)) return null;
  return decodeURIComponent(parsed.pathname.slice(imageBasePath.length));
}
assert(
  products.every(
    (product) =>
      (!product.imageUrl || managedImageKey(product.imageUrl)) &&
      Array.isArray(product.gallery) &&
      product.gallery.every((imageUrl) => managedImageKey(imageUrl)),
  ),
  'every product image must use a local asset or ACA-managed image storage',
);
assert(pumpParts.length > 0, 'pump parts category must not be empty');
assert(wiringHarnesses.length > 0, 'wiring harness category must not be empty');
assert(fuelInjectors.length > 0, 'fuel injector category must not be empty');
assert(fuelPumps.length > 0, 'fuel pump category must not be empty');
assert(engineRebuildKits.length > 0, 'engine rebuild kit category must not be empty');
assert(controllers.length > 0, 'controllers category must not be empty');
assert(monitors.length > 0, 'monitors category must not be empty');
assert(
  pumpParts.every(
    (product) =>
      product.imageUrl === '/catalog-assets/category-pump-parts.jpg' &&
      JSON.stringify(product.gallery) === JSON.stringify(['/catalog-assets/category-pump-parts.jpg']),
  ),
  'pump parts must use the local unbranded catalogue image',
);
assert(
  wiringHarnesses.every((product) => Array.isArray(product.gallery) && product.imageUrl === (product.gallery[0] || null)),
  'every wiring harness primary image must be the first image from its own ordered gallery',
);
assert(
  wiringHarnesses.every(
    (product) =>
      product.imageUrl !== '/catalog-assets/category-wiring-harness.jpg' &&
      !product.gallery.includes('/catalog-assets/category-wiring-harness.jpg'),
  ),
  'wiring harnesses must not use the shared category placeholder',
);
assert(
  wiringHarnesses.every((product) =>
    product.gallery.every((imageUrl) => Boolean(managedImageKey(imageUrl))),
  ),
  'wiring harness galleries must contain only ACA-managed or product-scoped local images',
);
const wiringHarnessesWithImages = wiringHarnesses.filter((product) => product.gallery.length > 0);
const uniqueWiringHarnessGalleries = new Set(wiringHarnessesWithImages.map((product) => JSON.stringify(product.gallery)));
assert.equal(uniqueWiringHarnessGalleries.size, wiringHarnessesWithImages.length, 'wiring harness products must not share the same complete gallery');
assert(
  products.every((product) => product.gallery.every((imageUrl) => !isExcludedCatalogImage(product.id, imageUrl))),
  'visible supplier marks and verified duplicate images must not be published',
);
for (const product of wiringHarnesses) {
  for (const imageUrl of product.gallery.filter((value) => value.startsWith('/catalog-assets/wiring-harnesses/'))) {
    const filePath = path.join(catalogDir, '..', imageUrl.replace(/^\//, ''));
    assert(fs.existsSync(filePath), `missing locally mirrored wiring harness image for ${product.id}: ${imageUrl}`);
    assert(fs.statSync(filePath).size > 0, `empty locally mirrored wiring harness image for ${product.id}: ${imageUrl}`);
  }
}
assert(
  fuelInjectors.every(
    (product) =>
      product.imageUrl === '/catalog-assets/category-fuel-injector.jpg' &&
      JSON.stringify(product.gallery) === JSON.stringify(['/catalog-assets/category-fuel-injector.jpg']),
  ),
  'fuel injectors must use the local unbranded catalogue image',
);
assert(
  fuelPumps.every(
    (product) =>
      Array.isArray(product.gallery) &&
      product.gallery.length > 0 &&
      product.imageUrl === product.gallery[0] &&
      product.imageUrl !== '/catalog-assets/category-fuel-pump.jpg' &&
      product.gallery.every((imageUrl) => Boolean(managedImageKey(imageUrl))),
  ),
  'fuel pumps must use their own ACA-managed product gallery instead of a shared placeholder',
);
assert.equal(
  new Set(fuelPumps.map((product) => product.imageUrl)).size,
  fuelPumps.length,
  'every fuel pump must have a distinct primary image',
);

const imageManifestPath = path.join(catalogDir, manifest.imageManifestFile);
assert(fs.existsSync(imageManifestPath), `missing image integrity manifest: ${manifest.imageManifestFile}`);
const imageManifest = JSON.parse(fs.readFileSync(imageManifestPath, 'utf8'));
assert.equal(imageManifest.imageBaseUrl, manifest.imageBaseUrl, 'image base URL must match the image integrity manifest');
assert.equal(imageManifest.imageCount, manifest.mirroredImageCount, 'mirrored image count must match the image integrity manifest');
assert.equal(imageManifest.entries.length, imageManifest.imageCount, 'image integrity entry count must match');
const imageManifestKeys = new Set(imageManifest.entries.map((entry) => entry.key));
assert.equal(imageManifestKeys.size, imageManifest.entries.length, 'image integrity keys must be unique');
const managedRemoteKeys = new Set(
  products.flatMap((product) => product.gallery.map(managedImageKey).filter((key) => key && !key.startsWith('local:'))),
);
assert.deepEqual(managedRemoteKeys, imageManifestKeys, 'every ACA-managed gallery image must have exactly one integrity entry');
assert(
  engineRebuildKits.every(
    (product) =>
      product.imageUrl === '/catalog-assets/category-engine-rebuild-kit.jpg' &&
      JSON.stringify(product.gallery) === JSON.stringify(['/catalog-assets/category-engine-rebuild-kit.jpg']),
  ),
  'engine rebuild kits must use the local unbranded catalogue image',
);

console.log(
  JSON.stringify(
    {
      passed: true,
      filesChecked: jsonFiles.length,
      products: products.length,
      pumpParts: pumpParts.length,
      wiringHarnesses: wiringHarnesses.length,
      wiringHarnessImages: wiringHarnesses.reduce((total, product) => total + product.gallery.length, 0),
      wiringHarnessesWithoutImages: wiringHarnesses.length - wiringHarnessesWithImages.length,
      uniqueWiringHarnessGalleries: uniqueWiringHarnessGalleries.size,
      locallyMirroredWiringHarnessImages: wiringHarnesses.reduce(
        (total, product) => total + product.gallery.filter((imageUrl) => imageUrl.startsWith('/catalog-assets/wiring-harnesses/')).length,
        0,
      ),
      fuelInjectors: fuelInjectors.length,
      fuelPumps: fuelPumps.length,
      engineRebuildKits: engineRebuildKits.length,
      controllers: controllers.length,
      monitors: monitors.length,
      supplierBrandOccurrences: 0,
      sensitiveSupplierFields: 0,
    },
    null,
    2,
  ),
);

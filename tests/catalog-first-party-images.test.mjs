import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  buildPriorityImagePlan,
  priorityCatalogHandles,
  priorityCatalogImagePublicRoot,
  rewritePriorityProductImages,
} from '../scripts/catalog-first-party-images.mjs';

const catalogDir = path.resolve('client/public/catalog-data');
const assetRoot = path.resolve('client/public/catalog-assets/priority-products');

test('priority catalog images are complete, first-party, and integrity checked', () => {
  const plan = buildPriorityImagePlan({ catalogDir, assetRoot, verifyAssets: true });
  assert.equal(priorityCatalogHandles.size, 300);
  assert.equal(plan.selectedProducts.size, 300);
  assert.equal(plan.remoteAssets.size, 299);
  assert.equal(plan.totalBytes, 6_043_990);

  for (const product of plan.selectedProducts.values()) {
    const rewritten = rewritePriorityProductImages(product, plan.imageManifest);
    assert.ok(rewritten.imageUrl?.startsWith('/'), `${product.handle} primary image must be first-party`);
    assert.ok(rewritten.gallery?.length, `${product.handle} must keep its gallery`);
    assert.equal(rewritten.gallery[0], rewritten.imageUrl, `${product.handle} gallery must begin with the primary image`);
    assert.deepEqual(rewritten.gallery.slice(1), product.gallery.slice(1), `${product.handle} secondary gallery order must stay unchanged`);
  }

  for (const asset of plan.remoteAssets.values()) {
    assert.ok(asset.publicUrl.startsWith(priorityCatalogImagePublicRoot));
    assert.ok(fs.existsSync(asset.filePath));
  }
});

test('catalog refresh preserves the committed first-party priority image set', () => {
  const workflow = fs.readFileSync('.github/workflows/catalog-refresh.yml', 'utf8');
  assert.match(workflow, /CATALOG_PRIORITY_IMAGE_SOURCE_DIR: \.catalog-images/);
  assert.match(workflow, /client\/public\/catalog-assets\/priority-products/);
});

test('products outside the reviewed cohort keep their existing image URLs', () => {
  const plan = buildPriorityImagePlan({ catalogDir, assetRoot, verifyAssets: true });
  const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
  let sample;
  for (let index = 1; index <= manifest.chunkCount && !sample; index += 1) {
    const products = JSON.parse(fs.readFileSync(path.join(catalogDir, `products-${String(index).padStart(3, '0')}.json`), 'utf8'));
    sample = products.find(product => !priorityCatalogHandles.has(product.handle) && /^https:\/\//.test(product.imageUrl || ''));
  }
  assert.ok(sample, 'expected a non-priority remote-image product');
  assert.deepEqual(rewritePriorityProductImages(sample, plan.imageManifest), sample);
});

test('production catalog uses a first-party primary image for every priority product', {
  skip: !fs.existsSync(path.resolve('dist/public/catalog-data/manifest.json')),
}, () => {
  const distCatalogDir = path.resolve('dist/public/catalog-data');
  const manifest = JSON.parse(fs.readFileSync(path.join(distCatalogDir, 'manifest.json'), 'utf8'));
  const products = Array.from({ length: manifest.chunkCount }, (_, index) =>
    JSON.parse(fs.readFileSync(path.join(distCatalogDir, `products-${String(index + 1).padStart(3, '0')}.json`), 'utf8'))).flat();
  const priorityProducts = products.filter(product => priorityCatalogHandles.has(product.handle));
  assert.equal(priorityProducts.length, 300);
  for (const product of priorityProducts) {
    assert.ok(product.imageUrl?.startsWith('/'), `${product.handle} built primary image must be first-party`);
    assert.equal(product.gallery?.[0], product.imageUrl, `${product.handle} built gallery must begin with the primary image`);
    const file = path.join('dist/public', product.imageUrl.replace(/^\//, ''));
    assert.ok(fs.existsSync(file), `${product.handle} built primary image file must exist`);
  }
});

test('static priority product pages expose fast, product-specific first-party image metadata', {
  skip: !fs.existsSync(path.resolve('dist/public/catalog/708-7s-00550-hydraulic-pump/index.html')),
}, () => {
  const isFirstParty = value => new URL(value, 'https://acahydraulic.kz').hostname === 'acahydraulic.kz';
  for (const handle of priorityCatalogHandles) {
    const html = fs.readFileSync(path.resolve('dist/public/catalog', handle, 'index.html'), 'utf8');
    const firstImageTag = html.match(/<section data-product-gallery>[\s\S]*?(<img\b[^>]*>)/i)?.[1];
    assert.ok(firstImageTag, `${handle} must expose a static primary image`);
    const firstImage = firstImageTag.match(/\bsrc="([^"]+)"/i)?.[1];
    assert.ok(firstImage && isFirstParty(firstImage), `${handle} static primary image must be first-party`);
    assert.match(firstImageTag, /\bloading="eager"/i, `${handle} primary image must not be lazy-loaded`);
    assert.match(firstImageTag, /\bfetchpriority="high"/i, `${handle} primary image must have high fetch priority`);

    const ogImage = html.match(/<meta(?=[^>]*\bproperty="og:image")(?=[^>]*\bcontent="([^"]+)")[^>]*>/i)?.[1];
    assert.ok(ogImage && isFirstParty(ogImage), `${handle} Open Graph image must be first-party`);
    const ogAlt = html.match(/<meta(?=[^>]*\bproperty="og:image:alt")(?=[^>]*\bcontent="([^"]+)")[^>]*>/i)?.[1];
    assert.ok(ogAlt && !ogAlt.includes('Ремонт гидравлики спецтехники'), `${handle} must have product-specific Open Graph alt text`);

    const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .map(match => { try { return JSON.parse(match[1]); } catch { return null; } })
      .filter(Boolean);
    const productSchema = schemas.find(schema => schema['@type'] === 'Product');
    if (productSchema) assert.ok(isFirstParty(productSchema.image[0]), `${handle} Product schema must start with a first-party image`);

    if (ogImage.includes('/catalog-assets/priority-products/')) {
      assert.match(html, /property="og:image:width" content="1000"/i);
      assert.match(html, /property="og:image:height" content="1000"/i);
    }
  }
});

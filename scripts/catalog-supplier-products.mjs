import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import supplierProducts from '../shared/catalog-supplier-products.json' with { type: 'json' };
import hydrauvisionProducts from '../shared/catalog-hydrauvision-products.json' with { type: 'json' };
import hydrauvisionInventory from '../data/hydrauvision-pumps-20261017/source-products.json' with { type: 'json' };
import { hydrauvisionRetailPriceKzt } from './lib/hydrauvision-pricing.mjs';

export const SUPPLIER_CATALOG_SUPPLEMENT = '2026-10-supplier-catalog';
export const supplierCatalogProducts = [...supplierProducts, ...hydrauvisionProducts];
const SUPPLIER_CHUNK_SIZE = 250;
const SAFE_CATEGORY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HYDRAUVISION_PRODUCT_IDS = new Set(hydrauvisionProducts.map(product => product.id));
const HYDRAUVISION_PRODUCTS_BY_ID = new Map(hydrauvisionProducts.map(product => [product.id, product]));
const HYDRAUVISION_AUDIT = new Map(hydrauvisionInventory.products
  .filter(product => product.decision === 'published')
  .map(product => [product.publicId, product]));
const HYDRAUVISION_CANONICAL_REPLACEMENTS = new Map(hydrauvisionInventory.products
  .filter(product => product.decision === 'published' && product.canonicalExistingProduct)
  .map(product => [String(product.canonicalExistingProduct.id), product.canonicalExistingProduct]));

export function supplierCatalogProductByHandle(handle) {
  return supplierCatalogProducts.find(product => product.handle === handle);
}

function categoriesFor(product) {
  return [...new Set(product.categories?.length ? product.categories : [product.category])];
}

function validateProducts(products) {
  assert(Array.isArray(products), 'Supplier catalogue products must be an array');
  const ids = new Set();
  const handles = new Set();
  for (const product of products) {
    assert(product && typeof product === 'object', 'Invalid supplier catalogue product');
    assert(typeof product.id === 'string' && product.id, 'Supplier product id is required');
    assert(typeof product.handle === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.handle), `Invalid supplier product handle: ${product.handle}`);
    assert(!ids.has(product.id), `Duplicate supplier product id: ${product.id}`);
    ids.add(product.id);
    for (const handle of [product.handle, ...(product.legacyHandles || [])]) {
      assert(typeof handle === 'string' && handle, `Invalid supplier product alias: ${product.id}`);
      assert(!handles.has(handle), `Duplicate supplier product handle or alias: ${handle}`);
      handles.add(handle);
    }
    assert.equal(product.available, false, `${product.handle}: supplier availability must be unconfirmed`);
    const hydrauvisionAudit = HYDRAUVISION_AUDIT.get(product.id);
    if (HYDRAUVISION_PRODUCT_IDS.has(product.id)) {
      assert(hydrauvisionAudit, `${product.handle}: reviewed pump price audit is required`);
      assert.deepEqual(product, HYDRAUVISION_PRODUCTS_BY_ID.get(product.id), `${product.id}: reviewed pump record changed outside the importer`);
      assert(hydrauvisionAudit.sourcePriceExclTaxEur > 0, `${product.handle}: positive source price excluding VAT is required`);
      const expectedPrice = hydrauvisionRetailPriceKzt(hydrauvisionAudit.sourcePriceExclTaxEur);
      assert.equal(product.minPriceKzt, expectedPrice, `${product.handle}: reviewed minimum price does not match the price audit`);
      assert.equal(product.maxPriceKzt, expectedPrice, `${product.handle}: reviewed maximum price does not match the price audit`);
      assert.equal(typeof product.catalogPriceNote, 'string', `${product.handle}: reviewed price note is required`);
    } else {
      assert.equal(product.minPriceKzt, null, `${product.handle}: supplier minimum price must be unconfirmed`);
      assert.equal(product.maxPriceKzt, null, `${product.handle}: supplier maximum price must be unconfirmed`);
    }
    assert(!product.ownerProduct && !product.ownerCase && !product.ownerSale && !product.approvedSale && !product.ownerEvidence, `${product.handle}: supplier products cannot claim owner evidence`);
    assert(Array.isArray(product.variants) && product.variants.length > 0, `${product.handle}: supplier variants are required`);
    for (const variant of product.variants) {
      assert.equal(variant.available, false, `${product.handle}: variant availability must be unconfirmed`);
      assert.equal(variant.priceKzt, hydrauvisionAudit ? product.minPriceKzt : null, `${product.handle}: invalid supplier variant price`);
    }
    for (const category of categoriesFor(product)) {
      assert(SAFE_CATEGORY_ID.test(category || ''), `${product.handle}: invalid supplier category ${category}`);
    }
    if (product.catalogVideos !== undefined) {
      assert(Array.isArray(product.catalogVideos), `${product.handle}: invalid videos`);
      for (const video of product.catalogVideos) {
        assert(/^\/catalog-media\/[a-z0-9/._-]+\.mp4$/.test(video.src) && !video.src.includes('..'), `${product.handle}: invalid local video`);
        assert(/^\/catalog-assets\/[a-z0-9/._-]+\.jpg$/.test(video.poster) && !video.poster.includes('..'), `${product.handle}: invalid video poster`);
        assert(typeof video.caption === 'string' && video.caption.trim(), `${product.handle}: video caption required`);
        assert(Number.isInteger(video.width) && video.width > 0 && Number.isInteger(video.height) && video.height > 0, `${product.handle}: invalid video dimensions`);
      }
    }
  }
  return { ids, handles };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  const body = JSON.stringify(value);
  if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8') !== body) fs.writeFileSync(filePath, body);
}

function toIndexProduct(product, chunk) {
  const { variants, ...indexProduct } = product;
  return { ...indexProduct, chunk };
}

/**
 * Rebuild the supplement from full products, including snapshots that already
 * contain it. Legacy chunks and their prices stay in place; only supplement
 * products are moved into dedicated, bounded chunks after the legacy catalogue.
 */
export function applySupplierCatalogProducts(catalogDir, {
  products = supplierCatalogProducts,
  updateCategorySummary = true,
} = {}) {
  const { ids: supplierIds, handles: supplierHandles } = validateProducts(products);
  const manifestPath = path.join(catalogDir, 'manifest.json');
  const manifest = readJson(manifestPath);
  const indexFile = manifest.indexFile || 'search-index.json';
  const summaryFile = manifest.categorySummaryFile || 'category-summary.json';
  assert.equal(path.basename(indexFile), indexFile, 'Invalid catalogue index filename');
  assert.equal(path.basename(summaryFile), summaryFile, 'Invalid catalogue summary filename');
  const fullIndexPath = path.join(catalogDir, indexFile);
  const oldFullIndex = fs.existsSync(fullIndexPath) ? readJson(fullIndexPath) : [];
  const oldSummary = updateCategorySummary ? readJson(path.join(catalogDir, summaryFile)) : null;
  const chunkFiles = fs.readdirSync(catalogDir)
    .filter(file => /^products-\d+\.json$/.test(file))
    .map(file => ({ file, chunk: Number(file.match(/\d+/)[0]) }))
    .sort((a, b) => a.chunk - b.chunk);
  const legacyChunks = new Map();
  const oldSupplementHandles = new Set();
  let baseChunkCount = 0;

  for (const { file, chunk } of chunkFiles) {
    const rows = readJson(path.join(catalogDir, file));
    assert(Array.isArray(rows), `Catalogue product chunk must be an array: ${file}`);
    const legacyRows = [];
    for (const product of rows) {
      if (product.catalogSupplement === SUPPLIER_CATALOG_SUPPLEMENT) {
        oldSupplementHandles.add(product.handle);
        continue;
      }
      const canonicalReplacement = HYDRAUVISION_CANONICAL_REPLACEMENTS.get(String(product.id));
      if (canonicalReplacement) {
        assert.equal(product.handle, canonicalReplacement.handle, `Canonical replacement handle changed for ${product.id}`);
        continue;
      }
      assert(!supplierIds.has(String(product.id)) && !supplierHandles.has(product.handle), `Supplier product collides with existing catalogue product: ${product.handle}`);
      legacyRows.push({ ...product, chunk });
    }
    legacyChunks.set(chunk, legacyRows);
    if (legacyRows.length) baseChunkCount = chunk;
  }

  for (let chunk = 1; chunk <= manifest.chunkCount; chunk += 1) {
    assert(legacyChunks.has(chunk), `Catalogue product chunk is missing: ${chunk}`);
  }

  const outputChunks = new Map();
  const indexByHandle = new Map();
  for (let chunk = 1; chunk <= baseChunkCount; chunk += 1) {
    const rows = legacyChunks.get(chunk) || [];
    const suffix = String(chunk).padStart(3, '0');
    const chunkIndexPath = path.join(catalogDir, `search-index-${suffix}.json`);
    const oldChunkIndex = fs.existsSync(chunkIndexPath) ? readJson(chunkIndexPath) : [];
    const previousRows = new Map(oldChunkIndex.map(product => [product.handle, product]));
    outputChunks.set(chunk, rows);
    for (const product of rows) {
      const oldIndexRow = previousRows.get(product.handle);
      indexByHandle.set(product.handle, oldIndexRow && String(oldIndexRow.id) === String(product.id)
        ? { ...oldIndexRow, chunk }
        : toIndexProduct(product, chunk));
    }
  }

  const inserted = products.map((product, index) => ({
    ...product,
    catalogSupplement: SUPPLIER_CATALOG_SUPPLEMENT,
    chunk: baseChunkCount + Math.floor(index / SUPPLIER_CHUNK_SIZE) + 1,
  }));
  for (const product of inserted) {
    if (!outputChunks.has(product.chunk)) outputChunks.set(product.chunk, []);
    outputChunks.get(product.chunk).push(product);
    indexByHandle.set(product.handle, toIndexProduct(product, product.chunk));
  }

  const allProducts = [...outputChunks.values()].flat();
  assert.equal(new Set(allProducts.map(product => product.handle)).size, allProducts.length, 'Catalogue product handles must be unique');
  assert.equal(new Set(allProducts.map(product => String(product.id))).size, allProducts.length, 'Catalogue product ids must be unique');
  const productMap = Object.fromEntries(allProducts.map(product => [product.handle, product.chunk]));
  const fullIndex = [];
  const indexedHandles = new Set();
  for (const oldRow of oldFullIndex) {
    const row = indexByHandle.get(oldRow.handle);
    if (row && !supplierHandles.has(row.handle) && !indexedHandles.has(row.handle)) {
      fullIndex.push(row);
      indexedHandles.add(row.handle);
    }
  }
  for (const row of indexByHandle.values()) {
    if (!indexedHandles.has(row.handle)) {
      fullIndex.push(row);
      indexedHandles.add(row.handle);
    }
  }

  let categorySummary;
  if (oldSummary) {
    categorySummary = Object.fromEntries(Object.entries(oldSummary).map(([category, summary]) => [category, { ...summary, count: 0, imageUrl: null }]));
    for (const product of allProducts) {
      for (const category of categoriesFor(product)) {
        const summary = categorySummary[category] ||= { count: 0, imageUrl: null };
        summary.count += 1;
        summary.imageUrl ||= product.imageUrl || null;
        if (product.imageUrl && product.imageUrl === oldSummary[category]?.imageUrl) summary.imageUrl = product.imageUrl;
      }
    }
  }

  const chunkCount = baseChunkCount + Math.ceil(products.length / SUPPLIER_CHUNK_SIZE);
  const dataVersion = `catalog-${createHash('sha256').update(JSON.stringify(allProducts)).digest('hex').slice(0, 16)}`;
  // Everything above is validated before touching the snapshot on disk.
  for (const [chunk, rows] of outputChunks) {
    const suffix = String(chunk).padStart(3, '0');
    writeJson(path.join(catalogDir, `products-${suffix}.json`), rows);
    writeJson(path.join(catalogDir, `search-index-${suffix}.json`), rows.map(product => indexByHandle.get(product.handle)));
  }
  for (const file of fs.readdirSync(catalogDir)) {
    const match = file.match(/^(?:products|search-index)-(\d+)\.json$/);
    if (match && Number(match[1]) > chunkCount) fs.unlinkSync(path.join(catalogDir, file));
  }
  writeJson(fullIndexPath, fullIndex);
  writeJson(path.join(catalogDir, 'product-map.json'), productMap);
  if (categorySummary) writeJson(path.join(catalogDir, summaryFile), categorySummary);
  writeJson(manifestPath, { ...manifest, dataVersion, productCount: allProducts.length, chunkCount });

  return {
    added: products.filter(product => !oldSupplementHandles.has(product.handle)).length,
    products: products.length,
    chunks: Math.ceil(products.length / SUPPLIER_CHUNK_SIZE),
    productCount: allProducts.length,
    chunkCount,
  };
}

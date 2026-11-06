import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import ownerProducts from '../shared/catalog-owner-products.json' with { type: 'json' };

export const ownerCatalogProducts = ownerProducts;

export function ownerCatalogProductByHandle(handle) {
  return ownerCatalogProducts.find(product => product.handle === handle);
}

function productHandles(product) {
  return [product.handle, ...(product.legacyHandles || [])];
}

function categoriesFor(product) {
  return [...new Set(product.categories?.length ? product.categories : [product.category])];
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

export function applyOwnerCatalogProducts(catalogDir, { updateCategorySummary = true } = {}) {
  const manifestPath = path.join(catalogDir, 'manifest.json');
  const mapPath = path.join(catalogDir, 'product-map.json');
  const summaryPath = path.join(catalogDir, 'category-summary.json');
  const manifest = readJson(manifestPath);
  const oldSummary = updateCategorySummary ? readJson(summaryPath) : null;
  const indexFile = manifest.indexFile || 'search-index.json';
  const fullIndexPath = path.join(catalogDir, indexFile);
  const oldFullIndex = fs.existsSync(fullIndexPath) ? readJson(fullIndexPath) : [];
  const ownerIds = new Set(ownerCatalogProducts.map(product => String(product.id)));
  const ownerHandles = new Set(ownerCatalogProducts.flatMap(productHandles));
  const matchesOwner = product => ownerIds.has(String(product.id)) || ownerHandles.has(product.handle);
  const chunkFiles = fs.readdirSync(catalogDir)
    .filter(file => /^products-\d+\.json$/.test(file))
    .map(file => ({ file, chunk: Number(file.match(/\d+/)[0]) }))
    .sort((a, b) => a.chunk - b.chunk);
  const productChunks = new Map();
  const oldChunkIndexes = new Map();
  const oldProducts = [];

  for (const { file, chunk } of chunkFiles) {
    const rows = readJson(path.join(catalogDir, file));
    assert(Array.isArray(rows), `Catalogue product chunk must be an array: ${file}`);
    oldProducts.push(...rows);
    productChunks.set(chunk, rows.filter(product => !matchesOwner(product)));
    const suffix = String(chunk).padStart(3, '0');
    const indexPath = path.join(catalogDir, `search-index-${suffix}.json`);
    oldChunkIndexes.set(chunk, fs.existsSync(indexPath) ? readJson(indexPath) : []);
  }

  const targetChunk = 1;
  assert(productChunks.has(targetChunk), 'Catalogue product chunk 1 is required for owner products');
  const insertedProducts = ownerCatalogProducts.map(product => ({ ...product, chunk: targetChunk }));
  productChunks.set(targetChunk, [...insertedProducts, ...productChunks.get(targetChunk)]);

  const allProducts = [...productChunks.entries()].flatMap(([chunk, rows]) => rows.map(product => ({ product, chunk })));
  assert.equal(new Set(allProducts.map(({ product }) => product.handle)).size, allProducts.length, 'Catalogue product handles must be unique');
  assert.equal(new Set(allProducts.map(({ product }) => String(product.id))).size, allProducts.length, 'Catalogue product ids must be unique');

  const productMap = Object.fromEntries(allProducts.map(({ product, chunk }) => [product.handle, chunk]));
  const indexByHandle = new Map();
  for (const { product, chunk } of allProducts) {
    const previous = (oldChunkIndexes.get(chunk) || []).find(row => row.handle === product.handle);
    const ownerProduct = ownerIds.has(String(product.id)) || ownerCatalogProducts.some(item => item.handle === product.handle);
    indexByHandle.set(product.handle, ownerProduct || !previous || String(previous.id) !== String(product.id)
      ? toIndexProduct(product, chunk)
      : { ...previous, chunk });
  }

  const fullIndex = [];
  const indexedHandles = new Set();
  for (const previous of oldFullIndex) {
    const replacement = indexByHandle.get(previous.handle);
    if (replacement && !indexedHandles.has(previous.handle)) {
      fullIndex.push(replacement);
      indexedHandles.add(previous.handle);
    }
  }
  for (const [handle, product] of indexByHandle) {
    if (!indexedHandles.has(handle)) fullIndex.push(product);
  }

  let categorySummary;
  if (oldSummary) {
    categorySummary = Object.fromEntries(Object.entries(oldSummary).map(([category, summary]) => [category, { ...summary, count: 0, imageUrl: null }]));
    for (const { product } of allProducts) {
      for (const category of categoriesFor(product)) {
        const summary = categorySummary[category] ||= { count: 0, imageUrl: null };
        summary.count += 1;
        summary.imageUrl ||= product.imageUrl || null;
        if (product.imageUrl && product.imageUrl === oldSummary[category]?.imageUrl) summary.imageUrl = product.imageUrl;
      }
    }
  }

  for (const [chunk, rows] of productChunks) {
    const suffix = String(chunk).padStart(3, '0');
    writeJson(path.join(catalogDir, `products-${suffix}.json`), rows);
    writeJson(path.join(catalogDir, `search-index-${suffix}.json`), rows.map(product => indexByHandle.get(product.handle)));
  }
  if (fs.existsSync(fullIndexPath)) writeJson(fullIndexPath, fullIndex);
  writeJson(mapPath, productMap);
  if (categorySummary) writeJson(summaryPath, categorySummary);
  const dataVersion = `catalog-${createHash('sha256').update(JSON.stringify(allProducts.map(({ product }) => product))).digest('hex').slice(0, 16)}`;
  writeJson(manifestPath, { ...manifest, dataVersion, productCount: allProducts.length });

  const allChunkIndexes = [...productChunks.keys()].flatMap(chunk => readJson(path.join(catalogDir, `search-index-${String(chunk).padStart(3, '0')}.json`)));
  for (const product of ownerCatalogProducts) {
    assert.equal(allProducts.filter(row => row.product.handle === product.handle).length, 1, `Expected one owner product ${product.handle}`);
    assert.equal(allChunkIndexes.filter(row => row.handle === product.handle).length, 1, `Expected one indexed owner product ${product.handle}`);
    if (fs.existsSync(fullIndexPath)) assert.equal(fullIndex.filter(row => row.handle === product.handle).length, 1, `Expected one full-index owner product ${product.handle}`);
    assert.equal(productMap[product.handle], targetChunk, `Owner product ${product.handle} has an invalid product map entry`);
    for (const legacyHandle of product.legacyHandles || []) assert.equal(productMap[legacyHandle], undefined, `Legacy owner handle remains mapped: ${legacyHandle}`);
  }
  const added = ownerCatalogProducts.filter(product => !oldProducts.some(row => String(row.id) === String(product.id) || productHandles(product).includes(row.handle))).length;
  return { added, products: ownerCatalogProducts.length, chunk: targetChunk };
}

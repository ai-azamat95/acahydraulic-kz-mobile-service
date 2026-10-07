import assert from 'node:assert/strict';
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

function removeOwnerProducts(rows) {
  const ownerIds = new Set(ownerCatalogProducts.map(product => String(product.id)));
  const ownerHandles = new Set(ownerCatalogProducts.flatMap(productHandles));
  return rows.filter(row => !ownerIds.has(String(row.id)) && !ownerHandles.has(row.handle));
}

function toIndexProduct(product, chunk) {
  const { variants, ...indexProduct } = product;
  return { ...indexProduct, chunk };
}

export function applyOwnerCatalogProducts(catalogDir, { updateCategorySummary = true } = {}) {
  const manifestPath = path.join(catalogDir, 'manifest.json');
  const mapPath = path.join(catalogDir, 'product-map.json');
  const summaryPath = path.join(catalogDir, 'category-summary.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const productMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const categorySummary = updateCategorySummary
    ? JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
    : null;
  const existingHandles = new Set(Object.keys(productMap));
  const targetChunk = 1;
  const targetSuffix = String(targetChunk).padStart(3, '0');
  const productPath = path.join(catalogDir, `products-${targetSuffix}.json`);
  const indexChunkPath = path.join(catalogDir, `search-index-${targetSuffix}.json`);
  const fullIndexPath = path.join(catalogDir, 'search-index.json');

  const products = removeOwnerProducts(JSON.parse(fs.readFileSync(productPath, 'utf8')));
  const indexChunk = removeOwnerProducts(JSON.parse(fs.readFileSync(indexChunkPath, 'utf8')));
  const fullIndex = fs.existsSync(fullIndexPath)
    ? removeOwnerProducts(JSON.parse(fs.readFileSync(fullIndexPath, 'utf8')))
    : null;

  const insertedProducts = ownerCatalogProducts.map(product => ({ ...product, chunk: targetChunk }));
  const insertedIndex = ownerCatalogProducts.map(product => toIndexProduct(product, targetChunk));
  fs.writeFileSync(productPath, JSON.stringify([...insertedProducts, ...products]));
  fs.writeFileSync(indexChunkPath, JSON.stringify([...insertedIndex, ...indexChunk]));
  if (fullIndex) fs.writeFileSync(fullIndexPath, JSON.stringify([...insertedIndex, ...fullIndex]));

  let added = 0;
  for (const product of ownerCatalogProducts) {
    const alreadyPresent = productHandles(product).some(handle => existingHandles.has(handle));
    if (!alreadyPresent) added += 1;
    for (const legacyHandle of product.legacyHandles || []) delete productMap[legacyHandle];
    productMap[product.handle] = targetChunk;
    if (categorySummary) {
      for (const category of new Set(product.categories?.length ? product.categories : [product.category])) {
        const summary = categorySummary[category] || { count: 0, imageUrl: null };
        if (!alreadyPresent) summary.count += 1;
        summary.imageUrl ||= product.imageUrl;
        categorySummary[category] = summary;
      }
    }
  }
  manifest.productCount += added;
  fs.writeFileSync(mapPath, JSON.stringify(productMap));
  if (categorySummary) fs.writeFileSync(summaryPath, JSON.stringify(categorySummary));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));

  const representations = [
    JSON.parse(fs.readFileSync(productPath, 'utf8')),
    JSON.parse(fs.readFileSync(indexChunkPath, 'utf8')),
    ...(fullIndexPath && fs.existsSync(fullIndexPath) ? [JSON.parse(fs.readFileSync(fullIndexPath, 'utf8'))] : []),
  ];
  for (const product of ownerCatalogProducts) {
    for (const rows of representations) {
      assert.equal(rows.filter(row => row.handle === product.handle).length, 1, `Expected one owner product ${product.handle}`);
    }
    assert.equal(productMap[product.handle], targetChunk, `Owner product ${product.handle} has an invalid product map entry`);
  }
  return { added, products: ownerCatalogProducts.length, chunk: targetChunk };
}

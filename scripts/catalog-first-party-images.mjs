import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import phase2ProductCopy from '../shared/catalog-product-phase2-copy.json' with { type: 'json' };

export const priorityCatalogHandles = new Set(Object.keys(phase2ProductCopy));
export const priorityCatalogImagePublicRoot = '/catalog-assets/priority-products/';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeImageKey(key) {
  const normalized = path.posix.normalize(key);
  if (!key || normalized !== key || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    throw new Error(`Unsafe catalog image key: ${key}`);
  }
  return normalized;
}

export function managedCatalogImageKey(imageUrl, imageManifest) {
  if (typeof imageUrl !== 'string' || !imageUrl || imageUrl.startsWith('/')) return null;
  const baseUrl = new URL(`${imageManifest.imageBaseUrl.replace(/\/+$/, '')}/`);
  const parsed = new URL(imageUrl);
  const basePath = baseUrl.pathname;
  if (parsed.origin !== baseUrl.origin || !parsed.pathname.startsWith(basePath)) {
    throw new Error(`Priority catalog image is not in ACA-managed storage: ${imageUrl}`);
  }
  return safeImageKey(decodeURIComponent(parsed.pathname.slice(basePath.length)));
}

export function firstPartyCatalogImageUrl(imageUrl, imageManifest) {
  const key = managedCatalogImageKey(imageUrl, imageManifest);
  return key ? `${priorityCatalogImagePublicRoot}${key}` : imageUrl;
}

export function rewritePriorityProductImages(product, imageManifest) {
  if (!priorityCatalogHandles.has(product.handle)) return product;
  const imageUrl = firstPartyCatalogImageUrl(product.imageUrl, imageManifest);
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.map((image, index) => index === 0 ? imageUrl : image)
    : product.gallery;
  return {
    ...product,
    imageUrl,
    ...(gallery ? { gallery } : {}),
  };
}

function assetPath(assetRoot, key) {
  const root = path.resolve(assetRoot);
  const target = path.resolve(root, safeImageKey(key));
  if (!target.startsWith(`${root}${path.sep}`)) throw new Error(`Catalog image escapes asset root: ${key}`);
  return target;
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function representationFiles(catalogDir, manifest) {
  const files = [];
  for (let index = 1; index <= manifest.chunkCount; index += 1) {
    const suffix = String(index).padStart(3, '0');
    files.push(path.join(catalogDir, `products-${suffix}.json`));
    files.push(path.join(catalogDir, `search-index-${suffix}.json`));
  }
  const fullIndex = path.join(catalogDir, manifest.indexFile || 'search-index.json');
  if (fs.existsSync(fullIndex)) files.push(fullIndex);
  return files;
}

export function buildPriorityImagePlan({
  catalogDir = path.resolve('client/public/catalog-data'),
  assetRoot = path.resolve('client/public/catalog-assets/priority-products'),
  verifyAssets = true,
} = {}) {
  const manifest = readJson(path.join(catalogDir, 'manifest.json'));
  const imageManifest = readJson(path.join(catalogDir, manifest.imageManifestFile || 'catalog-image-manifest.json'));
  const integrityByKey = new Map(imageManifest.entries.map(entry => [entry.key, entry]));
  const selectedProducts = new Map();
  const remoteAssets = new Map();
  const productFiles = Array.from({ length: manifest.chunkCount }, (_, index) =>
    path.join(catalogDir, `products-${String(index + 1).padStart(3, '0')}.json`));

  for (const file of productFiles) {
    for (const product of readJson(file)) {
      if (!priorityCatalogHandles.has(product.handle)) continue;
      selectedProducts.set(product.handle, product);
      const images = [product.imageUrl].filter(Boolean);
      for (const imageUrl of images) {
        const key = managedCatalogImageKey(imageUrl, imageManifest);
        if (!key) continue;
        const integrity = integrityByKey.get(key);
        if (!integrity) throw new Error(`Missing integrity entry for priority image: ${key}`);
        remoteAssets.set(key, {
          key,
          sourceUrl: new URL(key, `${imageManifest.imageBaseUrl.replace(/\/+$/, '')}/`).href,
          publicUrl: `${priorityCatalogImagePublicRoot}${key}`,
          filePath: assetPath(assetRoot, key),
          bytes: integrity.bytes,
          contentHash: integrity.contentHash,
          contentType: integrity.contentType,
        });
      }
    }
  }

  const missingHandles = [...priorityCatalogHandles].filter(handle => !selectedProducts.has(handle));
  if (missingHandles.length) throw new Error(`Missing priority catalog products: ${missingHandles.join(', ')}`);

  if (verifyAssets) {
    for (const asset of remoteAssets.values()) {
      if (!fs.existsSync(asset.filePath)) throw new Error(`Missing first-party catalog image: ${asset.filePath}`);
      const stats = fs.statSync(asset.filePath);
      if (stats.size !== asset.bytes) throw new Error(`Unexpected byte size for ${asset.key}: ${stats.size} != ${asset.bytes}`);
      const hash = sha256(asset.filePath);
      if (hash !== asset.contentHash) throw new Error(`Unexpected SHA-256 for ${asset.key}: ${hash}`);
    }
  }

  return {
    manifest,
    imageManifest,
    selectedProducts,
    remoteAssets,
    totalBytes: [...remoteAssets.values()].reduce((sum, asset) => sum + asset.bytes, 0),
  };
}

export function applyPriorityCatalogImages({
  catalogDir = path.resolve('dist/public/catalog-data'),
  assetRoot = path.resolve('dist/public/catalog-assets/priority-products'),
} = {}) {
  const plan = buildPriorityImagePlan({ catalogDir, assetRoot, verifyAssets: true });
  const remoteToLocal = new Map([...plan.remoteAssets.values()].map(asset => [asset.sourceUrl, asset.publicUrl]));
  let rewrittenRows = 0;
  let rewrittenReferences = 0;

  for (const file of representationFiles(catalogDir, plan.manifest)) {
    const rows = readJson(file);
    let changed = false;
    const rewritten = rows.map(product => {
      if (!priorityCatalogHandles.has(product.handle)) return product;
      const before = JSON.stringify([product.imageUrl, product.gallery]);
      const next = rewritePriorityProductImages(product, plan.imageManifest);
      const after = JSON.stringify([next.imageUrl, next.gallery]);
      if (before !== after) {
        changed = true;
        rewrittenRows += 1;
        rewrittenReferences += [next.imageUrl, ...(next.gallery || [])]
          .filter(value => typeof value === 'string' && value.startsWith(priorityCatalogImagePublicRoot)).length;
      }
      return next;
    });
    if (changed) fs.writeFileSync(file, JSON.stringify(rewritten));
  }

  const summaryPath = path.join(catalogDir, plan.manifest.categorySummaryFile || 'category-summary.json');
  if (fs.existsSync(summaryPath)) {
    const summary = readJson(summaryPath);
    let changed = false;
    for (const value of Object.values(summary)) {
      if (typeof value?.imageUrl !== 'string') continue;
      const replacement = remoteToLocal.get(value.imageUrl);
      if (!replacement) continue;
      value.imageUrl = replacement;
      changed = true;
    }
    if (changed) fs.writeFileSync(summaryPath, JSON.stringify(summary));
  }

  return {
    products: plan.selectedProducts.size,
    assets: plan.remoteAssets.size,
    bytes: plan.totalBytes,
    rewrittenRows,
    rewrittenReferences,
  };
}

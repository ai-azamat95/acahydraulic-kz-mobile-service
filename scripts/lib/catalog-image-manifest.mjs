import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  const body = JSON.stringify(value);
  if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8') !== body) fs.writeFileSync(filePath, body);
}

export function catalogManagedImageKey(imageUrl, imageBaseUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl || imageUrl.startsWith('/')) return null;
  const base = new URL(imageBaseUrl);
  const basePath = `${base.pathname.replace(/\/+$/, '')}/`;
  const image = new URL(imageUrl);
  if (image.origin !== base.origin || !image.pathname.startsWith(basePath)) return null;
  return decodeURIComponent(image.pathname.slice(basePath.length));
}

export function reconcileCatalogImageManifest(catalogDir) {
  const manifestPath = path.join(catalogDir, 'manifest.json');
  const manifest = readJson(manifestPath);
  if (!manifest.imageManifestFile || !manifest.imageBaseUrl) return { reconciled: false, removed: 0 };

  const imageManifestPath = path.join(catalogDir, manifest.imageManifestFile);
  assert(fs.existsSync(imageManifestPath), `Missing catalogue image manifest: ${manifest.imageManifestFile}`);
  const imageManifest = readJson(imageManifestPath);
  assert.equal(imageManifest.imageBaseUrl, manifest.imageBaseUrl, 'Catalogue and image manifest base URLs must match');
  const referencedKeys = new Set();

  for (let page = 1; page <= manifest.chunkCount; page += 1) {
    const fileName = `products-${String(page).padStart(3, '0')}.json`;
    const products = readJson(path.join(catalogDir, fileName));
    for (const product of products) {
      for (const imageUrl of [product.imageUrl, ...(product.gallery || [])]) {
        const key = catalogManagedImageKey(imageUrl, manifest.imageBaseUrl);
        if (key) referencedKeys.add(key);
      }
    }
  }

  const entriesByKey = new Map(imageManifest.entries.map(entry => [entry.key, entry]));
  assert.equal(entriesByKey.size, imageManifest.entries.length, 'Catalogue image manifest keys must be unique');
  const missing = [...referencedKeys].filter(key => !entriesByKey.has(key));
  assert.deepEqual(missing, [], `Catalogue image manifest is missing referenced images: ${missing.slice(0, 10).join(', ')}`);

  const entries = imageManifest.entries.filter(entry => referencedKeys.has(entry.key));
  const nextImageManifest = {
    ...imageManifest,
    productCount: new Set(entries.map(entry => String(entry.productId))).size,
    imageCount: entries.length,
    totalBytes: entries.reduce((total, entry) => total + entry.bytes, 0),
    entries,
  };
  const nextManifest = {
    ...manifest,
    mirroredImageCount: nextImageManifest.imageCount,
    mirroredProductCount: nextImageManifest.productCount,
  };

  writeJson(imageManifestPath, nextImageManifest);
  writeJson(manifestPath, nextManifest);
  return {
    reconciled: true,
    removed: imageManifest.entries.length - entries.length,
    imageCount: nextImageManifest.imageCount,
    productCount: nextImageManifest.productCount,
    totalBytes: nextImageManifest.totalBytes,
  };
}

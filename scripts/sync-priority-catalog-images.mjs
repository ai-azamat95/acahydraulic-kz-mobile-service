import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { buildPriorityImagePlan } from './catalog-first-party-images.mjs';

const checkOnly = process.argv.includes('--check');
const prune = process.argv.includes('--prune');
const concurrency = 12;
const assetRoot = path.resolve(
  process.env.CATALOG_PRIORITY_IMAGE_ASSET_DIR || 'client/public/catalog-assets/priority-products',
);
const sourceRoot = process.env.CATALOG_PRIORITY_IMAGE_SOURCE_DIR
  ? path.resolve(process.env.CATALOG_PRIORITY_IMAGE_SOURCE_DIR)
  : null;

function validAsset(asset) {
  if (!fs.existsSync(asset.filePath)) return false;
  const contents = fs.readFileSync(asset.filePath);
  return contents.length === asset.bytes
    && crypto.createHash('sha256').update(contents).digest('hex') === asset.contentHash;
}

function sourceFile(asset) {
  if (!sourceRoot) return null;
  const filePath = path.resolve(sourceRoot, asset.key);
  if (!filePath.startsWith(`${sourceRoot}${path.sep}`)) {
    throw new Error(`Priority image escapes source root: ${asset.key}`);
  }
  return filePath;
}

function validateContents(asset, contents) {
  const hash = crypto.createHash('sha256').update(contents).digest('hex');
  if (contents.length !== asset.bytes) throw new Error(`Image byte mismatch: ${asset.key}`);
  if (hash !== asset.contentHash) throw new Error(`Image SHA-256 mismatch: ${asset.key}`);
}

async function syncAsset(asset) {
  if (validAsset(asset)) return 'unchanged';
  let contents;
  let result;
  const localSource = sourceFile(asset);
  if (localSource) {
    if (!fs.existsSync(localSource)) throw new Error(`Priority image missing from ACA storage checkout: ${asset.key}`);
    contents = fs.readFileSync(localSource);
    result = 'copied';
  } else {
    const response = await fetch(asset.sourceUrl, { headers: { accept: 'image/webp,image/*' } });
    if (!response.ok) throw new Error(`Image download failed: ${response.status} ${asset.sourceUrl}`);
    contents = Buffer.from(await response.arrayBuffer());
    result = 'downloaded';
  }
  validateContents(asset, contents);
  fs.mkdirSync(path.dirname(asset.filePath), { recursive: true });
  const temporary = `${asset.filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, contents);
  fs.renameSync(temporary, asset.filePath);
  return result;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(item) : [item];
  });
}

function removeEmptyDirectories(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirectories(path.join(directory, entry.name));
  }
  if (directory !== assetRoot && fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
}

if (checkOnly) {
  const plan = buildPriorityImagePlan({ assetRoot, verifyAssets: true });
  console.log(JSON.stringify({ checked: true, products: plan.selectedProducts.size, assets: plan.remoteAssets.size, bytes: plan.totalBytes }, null, 2));
} else {
  const plan = buildPriorityImagePlan({ assetRoot, verifyAssets: false });
  const assets = [...plan.remoteAssets.values()];
  let cursor = 0;
  let downloaded = 0;
  let copied = 0;
  let unchanged = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < assets.length) {
      const asset = assets[cursor];
      cursor += 1;
      const result = await syncAsset(asset);
      if (result === 'downloaded') downloaded += 1;
      else if (result === 'copied') copied += 1;
      else unchanged += 1;
    }
  }));
  let pruned = 0;
  if (prune) {
    const expected = new Set(assets.map(asset => path.resolve(asset.filePath)));
    for (const file of walkFiles(assetRoot)) {
      if (expected.has(path.resolve(file))) continue;
      fs.unlinkSync(file);
      pruned += 1;
    }
    removeEmptyDirectories(assetRoot);
  }
  buildPriorityImagePlan({ assetRoot, verifyAssets: true });
  console.log(JSON.stringify({
    products: plan.selectedProducts.size,
    assets: assets.length,
    source: sourceRoot ? 'aca-storage-checkout' : 'aca-storage-url',
    downloaded,
    copied,
    unchanged,
    pruned,
    bytes: plan.totalBytes,
  }, null, 2));
}

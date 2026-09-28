import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { rebuildCatalogImageManifest } from '../scripts/rebuild-catalog-image-manifest.mjs';

test('rebuilds changed image hashes and supports an integrity-only check', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-image-manifest-'));
  const imageDir = path.join(directory, 'images');
  const imagePath = path.join(imageDir, 'catalog/v2/1/01-example.webp');
  const manifestPath = path.join(directory, 'manifest.json');
  const copyPath = path.join(directory, 'copy.json');
  fs.mkdirSync(path.dirname(imagePath), { recursive: true });
  fs.writeFileSync(imagePath, 'clean-real-image');
  fs.writeFileSync(manifestPath, JSON.stringify({
    generatedAt: '2026-01-01T00:00:00.000Z',
    totalBytes: 1,
    entries: [{ key: 'catalog/v2/1/01-example.webp', bytes: 1, contentHash: 'old' }],
  }));

  const rebuilt = rebuildCatalogImageManifest({ manifestPath, imageDir, copyTo: [copyPath] });
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(rebuilt.changed, 1);
  assert.equal(manifest.entries[0].bytes, Buffer.byteLength('clean-real-image'));
  assert.equal(manifest.entries[0].contentHash, crypto.createHash('sha256').update('clean-real-image').digest('hex'));
  assert.deepEqual(JSON.parse(fs.readFileSync(copyPath, 'utf8')), manifest);
  assert.equal(rebuildCatalogImageManifest({ manifestPath, imageDir, check: true }).changed, 0);
});

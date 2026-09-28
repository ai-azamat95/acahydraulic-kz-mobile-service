import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  const descriptor = fs.openSync(filePath, 'r');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    let bytesRead = 0;
    do {
      bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, null);
      if (bytesRead) hash.update(buffer.subarray(0, bytesRead));
    } while (bytesRead);
  } finally {
    fs.closeSync(descriptor);
  }
  return hash.digest('hex');
}

function atomicWriteJson(filePath, value) {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value)}\n`);
  fs.renameSync(temporaryPath, filePath);
}

export function rebuildCatalogImageManifest({ manifestPath, imageDir, copyTo = [], check = false }) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const mismatches = [];
  let totalBytes = 0;

  for (const entry of manifest.entries) {
    const filePath = path.join(imageDir, entry.key);
    if (!fs.existsSync(filePath)) {
      mismatches.push({ key: entry.key, reason: 'missing' });
      continue;
    }
    const bytes = fs.statSync(filePath).size;
    const contentHash = sha256File(filePath);
    totalBytes += bytes;
    if (entry.bytes !== bytes || entry.contentHash !== contentHash) {
      mismatches.push({ key: entry.key, reason: 'content', beforeBytes: entry.bytes, bytes });
      if (!check) {
        entry.bytes = bytes;
        entry.contentHash = contentHash;
        entry.contentType = 'image/webp';
      }
    }
  }

  if (check) {
    if (mismatches.length) {
      throw new Error(`Image manifest integrity failed for ${mismatches.length} files: ${mismatches.slice(0, 10).map(item => item.key).join(', ')}`);
    }
    if (manifest.totalBytes !== totalBytes) {
      throw new Error(`Image manifest totalBytes mismatch: expected ${manifest.totalBytes}, found ${totalBytes}`);
    }
    return { imageCount: manifest.entries.length, totalBytes, changed: 0 };
  }

  if (mismatches.some(item => item.reason === 'missing')) {
    throw new Error(`Cannot rebuild image manifest with missing files: ${mismatches.filter(item => item.reason === 'missing').slice(0, 10).map(item => item.key).join(', ')}`);
  }

  manifest.generatedAt = new Date().toISOString();
  manifest.totalBytes = totalBytes;
  atomicWriteJson(manifestPath, manifest);
  for (const target of copyTo) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(manifestPath, target);
  }

  return { imageCount: manifest.entries.length, totalBytes, changed: mismatches.length };
}

function parseArguments(argv) {
  const options = { copyTo: [], check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--check') {
      options.check = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${argument}`);
    if (argument === '--manifest') options.manifestPath = path.resolve(value);
    else if (argument === '--image-dir') options.imageDir = path.resolve(value);
    else if (argument === '--copy-to') options.copyTo.push(path.resolve(value));
    else throw new Error(`Unknown argument: ${argument}`);
    index += 1;
  }
  if (!options.manifestPath || !options.imageDir) {
    throw new Error('Usage: node scripts/rebuild-catalog-image-manifest.mjs --manifest FILE --image-dir DIR [--copy-to FILE] [--check]');
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = rebuildCatalogImageManifest(parseArguments(process.argv.slice(2)));
  console.log(JSON.stringify({ passed: true, ...result }, null, 2));
}

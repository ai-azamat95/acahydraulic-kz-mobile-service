import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function deterministicSample(entries, size) {
  if (entries.length <= size) return entries;
  const selected = [];
  for (let index = 0; index < size; index += 1) {
    selected.push(entries[Math.floor(index * (entries.length - 1) / (size - 1))]);
  }
  return selected;
}

async function fetchImage(url, timeoutMs) {
  const response = await fetch(url, {
    headers: { Range: 'bytes=0-0', 'User-Agent': 'ACA-catalog-integrity-monitor/1.0' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  await response.arrayBuffer();
}

export async function checkCatalogImageAvailability({ manifestPath, sampleSize = 96, concurrency = 8, timeoutMs = 15_000 }) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entries = deterministicSample(manifest.entries, Math.max(2, sampleSize));
  const failures = [];
  let cursor = 0;

  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor];
      cursor += 1;
      const url = new URL(entry.key, `${manifest.imageBaseUrl.replace(/\/+$/, '')}/`).href;
      try {
        await fetchImage(url, timeoutMs);
      } catch (error) {
        failures.push({ key: entry.key, url, error: String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, () => worker()));
  assert.deepEqual(failures, [], `catalogue image availability failed: ${JSON.stringify(failures.slice(0, 10))}`);
  return { checked: entries.length, total: manifest.entries.length, failures: 0 };
}

function parseArguments(argv) {
  const options = {
    manifestPath: path.resolve('client/public/catalog-data/catalog-image-manifest.json'),
    sampleSize: 96,
    concurrency: 8,
    timeoutMs: 15_000,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${argument}`);
    if (argument === '--manifest') options.manifestPath = path.resolve(value);
    else if (argument === '--sample-size') options.sampleSize = Number(value);
    else if (argument === '--concurrency') options.concurrency = Number(value);
    else if (argument === '--timeout-ms') options.timeoutMs = Number(value);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkCatalogImageAvailability(parseArguments(process.argv.slice(2)));
  console.log(JSON.stringify({ passed: true, ...result }, null, 2));
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const publicKeys = new Set([
  'id', 'slug', 'sku', 'title', 'brand', 'category', 'oem', 'machineModels',
  'description', 'image', 'priceKzt', 'availability', 'featured', 'isDemo',
]);

// Importer records stay internal. Only explicitly public fields enter Vite.
// The approved retail price is copied as-is; no pricing calculation runs here.
export function legacyPublicProducts(rows) {
  assert(Array.isArray(rows), 'Legacy catalogue input must be an array');
  return rows.map(row => Object.fromEntries(Object.entries(row).filter(([key]) => publicKeys.has(key))));
}

export function prepareLegacyPublicCatalog() {
  const rows = JSON.parse(fs.readFileSync('client/src/data/catalog.generated.json', 'utf8'));
  const publicFile = 'client/src/data/catalog.public.json';
  const json = JSON.stringify(legacyPublicProducts(rows), null, 2) + '\n';
  if (!fs.existsSync(publicFile) || fs.readFileSync(publicFile, 'utf8') !== json) fs.writeFileSync(publicFile, json);
  console.log(JSON.stringify({ legacyPublicCatalog: true, products: rows.length }));
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) prepareLegacyPublicCatalog();

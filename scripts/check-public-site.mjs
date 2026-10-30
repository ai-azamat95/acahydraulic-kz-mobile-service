import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { scanPublicSupplierDirectory } from './lib/public-supplier-guard.mjs';

const publicDir = path.resolve(process.argv[2] || 'dist/public');
assert(fs.existsSync(publicDir), `public build directory is missing: ${publicDir}`);
const { filesChecked, failures } = scanPublicSupplierDirectory(publicDir);
assert.deepEqual(failures, [], `private supplier data leaked into the published site: ${JSON.stringify(failures.slice(0, 20))}`);
console.log(JSON.stringify({ passed: true, filesChecked, supplierBrandOccurrences: 0, sensitiveSupplierFields: 0 }, null, 2));

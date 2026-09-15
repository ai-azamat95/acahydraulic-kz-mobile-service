import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve(process.argv[2] || 'dist/public');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);
const forbiddenPatterns = [
  { label: 'supplier brand', pattern: /sinocmp/i },
  { label: 'supplier URL field', pattern: /["']sourceUrl["']/ },
  { label: 'supplier price field', pattern: /["']sourcePriceKzt["']/ },
  { label: 'supplier update field', pattern: /["']sourceUpdatedAt["']/ },
];
const failures = [];
let filesChecked = 0;

function scanDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(target);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    filesChecked += 1;
    const value = fs.readFileSync(target, 'utf8');
    for (const { label, pattern } of forbiddenPatterns) {
      if (pattern.test(value)) failures.push({ file: path.relative(publicDir, target), reason: label });
      pattern.lastIndex = 0;
    }
  }
}

assert(fs.existsSync(publicDir), `public build directory is missing: ${publicDir}`);
scanDirectory(publicDir);
assert.deepEqual(failures, [], `private supplier identity leaked into the published site: ${JSON.stringify(failures.slice(0, 20))}`);
console.log(JSON.stringify({ passed: true, filesChecked, supplierBrandOccurrences: 0, sensitiveSupplierFields: 0 }, null, 2));

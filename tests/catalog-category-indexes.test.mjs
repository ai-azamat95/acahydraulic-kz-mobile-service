import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createCategorySearchIndexes } from '../scripts/lib/catalog-category-indexes.mjs';

test('category search indexes contain only products from the requested catalogue section', () => {
  const catalogDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-category-index-'));
  fs.writeFileSync(path.join(catalogDir, 'search-index.json'), JSON.stringify([
    { id: 'pump', category: 'hydraulic-pumps', categories: ['hydraulic-pumps'] },
    { id: 'injector', category: 'engine-fuel', categories: ['engine-fuel', 'fuel-injectors'] },
  ]));
  fs.mkdirSync(path.join(catalogDir, 'category-indexes'));
  fs.writeFileSync(path.join(catalogDir, 'category-indexes', 'stale.json'), '[]');

  const result = createCategorySearchIndexes({ catalogDir });

  assert.deepEqual(result.files, {
    'engine-fuel': 'category-indexes/engine-fuel.json',
    'fuel-injectors': 'category-indexes/fuel-injectors.json',
    'hydraulic-pumps': 'category-indexes/hydraulic-pumps.json',
  });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(catalogDir, result.files['hydraulic-pumps']), 'utf8')).map(row => row.id), ['pump']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(catalogDir, result.files['fuel-injectors']), 'utf8')).map(row => row.id), ['injector']);
  assert.equal(fs.existsSync(path.join(catalogDir, 'category-indexes', 'stale.json')), false);
});

test('unsafe category ids cannot become public file paths', () => {
  const catalogDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-category-index-'));
  fs.writeFileSync(path.join(catalogDir, 'search-index.json'), JSON.stringify([
    { id: 'bad', category: '../private' },
  ]));
  assert.throws(() => createCategorySearchIndexes({ catalogDir }), /Unsafe catalogue category id/);
});

import fs from 'node:fs';
import path from 'node:path';

const SAFE_CATEGORY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createCategorySearchIndexes({
  catalogDir,
  indexFile = 'search-index.json',
  directory = 'category-indexes',
}) {
  const sourcePath = path.join(catalogDir, indexFile);
  if (!fs.existsSync(sourcePath)) throw new Error(`Catalog search index is missing: ${sourcePath}`);

  const products = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  if (!Array.isArray(products)) throw new Error('Catalog search index must be an array');

  const grouped = new Map();
  for (const product of products) {
    const categories = new Set(product.categories?.length ? product.categories : [product.category]);
    for (const categoryId of categories) {
      if (!SAFE_CATEGORY_ID.test(categoryId || '')) {
        throw new Error(`Unsafe catalogue category id: ${String(categoryId)}`);
      }
      const rows = grouped.get(categoryId) || [];
      rows.push(product);
      grouped.set(categoryId, rows);
    }
  }

  const outputDir = path.join(catalogDir, directory);
  fs.mkdirSync(outputDir, { recursive: true });
  const expectedFiles = new Set([...grouped.keys()].map(categoryId => `${categoryId}.json`));
  for (const fileName of fs.readdirSync(outputDir)) {
    if (fileName.endsWith('.json') && !expectedFiles.has(fileName)) {
      fs.unlinkSync(path.join(outputDir, fileName));
    }
  }

  const files = {};
  const counts = {};
  let totalBytes = 0;
  for (const categoryId of [...grouped.keys()].sort()) {
    const relativePath = `${directory}/${categoryId}.json`;
    const body = JSON.stringify(grouped.get(categoryId));
    fs.writeFileSync(path.join(catalogDir, relativePath), body);
    files[categoryId] = relativePath;
    counts[categoryId] = grouped.get(categoryId).length;
    totalBytes += Buffer.byteLength(body);
  }

  return { files, counts, totalBytes };
}

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { correctCatalogProductCategories } from '../shared/catalog-category-corrections.mjs';

// Apply after the existing price/owner/supplier preparation. Only taxonomy
// fields change; preserve every identity, price, image and commercial field.
export function applyCatalogCategoryCorrections(catalogDir) {
  const manifestPath = path.join(catalogDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const products = [];
  const changedIds = [];
  const write = (file, data) => fs.writeFileSync(path.join(catalogDir, file), JSON.stringify(data));
  const correctRows = (rows, collect = false) => {
    let changed = false;
    const corrected = rows.map(product => {
      const next = correctCatalogProductCategories(product);
      if (next !== product) {
        changed = true;
        if (collect) changedIds.push(String(product.id));
      }
      return next;
    });
    return { corrected, changed };
  };

  for (let page = 1; page <= manifest.chunkCount; page += 1) {
    const suffix = String(page).padStart(3, '0');
    const file = `products-${suffix}.json`;
    const result = correctRows(JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')), true);
    products.push(...result.corrected);
    if (result.changed) write(file, result.corrected);
    const index = `search-index-${suffix}.json`;
    const indexResult = correctRows(JSON.parse(fs.readFileSync(path.join(catalogDir, index), 'utf8')));
    if (indexResult.changed) write(index, indexResult.corrected);
  }
  const indexFile = manifest.indexFile || 'search-index.json';
  const indexResult = correctRows(JSON.parse(fs.readFileSync(path.join(catalogDir, indexFile), 'utf8')));
  if (indexResult.changed) write(indexFile, indexResult.corrected);

  if (changedIds.length) {
    const summaryFile = manifest.categorySummaryFile || 'category-summary.json';
    const oldSummary = JSON.parse(fs.readFileSync(path.join(catalogDir, summaryFile), 'utf8'));
    const summary = Object.fromEntries(Object.entries(oldSummary).map(([id, value]) => [id, { ...value, count: 0, imageUrl: null }]));
    for (const product of products) {
      for (const category of new Set(product.categories?.length ? product.categories : [product.category])) {
        const item = summary[category] ||= { count: 0, imageUrl: null };
        item.count += 1;
        item.imageUrl ||= product.imageUrl || null;
        if (product.imageUrl && product.imageUrl === oldSummary[category]?.imageUrl) item.imageUrl = product.imageUrl;
      }
    }
    write(summaryFile, summary);
    write('manifest.json', { ...manifest,
      dataVersion: `catalog-${createHash('sha256').update(JSON.stringify(products)).digest('hex').slice(0, 16)}` });
  }
  return { changed: changedIds.length, ids: changedIds };
}

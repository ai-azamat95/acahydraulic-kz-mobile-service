import path from 'node:path';

import { applyPriorityCatalogImages } from './catalog-first-party-images.mjs';

const publicDir = path.resolve(process.argv[2] || 'dist/public');
const result = applyPriorityCatalogImages({
  catalogDir: path.join(publicDir, 'catalog-data'),
  assetRoot: path.join(publicDir, 'catalog-assets', 'priority-products'),
});

console.log(JSON.stringify({ applied: true, publicDir, ...result }, null, 2));

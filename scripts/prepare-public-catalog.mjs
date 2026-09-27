import fs from 'node:fs';
import { applyOwnerCatalogSales } from './catalog-owner-sales.mjs';
import { applyOwnerCatalogProducts } from './catalog-owner-products.mjs';
import path from 'node:path';
import { applyApprovedCatalogPrices } from './catalog-approved-prices.mjs';

const catalogDir = path.resolve('client/public/catalog-data');
const manifestPath = path.join(catalogDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error('Catalog manifest is missing. Run the catalogue import first.');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const approvedPrices = applyApprovedCatalogPrices(catalogDir);
applyOwnerCatalogSales(catalogDir);
const ownerProducts = applyOwnerCatalogProducts(catalogDir);
const preparedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const privateFiles = [manifest.catalogAuditFile, manifest.pumpAuditFile, manifest.strictCategoryAuditFile].filter(Boolean);

for (const fileName of privateFiles) {
  const filePath = path.join(catalogDir, fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

const publicManifest = {
  importedAt: preparedManifest.importedAt,
  productCount: preparedManifest.productCount,
  pageSize: preparedManifest.pageSize,
  chunkCount: preparedManifest.chunkCount,
  currency: preparedManifest.currency,
  indexFile: preparedManifest.indexFile,
  categorySummaryFile: preparedManifest.categorySummaryFile,
  imagePolicy: preparedManifest.imagePolicy,
};

fs.writeFileSync(manifestPath, JSON.stringify(publicManifest));
console.log(JSON.stringify({ prepared: true, approvedPrices, ownerProducts, removedPrivateFiles: privateFiles, manifestFields: Object.keys(publicManifest) }, null, 2));

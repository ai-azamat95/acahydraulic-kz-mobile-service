import fs from 'node:fs';
import { applyOwnerCatalogSales } from './catalog-owner-sales.mjs';
import { applyOwnerCatalogProducts } from './catalog-owner-products.mjs';
import { applySupplierCatalogProducts } from './catalog-supplier-products.mjs';
import { createCategorySearchIndexes } from './lib/catalog-category-indexes.mjs';
import path from 'node:path';
import { applyApprovedCatalogPrices } from './catalog-approved-prices.mjs';
import { applyCatalogCategoryCorrections } from './catalog-category-corrections.mjs';

const catalogDir = path.resolve(process.env.CATALOG_DIR || 'client/public/catalog-data');
const manifestPath = path.join(catalogDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error('Catalog manifest is missing. Run the catalogue import first.');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const approvedPrices = applyApprovedCatalogPrices(catalogDir);
applyOwnerCatalogSales(catalogDir);
const ownerProducts = applyOwnerCatalogProducts(catalogDir);
const supplierProducts = applySupplierCatalogProducts(catalogDir);
const categoryCorrections = applyCatalogCategoryCorrections(catalogDir);
const preparedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const categoryIndexes = createCategorySearchIndexes({
  catalogDir,
  indexFile: preparedManifest.indexFile || 'search-index.json',
});
const privateFiles = [
  manifest.catalogAuditFile,
  manifest.pumpAuditFile,
  manifest.strictCategoryAuditFile,
  manifest.controllerAuditFile,
  manifest.monitorAuditFile,
  manifest.wiringHarnessAuditFile,
].filter(Boolean);

for (const fileName of privateFiles) {
  const filePath = path.join(catalogDir, fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

const publicManifest = {
  importedAt: preparedManifest.importedAt,
  dataVersion: preparedManifest.dataVersion || preparedManifest.importedAt,
  productCount: preparedManifest.productCount,
  pageSize: preparedManifest.pageSize,
  chunkCount: preparedManifest.chunkCount,
  currency: preparedManifest.currency,
  indexFile: preparedManifest.indexFile,
  categorySummaryFile: preparedManifest.categorySummaryFile,
  categoryIndexFiles: categoryIndexes.files,
  imageBaseUrl: preparedManifest.imageBaseUrl,
  imageManifestFile: preparedManifest.imageManifestFile,
  imageOwnership: preparedManifest.imageOwnership,
  mirroredImageCount: preparedManifest.mirroredImageCount,
  mirroredProductCount: preparedManifest.mirroredProductCount,
  imagePolicy: preparedManifest.imagePolicy,
};

fs.writeFileSync(manifestPath, JSON.stringify(publicManifest));
console.log(JSON.stringify({ prepared: true, approvedPrices, ownerProducts, supplierProducts, categoryCorrections, categoryIndexes: { categories: Object.keys(categoryIndexes.files).length, totalBytes: categoryIndexes.totalBytes }, removedPrivateFiles: privateFiles, manifestFields: Object.keys(publicManifest) }, null, 2));

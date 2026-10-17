import ledger from './catalog-category-corrections.json' with { type: 'json' };

export const catalogCategoryCorrections = ledger.corrections;
export const deferredCatalogCategoryCorrections = ledger.deferred;

export function catalogCategoryCorrection(id) {
  return Object.hasOwn(catalogCategoryCorrections, String(id)) ? catalogCategoryCorrections[String(id)] : undefined;
}

// Deliberately ID-scoped: supplier tags must not reclassify any other product.
export function correctCatalogProductCategories(product) {
  const correction = catalogCategoryCorrection(product.id);
  if (!correction || (product.category === correction.category &&
    JSON.stringify(product.categories) === JSON.stringify(correction.categories))) return product;
  return { ...product, category: correction.category, categories: [...correction.categories] };
}

export function reviewedCategorySourceProducts(category, original, collections) {
  const products = new Map();
  for (const product of original) {
    const correction = catalogCategoryCorrection(product.id);
    if (!correction || correction.categories.includes(category)) products.set(String(product.id), product);
  }
  for (const collection of collections) {
    for (const product of collection.products || []) {
      if (catalogCategoryCorrection(product.id)?.categories.includes(category)) products.set(String(product.id), product);
    }
  }
  return [...products.values()];
}

export function reviewedPumpSourceProducts(pumpCollections, legacyCategory) {
  const handles = { 'hydraulic-pumps': 'hydraulic-pump-assembly', 'gear-pumps': 'gear-pump', 'piston-pumps': 'piston-pump' };
  const products = new Map();
  const collections = Object.fromEntries(Object.values(handles).map(handle => [handle, 0]));
  for (const [, rows] of pumpCollections) {
    for (const product of rows) {
      const id = String(product.id);
      const category = catalogCategoryCorrection(id)?.category || legacyCategory(product);
      if (!handles[category] || products.has(id)) continue;
      products.set(id, product);
      collections[handles[category]] += 1;
    }
  }
  return { products: [...products.values()], collections,
    sourceCollections: Object.fromEntries(pumpCollections.map(([handle, rows]) => [handle, rows.length])) };
}

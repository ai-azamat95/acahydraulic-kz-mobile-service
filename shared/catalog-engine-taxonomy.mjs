import mapping from './catalog-engine-taxonomy.json' with { type: 'json' };
const reviewed = new Map(mapping.map(row => [String(row.id), row]));
const children = new Set(['fuel-injectors', 'fuel-pumps', 'turbochargers', 'air-compressors']);
// Reviewed IDs only: neither fitment mentions nor generic pump tags classify a product.
export function correctEngineTaxonomy(product) {
  const row = reviewed.get(String(product.id));
  if (!row) return product;
  const categories = [...new Set([
    ...(product.categories?.length ? product.categories : [product.category]).filter(c => (!children.has(c) || c === row.destination) && !(row.destination === 'air-compressors' && c === 'air-conditioning')),
    'engine-fuel', ...(row.destination ? [row.destination] : []),
  ])];
  const category = row.destination === 'air-compressors' ? 'air-compressors' : children.has(product.category) && product.category !== row.destination
    ? 'engine-fuel' : product.category;
  if (category === product.category && JSON.stringify(categories) === JSON.stringify(product.categories)) return product;
  return { ...product, category, categories };
}

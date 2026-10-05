// Use only published, non-empty model landings. Grouping does not assert fitment.
export function groupCatalogModels(models) {
  const groups = new Map();
  for (const model of models) {
    if (!(model.count > 0)) continue;
    const group = groups.get(model.brand) || [];
    group.push(model);
    groups.set(model.brand, group);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([brand, items]) => ({
    brand,
    models: [...items].sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true })),
  }));
}

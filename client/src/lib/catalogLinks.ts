export function catalogSearchHref(query: string, category?: string) {
  const path = category ? `/catalog/category/${encodeURIComponent(category)}` : "/catalog";
  return query.trim() ? `${path}?q=${encodeURIComponent(query.trim())}` : path;
}

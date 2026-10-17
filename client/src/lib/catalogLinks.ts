export function catalogSearchHref(query: string, category?: string) {
  const path = category ? `/catalog/category/${encodeURIComponent(category)}` : "/catalog";
  return query.trim() ? `${path}?q=${encodeURIComponent(query.trim())}` : path;
}

export function catalogBrandFilterHref(
  brandSlug: string,
  query = "",
  category = ""
) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (category) params.set("category", category);
  const suffix = params.toString();
  return `/catalog/brand/${encodeURIComponent(brandSlug)}/${suffix ? `?${suffix}` : ""}`;
}

export function catalogCategoryParam(search: string) {
  return new URLSearchParams(search).get("category") || "";
}

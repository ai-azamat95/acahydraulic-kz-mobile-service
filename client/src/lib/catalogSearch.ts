import type { CatalogIndexProduct } from "@/types/catalog";

const aliases: [RegExp, string][] = [
  [/(^|[^a-z0-9\u0400-\u04ff])гидронасос[а-я]*(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1hydraulic pump"],
  [/(^|[^a-z0-9\u0400-\u04ff])насос[а-я]*(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1pump"],
  [/(^|[^a-z0-9\u0400-\u04ff])(cat|кат|катерпиллар)(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1caterpillar"],
  [/(^|[^a-z0-9\u0400-\u04ff])(комацу|коматсу)(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1komatsu"],
  [/(^|[^a-z0-9\u0400-\u04ff])(хитачи)(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1hitachi"],
  [/(^|[^a-z0-9\u0400-\u04ff])(хендай|хундай|хёндай)(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1hyundai"],
  [/(^|[^a-z0-9\u0400-\u04ff])(кавасаки)(?=$|[^a-z0-9\u0400-\u04ff])/g, "$1kawasaki"],
];

export function normalizeCatalogSearch(value: string): string {
  let text = value.normalize("NFKC").toLowerCase();
  for (const [pattern, replacement] of aliases) text = text.replace(pattern, replacement);
  return text.replace(/[-‐‑‒–—/]+/g, " ").replace(/\s+/g, " ").trim();
}

export function catalogMatchesQuery(product: CatalogIndexProduct, query: string): boolean {
  const needle = normalizeCatalogSearch(query);
  if (!needle) return true;
  const text = normalizeCatalogSearch([product.title, product.catalogTitle, product.fitment, product.sku, ...product.tags].filter(Boolean).join(" "));
  const tokens = needle.split(" ");
  if (tokens.every((token) => text.includes(token))) return true;
  // Numbers and model codes are commonly typed with different separators.
  // Keep words separate so unrelated words cannot become an accidental match.
  const numericTokens = tokens.filter((token) => /\d/.test(token));
  const wordTokens = tokens.filter((token) => !/\d/.test(token));
  const compact = text.replace(/[^a-z0-9\u0400-\u04ff]/g, "");
  return numericTokens.length > 0 && wordTokens.every((token) => text.includes(token)) &&
    numericTokens.every((token) => compact.includes(token.replace(/[^a-z0-9\u0400-\u04ff]/g, "")));
}

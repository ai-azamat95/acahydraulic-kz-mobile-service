import landingData from "@shared/catalog-landings.json";
import seoContent from "@shared/catalog-seo-content.json";

export type CatalogCategoryLanding = (typeof landingData.categories)[number];
export type CatalogBrandLanding = (typeof landingData.brands)[number];

export const catalogCategoryLandings = landingData.categories;
export const catalogBrandLandings = landingData.brands;
export const catalogCategorySeoContent = seoContent;

export function categorySeoContent(categoryId?: string) {
  if (!categoryId || !(categoryId in catalogCategorySeoContent)) return null;
  return catalogCategorySeoContent[categoryId as keyof typeof catalogCategorySeoContent];
}

const MODEL_RULES: Array<{ pattern: RegExp; brand: string; engine?: boolean; requiresBrand?: boolean }> = [
  { pattern: /^(?:PC|WA)\d{2,4}(?:-[A-Z0-9]+)?$/i, brand: "Komatsu" },
  { pattern: /^D(?:31|37|39|41|50|53|57|60|61|63|65|68|75|80|85|95|155|275|355|375)[A-Z]?(?:-\d+)?$/i, brand: "Komatsu" },
  { pattern: /^(?:EX|ZX)\d{2,4}(?:-[A-Z0-9]+)?$/i, brand: "Hitachi" },
  { pattern: /^EC\d{2,4}[A-Z]?$/i, brand: "Volvo CE" },
  { pattern: /^SK\d{2,4}(?:-[A-Z0-9]+)?$/i, brand: "Kobelco" },
  { pattern: /^R\d{2,4}(?:LC)?(?:-[A-Z0-9]+)?$/i, brand: "Hyundai" },
  { pattern: /^DX\d{2,4}[A-Z]?$/i, brand: "Doosan" },
  { pattern: /^SY\d{2,4}[A-Z]?$/i, brand: "SANY" },
  { pattern: /^SD\d{2,4}[A-Z]?$/i, brand: "Shantui" },
  { pattern: /^(?:E)?3[0-9]{2}[A-Z]?$/i, brand: "Caterpillar", requiresBrand: true },
  { pattern: /^3CX$/i, brand: "JCB" },
  { pattern: /^(?:4HK1|6HK1|4JJ1)$/i, brand: "Isuzu", engine: true },
  { pattern: /^(?:J08E)$/i, brand: "Hino", engine: true },
  { pattern: /^(?:C13|C15|C18|3406E|3126B)$/i, brand: "Caterpillar", engine: true },
  { pattern: /^(?:4BT|6BT5|QSM11|M11|K19|NT855|ISX15|QSB6|QSX15)$/i, brand: "Cummins", engine: true },
  { pattern: /^(?:V2203|V3800|D722|D902|D905)$/i, brand: "Kubota", engine: true },
  { pattern: /^(?:D13|D16)$/i, brand: "Volvo", engine: true }
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function landingSearchText(product: { title: string; fitment?: string | null; tags?: string[] }) {
  return `${product.title} ${product.fitment || ""} ${(product.tags || []).join(" ")}`;
}

export function extractBrandSlugs(text: string) {
  return catalogBrandLandings
    .filter((brand) => brand.aliases.some((alias) => new RegExp(`(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`, "i").test(text)))
    .map((brand) => brand.slug);
}

export function modelSlug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type CatalogModelLanding = { slug: string; label: string; brand: string; engine: boolean };

export function extractModelLandings(text: string): CatalogModelLanding[] {
  const tokens = text.toUpperCase().match(/\b[A-Z0-9]+(?:-[A-Z0-9]+)*\b/g) || [];
  const found = new Map<string, CatalogModelLanding>();
  for (const token of tokens) {
    const rule = MODEL_RULES.find((candidate) => candidate.pattern.test(token) && (!candidate.requiresBrand || token.startsWith("E") || /\b(?:CAT|CATERPILLAR)\b/i.test(text)));
    if (!rule) continue;
    const slug = modelSlug(token);
    found.set(slug, { slug, label: token, brand: rule.brand, engine: Boolean(rule.engine) });
  }
  return Array.from(found.values());
}

export function modelLandingFromSlug(slug: string) {
  const label = slug.toUpperCase();
  const rule = MODEL_RULES.find((candidate) => candidate.pattern.test(label));
  return rule ? { slug, label, brand: rule.brand, engine: Boolean(rule.engine) } : null;
}

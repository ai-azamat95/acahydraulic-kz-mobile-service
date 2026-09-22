type SeoProduct = {
  handle: string;
  title: string;
  category: string;
  categories?: string[];
  fitment?: string | null;
  minPriceKzt?: number | null;
  approvedSale?: unknown;
};
export function catalogProductName(product: Pick<SeoProduct, "handle" | "title">, language?: string): string;
export function catalogProductSeo(product: SeoProduct, language?: string): { name: string; title: string; description: string };
export function catalogProductCategories(product: Pick<SeoProduct, "category" | "categories">): { id: string; title: string; description: string; intro: string }[];
export function catalogProductSelection(product: Pick<SeoProduct, "handle" | "approvedSale">): string;

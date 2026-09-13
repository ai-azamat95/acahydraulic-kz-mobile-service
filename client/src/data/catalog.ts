import generatedProducts from "./catalog.generated.json";

export type CatalogAvailability = "in_stock" | "on_request" | "out_of_stock";

export interface CatalogProduct {
  id: string;
  slug: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  oem: string[];
  machineModels: string[];
  description: string;
  image?: string;
  sourcePrice?: number;
  sourceCurrency?: "CNY" | "USD" | "KZT";
  markupPercent: number;
  priceKzt?: number;
  availability: CatalogAvailability;
  featured?: boolean;
  isDemo?: boolean;
}

/**
 * Applies a commercial markup without changing currency.
 * Currency conversion is intentionally kept separate because FX rates are dynamic.
 */
export function applyMarkup(basePrice: number, markupPercent = 50): number {
  return Math.round(basePrice * (1 + markupPercent / 100));
}

export function formatKzt(price?: number): string {
  if (!price) return "Цена по запросу";
  return `${new Intl.NumberFormat("ru-KZ").format(price)} ₸`;
}

export const catalogProducts = generatedProducts as CatalogProduct[];

export const catalogBrands = Array.from(
  new Set(catalogProducts.map((product) => product.brand))
).sort();

export const catalogCategories = Array.from(
  new Set(catalogProducts.map((product) => product.category))
).sort();

export function findCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}

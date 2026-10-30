import generatedProducts from "./catalog.public.json";

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
  priceKzt?: number;
  availability: CatalogAvailability;
  featured?: boolean;
  isDemo?: boolean;
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

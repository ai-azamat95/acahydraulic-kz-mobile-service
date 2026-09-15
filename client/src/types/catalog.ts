export type CatalogIndexProduct = {
  id: string;
  handle: string;
  title: string;
  category: string;
  tags: string[];
  skus?: string[];
  available: boolean;
  minPriceKzt: number | null;
  maxPriceKzt: number | null;
  imageUrl: string | null;
  chunk: number;
};

export type CatalogVariant = {
  id: string;
  title: string;
  sku: string;
  available: boolean;
  sourcePriceKzt: number;
  priceKzt: number | null;
  options: string[];
};

export type CatalogProduct = CatalogIndexProduct & {
  productType: string;
  specifications?: { name: string; value: string }[];
  variants: CatalogVariant[];
  gallery: string[];
  sourceUrl: string;
  sourceUpdatedAt: string;
};

export type CatalogIndexProduct = {
  id: string;
  handle: string;
  title: string;
  category: string;
  categories?: string[];
  tags: string[];
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
  variants: CatalogVariant[];
  gallery: string[];
  sourceUrl: string;
  sourceUpdatedAt: string;
};

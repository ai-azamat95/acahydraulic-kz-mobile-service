export type CatalogIndexProduct = {
  id: string;
  handle: string;
  title: string;
  catalogTitle?: string;
  fitment: string | null;
  sku: string;
  brand?: string;
  model?: string;
  mpn?: string;
  category: string;
  categories?: string[];
  tags: string[];
  available: boolean;
  minPriceKzt: number | null;
  ownerEvidence?: {
    heading: string;
    facts: string[];
    photoCaption: string;
    selection: string;
  };
  ownerSale?: { condition: "new"; confirmedOn: string; casePath: string };
  ownerProduct?: {
    condition: "new";
    confirmedOn: string;
    originCountry: string;
    shippingIncluded: boolean;
  };
  approvedSale?: {
    model: string;
    condition: "new";
    assembly: "complete";
    confirmedOn: string;
    deliveryMinDays: number;
    deliveryMaxDays: number;
    shippingFromUsdPerKg: number;
    defectResolution: "replacement-at-service-center";
    prepaymentPercent: number;
  };
  maxPriceKzt: number | null;
  imageUrl: string | null;
  chunk: number;
};

export type CatalogVariant = {
  id: string;
  title: string;
  sku: string;
  available: boolean;
  priceKzt: number | null;
  options: string[];
};

export type CatalogProduct = CatalogIndexProduct & {
  productType: string;
  variants: CatalogVariant[];
  gallery: string[];
};

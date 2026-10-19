type SeoProduct = {
  id?: string | number;
  handle: string;
  title: string;
  brand?: string | null;
  catalogTitle?: string;
  catalogSupplement?: string;
  catalogDescription?: string;
  catalogSelection?: string;
  tags?: string[];
  category: string;
  categories?: string[];
  fitment?: string | null;
  minPriceKzt?: number | null;
  approvedSale?: unknown;
  ownerSale?: unknown;
  ownerEvidence?: { selection: string };
};
export function catalogProductName(
  product: Pick<SeoProduct, "handle" | "title"> & Partial<Pick<SeoProduct, "catalogTitle" | "category" | "categories" | "id">>,
  language?: string,
): string;
export function catalogProductSeo(product: SeoProduct, language?: string): { name: string; title: string; description: string };
export function catalogProductHasReviewedCopy(product: Pick<SeoProduct, "handle">, language?: string): boolean;
export function catalogProductImageIsPlaceholder(product: { imageUrl?: string | null }): boolean;
export function catalogOfferHasConfirmedSupply(merchantOffer?: { availability?: string }): boolean;
export function catalogProductCategories(product: Pick<SeoProduct, "category" | "categories">): { id: string; title: string; description: string; intro: string }[];
export function catalogProductIsHydraulicPump(product: Pick<SeoProduct, "category" | "categories">): boolean;
export function catalogProductBrandLanding(product: Pick<SeoProduct, "brand" | "title" | "catalogTitle" | "fitment" | "tags">): { slug: string; name: string; matchSource: "manufacturer" | "title-manufacturer" } | undefined;
export function catalogProductSelection(product: Pick<SeoProduct, "handle" | "approvedSale" | "ownerEvidence" | "catalogSupplement" | "catalogSelection">): string;

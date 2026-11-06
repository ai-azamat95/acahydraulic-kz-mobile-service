import type { CatalogCopy, CatalogLanguage } from "@/content/partsCatalog";

type QuickSearchProduct = {
  ownerInventory?: {
    availability?: string;
  };
};

const preorderStatus: Record<CatalogLanguage, string> = {
  ru: "Под заказ · Проверить цену и срок",
  kz: "Тапсырыс бойынша · Баға мен мерзімді нақтылау",
  en: "To order · Confirm price and lead time",
};

export function catalogQuickSearchStatus(
  product: QuickSearchProduct,
  copy: Pick<CatalogCopy, "inStock" | "priceOnRequest">,
  language: CatalogLanguage,
) {
  if (product.ownerInventory?.availability === "in_stock") {
    return `${copy.inStock} · ${copy.priceOnRequest}`;
  }

  return preorderStatus[language];
}

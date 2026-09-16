import type { CatalogIndexProduct } from "@/types/catalog";

type AnalyticsParams = Record<string, unknown>;

export function catalogAnalyticsItem(product: CatalogIndexProduct) {
  return {
    item_id: product.id,
    item_name: product.handle,
    item_category: product.category,
    price: product.minPriceKzt ?? undefined,
    quantity: 1,
  };
}

export function trackCatalogEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  try {
    const gtag = (window as typeof window & {
      gtag?: (command: "event", name: string, parameters: AnalyticsParams) => void;
    }).gtag;
    if (typeof gtag !== "function") return;

    gtag("event", eventName, Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined),
    ));
  } catch {
    // Analytics must never block catalog navigation or contact actions.
  }
}

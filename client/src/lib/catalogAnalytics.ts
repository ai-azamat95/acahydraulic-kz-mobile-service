import type { CatalogIndexProduct } from "@/types/catalog";

type AnalyticsParams = Record<string, unknown>;

const MAX_SEARCH_VALUE_LENGTH = 80;
const VIN_LIKE_VALUE = /^[A-HJ-NPR-Z0-9]{17}$/i;
const EMAIL_LIKE_VALUE = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
const PHONE_LIKE_VALUE = /^\+?[\d\s().-]{10,}$/;

export type CatalogSearchAnalyticsInput = {
  searchMode: string;
  landingId: string;
  categoryId: string;
  brandSelected: boolean;
  partQuery: string;
  machineModel: string;
  resultCount: number;
};

/**
 * Keep useful OEM/model searches while refusing values that are likely to be
 * personal data. VIN and serial-number sourcing is handled in WhatsApp and is
 * intentionally not sent to GA4.
 */
export function catalogAnalyticsSearchValue(value: string): string | undefined {
  const rawValue = value.normalize("NFKC").trim();
  if (!rawValue || EMAIL_LIKE_VALUE.test(rawValue)) return undefined;

  const normalized = rawValue
    .replace(/[^\u0400-\u04FFA-Za-z0-9\s._+/#()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return undefined;

  const compact = normalized.replace(/[^A-Z0-9]/gi, "");
  const digits = normalized.replace(/\D/g, "");
  if (VIN_LIKE_VALUE.test(compact)) return undefined;
  if (digits.length >= 10 && PHONE_LIKE_VALUE.test(normalized)) return undefined;

  return normalized.slice(0, MAX_SEARCH_VALUE_LENGTH).toUpperCase();
}

export function catalogSearchAnalyticsParams(input: CatalogSearchAnalyticsInput): AnalyticsParams {
  const searchTerm = catalogAnalyticsSearchValue(input.partQuery);
  const machineModel = catalogAnalyticsSearchValue(input.machineModel);

  return {
    search_mode: input.searchMode,
    landing_id: input.landingId,
    category_id: input.categoryId || "all",
    brand_selected: input.brandSelected,
    has_part_query: Boolean(input.partQuery.trim()),
    has_machine_model: Boolean(input.machineModel.trim()),
    search_term: searchTerm || machineModel,
    catalog_machine_model: machineModel,
    catalog_result_count: input.resultCount,
    catalog_result_status: input.resultCount === 0 ? "no_results" : "results",
  };
}

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
    if (window.__ACA_ANALYTICS_EXCLUDE__) return;
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

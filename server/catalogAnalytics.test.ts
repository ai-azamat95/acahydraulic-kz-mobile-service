import { afterEach, describe, expect, it } from "vitest";

import {
  catalogAnalyticsItem,
  catalogAnalyticsSearchValue,
  catalogSearchAnalyticsParams,
  trackCatalogEvent,
} from "@/lib/catalogAnalytics";

afterEach(() => {
  delete (globalThis as typeof globalThis & { window?: unknown }).window;
});

describe("catalog analytics", () => {
  it("sends public product identifiers and removes undefined values", () => {
    const calls: unknown[][] = [];
    (globalThis as typeof globalThis & { window: unknown }).window = {
      gtag: (...args: unknown[]) => calls.push(args),
    };

    const item = catalogAnalyticsItem({
      id: "123",
      handle: "public-product-handle",
      title: "Public product title",
      fitment: null,
      sku: "",
      category: "hydraulic-pumps",
      tags: [],
      available: true,
      minPriceKzt: null,
      maxPriceKzt: null,
      imageUrl: null,
      chunk: 1,
    });
    trackCatalogEvent("view_item", { value: undefined, items: [item] });

    expect(calls).toEqual([["event", "view_item", { items: [{
      item_id: "123",
      item_name: "public-product-handle",
      item_category: "hydraulic-pumps",
      price: undefined,
      quantity: 1,
    }] }]]);
  });

  it("never blocks a catalog action when analytics is unavailable", () => {
    (globalThis as typeof globalThis & { window: unknown }).window = {
      gtag: () => {
        throw new Error("blocked");
      },
    };

    expect(() => trackCatalogEvent("catalog_whatsapp_click", { item_id: "123" })).not.toThrow();
  });

  it("records normalized OEM and machine model with the search result outcome", () => {
    expect(catalogSearchAnalyticsParams({
      searchMode: "oem",
      landingId: "/catalog/category/hydraulic-pumps",
      categoryId: "hydraulic-pumps",
      brandSelected: true,
      partQuery: "  708-2L-00500  ",
      machineModel: "Komatsu PC300-7",
      resultCount: 0,
    })).toMatchObject({
      search_term: "708-2L-00500",
      catalog_machine_model: "KOMATSU PC300-7",
      catalog_result_count: 0,
      catalog_result_status: "no_results",
    });
  });

  it("uses the machine model as the GA4 search term when an OEM is absent", () => {
    expect(catalogSearchAnalyticsParams({
      searchMode: "part",
      landingId: "/catalog",
      categoryId: "",
      brandSelected: false,
      partQuery: "",
      machineModel: "Hitachi ZX200-5G",
      resultCount: 12,
    })).toMatchObject({
      search_term: "HITACHI ZX200-5G",
      catalog_machine_model: "HITACHI ZX200-5G",
      catalog_result_status: "results",
    });
  });

  it("does not send likely personal identifiers as search dimensions", () => {
    expect(catalogAnalyticsSearchValue("+7 771 417 79 25")).toBeUndefined();
    expect(catalogAnalyticsSearchValue("1HGCM82633A004352")).toBeUndefined();
    expect(catalogAnalyticsSearchValue("buyer@example.com")).toBeUndefined();
  });

  it("does not send catalogue events for internal or automated traffic", () => {
    const calls: unknown[][] = [];
    (globalThis as typeof globalThis & { window: unknown }).window = {
      __ACA_ANALYTICS_EXCLUDE__: true,
      gtag: (...args: unknown[]) => calls.push(args),
    };

    trackCatalogEvent("catalog_search", { search_term: "K5V160DT" });

    expect(calls).toEqual([]);
  });
});

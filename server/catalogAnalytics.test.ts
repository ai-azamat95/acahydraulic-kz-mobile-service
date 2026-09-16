import { afterEach, describe, expect, it } from "vitest";

import { catalogAnalyticsItem, trackCatalogEvent } from "@/lib/catalogAnalytics";

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
});

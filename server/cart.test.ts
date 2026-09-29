import { describe, expect, it } from "vitest";

import {
  cartItemFromProduct,
  cartReducer,
  parseStoredCart,
  serializeCart,
  summarizeCart,
  type CartItem,
} from "@/lib/cart";
import type { CatalogIndexProduct } from "@/types/catalog";

const fixedItem: CartItem = {
  id: "pump-1",
  productId: "1",
  productHandle: "pump-1",
  title: "Гидронасос",
  sku: "K5V160",
  imageUrl: null,
  fitment: null,
  available: true,
  priceMode: "fixed",
  unitPriceKzt: 100_000,
  quantity: 1,
};

const catalogProduct: CatalogIndexProduct = {
  id: "1",
  handle: "pump-1",
  title: "Hydraulic pump",
  sku: "K5V160",
  fitment: "Excavator",
  category: "hydraulic-pumps",
  tags: [],
  available: true,
  minPriceKzt: 100_000,
  maxPriceKzt: 100_000,
  imageUrl: null,
  chunk: 1,
};

describe("cart", () => {
  it("adds the same line by increasing quantity and clamps quantity", () => {
    const added = cartReducer({ items: [] }, { type: "add", item: fixedItem });
    const twice = cartReducer(added, { type: "add", item: fixedItem });
    const clamped = cartReducer(twice, { type: "set-quantity", id: fixedItem.id, quantity: 500 });
    expect(twice.items[0].quantity).toBe(2);
    expect(clamped.items[0].quantity).toBe(99);
  });

  it("allows online payment only when every line has a fixed verified price", () => {
    expect(summarizeCart([fixedItem])).toMatchObject({ totalKzt: 100_000, canRequestOnlinePayment: true, quoteLineCount: 0 });
    expect(summarizeCart([{ ...fixedItem, id: "quote", priceMode: "quote", unitPriceKzt: null }])).toMatchObject({ totalKzt: 0, canRequestOnlinePayment: false, quoteLineCount: 1 });
  });

  it("treats imported catalogue prices as quote-only until verified", () => {
    const imported = cartItemFromProduct(catalogProduct);
    const approved = cartItemFromProduct({ ...catalogProduct, ownerProduct: { condition: "new", confirmedOn: "2026-09-28", originCountry: "Korea", shippingIncluded: true } });
    expect(imported).toMatchObject({ priceMode: "quote", unitPriceKzt: null });
    expect(approved).toMatchObject({ priceMode: "fixed", unitPriceKzt: 100_000 });
  });

  it("round-trips versioned storage and rejects malformed payloads", () => {
    const state = { items: [fixedItem] };
    expect(parseStoredCart(serializeCart(state))).toEqual(state);
    expect(parseStoredCart("not json")).toEqual({ items: [] });
    expect(parseStoredCart(JSON.stringify({ version: 2, items: [fixedItem] }))).toEqual({ items: [] });
  });
});

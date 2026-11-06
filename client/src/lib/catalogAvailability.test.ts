import { describe, expect, it } from "vitest";

import { catalogQuickSearchStatus } from "./catalogAvailability";

const stockCopy = {
  inStock: "В наличии",
  priceOnRequest: "Цена по запросу",
};

describe("catalog quick-search availability", () => {
  it("shows confirmed stock and price-on-request for an owner inventory item", () => {
    expect(
      catalogQuickSearchStatus(
        { ownerInventory: { availability: "in_stock" } },
        stockCopy,
        "ru"
      )
    ).toBe("В наличии · Цена по запросу");
  });

  it.each([
    ["ru", "Под заказ · Проверить цену и срок"],
    ["kz", "Тапсырыс бойынша · Баға мен мерзімді нақтылау"],
    ["en", "To order · Confirm price and lead time"],
  ] as const)(
    "keeps the existing %s preorder label for other products",
    (language, label) => {
      expect(catalogQuickSearchStatus({}, stockCopy, language)).toBe(label);
    }
  );
});

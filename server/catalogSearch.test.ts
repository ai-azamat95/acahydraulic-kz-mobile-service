import { describe, expect, it } from "vitest";
import { catalogMatchesQuery } from "@/lib/catalogSearch";
import type { CatalogIndexProduct } from "@/types/catalog";
const product = (title: string): CatalogIndexProduct => ({ id: "1", handle: "pump", title, fitment: null, sku: "ACA-001", category: "hydraulic-pumps", tags: [], available: true, minPriceKzt: null, maxPriceKzt: null, imageUrl: null, chunk: 1 });
describe("catalog search", () => {
  it.each(["20/911200", "20-911200", "20 911200", "20911200"])("matches OEM separators: %s", (query) => {
    expect(catalogMatchesQuery(product("Hydraulic pump 20/911200 for JCB"), query)).toBe(true);
  });
  it.each(["7082L00300", "708-2L-00300", "708 2L 00300"])("matches an alphanumeric OEM: %s", (query) => {
    expect(catalogMatchesQuery(product("Main pump 708-2L-00300 for Komatsu PC200-7"), query)).toBe(true);
  });
  it.each(["CAT 320", "Кат 320", "Caterpillar 320"])("matches brand aliases: %s", (query) => {
    expect(catalogMatchesQuery(product("Hydraulic Pump Caterpillar 320"), query)).toBe(true);
  });
  it("matches Russian unit names and separated model codes", () => {
    expect(catalogMatchesQuery(product("Hydraulic Pump Komatsu PC200-7"), "гидронасос Комацу PC 200" )).toBe(true);
    expect(catalogMatchesQuery(product("Hydraulic Pump Komatsu PC 200-7"), "PC200")).toBe(true);
  });
  it("includes public SKU and rejects a different OEM or brand", () => {
    const pump = product("Main pump 708-2L-00300 for Komatsu PC200-7");
    expect(catalogMatchesQuery(pump, "ACA001")).toBe(true);
    expect(catalogMatchesQuery(pump, "7082L00301")).toBe(false);
    expect(catalogMatchesQuery(pump, "Caterpillar PC200")).toBe(false);
  });
});

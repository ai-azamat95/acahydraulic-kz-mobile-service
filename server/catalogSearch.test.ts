import { describe, expect, it } from "vitest";
import { catalogMatchesQuery } from "@/lib/catalogSearch";
import type { CatalogIndexProduct } from "@/types/catalog";
const product = (title: string): CatalogIndexProduct => ({ id: "1", handle: "pump", title, fitment: null, sku: "ACA-001", category: "hydraulic-pumps", tags: [], available: true, minPriceKzt: null, maxPriceKzt: null, imageUrl: null, chunk: 1 });
describe("catalog search", () => {
  it("finds a reviewed product by its visible Russian name and its original English name", () => {
    const starter = { ...product("Starter Motor 5364880 for Cummins Engine QSL9.3"), handle: "starter-motor-5364880-for-cummins-engine-qsl9-3" };
    expect(catalogMatchesQuery(starter, "стартер 5364880")).toBe(true);
    expect(catalogMatchesQuery(starter, "starter 5364880")).toBe(true);
    expect(catalogMatchesQuery(starter, "стартер 5364881")).toBe(false);
  });
  it("finds reviewed fuel injection pumps using the Russian trade abbreviation", () => {
    const pump = { ...product("Fuel Injection Pump 28526390 7256789 for Bobcat Doosan D34 Engine S740 S750 S770"), handle: "fuel-injection-pump-28526390-7256789-for-bobcat-doosan-d34" };
    expect(catalogMatchesQuery(pump, "ТНВД 28526390")).toBe(true);
    expect(catalogMatchesQuery(pump, "ТНВД CAT 28526390")).toBe(false);
  });
  it("keeps OEM and machine searches when the display title leads with the pump model", () => {
    const pump = { ...product("Гидронасос K3V112DTP в сборе"), catalogTitle: "215111278 excavator hydraulic pump K3V112DTP-9C32-14T for JS220 JS200" };
    expect(catalogMatchesQuery(pump, "215111278")).toBe(true);
    expect(catalogMatchesQuery(pump, "JS220")).toBe(true);
    expect(catalogMatchesQuery(pump, "K3V112DTP 9C32 14T")).toBe(true);
    expect(catalogMatchesQuery(pump, "215111279")).toBe(false);
  });
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

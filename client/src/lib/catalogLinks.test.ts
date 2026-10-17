import { describe, expect, it } from "vitest";

import { catalogBrandFilterHref, catalogCategoryParam } from "./catalogLinks";

describe("catalogue brand category links", () => {
  it("keeps a brand route while adding a category filter", () => {
    expect(catalogBrandFilterHref("rexroth", "", "hydraulic-motors")).toBe(
      "/catalog/brand/rexroth/?category=hydraulic-motors"
    );
    expect(
      catalogBrandFilterHref("danfoss", "83073386", "hydraulic-pumps")
    ).toBe("/catalog/brand/danfoss/?q=83073386&category=hydraulic-pumps");
  });

  it("reads the category again after SPA query-string navigation", () => {
    expect(catalogCategoryParam("?category=pump-parts")).toBe("pump-parts");
    expect(catalogCategoryParam("?q=A11VLO&category=hydraulic-pumps")).toBe(
      "hydraulic-pumps"
    );
    expect(catalogCategoryParam("?q=A11VLO")).toBe("");
  });
});

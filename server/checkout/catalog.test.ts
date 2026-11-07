import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { catalogValidator } from "./catalog";
it("checks product and variant identity without trusting supplier prices", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aca-catalog-"));
  try {
    writeFileSync(
      path.join(dir, "product-map.json"),
      JSON.stringify({ pump: 1 })
    );
    writeFileSync(
      path.join(dir, "products-001.json"),
      JSON.stringify([
        {
          id: "1",
          handle: "pump",
          minPriceKzt: 1,
          variants: [{ id: "a" }, { id: "b" }],
        },
      ])
    );
    const validate = catalogValidator(dir);
    const item = {
      productId: "1",
      productHandle: "pump",
      variantId: "a",
      quantity: 1,
    };
    expect(() => validate([item])).not.toThrow();
    expect(() => validate([{ ...item, productId: "other" }])).toThrow(
      "PRODUCT_VARIANT_INVALID"
    );
    expect(() => validate([{ ...item, variantId: "other" }])).toThrow(
      "PRODUCT_VARIANT_INVALID"
    );
    expect(() => validate([{ ...item, variantId: undefined }])).toThrow(
      "PRODUCT_VARIANT_INVALID"
    );
    expect(() => validate([{ ...item, productHandle: "missing" }])).toThrow(
      "PRODUCT_NOT_FOUND"
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

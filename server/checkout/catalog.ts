import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { OrderRequest } from "../../shared/checkout";
import { CheckoutError } from "./errors";
const productSchema = z.object({
  id: z.string(),
  handle: z.string(),
  variants: z.array(z.object({ id: z.string() })),
});

/** Snapshot validates identity/variant only; it is never a source of payable prices. */
export function catalogValidator(directory: string) {
  return (items: OrderRequest["items"]) => {
    const map = z
      .record(z.string(), z.number().int().positive().max(10000))
      .parse(
        JSON.parse(
          readFileSync(path.join(directory, "product-map.json"), "utf8")
        )
      );
    const chunks = new Map<number, z.infer<typeof productSchema>[]>();
    for (const item of items) {
      const chunk = map[item.productHandle];
      if (!Number.isInteger(chunk))
        throw new CheckoutError("PRODUCT_NOT_FOUND", 400);
      let products = chunks.get(chunk);
      if (!products) {
        products = z
          .array(productSchema)
          .parse(
            JSON.parse(
              readFileSync(
                path.join(
                  directory,
                  `products-${String(chunk).padStart(3, "0")}.json`
                ),
                "utf8"
              )
            )
          );
        chunks.set(chunk, products);
      }
      const product = products.find(
        product =>
          product.handle === item.productHandle && product.id === item.productId
      );
      if (
        !product ||
        (item.variantId &&
          !product.variants.some(variant => variant.id === item.variantId)) ||
        (!item.variantId && product.variants.length > 1)
      )
        throw new CheckoutError("PRODUCT_VARIANT_INVALID", 400);
    }
  };
}

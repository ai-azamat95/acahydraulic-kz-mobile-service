import { useEffect, useState } from "react";

import type { CatalogIndexProduct, CatalogProduct } from "@/types/catalog";

export function useCatalogIndex() {
  const [products, setProducts] = useState<CatalogIndexProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/catalog-data/manifest.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Catalog manifest unavailable");
        return response.json();
      })
      .then(async (manifest: { chunkCount: number }) => {
        const requests = Array.from({ length: manifest.chunkCount }, (_, index) =>
          fetch(`/catalog-data/search-index-${String(index + 1).padStart(3, "0")}.json`, { signal: controller.signal })
            .then((response) => {
              if (!response.ok) throw new Error("Catalog index unavailable");
              return response.json() as Promise<CatalogIndexProduct[]>;
            }),
        );
        const chunks = await Promise.all(requests);
        setProducts(chunks.flat().sort((a, b) => a.title.localeCompare(b.title, "en")));
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return { products, loading, error };
}

export function useCatalogProduct(handle: string) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProduct() {
      try {
        const mapResponse = await fetch("/catalog-data/product-map.json", { signal: controller.signal });
        if (!mapResponse.ok) throw new Error("Product map unavailable");
        const productMap = (await mapResponse.json()) as Record<string, number>;
        const chunk = productMap[handle];
        if (!chunk) throw new Error("Product not found");
        const chunkResponse = await fetch(`/catalog-data/products-${String(chunk).padStart(3, "0")}.json`, { signal: controller.signal });
        if (!chunkResponse.ok) throw new Error("Product data unavailable");
        const products = (await chunkResponse.json()) as CatalogProduct[];
        const match = products.find((item) => item.handle === handle);
        if (!match) throw new Error("Product not found");
        setProduct(match);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    return () => controller.abort();
  }, [handle]);

  return { product, loading, error };
}

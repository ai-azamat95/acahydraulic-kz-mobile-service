import { useEffect, useState } from "react";

import type { CatalogIndexProduct, CatalogProduct } from "@/types/catalog";

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    cache: "no-store",
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status} ${url}`);
  return response.json() as Promise<T>;
}

export function useCatalogIndex() {
  const [products, setProducts] = useState<CatalogIndexProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        setLoading(true);
        setError(false);

        const manifest = await fetchJson<{
          chunkCount: number;
          indexFile?: string;
        }>("/catalog-data/manifest.json", controller.signal);

        // New deployments publish one consolidated search index. This is much
        // more reliable on mobile than waiting for 40+ parallel JSON requests.
        // Keep the chunk fallback so older cached deployments still work.
        if (manifest.indexFile) {
          try {
            const index = await fetchJson<CatalogIndexProduct[]>(
              `/catalog-data/${manifest.indexFile}`,
              controller.signal,
            );
            setProducts(index.sort((a, b) => a.title.localeCompare(b.title, "en")));
            return;
          } catch (indexError) {
            if (controller.signal.aborted) return;
            console.warn("Consolidated catalog index unavailable, falling back to chunks", indexError);
          }
        }

        const collected: CatalogIndexProduct[] = [];
        for (let start = 0; start < manifest.chunkCount; start += 6) {
          const batch = Array.from(
            { length: Math.min(6, manifest.chunkCount - start) },
            (_, offset) => start + offset + 1,
          );
          const chunks = await Promise.all(
            batch.map((page) =>
              fetchJson<CatalogIndexProduct[]>(
                `/catalog-data/search-index-${String(page).padStart(3, "0")}.json`,
                controller.signal,
              ),
            ),
          );
          collected.push(...chunks.flat());
          // Progressive rendering means users see real products instead of a
          // page full of zero counters while the remaining chunks load.
          setProducts([...collected].sort((a, b) => a.title.localeCompare(b.title, "en")));
        }
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        console.error("Catalog index failed to load", requestError);
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCatalog();
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
        const productMap = await fetchJson<Record<string, number>>(
          "/catalog-data/product-map.json",
          controller.signal,
        );
        const chunk = productMap[handle];
        if (!chunk) throw new Error("Product not found");
        const products = await fetchJson<CatalogProduct[]>(
          `/catalog-data/products-${String(chunk).padStart(3, "0")}.json`,
          controller.signal,
        );
        const match = products.find((item) => item.handle === handle);
        if (!match) throw new Error("Product not found");
        setProduct(match);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProduct();
    return () => controller.abort();
  }, [handle]);

  return { product, loading, error };
}

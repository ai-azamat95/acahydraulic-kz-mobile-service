import { useEffect, useState } from "react";

import "@/catalog-mobile.css";
import type { CatalogIndexProduct, CatalogProduct } from "@/types/catalog";

type CatalogManifest = {
  importedAt?: string;
  chunkCount: number;
  indexFile?: string;
};

async function fetchJson<T>(
  url: string,
  signal: AbortSignal,
  cache: RequestCache = "force-cache",
): Promise<T> {
  const response = await fetch(url, {
    signal,
    cache,
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status} ${url}`);
  return response.json() as Promise<T>;
}

function versioned(url: string, importedAt?: string) {
  if (!importedAt) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(importedAt)}`;
}

export function useCatalogIndex() {
  const [products, setProducts] = useState<CatalogIndexProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let backgroundTimer: number | undefined;

    async function loadCatalog() {
      let bootstrapLoaded = false;
      try {
        setLoading(true);
        setError(false);

        // The manifest is tiny. Revalidate only this file so a new deployment
        // is discovered quickly, while the large versioned catalog files stay
        // in the browser cache between visits.
        const manifest = await fetchJson<CatalogManifest>(
          "/catalog-data/manifest.json",
          controller.signal,
          "no-cache",
        );

        const firstChunkUrl = versioned(
          "/catalog-data/search-index-001.json",
          manifest.importedAt,
        );

        // Fast first paint: download just one small chunk first. The page can
        // render immediately instead of blocking on all 10k+ products.
        try {
          const firstChunk = await fetchJson<CatalogIndexProduct[]>(
            firstChunkUrl,
            controller.signal,
            "force-cache",
          );
          if (!controller.signal.aborted) {
            setProducts(firstChunk);
            bootstrapLoaded = firstChunk.length > 0;
            setLoading(false);
          }
        } catch (bootstrapError) {
          if (controller.signal.aborted) return;
          console.warn("Catalog bootstrap chunk unavailable", bootstrapError);
          setLoading(false);
        }

        const loadFullIndex = async () => {
          try {
            if (manifest.indexFile) {
              const index = await fetchJson<CatalogIndexProduct[]>(
                versioned(`/catalog-data/${manifest.indexFile}`, manifest.importedAt),
                controller.signal,
                "force-cache",
              );
              if (!controller.signal.aborted) setProducts(index);
              return;
            }

            // Compatibility fallback for an older deployment: stream chunks
            // progressively, but keep each versioned file cacheable.
            const collected: CatalogIndexProduct[] = [];
            for (let start = 0; start < manifest.chunkCount; start += 6) {
              if (controller.signal.aborted) return;
              const batch = Array.from(
                { length: Math.min(6, manifest.chunkCount - start) },
                (_, offset) => start + offset + 1,
              );
              const chunks = await Promise.all(
                batch.map((page) =>
                  fetchJson<CatalogIndexProduct[]>(
                    versioned(
                      `/catalog-data/search-index-${String(page).padStart(3, "0")}.json`,
                      manifest.importedAt,
                    ),
                    controller.signal,
                    "force-cache",
                  ),
                ),
              );
              collected.push(...chunks.flat());
              if (!controller.signal.aborted) setProducts([...collected]);
            }
          } catch (fullIndexError) {
            if (controller.signal.aborted) return;
            console.error("Full catalog index failed to load", fullIndexError);
            // If the first chunk rendered successfully, keep the usable page
            // instead of replacing it with an error screen.
            if (!bootstrapLoaded) setError(true);
          }
        };

        // Let the browser paint the catalogue UI before parsing the large
        // consolidated index. This materially improves perceived navigation
        // speed on iPhone/mobile networks.
        backgroundTimer = window.setTimeout(() => {
          void loadFullIndex();
        }, 120);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        console.error("Catalog manifest failed to load", requestError);
        setError(true);
        setLoading(false);
      }
    }

    void loadCatalog();
    return () => {
      if (backgroundTimer !== undefined) window.clearTimeout(backgroundTimer);
      controller.abort();
    };
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
        setLoading(true);
        setError(false);

        const manifest = await fetchJson<CatalogManifest>(
          "/catalog-data/manifest.json",
          controller.signal,
          "no-cache",
        );
        const productMap = await fetchJson<Record<string, number>>(
          versioned("/catalog-data/product-map.json", manifest.importedAt),
          controller.signal,
          "force-cache",
        );
        const chunk = productMap[handle];
        if (!chunk) throw new Error("Product not found");
        const products = await fetchJson<CatalogProduct[]>(
          versioned(
            `/catalog-data/products-${String(chunk).padStart(3, "0")}.json`,
            manifest.importedAt,
          ),
          controller.signal,
          "force-cache",
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
    void loadProduct();
    return () => controller.abort();
  }, [handle]);

  return { product, loading, error };
}

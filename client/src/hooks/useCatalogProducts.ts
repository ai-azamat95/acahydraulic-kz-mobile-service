import { useEffect, useState } from "react";

import "@/catalog-mobile.css";
import "@/catalog-performance.css";
import type { CatalogIndexProduct, CatalogProduct } from "@/types/catalog";

type CatalogManifest = {
  importedAt?: string;
  chunkCount: number;
  indexFile?: string;
  productCount?: number;
  categorySummaryFile?: string;
};

export type CatalogCategorySummary = Record<string, { count: number; imageUrl?: string | null }>;

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
  const [productCount, setProductCount] = useState(0);
  const [categorySummary, setCategorySummary] = useState<CatalogCategorySummary>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let backgroundTimer: number | undefined;

    async function loadCatalog() {
      let bootstrapLoaded = false;
      try {
        setLoading(true);
        setError(false);
        setComplete(false);
        setProductCount(0);
        setCategorySummary({});

        const manifest = await fetchJson<CatalogManifest>(
          "/catalog-data/manifest.json",
          controller.signal,
          "no-cache",
        );

        if (!controller.signal.aborted) setProductCount(manifest.productCount || 0);

        const categorySummaryFile = manifest.categorySummaryFile || "category-summary.json";
        void fetchJson<CatalogCategorySummary>(
          versioned(`/catalog-data/${categorySummaryFile}`, manifest.importedAt),
          controller.signal,
          "force-cache",
        )
          .then((summary) => {
            if (!controller.signal.aborted) setCategorySummary(summary);
          })
          .catch((summaryError) => {
            if (!controller.signal.aborted) console.warn("Catalog category summary unavailable", summaryError);
          });

        const firstChunkUrl = versioned(
          "/catalog-data/search-index-001.json",
          manifest.importedAt,
        );

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
            const indexFile = manifest.indexFile || "search-index.json";
            try {
              const index = await fetchJson<CatalogIndexProduct[]>(
                versioned(`/catalog-data/${indexFile}`, manifest.importedAt),
                controller.signal,
                "force-cache",
              );
              if (!controller.signal.aborted) {
                setProducts(index);
                setComplete(true);
              }
              return;
            } catch (fullIndexError) {
              if (controller.signal.aborted) return;
              console.warn("Complete catalog index unavailable; loading chunks", fullIndexError);
            }

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
            if (!controller.signal.aborted) setComplete(true);
          } catch (fullIndexError) {
            if (controller.signal.aborted) return;
            console.error("Full catalog index failed to load", fullIndexError);
            if (!bootstrapLoaded) setError(true);
          }
        };

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

  return { products, productCount, categorySummary, loading, error, complete };
}

export function useCatalogProduct(handle: string) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"not-found" | "load-failed" | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        setProduct(null);

        const manifest = await fetchJson<CatalogManifest>(
          "/catalog-data/manifest.json",
          controller.signal,
          "no-cache",
        );
        const productMap = await fetchJson<Record<string, number>>(
          versioned("/catalog-data/product-map.json", manifest.importedAt),
          controller.signal,
          "no-cache",
        );
        const chunk = productMap[handle];
        if (chunk === undefined) throw new Error("Product not found");
        const products = await fetchJson<CatalogProduct[]>(
          versioned(
            `/catalog-data/products-${String(chunk).padStart(3, "0")}.json`,
            manifest.importedAt,
          ),
          controller.signal,
          "no-cache",
        );
        const match = products.find((item) => item.handle === handle);
        if (!match) throw new Error("Product not found");
        setProduct(match);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        const notFound = requestError instanceof Error && requestError.message === "Product not found";
        if (!notFound) console.error("Catalog product failed to load", requestError);
        setError(notFound ? "not-found" : "load-failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadProduct();
    return () => controller.abort();
  }, [attempt, handle]);

  return { product, loading, error, retry: () => setAttempt(value => value + 1) };
}

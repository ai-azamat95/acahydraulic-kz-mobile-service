import { Link } from "wouter";
import { ChevronRight, Package, SearchX } from "lucide-react";

import type { CatalogCopy, CatalogLanguage } from "@/content/partsCatalog";
import type { CatalogIndexProduct } from "@/types/catalog";

type ProductResultsProps = {
  copy: CatalogCopy;
  language: CatalogLanguage;
  products: CatalogIndexProduct[];
  total: number;
  loading: boolean;
  error: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
};

function formatKzt(value: number, language: CatalogLanguage) {
  const amount = new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${amount} ₸`;
}

function formatPrice(product: CatalogIndexProduct, copy: CatalogCopy, language: CatalogLanguage) {
  if (product.minPriceKzt === null) return copy.priceOnRequest;

  if (
    product.maxPriceKzt !== null &&
    product.maxPriceKzt > product.minPriceKzt
  ) {
    return `${formatKzt(product.minPriceKzt, language)} — ${formatKzt(product.maxPriceKzt, language)}`;
  }

  return `${copy.fromPrice} ${formatKzt(product.minPriceKzt, language)}`;
}

function productCode(product: CatalogIndexProduct) {
  const usefulTag = product.tags.find((tag) => /\d/.test(tag) && tag.length <= 26);
  return usefulTag || product.category;
}

export function ProductResults({ copy, language, products, total, loading, error, canLoadMore, onLoadMore }: ProductResultsProps) {
  if (loading) {
    return <div className="mt-8 min-h-40 border border-white/10 bg-[#151515] p-6 text-gray-300" role="status">{copy.loadingProducts}</div>;
  }
  if (error) {
    return <div className="mt-8 min-h-40 border border-[#FFC000]/40 bg-[#FFC000]/5 p-6 text-gray-200" role="alert">{copy.loadError}</div>;
  }
  if (total === 0) {
    return (
      <div className="mt-8 flex min-h-48 flex-col items-center justify-center border border-white/10 bg-[#151515] p-6 text-center">
        <SearchX className="h-8 w-8 text-[#FFC000]" aria-hidden="true" />
        <p className="mt-4 max-w-xl text-gray-300">{copy.noResults}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const visibleTags = product.tags.slice(0, 3);
          return (
            <article
              key={product.id}
              className="group flex min-h-[410px] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#151515] shadow-[0_12px_35px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-[#FFC000]/55 hover:shadow-[0_16px_45px_rgba(0,0,0,0.32)]"
            >
              <Link
                href={`/catalog/${product.handle}`}
                className="relative flex h-40 items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,192,0,0.14),transparent_42%),linear-gradient(135deg,#1b1b1b,#101010)]"
                aria-label={product.title}
              >
                <div className="absolute left-3 top-3 max-w-[72%] truncate rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-300 backdrop-blur">
                  {productCode(product)}
                </div>
                <div
                  className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                    product.available
                      ? "border-[#FFC000]/40 bg-[#FFC000]/10 text-[#FFD24A]"
                      : "border-white/10 bg-black/25 text-gray-500"
                  }`}
                >
                  {product.available ? copy.available : copy.checkAvailability}
                </div>
                <span className="grid h-20 w-20 place-items-center rounded-full border border-[#FFC000]/20 bg-[#FFC000]/10 text-[#FFC000] transition-transform duration-200 group-hover:scale-105">
                  <Package className="h-10 w-10" aria-hidden="true" />
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-4 min-h-[5.5rem] text-base font-semibold leading-snug text-white">
                  <Link href={`/catalog/${product.handle}`} className="transition-colors hover:text-[#FFC000]">
                    {product.title}
                  </Link>
                </h3>

                {visibleTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Product tags">
                    {visibleTags.map((tag) => (
                      <span key={tag} className="max-w-full truncate rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{copy.priceOnRequest === formatPrice(product, copy, language) ? "" : "ACA Hydraulic"}</p>
                  <p className="mt-1 text-xl font-extrabold leading-tight text-[#FFC000]">
                    {formatPrice(product, copy, language)}
                  </p>

                  <Link
                    href={`/catalog/${product.handle}`}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded border border-white/15 bg-[#0f0f0f] px-4 text-sm font-bold text-white transition-colors hover:border-[#FFC000] hover:bg-[#FFC000] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                  >
                    {copy.viewPart}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {canLoadMore && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={onLoadMore} className="min-h-12 rounded border border-white/25 px-6 font-bold text-white hover:border-[#FFC000] hover:text-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]">
            {copy.loadMore}
          </button>
        </div>
      )}
    </>
  );
}

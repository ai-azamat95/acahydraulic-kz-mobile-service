import { Link } from "wouter";
import { Package, SearchX } from "lucide-react";

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
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="flex min-h-64 flex-col rounded border border-white/10 bg-[#151515] p-5 transition-colors hover:border-white/30">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-[#FFC000]/10 text-[#FFC000]">
                <Package className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className={`text-xs font-semibold ${product.available ? "text-[#FFD24A]" : "text-gray-500"}`}>
                {product.available ? copy.available : copy.checkAvailability}
              </span>
            </div>
            <h3 className="mt-5 line-clamp-4 text-base font-semibold leading-snug text-white">{product.title}</h3>
            <div className="mt-auto pt-5">
              <p className="text-lg font-bold text-[#FFC000]">
                {product.minPriceKzt !== null ? `${copy.fromPrice} ${formatKzt(product.minPriceKzt, language)}` : copy.priceOnRequest}
              </p>
              <Link href={`/catalog/${product.handle}`} className="mt-4 inline-flex min-h-10 items-center text-sm font-bold text-white underline decoration-[#FFC000] decoration-2 underline-offset-4 hover:text-[#FFC000]">
                {copy.viewPart}
              </Link>
            </div>
          </article>
        ))}
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

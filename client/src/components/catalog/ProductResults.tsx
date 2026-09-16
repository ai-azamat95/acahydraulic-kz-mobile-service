import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, MessageCircle, Package, SearchX } from "lucide-react";

import type { CatalogCopy, CatalogLanguage } from "@/content/partsCatalog";
import { partCategories } from "@/content/partsCatalog";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import type { CatalogIndexProduct } from "@/types/catalog";

type ProductResultsProps = {
  copy: CatalogCopy;
  language: CatalogLanguage;
  products: CatalogIndexProduct[];
  activeCategory?: string;
  total: number;
  loading: boolean;
  error: boolean;
  canLoadMore: boolean;
  onLoadMore: () => void;
};

const WHATSAPP_NUMBER = "77714177925";

function formatKzt(value: number, language: CatalogLanguage) {
  const amount = new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${amount} ₸`;
}

function formatPrice(product: CatalogIndexProduct, copy: CatalogCopy, language: CatalogLanguage) {
  if (product.minPriceKzt === null) return copy.priceOnRequest;

  if (product.maxPriceKzt !== null && product.maxPriceKzt > product.minPriceKzt) {
    return `${formatKzt(product.minPriceKzt, language)} — ${formatKzt(product.maxPriceKzt, language)}`;
  }

  return `${copy.fromPrice} ${formatKzt(product.minPriceKzt, language)}`;
}

function productCode(product: CatalogIndexProduct, activeCategory: string | undefined, language: CatalogLanguage) {
  const categoryId = activeCategory || product.category;
  const category = partCategories.find((item) => item.id === categoryId);
  if (category) return category[language];
  const usefulTag = product.tags.find((tag) => /\d/.test(tag) && tag.length <= 26);
  return usefulTag || categoryId;
}

function ProductImage({ product }: { product: CatalogIndexProduct }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(product.imageUrl) && !failed;

  return (
    <div className="aca-product-media relative aspect-square w-full overflow-hidden bg-white">
      {showImage ? (
        <img
          src={product.imageUrl || ""}
          alt={product.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.035]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#fff,#f4f4f4)] text-gray-400">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12" aria-hidden="true" />
            <span className="mt-2 block text-xs font-medium">ACA Hydraulic</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductResults({ copy, language, products, activeCategory, total, loading, error, canLoadMore, onLoadMore }: ProductResultsProps) {
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
      <div className="aca-product-grid mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const visibleTags = product.tags.slice(0, 2);
          const whatsappText = encodeURIComponent(`Здравствуйте! Интересует запчасть: ${product.title}\n${window.location.origin}/catalog/${product.handle}`);
          return (
            <article
              key={product.id}
              className="aca-product-card group flex min-w-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#151515] shadow-[0_12px_35px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:border-[#FFC000]/55 hover:shadow-[0_16px_45px_rgba(0,0,0,0.32)]"
            >
              <Link href={`/catalog/${product.handle}`} className="relative block" aria-label={product.title}>
                <ProductImage product={product} />
                <div className="aca-product-code absolute left-2 top-2 max-w-[70%] truncate rounded-full border border-black/10 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur sm:left-3 sm:top-3 sm:text-[11px]">
                  {productCode(product, activeCategory, language)}
                </div>
                <div
                  className={`absolute right-2 top-2 rounded-full border px-2 py-1 text-[10px] font-bold backdrop-blur sm:right-3 sm:top-3 sm:text-[11px] ${
                    product.available
                      ? "border-[#FFC000]/50 bg-black/75 text-[#FFD24A]"
                      : "border-white/20 bg-black/70 text-gray-300"
                  }`}
                >
                  {product.available ? copy.available : copy.checkAvailability}
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-3 sm:p-5">
                <h3 className="line-clamp-3 min-h-[3.8rem] text-sm font-semibold leading-snug text-white sm:min-h-[4.4rem] sm:text-base">
                  <Link href={`/catalog/${product.handle}`} className="transition-colors hover:text-[#FFC000]">
                    {product.title}
                  </Link>
                </h3>

                <div className="aca-product-fitment mt-3 min-h-[3.4rem] border-l-2 border-[#FFC000]/70 pl-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#FFC000] sm:text-[11px]">
                    {copy.fitmentLabel}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-400 sm:text-xs sm:leading-[1.15rem]">
                    {product.fitment || copy.fitmentUnknown}
                  </p>
                </div>

                {visibleTags.length > 0 && (
                  <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex" aria-label="Product tags">
                    {visibleTags.map((tag) => (
                      <span key={tag} className="max-w-full truncate rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 sm:pt-5">
                  <p className="text-base font-extrabold leading-tight text-[#FFC000] sm:text-xl">
                    {formatPrice(product, copy, language)}
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Link
                      href={`/catalog/${product.handle}`}
                      className="inline-flex min-h-10 items-center justify-center gap-1 rounded border border-white/15 bg-[#0f0f0f] px-2 text-xs font-bold text-white transition-colors hover:border-[#FFC000] hover:text-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] sm:min-h-11 sm:text-sm"
                    >
                      {copy.viewPart}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCatalogEvent("catalog_whatsapp_click", {
                        catalog_source: "product_card",
                        item_id: product.id,
                        item_category: activeCategory || product.category,
                      })}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded bg-[#FFC000] px-2 text-xs font-extrabold text-black transition-colors hover:bg-[#E6AC00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] sm:min-h-11 sm:text-sm"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
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

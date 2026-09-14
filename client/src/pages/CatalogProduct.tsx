import { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Check, MessageCircle, Package, ShieldCheck } from "lucide-react";

import { SEO } from "@/components/SEO";
import { catalogCopy, partCategories, type CatalogLanguage } from "@/content/partsCatalog";
import { useCatalogProduct } from "@/hooks/useCatalogProducts";
import { useTikTokContact } from "@/hooks/useTikTokEvents";

const WHATSAPP_NUMBER = "77714177925";

function formatKzt(value: number, language: CatalogLanguage) {
  return new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CatalogProduct() {
  const { handle = "" } = useParams<{ handle: string }>();
  const [language, setLanguage] = useState<CatalogLanguage>("ru");
  const { product, loading, error } = useCatalogProduct(handle);
  const fireContact = useTikTokContact();
  const copy = catalogCopy[language];
  const category = product ? partCategories.find((item) => item.id === product.category) : null;
  const categoryName = category?.[language] || product?.category || "";

  const requestProduct = () => {
    if (!product) return;
    const message = [
      copy.whatsappIntro,
      `${copy.whatsappPart}: ${product.title}`,
      `${copy.whatsappCategory}: ${categoryName}`,
      `${copy.price}: ${product.minPriceKzt !== null ? `${copy.fromPrice} ${formatKzt(product.minPriceKzt, language)}` : copy.priceOnRequest}`,
      copy.whatsappPhoto,
    ].join("\n");
    fireContact("whatsapp");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <div className="grid min-h-[100dvh] place-items-center bg-[#101010] px-4 text-white" role="status">{copy.loadingProducts}</div>;
  }

  if (error || !product) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-[#101010] px-4 text-white">
        <div className="max-w-lg border border-white/10 bg-[#151515] p-8 text-center">
          <Package className="mx-auto h-9 w-9 text-[#FFC000]" aria-hidden="true" />
          <p className="mt-5 text-gray-300">{copy.noResults}</p>
          <Link href="/catalog" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#FFC000] underline underline-offset-4">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {copy.backToCatalog}
          </Link>
        </div>
      </div>
    );
  }

  const displayedPrice = product.minPriceKzt !== null
    ? `${copy.fromPrice} ${formatKzt(product.minPriceKzt, language)}`
    : copy.priceOnRequest;

  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto">
      <SEO
        title={`${product.title} - цена и подбор`}
        description={`${product.title}. Цена ${displayedPrice}. Проверка совместимости с моделью спецтехники и заказ через ACA Hydraulic.`}
        canonical={`/catalog/${product.handle}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          sku: product.variants.find((variant) => variant.sku)?.sku || product.id,
          category: categoryName,
          brand: { "@type": "Brand", name: product.tags[0] || "ACA Hydraulic" },
          offers: product.minPriceKzt !== null ? {
            "@type": "AggregateOffer",
            priceCurrency: "KZT",
            lowPrice: product.minPriceKzt,
            highPrice: product.maxPriceKzt ?? product.minPriceKzt,
            offerCount: product.variants.length,
            availability: product.available ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            url: `https://acahydraulic.kz/catalog/${product.handle}/`,
          } : undefined,
        }}
        breadcrumbs={[
          { name: "Каталог запчастей", url: "/catalog" },
          { name: product.title, url: `/catalog/${product.handle}` },
        ]}
      />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101010]/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="ACA Hydraulic">
            <span className="flex h-7 gap-[3px]" aria-hidden="true">
              <span className="w-2.5 bg-[#FFC000]" />
              <span className="flex flex-col justify-between">
                <span className="h-3 w-2.5 bg-[#FFC000]" />
                <span className="h-3 w-2.5 bg-[#FFC000]" />
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <strong className="text-lg tracking-wide">ACA</strong>
              <span className="mt-0.5 text-[11px] tracking-wider">HYDRAULIC</span>
            </span>
          </Link>
          <div className="flex items-center gap-2" aria-label="Language">
            {(["ru", "kz", "en"] as CatalogLanguage[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                aria-pressed={language === item}
                className={`min-h-10 min-w-10 rounded px-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] ${language === item ? "bg-[#FFC000] text-black" : "text-gray-300 hover:bg-white/10"}`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <Link href="/catalog" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#FFC000]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.backToCatalog}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="grid min-h-72 place-items-center rounded border border-white/10 bg-[#151515] p-8">
            <div className="text-center">
              <span className="mx-auto grid h-24 w-24 place-items-center rounded bg-[#FFC000]/10 text-[#FFC000]">
                <Package className="h-12 w-12" aria-hidden="true" />
              </span>
              <p className="mt-5 text-sm text-gray-500">{categoryName}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[#FFC000]">{categoryName}</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">{product.title}</h1>
            <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">{copy.productDescription}</p>
            <p className="mt-7 text-3xl font-bold text-[#FFC000]">{displayedPrice}</p>
            <p className="mt-2 text-sm text-gray-400">{product.available ? copy.available : copy.checkAvailability}</p>
            <button
              type="button"
              onClick={requestProduct}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#FFC000] px-6 font-bold text-black hover:bg-[#E6AC00] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {copy.requestButton}
            </button>
            <p className="mt-3 text-sm text-gray-500">{copy.requestNote}</p>
          </div>
        </div>

        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="variants-title">
          <h2 id="variants-title" className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.variantsTitle}</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {product.variants.map((variant) => (
              <article key={variant.id} className="rounded border border-white/10 bg-[#151515] p-5">
                <h3 className="font-semibold text-white">{variant.title || product.title}</h3>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div>
                    <dt className="text-gray-500">{copy.sku}</dt>
                    <dd className="mt-1 font-medium text-gray-200">{variant.sku || product.id}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">{copy.price}</dt>
                    <dd className="mt-1 text-lg font-bold text-[#FFC000]">{variant.priceKzt !== null ? formatKzt(variant.priceKzt, language) : copy.priceOnRequest}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">{copy.status}</dt>
                    <dd className="mt-1 flex items-center gap-2 text-gray-200">
                      <Check className="h-4 w-4 text-[#FFC000]" aria-hidden="true" />
                      {variant.available ? copy.available : copy.checkAvailability}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 flex gap-4 border-l-2 border-[#FFC000] bg-[#151515] p-6">
          <ShieldCheck className="h-7 w-7 shrink-0 text-[#FFC000]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold">{copy.qualityTitle}</h2>
            <p className="mt-2 leading-relaxed text-gray-400">{copy.qualityText}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

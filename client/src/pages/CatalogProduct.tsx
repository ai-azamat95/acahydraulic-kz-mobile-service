import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Check, ImageIcon, MessageCircle, Package, ShieldCheck, ZoomIn } from "lucide-react";

import { SEO } from "@/components/SEO";
import { catalogCopy, partCategories, type CatalogLanguage } from "@/content/partsCatalog";
import { useCatalogProduct } from "@/hooks/useCatalogProducts";
import { useTikTokContact } from "@/hooks/useTikTokEvents";
import { catalogAnalyticsItem, trackCatalogEvent } from "@/lib/catalogAnalytics";

const WHATSAPP_NUMBER = "77714177925";

function formatKzt(value: number, language: CatalogLanguage) {
  const amount = new Intl.NumberFormat(language === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${amount} ₸`;
}

export default function CatalogProduct() {
  const { handle = "" } = useParams<{ handle: string }>();
  const [language, setLanguage] = useState<CatalogLanguage>("ru");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const trackedProductRef = useRef("");
  const { product, loading, error } = useCatalogProduct(handle);
  const fireContact = useTikTokContact();
  const copy = catalogCopy[language];
  const category = product ? partCategories.find((item) => item.id === product.category) : null;
  const categoryName = category?.[language] || product?.category || "";

  const gallery = useMemo(() => {
    if (!product) return [];
    const images = product.gallery?.length ? product.gallery : product.imageUrl ? [product.imageUrl] : [];
    return Array.from(new Set(images.filter(Boolean)));
  }, [product]);

  useEffect(() => {
    setSelectedImage(gallery[0] || "");
    setImageFailed(false);
  }, [gallery]);

  useEffect(() => {
    if (!product || trackedProductRef.current === product.id) return;
    trackedProductRef.current = product.id;
    trackCatalogEvent("view_item", {
      currency: "KZT",
      value: product.minPriceKzt ?? undefined,
      items: [catalogAnalyticsItem(product)],
    });
  }, [product]);

  const requestProduct = () => {
    if (!product) return;
    const message = [
      copy.whatsappIntro,
      `${copy.whatsappPart}: ${product.title}`,
      `${copy.whatsappCategory}: ${categoryName}`,
      `${copy.price}: ${product.minPriceKzt !== null ? `${copy.fromPrice} ${formatKzt(product.minPriceKzt, language)}` : copy.priceOnRequest}`,
      `Ссылка: ${window.location.href}`,
      copy.whatsappPhoto,
    ].join("\n");
    trackCatalogEvent("catalog_whatsapp_click", {
      catalog_source: "product_page",
      item_id: product.id,
      item_category: product.category,
    });
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
  const mainSku = product.variants.find((variant) => variant.sku)?.sku || product.id;
  const fitmentText = product.fitment || copy.fitmentUnknown;
  const seoDescription = `${product.title}. ${copy.fitmentLabel}: ${fitmentText}. Цена ${displayedPrice}. Проверка совместимости до оплаты.`;

  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto">
      <SEO
        title={`${product.title} - цена и подбор`}
        description={seoDescription}
        canonical={`/catalog/${product.handle}`}
        ogImage={gallery[0]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: seoDescription,
          image: gallery,
          sku: mainSku,
          category: categoryName,
          additionalProperty: product.fitment ? [{
            "@type": "PropertyValue",
            name: copy.fitmentLabel,
            value: product.fitment,
          }] : undefined,
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

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.08fr_0.92fr]">
          <section aria-label="Product photos">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              {selectedImage && !imageFailed ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                  decoding="async"
                  referrerPolicy="no-referrer-when-downgrade"
                  onError={() => setImageFailed(true)}
                  className="h-full w-full object-contain p-4 md:p-8"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_42%,#fff,#f1f1f1)] text-gray-400">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-16 w-16" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold">ACA Hydraulic</p>
                  </div>
                </div>
              )}
              {selectedImage && !imageFailed && (
                <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                  Фото товара
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => {
                      setSelectedImage(image);
                      setImageFailed(false);
                    }}
                    aria-label={`Фото ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    className={`aspect-square overflow-hidden rounded border bg-white p-1 transition ${selectedImage === image ? "border-[#FFC000] ring-1 ring-[#FFC000]" : "border-white/15 hover:border-white/40"}`}
                  >
                    <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="lg:py-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[#FFC000]">{categoryName}</p>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-gray-400">SKU: {mainSku}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">{product.title}</h1>
            <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">{copy.productDescription}</p>

            <section className="aca-product-fitment-detail mt-6 border-l-2 border-[#FFC000] bg-white/[0.04] px-4 py-3" aria-labelledby="fitment-title">
              <h2 id="fitment-title" className="text-xs font-bold uppercase tracking-[0.1em] text-[#FFC000]">{copy.fitmentLabel}</h2>
              <p className="mt-2 leading-relaxed text-gray-200">{fitmentText}</p>
              {product.fitment && (
                <p className="mt-2 text-xs leading-5 text-gray-500">{copy.fitmentUnknown}</p>
              )}
            </section>

            <div className="mt-7 rounded-lg border border-white/10 bg-[#151515] p-5 md:p-6">
              <p className="text-3xl font-extrabold text-[#FFC000] md:text-4xl">{displayedPrice}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                <Check className="h-4 w-4 text-[#FFC000]" aria-hidden="true" />
                {product.available ? copy.available : copy.checkAvailability}
              </div>
              <button
                type="button"
                onClick={requestProduct}
                className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3.5 text-base font-extrabold text-black transition-colors hover:bg-[#E6AC00] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {copy.requestButton}
              </button>
              <p className="mt-3 text-sm text-gray-500">{copy.requestNote}</p>
            </div>

            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.slice(0, 8).map((tag) => (
                  <span key={tag} className="rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">{tag}</span>
                ))}
              </div>
            )}
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

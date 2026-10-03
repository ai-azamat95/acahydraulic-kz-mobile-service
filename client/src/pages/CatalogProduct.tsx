import catSale from "../../../shared/cat-432e-sale.json";
import Cat432eSaleMedia from "@/components/Cat432eSaleMedia";
import xcmgSale from "../../../shared/xcmg-xz200-pump-sale.json";
import XcmgXz200PumpMedia from "@/components/XcmgXz200PumpMedia";
import merchantPumps from "../../../shared/merchant-pumps.json";
import SiteHomeLink from "@/components/SiteHomeLink";
import PumpCaseTeaser from "@/components/PumpCaseTeaser";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useParams } from "wouter";
import { ArrowLeft, Check, ImageIcon, MessageCircle, Package, RotateCcw, ShieldCheck, ShoppingCart, ZoomIn } from "lucide-react";

import { SEO } from "@/components/SEO";
import { CartButton } from "@/components/cart/CartButton";
import { CatalogLanguageControl } from "@/components/catalog/CatalogLanguageControl";
import { catalogCopy, partCategories, type CatalogLanguage } from "@/content/partsCatalog";
import { useCart } from "@/contexts/CartContext";
import { useCatalogProduct } from "@/hooks/useCatalogProducts";
import { useTikTokContact } from "@/hooks/useTikTokEvents";
import { catalogAnalyticsItem, trackCatalogEvent } from "@/lib/catalogAnalytics";
import { cartItemFromProduct, preferredCartItem } from "@/lib/cart";

import { catalogProductSeo, catalogProductCategories, catalogProductSelection } from "@shared/catalog-product-seo.mjs";

const WHATSAPP_NUMBER = "77714177925";

function schemaAvailability(value?: string) {
  if (value === "preorder") return "https://schema.org/PreOrder";
  if (value === "backorder") return "https://schema.org/BackOrder";
  if (value === "out_of_stock") return "https://schema.org/OutOfStock";
  return "https://schema.org/InStock";
}

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
  const { product, loading, error, retry } = useCatalogProduct(handle);
  const { addItem } = useCart();
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

  const requestProduct = (
    purpose: "part" | "nameplate" | "invoice" = "part",
    source = "product_page",
  ) => {
    if (!product) return;
    const message = [
      copy.whatsappIntro,
      `${copy.whatsappPart}: ${product.title}`,
      `${copy.whatsappCategory}: ${categoryName}`,
      `${copy.price}: ${product.minPriceKzt !== null ? `${(product.approvedSale || product.ownerSale || product.ownerProduct) ? "" : `${copy.fromPrice} `}${formatKzt(product.minPriceKzt, language)}` : copy.priceOnRequest}`,
      `Ссылка: ${window.location.href}`,
      copy.whatsappPhoto,
      language === "ru" ? "Поставка под заказ. Прошу подтвердить цену и срок." : language === "kz" ? "Тапсырыс бойынша жеткізу. Баға мен мерзімді растауыңызды сұраймын." : "Please confirm price and lead time for supply to order.",
      language === "ru" ? "Город: \nКоличество: \nНужна к дате: " : language === "kz" ? "Қала: \nСаны: \nҚажетті күні: " : "City: \nQuantity: \nRequired by: ",
      purpose === "invoice" ? (language === "ru" ? "Прошу подготовить счёт после согласования детали и поставки. Реквизиты приложу файлом в этом чате." : language === "kz" ? "Бөлшек пен жеткізу келісілгеннен кейін шот дайындауыңызды сұраймын. Деректемелер файлын осы чатқа тіркеймін." : "Please prepare an invoice after confirming the part and delivery. I will attach company details in this chat.") : "",
    ].filter(Boolean).join("\n");
    trackCatalogEvent("catalog_whatsapp_click", {
      catalog_source: source,
      catalog_request_type: purpose,
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
          <p className="mt-5 text-gray-300">{error === "load-failed" ? copy.loadError : copy.noResults}</p>
          {error === "load-failed" && (
            <button
              type="button"
              onClick={retry}
              className="mt-6 inline-flex min-h-11 items-center gap-2 bg-[#FFC000] px-5 font-bold text-black hover:bg-[#e6ad00]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {language === "ru" ? "Повторить загрузку" : language === "kz" ? "Қайта жүктеу" : "Try again"}
            </button>
          )}
          <Link href="/catalog" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#FFC000] underline underline-offset-4">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {copy.backToCatalog}
          </Link>
        </div>
      </div>
    );
  }

  const isXcmgOwnerSale = product.ownerSale?.casePath === xcmgSale.casePath;
  const ownerSaleTerms = isXcmgOwnerSale ? xcmgSale.terms[language] : catSale.terms[language];
  const fixedOffer = Boolean(product.approvedSale || product.ownerSale || product.ownerProduct);
  const displayedPrice = product.minPriceKzt !== null
    ? `${fixedOffer ? "" : `${copy.fromPrice} `}${formatKzt(product.minPriceKzt, language)}`
    : copy.priceOnRequest;
  const merchantOffer = merchantPumps.products.find(offer => offer.handle === product.handle);
  const merchantShippingPriceKzt = merchantOffer && Object.hasOwn(merchantOffer, "shippingPriceKzt")
    ? merchantOffer.shippingPriceKzt
    : merchantPumps.shippingPriceKzt;
  const merchantTerms = merchantOffer?.terms?.[language] || merchantPumps.terms[language];
  const merchantDeliveryTime = merchantOffer
    && [merchantOffer.handlingMinDays, merchantOffer.handlingMaxDays, merchantOffer.transitMinDays, merchantOffer.transitMaxDays].every(Number.isFinite)
    ? {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: merchantOffer.handlingMinDays, maxValue: merchantOffer.handlingMaxDays, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: merchantOffer.transitMinDays, maxValue: merchantOffer.transitMaxDays, unitCode: "DAY" },
      }
    : merchantOffer && !Object.hasOwn(merchantOffer, "handlingMinDays")
      ? {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: merchantPumps.handlingMinDays, maxValue: merchantPumps.handlingMaxDays, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: merchantPumps.transitMinDays, maxValue: merchantPumps.transitMaxDays, unitCode: "DAY" },
        }
      : undefined;
  const mainSku = product.variants.find((variant) => variant.sku)?.sku || product.id;
  const fitmentText = product.fitment || copy.fitmentUnknown;
  const fitmentLabel = (product.approvedSale || product.ownerSale || product.ownerProduct)
    ? language === "ru" ? "Применяемость этого исполнения" : language === "kz" ? "Осы нұсқаның қолданылуы" : "Applications of this configuration"
    : copy.fitmentLabel;
  const seriesNote = (product.approvedSale || product.ownerSale || product.ownerProduct)
    ? language === "ru" ? "Насосы этой серии применяются на технике разных марок. Здесь указано одно из исполнений. Для вашей техники подберём подходящий вариант по шильдику, валу, фланцу, портам и регулятору. Одного совпадения модели насоса недостаточно." : language === "kz" ? "Бұл сериядағы сорғылар әртүрлі маркалы техникада қолданылады. Мұнда нұсқалардың бірі көрсетілген. Техникаңызға сәйкес нұсқаны тақтайша, білік, фланец, порттар және реттегіш бойынша таңдаймыз. Сорғы моделінің сәйкес келуі жеткіліксіз." : "This pump series is used on equipment from different brands. This page lists one configuration. We select the correct version for your machine using the nameplate, shaft, flange, ports and regulator. A matching pump model alone does not confirm compatibility."
    : "";
  const productSeo = catalogProductSeo(product, language);
  const productCategories = catalogProductCategories(product);
  const seoDescription = productSeo.description;
  const addProductToCart = () => {
    addItem(preferredCartItem(product));
    toast.success(language === "ru" ? "Товар добавлен в корзину" : language === "kz" ? "Тауар себетке қосылды" : "Added to cart");
  };

  return (
    <div className="min-h-[100dvh] bg-[#101010] pb-20 text-white font-roboto lg:pb-0">
      <SEO
        title={productSeo.title}
        description={seoDescription}
        canonical={`/catalog/${product.handle}`}
        ogImage={gallery[0]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: productSeo.name,
          description: seoDescription,
          image: gallery.map(image => new URL(image, "https://acahydraulic.kz").href),
          sku: mainSku,
          category: merchantOffer ? merchantPumps.productType : undefined,
          brand: (merchantOffer?.brand || product.brand) ? { "@type": "Brand", name: merchantOffer?.brand || product.brand } : undefined,
          mpn: merchantOffer?.mpn || product.mpn,
          itemCondition: fixedOffer ? "https://schema.org/NewCondition" : undefined,
          additionalProperty: product.fitment ? [{
            "@type": "PropertyValue",
            name: fitmentLabel,
            value: product.fitment,
          }] : undefined,
          offers: product.minPriceKzt !== null ? {
            "@type": fixedOffer ? "Offer" : "AggregateOffer",
            price: fixedOffer ? product.minPriceKzt : undefined,
            priceCurrency: "KZT",
            shippingDetails: merchantOffer ? {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: merchantShippingPriceKzt, currency: "KZT" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "KZ" },
              deliveryTime: merchantDeliveryTime,
            } : undefined,
            availability: merchantOffer ? schemaAvailability(merchantOffer.availability) : undefined,
            lowPrice: fixedOffer ? undefined : product.minPriceKzt,
            highPrice: fixedOffer ? undefined : product.maxPriceKzt ?? product.minPriceKzt,
            offerCount: fixedOffer ? undefined : product.variants.length,
            url: `https://acahydraulic.kz/catalog/${product.handle}/`,
          } : undefined,
        }}
        breadcrumbs={[
          { name: "Каталог запчастей", url: "/catalog/" },
          ...productCategories.slice(0, 1).map(category => ({ name: category.title, url: `/catalog/category/${category.id}/` })),
          { name: productSeo.name, url: `/catalog/${product.handle}` },
        ]}
      />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101010]/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <SiteHomeLink className="flex items-center gap-3" aria-label="ACA Hydraulic">
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
          </SiteHomeLink>
          <div className="flex items-center gap-2">
            <CartButton />
            <CatalogLanguageControl language={language} onChange={setLanguage} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <Link href="/catalog" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#FFC000]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.backToCatalog}
        </Link>

        <nav aria-label="Разделы каталога" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {productCategories.map(category => (
            <Link key={category.id} href={`/catalog/category/${category.id}/`} className="inline-flex min-h-10 items-center text-sm text-[#FFC000] underline underline-offset-4">{category.title}</Link>
          ))}
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.08fr_0.92fr]">
          <section aria-label="Product photos" className="min-w-0">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              {selectedImage && !imageFailed ? (
                <img
                  src={selectedImage}
                  alt={productSeo.name}
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
                  {product.ownerEvidence ? "Пример маркировки узла" : "Фото товара"}
                </span>
              )}
            </div>

            {product.ownerEvidence && <p className="mt-3 text-sm leading-6 text-gray-400">{product.ownerEvidence.photoCaption}</p>}

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

          <div className="min-w-0 lg:py-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[#FFC000]">{categoryName}</p>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-gray-400">SKU: {mainSku}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight [overflow-wrap:anywhere] md:text-5xl">{productSeo.name}</h1>
            {productSeo.name !== product.title && <p className="mt-3 text-sm leading-relaxed text-gray-400" lang="en">{product.title}</p>}
            <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">{(product.ownerSale || product.ownerProduct) ? seoDescription : copy.productDescription}</p>

            <section className="aca-product-fitment-detail mt-6 border-l-2 border-[#FFC000] bg-white/[0.04] px-4 py-3" aria-labelledby="fitment-title">
              <h2 id="fitment-title" className="text-xs font-bold uppercase tracking-[0.1em] text-[#FFC000]">{fitmentLabel}</h2>
              <p className="mt-2 leading-relaxed text-gray-200">{fitmentText}</p>
              {product.catalogTitle && <p className="mt-2 text-sm leading-6 text-gray-400">{product.catalogTitle}</p>}
              {seriesNote && <p className="mt-3 text-sm leading-6 text-gray-300">{seriesNote}</p>}
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
              {product.ownerSale && <p className="mt-3 text-sm leading-6 text-gray-300">{ownerSaleTerms}</p>}
              {(product.approvedSale || product.ownerProduct) && <p className="mt-3 text-sm leading-6 text-gray-300">
                {merchantOffer ? merchantTerms : language === "ru" ? "Новый насос в сборе. Поставка под заказ по Казахстану — 3–14 дней. Доставка — от 3 долларов США за кг, оплачивается отдельно. Предоплата 100%. Итоговую стоимость доставки согласуем до оплаты. При браке — замена через сервисный центр. Исполнение проверяем по шильдику, валу, фланцу, портам и регулятору." : language === "kz" ? "Жаңа сорғы жинағы. Қазақстан бойынша тапсырыспен жеткізу — 3–14 күн. Жеткізу — кг үшін 3 АҚШ долларынан бастап, бөлек төленеді. Алдын ала төлем 100%. Жеткізудің толық құны төлемге дейін келісіледі. Ақау болса — сервис орталығы арқылы ауыстыру. Сәйкестік тақтайша, білік, фланец, порттар және реттегіш бойынша тексеріледі." : "New complete pump assembly. Supply to order across Kazakhstan in 3–14 days. Shipping from USD 3 per kg, charged separately. 100% prepayment. Final shipping cost agreed before payment. Defective units replaced through our service center. We check the nameplate, shaft, flange, ports and regulator for compatibility."}
              </p>}
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={addProductToCart}
                  className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3.5 text-base font-extrabold text-black transition-colors hover:bg-[#E6AC00] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  {language === "ru" ? "В корзину" : language === "kz" ? "Себетке" : "Add to cart"}
                </button>
                <button
                  type="button"
                  onClick={() => requestProduct()}
                  className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded border border-[#FFC000]/60 px-6 py-3.5 text-base font-bold text-[#FFC000] transition-colors hover:bg-[#FFC000]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {copy.requestButton}
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500">{copy.requestNote}</p>
              <div className="mt-4 flex flex-col items-start gap-3 text-sm">
                <button type="button" onClick={() => requestProduct("nameplate")} className="min-h-11 text-[#FFC000] underline underline-offset-4">
                  {language === "ru" ? "Отправить фото шильдика в WhatsApp" : language === "kz" ? "WhatsApp арқылы шильдик фотосын жіберу" : "Send a nameplate photo in WhatsApp"}
                </button>
                <button type="button" onClick={() => requestProduct("invoice")} className="min-h-11 text-white underline underline-offset-4">
                  {language === "ru" ? "Запросить счёт в WhatsApp" : language === "kz" ? "WhatsApp арқылы шот сұрату" : "Request an invoice in WhatsApp"}
                </button>
                <p className="text-gray-400">{language === "ru" ? "Фото и файл с реквизитами прикрепите в открывшемся чате. Счёт подготовим после согласования детали, цены и срока." : language === "kz" ? "Фото мен деректемелер файлын ашылған чатқа тіркеңіз. Шот бөлшек, баға және мерзім келісілгеннен кейін дайындалады." : "Attach your photo or company details in the chat. We prepare the invoice after confirming the part, price and lead time."}</p>
              </div>
            </div>

            {product.ownerSale && (isXcmgOwnerSale ? (
              <section className="mt-8">
                <h2 className="text-2xl font-bold">Этот насос поставили и установили через ACA Hydraulic</h2>
                <p className="my-4 text-gray-300">Новый насос XCMG 803001730 продан за 1 350 000 ₸ и установлен на буровую установку клиента. В карточке использованы реальные фото и видео заказа.</p>
                <XcmgXz200PumpMedia />
                <Link href={xcmgSale.casePath} className="mt-4 inline-flex min-h-11 items-center font-bold text-[#FFC000] underline">Кейс: XCMG XZ200 и насос 803001730</Link>
              </section>
            ) : (
              <section className="mt-8"><h2 className="text-2xl font-bold">Этот насос уже покупали в ACA Hydraulic</h2><p className="my-4 text-gray-300">Продали новый насос для CAT 432E. По обратной связи клиента, он остался доволен покупкой.</p><Cat432eSaleMedia /><Link href={catSale.casePath} className="mt-4 inline-flex min-h-11 items-center font-bold text-[#FFC000] underline">Кейс продажи: CAT 432E и насос 267-2755</Link></section>
            ))}
            {product.ownerProduct && <section className="mt-8 rounded-lg border border-[#FFC000]/30 bg-[#FFC000]/5 p-5"><h2 className="text-xl font-bold">Подтверждено по реальному товару</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-gray-300"><li>HANDOK HYDRAULIC, модель H5V80DTP-12T.</li><li>Номер детали YKSKR-9K00, маркировка Made in Korea.</li><li>Цена 2 530 000 ₸, доставка по Казахстану включена.</li></ul><div className="mt-4 flex flex-col items-start gap-2"><Link href="/cases/postavka-zamena-gidronasosa/#hitachi-order" className="inline-flex min-h-11 items-center font-bold text-[#FFC000] underline underline-offset-4">Реальный заказ HANDOK для Hitachi ZX160W</Link><Link href="/blog/k5v80dtp-handok-hitachi-zx160w/" className="inline-flex min-h-11 items-center font-bold text-[#FFC000] underline underline-offset-4">Как проверить H5V80DTP и K5V80DTP перед заказом</Link></div></section>}
            {product.ownerEvidence && <section className="mt-8 rounded-lg border border-[#FFC000]/30 bg-[#FFC000]/5 p-5"><h2 className="text-xl font-bold">{product.ownerEvidence.heading}</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-gray-300">{product.ownerEvidence.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></section>}
            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.slice(0, 8).map((tag) => (
                  <span key={tag} className="rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {language === "ru" && <section className="mt-10 rounded-lg border border-white/10 bg-[#151515] p-5 md:p-7" aria-labelledby="selection-title">
          <h2 id="selection-title" className="text-xl font-bold">Что прислать для подбора этой запчасти</h2>
          <p className="mt-3 max-w-4xl leading-relaxed text-gray-300">{catalogProductSelection(product)}</p>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-400">Укажите количество, город и нужную дату. Совпадения только модели техники недостаточно: исполнение, комплектацию, цену и срок поставки подтверждаем до оплаты.</p>
          <button type="button" onClick={() => requestProduct("nameplate")} className="mt-4 min-h-11 font-bold text-[#FFC000] underline underline-offset-4">Отправить данные для подбора</button>
        </section>}

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
                <button
                  type="button"
                  onClick={() => {
                    addItem(cartItemFromProduct(product, variant));
                    toast.success(language === "ru" ? "Исполнение добавлено в корзину" : language === "kz" ? "Нұсқа себетке қосылды" : "Variant added to cart");
                  }}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-4 font-extrabold text-black hover:bg-[#E6AC00]"
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                  {language === "ru" ? "Добавить это исполнение" : language === "kz" ? "Осы нұсқаны қосу" : "Add this variant"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 flex gap-4 border-l-2 border-[#FFC000] bg-[#151515] p-6">
          <ShieldCheck className="h-7 w-7 shrink-0 text-[#FFC000]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-bold">{copy.qualityTitle}</h2>
            <p className="mt-2 leading-relaxed text-gray-400">{copy.qualityText}</p>
            <Link href="/delivery-and-returns/" className="mt-3 inline-flex min-h-11 items-center text-[#FFC000] underline">{language === "ru" ? "Доставка, оплата и возврат" : language === "kz" ? "Жеткізу, төлем және қайтару" : "Delivery, payment and returns"}</Link>
          </div>
        </section>
        {product.category === "hydraulic-pumps" && <div className="mt-12"><PumpCaseTeaser /></div>}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#101010]/95 p-3 shadow-[0_-12px_30px_rgba(0,0,0,0.45)] backdrop-blur lg:hidden">
        <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-2">
          <button type="button" onClick={addProductToCart} className="flex min-h-12 items-center justify-center gap-2 rounded bg-[#FFC000] px-3 py-3 text-sm font-extrabold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {language === "ru" ? "В корзину" : language === "kz" ? "Себетке" : "Add"}
          </button>
          <button type="button" onClick={() => requestProduct("nameplate", "product_page_sticky")} className="flex min-h-12 items-center justify-center gap-2 rounded border border-[#FFC000] px-3 py-3 text-sm font-bold text-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            {language === "ru" ? "Проверить" : language === "kz" ? "Тексеру" : "Check fit"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { FormEvent, useDeferredValue, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Boxes,
  Check,
  ChevronRight,
  CircuitBoard,
  Cog,
  Fan,
  Fuel,
  Gauge,
  MessageCircle,
  Monitor,
  PackageCheck,
  PackageSearch,
  Search,
  ScanLine,
  Settings,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { SEO } from "@/components/SEO";
import { ProductResults } from "@/components/catalog/ProductResults";
import { catalogCopy, partCategories, supportedBrands, type CatalogLanguage } from "@/content/partsCatalog";
import { useCatalogIndex } from "@/hooks/useCatalogProducts";
import { useTikTokContact } from "@/hooks/useTikTokEvents";

const categoryIcons = [Gauge, Settings, Cog, Boxes, Wrench, CircuitBoard, Monitor, PackageCheck, Fuel, Fan, ScanLine, PackageSearch];
const WHATSAPP_NUMBER = "77714177925";

export default function Catalog() {
  const [language, setLanguage] = useState<CatalogLanguage>("ru");
  const [partQuery, setPartQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [machineModel, setMachineModel] = useState("");
  const [category, setCategory] = useState("");
  const [formError, setFormError] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const copy = catalogCopy[language];
  const { products, loading, error } = useCatalogIndex();
  const fireContact = useTikTokContact();
  const deferredQuery = useDeferredValue(`${partQuery} ${machineModel}`.trim().toLowerCase());

  const selectedCategory = useMemo(
    () => partCategories.find((item) => item.id === category),
    [category],
  );

  const filteredProducts = useMemo(() => {
    const brandNeedle = brand.toLowerCase();
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      const haystack = `${product.title} ${product.tags.join(" ")}`.toLowerCase();
      if (brandNeedle && !haystack.includes(brandNeedle)) return false;
      if (deferredQuery) {
        const terms = deferredQuery.split(/\s+/).filter(Boolean);
        if (!terms.every((term) => haystack.includes(term))) return false;
      }
      return true;
    });
  }, [brand, category, deferredQuery, products]);

  const openWhatsApp = (event?: FormEvent) => {
    event?.preventDefault();
    if (!partQuery.trim() && !machineModel.trim()) {
      setFormError(copy.emptyQuery);
      return;
    }

    setFormError("");
    const categoryName = selectedCategory?.[language] || copy.allCategories;
    const lines = [
      copy.whatsappIntro,
      `${copy.whatsappPart}: ${partQuery.trim() || "-"}`,
      `${copy.whatsappBrand}: ${brand || "-"}`,
      `${copy.whatsappModel}: ${machineModel.trim() || "-"}`,
      `${copy.whatsappCategory}: ${categoryName}`,
      copy.whatsappPhoto,
    ];
    fireContact("whatsapp");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto">
      <SEO
        title="Запчасти для спецтехники: подбор по номеру и модели"
        description="Подбор гидравлических и электронных запчастей для CAT, Komatsu, Hitachi, Volvo, SANY, XCMG и другой спецтехники. Проверка совместимости и заявка в WhatsApp."
        keywords="запчасти для спецтехники Казахстан, гидронасос купить, гидромотор, запчасти экскаваторов, CAT, Komatsu, Hitachi"
        canonical="/catalog"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Каталог запчастей ACA Hydraulic",
          url: "https://acahydraulic.kz/catalog/",
          inLanguage: ["ru-KZ", "kk-KZ", "en"],
          about: "Запчасти для гидравлических систем и спецтехники",
        }}
        breadcrumbs={[{ name: "Каталог запчастей", url: "/catalog" }]}
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
                className={`min-h-10 min-w-10 rounded px-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] ${
                  language === item ? "bg-[#FFC000] text-black" : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-white/10 bg-[#151515]">
          <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#FFC000]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {copy.backToService}
            </Link>
            <div className="max-w-3xl">
              <h1 className="font-bebas text-4xl font-bold uppercase leading-tight tracking-wide md:text-6xl">
                {copy.pageTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">{copy.pageDescription}</p>
            </div>

            <form onSubmit={openWhatsApp} className="mt-8 border border-white/15 bg-[#0d0d0d] p-4 md:p-6" noValidate>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="grid gap-2 text-sm font-medium text-white xl:col-span-2">
                  {copy.searchLabel}
                  <span className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <input
                      value={partQuery}
                      onChange={(event) => setPartQuery(event.target.value)}
                      placeholder={copy.searchPlaceholder}
                      className="min-h-12 w-full rounded border border-white/20 bg-[#181818] py-3 pl-11 pr-3 text-base text-white placeholder:text-gray-500 focus:border-[#FFC000] focus:outline-none"
                    />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-medium text-white">
                  {copy.brandLabel}
                  <select
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    className="min-h-12 rounded border border-white/20 bg-[#181818] px-3 text-base text-white focus:border-[#FFC000] focus:outline-none"
                  >
                    <option value="">{copy.brandPlaceholder}</option>
                    {supportedBrands.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-white">
                  {copy.categoryLabel}
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="min-h-12 rounded border border-white/20 bg-[#181818] px-3 text-base text-white focus:border-[#FFC000] focus:outline-none"
                  >
                    <option value="">{copy.allCategories}</option>
                    {partCategories.map((item) => <option key={item.id} value={item.id}>{item[language]}</option>)}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-white md:col-span-2 xl:col-span-3">
                  {copy.modelLabel}
                  <input
                    value={machineModel}
                    onChange={(event) => setMachineModel(event.target.value)}
                    placeholder={copy.modelPlaceholder}
                    className="min-h-12 rounded border border-white/20 bg-[#181818] px-3 text-base text-white placeholder:text-gray-500 focus:border-[#FFC000] focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 self-end rounded bg-[#FFC000] px-5 font-bold text-black transition-colors hover:bg-[#E6AC00] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  {copy.findButton}
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{copy.helper}</p>
              {formError && <p className="mt-3 text-sm font-medium text-[#FFD24A]" role="alert">{formError}</p>}
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16" aria-labelledby="categories-title">
          <h2 id="categories-title" className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.categoriesTitle}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-gray-400">{copy.categoriesDescription}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partCategories.map((item, index) => {
              const Icon = categoryIcons[index];
              const active = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(active ? "" : item.id)}
                  aria-pressed={active}
                  className={`group flex min-h-24 items-center gap-4 rounded border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] ${
                    active ? "border-[#FFC000] bg-[#FFC000]/10" : "border-white/10 bg-[#151515] hover:border-white/30"
                  }`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded bg-[#FFC000]/10 text-[#FFC000]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="flex flex-1 items-center justify-between gap-3 font-semibold">
                    {item[language]}
                    <ChevronRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:text-[#FFC000]" aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-14 border-t border-white/10 pt-10" aria-live="polite">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.resultsTitle}</h2>
              {!loading && !error && <p className="text-sm text-gray-400">{filteredProducts.length.toLocaleString()} {copy.productsFound}</p>}
            </div>
            <ProductResults
              copy={copy}
              language={language}
              products={filteredProducts.slice(0, visibleCount)}
              total={filteredProducts.length}
              loading={loading}
              error={error}
              canLoadMore={visibleCount < filteredProducts.length}
              onLoadMore={() => setVisibleCount((count) => count + 24)}
            />
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#151515]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
            <div>
              <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.brandsTitle}</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-gray-400">{copy.brandsDescription}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {supportedBrands.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setBrand(brand === item ? "" : item)}
                    aria-pressed={brand === item}
                    className={`min-h-10 rounded border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] ${
                      brand === item ? "border-[#FFC000] bg-[#FFC000] text-black" : "border-white/15 bg-[#0e0e0e] text-gray-200 hover:border-white/35"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-l-2 border-[#FFC000] bg-[#0e0e0e] p-6 md:p-8">
              <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide">{copy.processTitle}</h2>
              <ol className="mt-6 grid gap-5">
                {copy.process.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-300 md:text-base">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC000]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded border border-white/10 bg-[#151515] p-6">
              <Truck className="h-7 w-7 text-[#FFC000]" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-bold">{copy.deliveryTitle}</h2>
              <p className="mt-3 leading-relaxed text-gray-400">{copy.deliveryText}</p>
            </article>
            <article className="rounded border border-white/10 bg-[#151515] p-6">
              <ShieldCheck className="h-7 w-7 text-[#FFC000]" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-bold">{copy.qualityTitle}</h2>
              <p className="mt-3 leading-relaxed text-gray-400">{copy.qualityText}</p>
            </article>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-6 border border-[#FFC000]/45 bg-[#FFC000]/5 p-6 md:flex-row md:items-center md:p-8">
            <div>
              <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide">{copy.requestTitle}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-gray-300">{copy.requestDescription}</p>
              <p className="mt-2 text-sm text-gray-500">{copy.requestNote}</p>
            </div>
            <button
              type="button"
              onClick={() => openWhatsApp()}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded bg-[#FFC000] px-6 font-bold text-black hover:bg-[#E6AC00] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {copy.requestButton}
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#090909]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <div>
            <strong className="text-white">ACA Hydraulic</strong>
            <p className="mt-1">Астана, трасса Астана-Караганда, 81</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+77714177925" className="font-semibold text-[#FFC000] hover:text-[#FFD24A]">+7 (771) 417-79-25</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#FFC000] hover:text-[#FFD24A]">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

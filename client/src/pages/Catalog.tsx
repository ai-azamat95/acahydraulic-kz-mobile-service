import { FormEvent, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
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
const categoryImageOverrides: Record<string, string> = {
  "final-drives": "/catalog-assets/final-drive-category.jpg",
};

function categoryThumbnail(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname === "sinocmp.com" || url.hostname === "cdn.shopify.com") {
      url.searchParams.set("width", "480");
    }
    return url.href;
  } catch {
    return source;
  }
}

type SearchMode = "part" | "oem" | "vin";

const enhancementCopy = {
  ru: {
    searchModes: [
      { id: "part", label: "Номер / название", placeholder: "K5V160DT, 90R055, гидронасос..." },
      { id: "oem", label: "OEM номер", placeholder: "Введите OEM / артикул производителя" },
      { id: "vin", label: "VIN / серийный №", placeholder: "Введите VIN или серийный номер техники" },
    ],
    catalogSearch: "Найти в каталоге",
    whatsappPick: "Подобрать в WhatsApp",
    vinNote: "Подбор по VIN и серийному номеру требует ручной сверки комплектации — заявка откроется в WhatsApp.",
    promoTitle: "Спецпредложения",
    promoCode: "Промокод",
    promos: [
      { eyebrow: "Первый заказ", title: "Скидка 5%", text: "Используйте промокод ACA5 при первом заказе запчастей.", badge: "ACA5" },
      { eyebrow: "Точный подбор", title: "OEM • модель • шильдик", text: "Сверяем номер, исполнение, разъёмы, вал, фланец и порты до оплаты.", badge: "CHECK" },
      { eyebrow: "Варианты поставки", title: "Оригинал • Китай • Корея", text: "Предложим несколько вариантов по цене и сроку — без подмены позиции.", badge: "OEM" },
    ],
    supplyTitle: "Какой вариант нужен?",
    supplyText: "Выберите предпочтение — оно попадёт в заявку менеджеру.",
    supplyOptions: ["Оригинал OEM", "Китайский аналог", "Корейский аналог", "Проверенный аналог"],
    categoriesHint: "Нажмите категорию — сразу покажем подходящие товары ниже.",
    showAll: "Все товары",
    searchType: "Тип поиска",
    supplyType: "Вариант поставки",
  },
  kz: {
    searchModes: [
      { id: "part", label: "Нөмір / атауы", placeholder: "K5V160DT, 90R055, гидросорғы..." },
      { id: "oem", label: "OEM нөмірі", placeholder: "OEM / өндіруші артикулын енгізіңіз" },
      { id: "vin", label: "VIN / сериялық №", placeholder: "VIN немесе техника сериялық нөмірін енгізіңіз" },
    ],
    catalogSearch: "Каталогтан табу",
    whatsappPick: "WhatsApp арқылы іріктеу",
    vinNote: "VIN және сериялық нөмір бойынша іріктеу комплектацияны қолмен тексеруді талап етеді — өтінім WhatsApp-та ашылады.",
    promoTitle: "Арнайы ұсыныстар",
    promoCode: "Промокод",
    promos: [
      { eyebrow: "Алғашқы тапсырыс", title: "5% жеңілдік", text: "Алғашқы қосалқы бөлшек тапсырысында ACA5 промокодын қолданыңыз.", badge: "ACA5" },
      { eyebrow: "Дәл іріктеу", title: "OEM • модель • тақтайша", text: "Төлемге дейін нөмірді, орындалуын, қосқыштарды, білікті, фланецті және порттарды тексереміз.", badge: "CHECK" },
      { eyebrow: "Жеткізу нұсқалары", title: "Түпнұсқа • Қытай • Корея", text: "Баға мен мерзім бойынша бірнеше нұсқа ұсынамыз — позицияны алмастырмаймыз.", badge: "OEM" },
    ],
    supplyTitle: "Қай нұсқа қажет?",
    supplyText: "Қалауыңызды таңдаңыз — ол менеджерге өтініммен бірге түседі.",
    supplyOptions: ["Түпнұсқа OEM", "Қытай баламасы", "Корея баламасы", "Тексерілген балама"],
    categoriesHint: "Санатты басыңыз — төменде сәйкес тауарлар бірден көрсетіледі.",
    showAll: "Барлық тауарлар",
    searchType: "Іздеу түрі",
    supplyType: "Жеткізу нұсқасы",
  },
  en: {
    searchModes: [
      { id: "part", label: "Part / description", placeholder: "K5V160DT, 90R055, hydraulic pump..." },
      { id: "oem", label: "OEM number", placeholder: "Enter OEM / manufacturer part number" },
      { id: "vin", label: "VIN / serial no.", placeholder: "Enter machine VIN or serial number" },
    ],
    catalogSearch: "Search catalogue",
    whatsappPick: "Source on WhatsApp",
    vinNote: "VIN and serial-number sourcing requires a manual configuration check, so the request opens in WhatsApp.",
    promoTitle: "Special offers",
    promoCode: "Promo code",
    promos: [
      { eyebrow: "First order", title: "5% off", text: "Use promo code ACA5 on your first parts order.", badge: "ACA5" },
      { eyebrow: "Exact fitment", title: "OEM • model • nameplate", text: "We verify the number, configuration, connectors, shaft, flange and ports before payment.", badge: "CHECK" },
      { eyebrow: "Supply options", title: "Genuine • China • Korea", text: "We can quote multiple options by price and lead time without substituting the part.", badge: "OEM" },
    ],
    supplyTitle: "Which supply option do you need?",
    supplyText: "Choose a preference and it will be included in the sourcing request.",
    supplyOptions: ["Genuine OEM", "Chinese alternative", "Korean alternative", "Verified aftermarket"],
    categoriesHint: "Tap a category and we will jump straight to matching products below.",
    showAll: "All products",
    searchType: "Search type",
    supplyType: "Supply option",
  },
} as const;

export default function Catalog() {
  const [language, setLanguage] = useState<CatalogLanguage>("ru");
  const [partQuery, setPartQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [machineModel, setMachineModel] = useState("");
  const [category, setCategory] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("part");
  const [supplyOption, setSupplyOption] = useState("");
  const [formError, setFormError] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [promoIndex, setPromoIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const copy = catalogCopy[language];
  const ui = enhancementCopy[language];
  const { products, loading, error } = useCatalogIndex();
  const fireContact = useTikTokContact();
  const deferredQuery = useDeferredValue(`${searchMode === "vin" ? "" : partQuery} ${machineModel}`.trim().toLowerCase());
  const activeSearchMode = ui.searchModes.find((item) => item.id === searchMode) || ui.searchModes[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromoIndex((index) => (index + 1) % ui.promos.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [ui.promos.length]);

  useEffect(() => {
    setPromoIndex(0);
  }, [language]);

  const selectedCategory = useMemo(
    () => partCategories.find((item) => item.id === category),
    [category],
  );

  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; imageUrl: string | null }> = {};
    for (const item of partCategories) stats[item.id] = { count: 0, imageUrl: null };
    for (const product of products) {
      const stat = stats[product.category];
      if (!stat) continue;
      stat.count += 1;
      if (!stat.imageUrl && product.imageUrl) stat.imageUrl = product.imageUrl;
    }
    return stats;
  }, [products]);

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

  const scrollToResults = () => {
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openWhatsApp = (event?: FormEvent) => {
    event?.preventDefault();
    if (!partQuery.trim() && !machineModel.trim() && !brand && !category) {
      setFormError(copy.emptyQuery);
      return;
    }

    setFormError("");
    const categoryName = selectedCategory?.[language] || copy.allCategories;
    const lines = [
      copy.whatsappIntro,
      `${ui.searchType}: ${activeSearchMode.label}`,
      `${copy.whatsappPart}: ${partQuery.trim() || "-"}`,
      `${copy.whatsappBrand}: ${brand || "-"}`,
      `${copy.whatsappModel}: ${machineModel.trim() || "-"}`,
      `${copy.whatsappCategory}: ${categoryName}`,
      `${ui.supplyType}: ${supplyOption || "-"}`,
      copy.whatsappPhoto,
    ];
    fireContact("whatsapp");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  };

  const searchCatalog = (event: FormEvent) => {
    event.preventDefault();
    if (!partQuery.trim() && !machineModel.trim() && !brand && !category) {
      setFormError(copy.emptyQuery);
      return;
    }
    if (searchMode === "vin") {
      openWhatsApp();
      return;
    }
    setFormError("");
    setVisibleCount(24);
    scrollToResults();
  };

  const chooseCategory = (categoryId: string) => {
    const nextCategory = category === categoryId ? "" : categoryId;
    setCategory(nextCategory);
    setVisibleCount(24);
    setFormError("");
    scrollToResults();
  };

  const chooseBrand = (brandName: string) => {
    setBrand(brand === brandName ? "" : brandName);
    setVisibleCount(24);
    scrollToResults();
  };

  const promo = ui.promos[promoIndex];

  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto">
      <SEO
        title="Запчасти для спецтехники: подбор по номеру, OEM и VIN"
        description="Подбор гидравлических и электронных запчастей по номеру, OEM, VIN и модели техники. CAT, Komatsu, Hitachi, Volvo, SANY, XCMG и другие бренды."
        keywords="запчасти для спецтехники Казахстан, OEM запчасти, поиск по VIN, гидронасос купить, гидромотор, CAT, Komatsu, Hitachi"
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

      <main id="catalog-top">
        <section className="overflow-hidden border-b border-white/10 bg-[#151515]">
          <div className="mx-auto max-w-7xl px-4 py-7 md:py-11">
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#FFC000]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {copy.backToService}
            </Link>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <div>
                <div className="max-w-3xl">
                  <h1 className="font-bebas text-4xl font-bold uppercase leading-tight tracking-wide md:text-6xl">
                    {copy.pageTitle}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">{copy.pageDescription}</p>
                </div>

                <div className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label={ui.searchType}>
                  {ui.searchModes.map((item) => {
                    const active = searchMode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSearchMode(item.id as SearchMode);
                          setFormError("");
                        }}
                        aria-pressed={active}
                        className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold transition-colors ${
                          active ? "border-[#FFC000] bg-[#FFC000] text-black" : "border-white/15 bg-[#0e0e0e] text-gray-200 hover:border-white/35"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <form id="catalog-search" onSubmit={searchCatalog} className="mt-3 rounded-xl border border-white/15 bg-[#0d0d0d] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.28)] md:p-5" noValidate>
                  <label className="grid gap-2 text-sm font-medium text-white">
                    {activeSearchMode.label}
                    <span className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#FFC000]" aria-hidden="true" />
                      <input
                        value={partQuery}
                        onChange={(event) => setPartQuery(event.target.value)}
                        placeholder={activeSearchMode.placeholder}
                        inputMode="search"
                        className="min-h-14 w-full rounded-lg border border-white/20 bg-[#181818] py-3 pl-11 pr-3 text-base font-medium text-white placeholder:text-gray-500 focus:border-[#FFC000] focus:outline-none"
                      />
                    </span>
                  </label>

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    <label className="grid gap-2 text-xs font-medium text-gray-300 md:text-sm">
                      {copy.brandLabel}
                      <select
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)}
                        className="min-h-11 min-w-0 rounded border border-white/20 bg-[#181818] px-2 text-sm text-white focus:border-[#FFC000] focus:outline-none"
                      >
                        <option value="">{copy.brandPlaceholder}</option>
                        {supportedBrands.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </label>

                    <label className="grid gap-2 text-xs font-medium text-gray-300 md:text-sm">
                      {copy.categoryLabel}
                      <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="min-h-11 min-w-0 rounded border border-white/20 bg-[#181818] px-2 text-sm text-white focus:border-[#FFC000] focus:outline-none"
                      >
                        <option value="">{copy.allCategories}</option>
                        {partCategories.map((item) => <option key={item.id} value={item.id}>{item[language]}</option>)}
                      </select>
                    </label>

                    <label className="col-span-2 grid gap-2 text-xs font-medium text-gray-300 md:col-span-1 md:text-sm">
                      {copy.modelLabel}
                      <input
                        value={machineModel}
                        onChange={(event) => setMachineModel(event.target.value)}
                        placeholder={copy.modelPlaceholder}
                        className="min-h-11 min-w-0 rounded border border-white/20 bg-[#181818] px-3 text-sm text-white placeholder:text-gray-500 focus:border-[#FFC000] focus:outline-none"
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="submit"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FFC000] px-5 font-extrabold text-black transition-colors hover:bg-[#E6AC00] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                    >
                      <Search className="h-5 w-5" aria-hidden="true" />
                      {searchMode === "vin" ? ui.whatsappPick : ui.catalogSearch}
                    </button>
                    <button
                      type="button"
                      onClick={() => openWhatsApp()}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#FFC000]/50 bg-[#FFC000]/5 px-5 font-bold text-[#FFD24A] transition-colors hover:bg-[#FFC000]/10"
                    >
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
                      {ui.whatsappPick}
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{searchMode === "vin" ? ui.vinNote : copy.helper}</p>
                  {formError && <p className="mt-3 text-sm font-medium text-[#FFD24A]" role="alert">{formError}</p>}
                </form>
              </div>

              <div className="aca-mobile-promos">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ui.promos[0].text)}`} target="_blank" rel="noopener noreferrer" aria-label={ui.promos[0].text}>
                  <img src="/catalog-assets/promo-first-order.jpg" width="900" height="300" alt={ui.promos[0].text} fetchPriority="high" />
                </a>
                <a href="#catalog-delivery" aria-label={copy.deliveryTitle}>
                  <img src="/catalog-assets/promo-china-delivery.jpg" width="900" height="300" alt={copy.deliveryTitle} loading="lazy" decoding="async" />
                </a>
              </div>
              <aside className="relative min-h-[310px] overflow-hidden rounded-xl border border-[#FFC000]/35 bg-[radial-gradient(circle_at_80%_10%,rgba(255,192,0,0.25),transparent_34%),linear-gradient(145deg,#171717,#090909)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.32)] md:p-8">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-[#FFC000]/15" aria-hidden="true" />
                <div className="absolute -right-2 top-8 h-24 w-24 rounded-full border border-[#FFC000]/10" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFC000]">{ui.promoTitle}</p>
                <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-gray-400">{promo.eyebrow}</p>
                <h2 className="mt-2 font-bebas text-4xl font-bold uppercase leading-none tracking-wide md:text-5xl">{promo.title}</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300 md:text-base">{promo.text}</p>

                <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-[#FFC000]/40 bg-black/40 px-4 py-3">
                  <span className="text-xs uppercase tracking-wider text-gray-400">{ui.promoCode}</span>
                  <strong className="text-xl tracking-[0.14em] text-[#FFC000]">{promo.badge}</strong>
                </div>

                <div className="mt-8 flex items-center gap-2" aria-label={ui.promoTitle}>
                  {ui.promos.map((item, index) => (
                    <button
                      key={item.badge}
                      type="button"
                      onClick={() => setPromoIndex(index)}
                      aria-label={`${ui.promoTitle} ${index + 1}`}
                      aria-pressed={index === promoIndex}
                      className={`h-2.5 rounded-full transition-all ${index === promoIndex ? "w-8 bg-[#FFC000]" : "w-2.5 bg-white/25 hover:bg-white/45"}`}
                    />
                  ))}
                </div>
              </aside>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 md:p-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white md:text-lg">{ui.supplyTitle}</h2>
                  <p className="mt-1 text-sm text-gray-400">{ui.supplyText}</p>
                </div>
                {supplyOption && (
                  <button type="button" onClick={() => setSupplyOption("")} className="text-xs font-semibold text-[#FFC000] hover:text-[#FFD24A]">
                    {ui.showAll}
                  </button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {ui.supplyOptions.map((item, index) => {
                  const Icon = [ShieldCheck, Boxes, Truck, Check][index];
                  const active = supplyOption === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSupplyOption(active ? "" : item)}
                      aria-pressed={active}
                      className={`flex min-h-16 items-center gap-2 rounded-lg border px-3 text-left text-xs font-bold transition-colors md:text-sm ${
                        active ? "border-[#FFC000] bg-[#FFC000] text-black" : "border-white/10 bg-[#151515] text-gray-200 hover:border-[#FFC000]/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 md:py-14" aria-labelledby="categories-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="categories-title" className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.categoriesTitle}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-gray-400">{ui.categoriesHint}</p>
            </div>
            {category && (
              <button
                type="button"
                onClick={() => chooseCategory(category)}
                className="min-h-10 rounded border border-white/15 bg-[#151515] px-4 text-sm font-bold text-gray-200 hover:border-[#FFC000]/50 hover:text-[#FFC000]"
              >
                {ui.showAll}
              </button>
            )}
          </div>

          <div className="aca-category-grid">
            {partCategories.map((item, index) => {
              const Icon = categoryIcons[index];
              const active = category === item.id;
              const stat = categoryStats[item.id];
              const imageUrl = categoryImageOverrides[item.id] || stat?.imageUrl;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseCategory(item.id)}
                  aria-pressed={active}
                  className="aca-category-card"
                >
                  <span className="aca-category-media">
                    <Icon className="aca-category-fallback" aria-hidden="true" />
                    {imageUrl && (
                      <img
                        key={imageUrl}
                        src={categoryThumbnail(imageUrl)}
                        alt=""
                        width="240"
                        height="160"
                        loading="lazy"
                        decoding="async"
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </span>
                  <span className="aca-category-label">{item[language]}</span>
                  <ChevronRight className="aca-category-arrow" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div ref={resultsRef} className="mt-12 scroll-mt-24 border-t border-white/10 pt-8" aria-live="polite">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.resultsTitle}</h2>
                {selectedCategory && <p className="mt-1 text-sm font-medium text-[#FFC000]">{selectedCategory[language]}</p>}
              </div>
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
                    onClick={() => chooseBrand(item)}
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

        <section id="catalog-delivery" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
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

      <nav className="aca-mobile-nav" aria-label={copy.pageTitle}>
        <a href="#categories-title"><Boxes aria-hidden="true" /><span>{copy.allCategories}</span></a>
        <a href="#catalog-delivery"><Truck aria-hidden="true" /><span>{copy.deliveryTitle}</span></a>
        <a className="aca-mobile-whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /><span>WhatsApp</span></a>
        <a href="tel:+77714177925"><Wrench aria-hidden="true" /><span>{language === "ru" ? "Поддержка" : language === "kz" ? "Қолдау" : "Support"}</span></a>
      </nav>

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

import catalogHomeSeo from "@shared/catalog-home-seo.json";
import { catalogProductName } from "@shared/catalog-product-seo.mjs";
import SiteHomeLink from "@/components/SiteHomeLink";
import CatalogDirectory from "@/components/catalog/CatalogDirectory";
import PumpSupplyOffers, { supplyPumpOffers, pumpSupplyLabels } from "@/components/catalog/PumpSupplyOffers";
import { pumpCasePath } from "@/content/pumpCases";
import { catalogSearchHref } from "@/lib/catalogLinks";
import { catalogMatchesQuery } from "@/lib/catalogSearch";
import { FormEvent, Fragment, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearch } from "wouter";
import {
  ArrowLeft,
  Boxes,
  Cable,
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
  SlidersHorizontal,
  Truck,
  Wrench,
} from "lucide-react";

import { SEO } from "@/components/SEO";
import { CartButton } from "@/components/cart/CartButton";
import { CatalogLanguageControl } from "@/components/catalog/CatalogLanguageControl";
import { ProductResults } from "@/components/catalog/ProductResults";
import { catalogCopy, partCategories, supportedBrands, type CatalogLanguage } from "@/content/partsCatalog";
import { useCatalogIndex } from "@/hooks/useCatalogProducts";
import { useTikTokContact } from "@/hooks/useTikTokEvents";
import { catalogAnalyticsItem, catalogSearchAnalyticsParams, trackCatalogEvent } from "@/lib/catalogAnalytics";
import {
  catalogBrandLandings,
  catalogCategoryLandings,
  categorySeoContent,
  categorySelectionGuide,
  extractBrandSlugs,
  extractModelLandings,
  landingSearchText,
  modelLandingFromSlug,
} from "@/lib/catalogLandings";

const categoryIcons: Record<(typeof partCategories)[number]["id"], typeof Gauge> = {
  "hydraulic-pumps": Gauge,
  "gear-pumps": Cog,
  "piston-pumps": Gauge,
  "main-control-valves": Wrench,
  "pump-parts": Settings,
  "hydraulic-motors": Cog,
  "final-drives": Boxes,
  "control-valves": Wrench,
  electrical: CircuitBoard,
  "wiring-harnesses": Cable,
  controllers: CircuitBoard,
  monitors: Monitor,
  "seals-filters": PackageCheck,
  "engine-fuel": Fuel,
  "engine-rebuild-kits": Settings,
  "fuel-injectors": Fuel,
  "fuel-pumps": Fuel,
  "fuel-common-rails": Fuel,
  "air-conditioning": Fan,
  "diagnostic-tools": ScanLine,
  "other-parts": PackageSearch,
};
const WHATSAPP_NUMBER = "77714177925";
const DEFAULT_VISIBLE_PRODUCTS = 24;
const ELECTRONICS_VISIBLE_PRODUCTS = 48;
const HYDRAULIC_PUMP_VISIBLE_PRODUCTS = 800;
const HYDRAULIC_PUMP_LOAD_MORE_BATCH = 200;
const completeEngineCategoryCopy: Record<CatalogLanguage, { title: string; subtitle: string }> = {
  ru: { title: "Двигатели в сборе", subtitle: "Поставка и монтаж" },
  kz: { title: "Қозғалтқыштар жинағы", subtitle: "Жеткізу және орнату" },
  en: { title: "Complete engines", subtitle: "Supply and installation" },
};
// Local representative product photos keep category navigation fast and consistent.
const categoryImageOverrides: Record<string, string> = {
  "hydraulic-pumps": "/catalog-assets/category-hydraulic-pump.jpg",
  "gear-pumps": "/catalog-assets/category-gear-pump.jpg",
  "piston-pumps": "/catalog-assets/category-piston-pump.jpg",
  "main-control-valves": "/catalog-assets/category-main-control-valve.jpg",
  "pump-parts": "/catalog-assets/category-pump-parts.jpg",
  "hydraulic-motors": "/catalog-assets/category-hydraulic-motor.jpg",
  "final-drives": "/catalog-assets/final-drive-category.jpg",
  "control-valves": "/catalog-assets/category-control-valve.jpg",
  "electrical": "/catalog-assets/category-electrical.jpg",
  "wiring-harnesses": "/catalog-assets/category-wiring-harness.jpg",
  controllers: "/catalog-assets/category-controller.jpg",
  monitors: "/catalog-assets/category-monitor.jpg",
  "seals-filters": "/catalog-assets/category-seals-filters.jpg",
  "engine-fuel": "/catalog-assets/category-engine-fuel.jpg",
  "engine-rebuild-kits": "/catalog-assets/category-engine-rebuild-kit.jpg",
  "fuel-injectors": "/catalog-assets/category-fuel-injector.jpg",
  "fuel-pumps": "/catalog-assets/category-fuel-pump.jpg",
  "fuel-common-rails": "/catalog-assets/category-fuel-common-rail.webp",
  "air-conditioning": "/catalog-assets/category-air-conditioning.jpg",
  "diagnostic-tools": "/catalog-assets/category-diagnostic-tools.jpg",
  "other-parts": "/catalog-assets/category-other-parts.jpg",
};

function categoryThumbnail(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname === "cdn.shopify.com" || url.hostname.endsWith(".shopify.com")) {
      url.searchParams.set("width", "480");
    }
    return url.href;
  } catch {
    return source;
  }
}

function categoryCountLabel(count: number, language: CatalogLanguage) {
  const locale = language === "kz" ? "kk-KZ" : language === "en" ? "en-US" : "ru-RU";
  const formattedCount = count.toLocaleString(locale);
  if (language === "kz") return `${formattedCount} тауар`;
  if (language === "en") return `${formattedCount} ${count === 1 ? "item" : "items"}`;
  const plural = new Intl.PluralRules("ru-RU").select(count);
  const noun = plural === "one" ? "товар" : plural === "few" ? "товара" : "товаров";
  return `${formattedCount} ${noun}`;
}

function initialVisibleProducts(category: string) {
  if (["controllers", "monitors"].includes(category)) return ELECTRONICS_VISIBLE_PRODUCTS;
  if (["gear-pumps", "piston-pumps", "hydraulic-motors", "main-control-valves", "wiring-harnesses", "fuel-injectors", "fuel-pumps", "fuel-common-rails", "engine-rebuild-kits"].includes(category)) return Number.MAX_SAFE_INTEGER;
  return category === "hydraulic-pumps" ? HYDRAULIC_PUMP_VISIBLE_PRODUCTS : DEFAULT_VISIBLE_PRODUCTS;
}

function visibleProductsLabel(visible: number, total: number, language: CatalogLanguage) {
  const locale = language === "kz" ? "kk-KZ" : language === "en" ? "en-US" : "ru-RU";
  const shown = Math.min(visible, total).toLocaleString(locale);
  const available = total.toLocaleString(locale);
  if (language === "kz") return `${shown} / ${available} тауар көрсетілді`;
  if (language === "en") return `Showing ${shown} of ${available} products`;
  return `Показано ${shown} из ${available} товаров`;
}

function catalogProgressLabel(loaded: number, total: number, language: CatalogLanguage) {
  const locale = language === "kz" ? "kk-KZ" : language === "en" ? "en-US" : "ru-RU";
  const ready = loaded.toLocaleString(locale);
  const available = total.toLocaleString(locale);
  if (language === "kz") return `${ready} / ${available} тауар жүктелді — қалғаны жүктелуде…`;
  if (language === "en") return `Loaded ${ready} of ${available} products — loading the rest…`;
  return `Загружено ${ready} из ${available} товаров — загружаем остальные…`;
}

function showAllProductsLabel(total: number, language: CatalogLanguage) {
  const locale = language === "kz" ? "kk-KZ" : language === "en" ? "en-US" : "ru-RU";
  const available = total.toLocaleString(locale);
  if (language === "kz") return `Барлық ${available} тауарды көрсету`;
  if (language === "en") return `Show all ${available} products`;
  return `Показать все ${available} товаров`;
}

type SearchMode = "part" | "oem" | "vin";

function categoryFromUrl() {
  if (typeof window === "undefined") return "";
  const requestedCategory = new URLSearchParams(window.location.search).get("category") || "";
  return partCategories.some((item) => item.id === requestedCategory) ? requestedCategory : "";
}

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
    categoriesHint: "Выберите категорию — откроется отдельная страница со всеми товарами раздела.",
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
    categoriesHint: "Санатты таңдаңыз — бөлімдегі барлық тауарлар жеке бетте ашылады.",
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
    categoriesHint: "Choose a category to open a dedicated page with all products in that section.",
    showAll: "All products",
    searchType: "Search type",
    supplyType: "Supply option",
  },
} as const;

export default function Catalog() {
  const params = useParams<{ categoryId?: string; brandSlug?: string; modelSlug?: string }>();
  const [, navigate] = useLocation();
  const urlSearch = useSearch();
  const urlQuery = new URLSearchParams(urlSearch).get("q") || "";
  const routeCategory = partCategories.some((item) => item.id === params.categoryId) ? params.categoryId || "" : "";
  const routeBrand = catalogBrandLandings.find((item) => item.slug === params.brandSlug);
  const routeModel = params.modelSlug ? modelLandingFromSlug(params.modelSlug) : null;
  const [language, setLanguage] = useState<CatalogLanguage>("ru");
  const [partQuery, setPartQuery] = useState(urlQuery);
  const [brand, setBrand] = useState(routeBrand?.name || "");
  const [machineModel, setMachineModel] = useState(routeModel?.label || "");
  const [category, setCategory] = useState(routeCategory || categoryFromUrl);
  const [searchMode, setSearchMode] = useState<SearchMode>("part");
  const [supplyOption, setSupplyOption] = useState("");
  const [formError, setFormError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() => initialVisibleProducts(category));
  const resultsRef = useRef<HTMLDivElement>(null);
  const trackedLandingRef = useRef("");
  const copy = catalogCopy[language];
  const ui = enhancementCopy[language];
  const { products, productCount, categorySummary, loading, error, complete } = useCatalogIndex();
  const fireContact = useTikTokContact();
  const deferredQuery = useDeferredValue(`${searchMode === "vin" ? "" : partQuery} ${machineModel}`.trim().toLowerCase());
  const activeSearchMode = ui.searchModes.find((item) => item.id === searchMode) || ui.searchModes[0];

  useEffect(() => {
    const nextCategory = routeCategory || (params.categoryId ? "" : categoryFromUrl());
    setCategory(nextCategory);
    setBrand(routeBrand?.name || "");
    setMachineModel(routeModel?.label || "");
    setVisibleCount(initialVisibleProducts(nextCategory));
    window.scrollTo(0, 0);
  }, [params.brandSlug, params.categoryId, params.modelSlug, routeBrand?.name, routeCategory, routeModel?.label]);

  const selectedCategory = useMemo(
    () => partCategories.find((item) => item.id === category),
    [category],
  );

  useEffect(() => {
    setPartQuery(urlQuery);
    setSearchMode("part");
    setFormError("");
    setVisibleCount(initialVisibleProducts(category));
    if (urlQuery) window.scrollTo(0, 0);
  }, [urlQuery]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; imageUrl: string | null }> = {};
    const hasPublishedSummary = Object.keys(categorySummary).length > 0;
    for (const item of partCategories) {
      const summary = categorySummary[item.id];
      stats[item.id] = { count: summary?.count || 0, imageUrl: summary?.imageUrl || null };
    }
    if (!hasPublishedSummary) {
      for (const product of products) {
        for (const categoryId of product.categories || [product.category]) {
          const stat = stats[categoryId];
          if (!stat) continue;
          stat.count += 1;
          if (!stat.imageUrl && product.imageUrl) stat.imageUrl = product.imageUrl;
        }
      }
    }
    return stats;
  }, [categorySummary, products]);

  const brandStats = useMemo(() => {
    const stats = new Map<string, number>();
    for (const product of products) {
      for (const slug of extractBrandSlugs(landingSearchText(product))) {
        stats.set(slug, (stats.get(slug) || 0) + 1);
      }
    }
    return stats;
  }, [products]);

  const modelStats = useMemo(() => {
    const stats = new Map<string, ReturnType<typeof extractModelLandings>[number] & { count: number }>();
    for (const product of products) {
      for (const model of extractModelLandings(landingSearchText(product))) {
        const current = stats.get(model.slug);
        stats.set(model.slug, { ...model, count: (current?.count || 0) + 1 });
      }
    }
    return Array.from(stats.values()).filter((item) => item.count >= 8).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [products]);

  const navigationModels = useMemo(() => {
    if (!category && !routeBrand && !routeModel) return modelStats;
    const counts = new Map<string, number>();
    for (const product of products) {
      if (category && !(product.categories || [product.category]).includes(category)) continue;
      const text = landingSearchText(product);
      if (routeBrand && !extractBrandSlugs(text).includes(routeBrand.slug)) continue;
      const models = extractModelLandings(text);
      if (routeModel && !models.some(model => model.slug === routeModel.slug)) continue;
      for (const model of models) counts.set(model.slug, (counts.get(model.slug) || 0) + 1);
    }
    return modelStats
      .filter(model => model.slug !== routeModel?.slug && (counts.get(model.slug) || 0) > 0)
      .map(model => ({ ...model, count: counts.get(model.slug)! }));
  }, [category, routeBrand?.slug, routeModel?.slug, modelStats, products]);

  const filterProducts = useCallback((query: string) => {
    const brandNeedle = brand.toLowerCase();
    return products.filter((product) => {
      if (category && !(product.categories || [product.category]).includes(category)) return false;
      const landingText = landingSearchText(product);
      const haystack = landingText.toLowerCase();
      if (routeBrand && !extractBrandSlugs(landingText).includes(routeBrand.slug)) return false;
      if (routeModel && !extractModelLandings(landingText).some((item) => item.slug === routeModel.slug)) return false;
      if (!routeBrand && brandNeedle && !haystack.includes(brandNeedle)) return false;
      if (query) {
        if (!catalogMatchesQuery(product, query)) return false;
      }
      return true;
    });
  }, [brand, category, products, routeBrand, routeModel]);

  const filteredProducts = useMemo(() => filterProducts(deferredQuery), [deferredQuery, filterProducts]);

  const matchingSupplyOffers = useMemo(() => {
    if (searchMode === "vin" || (category && category !== "hydraulic-pumps")) return [];
    return supplyPumpOffers.filter(offer =>
      (!brand || offer.brands.includes(brand.toLowerCase())) &&
      catalogMatchesQuery({ title: offer.name, fitment: null, sku: "", tags: offer.tags }, deferredQuery)
    );
  }, [brand, category, deferredQuery, searchMode]);

  const categoryLanding = catalogCategoryLandings.find((item) => item.id === category);
  const categorySeo = categorySeoContent(categoryLanding?.id);
  const selectionGuide = categorySelectionGuide(categoryLanding?.id);
  const landingPath = categoryLanding
    ? `/catalog/category/${categoryLanding.id}`
    : routeBrand
      ? `/catalog/brand/${routeBrand.slug}`
      : routeModel
        ? `/catalog/model/${routeModel.slug}`
        : "/catalog";
  const landingTitle = categoryLanding?.title
    || (routeBrand ? `Запчасти ${routeBrand.name} для спецтехники` : "")
    || (routeModel ? `Запчасти для ${routeModel.engine ? "двигателя" : "спецтехники"} ${routeModel.brand} ${routeModel.label}` : "")
    || catalogHomeSeo.title;
  const landingDescription = categoryLanding?.description
    || (routeBrand ? `Каталог запчастей ${routeBrand.name} для спецтехники. Подбор по OEM-номеру, модели и серийному номеру с проверкой совместимости до оплаты.` : "")
    || (routeModel ? `Запчасти для ${routeModel.brand} ${routeModel.label}: поиск по OEM-номеру и узлу, проверка исполнения и совместимости, поставка по Казахстану.` : "")
    || catalogHomeSeo.description;
  const isLandingPage = Boolean(categoryLanding || routeBrand || routeModel);
  const showResults = isLandingPage || Boolean(urlQuery);
  const hasActiveProductFilters = Boolean(deferredQuery || brand || routeBrand || routeModel);
  const expectedResultCount = !complete && category && !hasActiveProductFilters
    ? Math.max(filteredProducts.length, categoryStats[category]?.count || 0)
    : filteredProducts.length;
  const isFullIndexLoading = !complete;

  useEffect(() => {
    if (!complete) return;
    const trackingKey = landingPath;
    if (trackedLandingRef.current === trackingKey) return;
    trackedLandingRef.current = trackingKey;
    trackCatalogEvent("view_item_list", {
      item_list_id: landingPath,
      item_list_name: categoryLanding?.id || routeBrand?.slug || routeModel?.slug || "catalog",
      catalog_result_count: filteredProducts.length,
      catalog_language: language,
      items: filteredProducts.slice(0, 24).map(catalogAnalyticsItem),
    });
  }, [categoryLanding?.id, complete, filteredProducts, landingPath, language, routeBrand?.slug, routeModel?.slug]);

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
    trackCatalogEvent("catalog_whatsapp_click", {
      catalog_source: "catalog_search",
      search_mode: searchMode,
      landing_id: landingPath,
      category_id: category || "all",
      brand_selected: Boolean(brand),
      has_part_query: Boolean(partQuery.trim()),
      has_machine_model: Boolean(machineModel.trim()),
      supply_option_selected: Boolean(supplyOption),
    });
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
    setVisibleCount(initialVisibleProducts(category));
    const submittedQuery = `${partQuery} ${machineModel}`.trim().toLowerCase();
    const submittedResultCount = filterProducts(submittedQuery).length;
    const analyticsParams = catalogSearchAnalyticsParams({
      searchMode,
      landingId: landingPath,
      categoryId: category || "all",
      brandSelected: Boolean(brand),
      partQuery,
      machineModel,
      resultCount: submittedResultCount,
    });
    trackCatalogEvent("catalog_search", analyticsParams);
    if (analyticsParams.search_term) {
      trackCatalogEvent("view_search_results", analyticsParams);
    }
    if (submittedResultCount === 0) {
      trackCatalogEvent("catalog_no_results", analyticsParams);
    }
    const submittedText = `${partQuery} ${machineModel}`.trim();
    const brandLanding = catalogBrandLandings.find((item) => item.name === brand);
    const querySuffix = submittedText ? `?q=${encodeURIComponent(submittedText)}` : "";
    const destination = category
      ? catalogSearchHref(submittedText, category)
      : brandLanding
        ? `/catalog/brand/${brandLanding.slug}${querySuffix}`
        : catalogSearchHref(submittedText);
    setPartQuery(submittedText);
    setMachineModel("");
    navigate(destination);
    window.setTimeout(scrollToResults, 0);
  };

  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto" data-catalog-landing={isLandingPage ? "true" : undefined}>
      <SEO
        title={landingTitle}
        description={landingDescription}
        keywords="запчасти для спецтехники Казахстан, OEM запчасти, поиск по VIN, гидронасос купить, гидромотор, CAT, Komatsu, Hitachi"
        canonical={landingPath}
        noIndex={Boolean(urlQuery || (params.categoryId && !categoryLanding) || (params.brandSlug && !routeBrand) || (params.modelSlug && !routeModel) || (complete && isLandingPage && filteredProducts.length === 0 && matchingSupplyOffers.length === 0))}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: landingTitle,
          description: landingDescription,
          url: `https://acahydraulic.kz${landingPath}/`,
          inLanguage: ["ru-KZ", "kk-KZ", "en"],
          about: "Запчасти для гидравлических систем и спецтехники",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: filteredProducts.length,
            itemListElement: filteredProducts.slice(0, 24).map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://acahydraulic.kz/catalog/${product.handle}/`,
              name: catalogProductName(product, language),
            })),
          },
        }}
        breadcrumbs={isLandingPage ? [{ name: "Каталог запчастей", url: "/catalog" }, { name: landingTitle, url: landingPath }] : [{ name: "Каталог запчастей", url: "/catalog" }]}
      />

      <header className="aca-catalog-header sticky top-0 z-50 border-b border-white/10 bg-[#101010]/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
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

          <nav className="aca-desktop-nav" aria-label={copy.pageTitle}>
            <a href="#categories-title">{copy.categoriesTitle}</a>
            <a href="#catalog-search">{language === "ru" ? "Подбор запчасти" : language === "kz" ? "Бөлшек іріктеу" : "Parts search"}</a>
            <a href="tel:+77714177925">+7 (771) 417-79-25</a>
            <a className="aca-desktop-whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <CartButton />
            <CatalogLanguageControl language={language} onChange={setLanguage} />
          </div>
        </div>
      </header>

      <main id="catalog-top">
        <section className="aca-catalog-hero overflow-hidden border-b border-white/10 bg-[#151515]">
          <div className="aca-catalog-hero-inner mx-auto max-w-[1600px] px-4 py-7 md:py-11">
            <SiteHomeLink className="mb-5 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#FFC000]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {copy.backToService}
            </SiteHomeLink>

            <div className="aca-catalog-lead grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <div className="aca-catalog-search-column">
                <div className={`max-w-3xl${isLandingPage ? " aca-landing-heading" : ""}`}>
                  <h1 className="font-bebas text-4xl font-bold uppercase leading-tight tracking-wide md:text-6xl">
                    {isLandingPage ? landingTitle : copy.pageTitle}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">{isLandingPage ? `${language === "ru" ? "Поставка под заказ." : language === "kz" ? "Тапсырыс бойынша." : "Supplied to order."} ${landingDescription}` : copy.pageDescription}</p>
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

                  {searchMode !== "vin" && partQuery.trim().length >= 2 && deferredQuery === `${partQuery} ${machineModel}`.trim().toLowerCase() && (
                    <section aria-label={language === "ru" ? "Быстрые результаты поиска" : "Quick search results"} className="mt-2 overflow-hidden rounded-lg border border-white/15 bg-[#181818]">
                      {matchingSupplyOffers.map(offer => <Link key={offer.id} href={`${pumpCasePath}#${offer.caseAnchor}`} className="flex min-h-16 items-center gap-3 border-b border-white/10 p-3 hover:bg-white/5">
                      <img src={`/media/pump-cases/${offer.image}`} alt="" width={44} height={44} className="h-11 w-11 rounded object-contain" />
                      <span className="min-w-0"><span className="block text-sm text-white">{offer.name}</span><span className="mt-1 block text-xs text-[#FFC000]">{offer.price || pumpSupplyLabels[language].quote} · {pumpSupplyLabels[language].details}</span></span>
                    </Link>)}
                    {filteredProducts.slice(0, 5).map((product) => (
                        <Link key={product.id} href={`/catalog/${product.handle}`} className="flex min-h-16 items-center gap-3 border-b border-white/10 p-3 last:border-0 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">
                          {product.imageUrl && <img src={product.imageUrl} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 rounded bg-white object-contain" />}
                          <span className="min-w-0"><span className="line-clamp-2 text-sm text-white">{catalogProductName(product, language)}</span><span className="mt-1 block text-xs text-[#FFC000]">{language === "ru" ? "Под заказ · Проверить цену и срок" : language === "kz" ? "Тапсырыс бойынша · Баға мен мерзімді нақтылау" : "To order · Confirm price and lead time"}</span></span>
                        </Link>
                      ))}
                      {filteredProducts.length === 0 && matchingSupplyOffers.length === 0 && <p className="p-3 text-sm text-gray-400">{loading || !complete ? copy.loadingProducts : copy.noResults}</p>}
                    </section>
                  )}

                  <button
                    type="button"
                    onClick={() => setFiltersOpen((open) => !open)}
                    aria-expanded={filtersOpen}
                    aria-controls="catalog-refine-fields"
                    className="aca-refine-toggle mt-3 hidden min-h-11 w-full items-center justify-between rounded border border-gray-300 bg-white px-3 text-sm font-bold text-gray-800"
                  >
                    <span className="inline-flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />{language === "ru" ? "Уточнить поиск" : language === "kz" ? "Іздеуді нақтылау" : "Refine search"}</span>
                    <span className="text-xs text-gray-500">{[brand, category, machineModel].filter(Boolean).length || ""}</span>
                  </button>

                  <div id="catalog-refine-fields" className="aca-refine-fields mt-4 grid grid-cols-2 gap-3 md:grid-cols-3" data-open={filtersOpen ? "true" : "false"}>
                    <label className="grid gap-2 text-xs font-medium text-gray-300 md:text-sm">
                      {copy.brandLabel}
                      <select
                        value={brand}
                        onChange={(event) => {
                          setBrand(event.target.value);
                          setCategory("");
                          setVisibleCount(initialVisibleProducts(""));
                        }}
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
                        onChange={(event) => {
                          const nextCategory = event.target.value;
                          setCategory(nextCategory);
                          setBrand("");
                          setVisibleCount(initialVisibleProducts(nextCategory));
                        }}
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

              <aside className="aca-desktop-promo" aria-label={ui.promoTitle}>
                <a className="aca-desktop-banner" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ui.promos[0].text)}`} target="_blank" rel="noopener noreferrer" aria-label={ui.promos[0].text}>
                  <img src="/catalog-assets/promo-first-order.jpg" width="900" height="300" alt={ui.promos[0].text} fetchPriority="high" />
                </a>
                <a className="aca-desktop-banner" href="#catalog-delivery" aria-label={copy.deliveryTitle}>
                  <img src="/catalog-assets/promo-china-delivery.jpg" width="900" height="300" alt={copy.deliveryTitle} loading="eager" decoding="async" />
                </a>
                <div className="aca-promo-proof" aria-label={language === "ru" ? "Преимущества каталога" : language === "kz" ? "Каталог артықшылықтары" : "Catalogue benefits"}>
                  <div>
                    <strong>{(productCount || products.length) > 0 ? (productCount || products.length).toLocaleString(language === "en" ? "en-US" : "ru-RU") : "10 000+"}</strong>
                    <span>{language === "ru" ? "позиций в каталоге" : language === "kz" ? "каталогтағы позиция" : "catalogue items"}</span>
                  </div>
                  <div>
                    <strong>OEM / VIN</strong>
                    <span>{language === "ru" ? "проверка совместимости" : language === "kz" ? "сәйкестікті тексеру" : "fitment verification"}</span>
                  </div>
                  <div>
                    <strong>KZ</strong>
                    <span>{language === "ru" ? "доставка по Казахстану" : language === "kz" ? "Қазақстанға жеткізу" : "delivery nationwide"}</span>
                  </div>
                </div>
              </aside>
            </div>

            <div className="aca-supply-panel mt-6 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 md:p-5">
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

        <section className="aca-catalog-content mx-auto max-w-[1600px] px-4 py-10 md:py-14" aria-labelledby="categories-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="categories-title" className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{isLandingPage ? landingTitle : copy.categoriesTitle}</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-gray-400">
                {isLandingPage
                  ? language === "ru"
                    ? "Товары раздела показаны ниже. Для другого узла вернитесь ко всем категориям."
                    : language === "kz"
                      ? "Бөлім тауарлары төменде көрсетілген. Басқа торап үшін барлық санаттарға оралыңыз."
                      : "Products in this section are shown below. Return to all categories to choose another section."
                  : ui.categoriesHint}
              </p>
            </div>
            {isLandingPage ? (
              <Link
                href={catalogSearchHref(partQuery)}
                data-catalog-back
                className="inline-flex min-h-11 items-center gap-2 rounded border border-gray-300 bg-white px-4 text-sm font-bold text-gray-800 hover:border-[#FFC000] hover:text-[#8a6100]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {copy.categoriesTitle}
              </Link>
            ) : (
              matchingSupplyOffers.length > 0 && <button type="button" onClick={scrollToResults} className="min-h-11 text-sm font-bold text-[#8a6100] underline underline-offset-4">{pumpSupplyLabels[language].title}</button>
            )}
          </div>

          {!isLandingPage && <div className="aca-category-grid">
            {partCategories.map((item, index) => {
              const Icon = categoryIcons[item.id];
              const stat = categoryStats[item.id];
              const imageUrl = categoryImageOverrides[item.id] || stat?.imageUrl;
              return (
                <Fragment key={item.id}>
                  <Link
                    href={catalogSearchHref(partQuery, item.id)}
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
                    <span className="aca-category-copy">
                      <span className="aca-category-label">{item[language]}</span>
                      <span className="aca-category-count">
                        {categoryCountLabel(stat?.count || 0, language)}
                      </span>
                    </span>
                    <ChevronRight className="aca-category-arrow" aria-hidden="true" />
                  </Link>
                  {index === 0 && (
                    <Link
                      href="/parts/engines-complete/"
                      onClick={() => trackCatalogEvent("complete_engine_category_click", { source: "catalog-category-grid", language })}
                      className="aca-category-card aca-engine-category-card"
                      data-complete-engine-category
                    >
                      <span className="aca-category-media">
                        <img
                          src="/catalog-assets/complete-engine-category.webp"
                          alt="Новый комплектный двигатель для спецтехники"
                          width="640"
                          height="640"
                          loading="lazy"
                        />
                        <Cog className="aca-category-fallback" aria-hidden="true" />
                      </span>
                      <span className="aca-category-copy">
                        <span className="aca-category-label">{completeEngineCategoryCopy[language].title}</span>
                        <span className="aca-category-count">{completeEngineCategoryCopy[language].subtitle}</span>
                      </span>
                      <ChevronRight className="aca-category-arrow" aria-hidden="true" />
                    </Link>
                  )}
                </Fragment>
              );
            })}
          </div>}
          {!isLandingPage && (
            <aside className="aca-mobile-promos" aria-label={ui.promoTitle}>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ui.promos[0].text)}`} target="_blank" rel="noopener noreferrer" aria-label={ui.promos[0].text}>
                <img src="/catalog-assets/promo-first-order.jpg" width="900" height="300" alt={ui.promos[0].text} loading="lazy" decoding="async" />
              </a>
              <a href="#catalog-delivery" aria-label={copy.deliveryTitle}>
                <img src="/catalog-assets/promo-china-delivery.jpg" width="900" height="300" alt={copy.deliveryTitle} loading="lazy" decoding="async" />
              </a>
            </aside>
          )}
          {isLandingPage && selectionGuide && (
            <section className="mt-6 rounded-lg border border-gray-300 bg-white p-4 md:p-5" data-catalog-selection-guide>
              <h2 className="text-lg font-bold text-[#17242b]">{selectionGuide.heading}</h2>
              <details className="mt-2">
                <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium text-[#795809] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">Проверка перед заказом и полезные ссылки</summary>
                <p className="mt-3 max-w-5xl leading-relaxed text-gray-700">{selectionGuide.text}</p>
                <nav className="mt-4" aria-label="Подбор, диагностика и связанные запчасти">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {selectionGuide.links.map(({ href, label }) => (
                      <li key={href}><Link href={href} className="inline-flex min-h-11 items-center text-sm text-[#795809] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </details>
            </section>
          )}
          {showResults && <div
            id="catalog-results"
            ref={resultsRef}
            className="mt-12 scroll-mt-24 border-t border-white/10 pt-8"
            aria-live="polite"
            data-result-count={filteredProducts.length}
            data-expected-count={expectedResultCount}
            data-index-complete={complete ? "true" : "false"}
            data-visible-count={Math.min(visibleCount, filteredProducts.length)}
          >
            <PumpSupplyOffers offers={matchingSupplyOffers} language={language} />
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{matchingSupplyOffers.length ? pumpSupplyLabels[language].more : copy.resultsTitle}</h2>
                {selectedCategory && <p className="mt-1 text-sm font-medium text-[#FFC000]">{selectedCategory[language]}</p>}
              </div>
              {!loading && !error && (
                <p className="text-sm text-gray-400" role={isFullIndexLoading ? "status" : undefined}>
                  {isFullIndexLoading
                    ? expectedResultCount > filteredProducts.length
                      ? catalogProgressLabel(filteredProducts.length, expectedResultCount, language)
                      : copy.loadingProducts
                    : visibleProductsLabel(visibleCount, filteredProducts.length, language)}
                </p>
              )}
            </div>
            <ProductResults
              copy={matchingSupplyOffers.length ? { ...copy, noResults: pumpSupplyLabels[language].empty } : copy}
              language={language}
              products={filteredProducts.slice(0, visibleCount)}
              activeCategory={category || undefined}
              total={complete ? filteredProducts.length : expectedResultCount}
              loading={loading || (!complete && filteredProducts.length === 0)}
              error={error}
              canLoadMore={complete && visibleCount < filteredProducts.length}
              onLoadMore={() => setVisibleCount((count) => count + (category === "hydraulic-pumps" ? HYDRAULIC_PUMP_LOAD_MORE_BATCH : ["controllers", "monitors"].includes(category) ? ELECTRONICS_VISIBLE_PRODUCTS : DEFAULT_VISIBLE_PRODUCTS))}
              showAllLabel={showAllProductsLabel(filteredProducts.length, language)}
              onShowAll={() => setVisibleCount(filteredProducts.length)}
            />
          </div>}

          {isLandingPage && (
            <section className="aca-landing-intro mt-12 border-l-2 border-[#FFC000] bg-[#151515] p-5 md:p-7" aria-label="О разделе каталога">
              <h2 className="text-xl font-bold text-white">{landingTitle}</h2>
              <p className="mt-3 max-w-5xl leading-relaxed text-gray-300">{categoryLanding?.intro || landingDescription}</p>
              <p className="mt-3 max-w-5xl text-sm leading-relaxed text-gray-400">Цена, наличие и срок подтверждаются после проверки OEM-номера, модели, серийного номера и исполнения детали.</p>
              {categorySeo && (
                <div className="mt-6 grid gap-5 border-t border-white/10 pt-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <h3 className="text-lg font-bold text-white">Как подобрать запчасть без ошибки</h3>
                    <p className="mt-2 leading-relaxed text-gray-300">{categorySeo.selection}</p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">Также ищут: {categorySeo.queries.join(" · ")}.</p>
                    {categoryLanding?.id === "hydraulic-pumps" && (
                      <nav className="mt-4 grid gap-2 text-sm text-[#FFC000] underline" aria-label="Подтверждённые кейсы поставки насосов">
                        <Link href="/cases/cat-432e-postavka-gidronasosa-267-2755/">CAT 432E: продажа насоса 267-2755</Link>
                        <Link href="/cases/xcmg-xz200-ustanovka-gidronasosa-803001730/">XCMG XZ200: поставка и установка насоса 803001730</Link>
                      </nav>
                    )}
                  </div>
                  <div className="grid gap-2" aria-label="Частые вопросы по подбору">
                    <details className="rounded border border-white/10 bg-[#0f0f0f] p-4">
                      <summary className="cursor-pointer font-bold text-white">Какие данные нужны для подбора?</summary>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">{categorySeo.selection}</p>
                    </details>
                    <details className="rounded border border-white/10 bg-[#0f0f0f] p-4">
                      <summary className="cursor-pointer font-bold text-white">Как подтверждается совместимость?</summary>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">Сопоставляем OEM-номер, модель и серийный номер техники, исполнение и фотографии узла. Совпадение только по внешнему виду не считается подтверждением.</p>
                    </details>
                    <details className="rounded border border-white/10 bg-[#0f0f0f] p-4">
                      <summary className="cursor-pointer font-bold text-white">Когда будут известны цена и срок?</summary>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">После проверки номера и комплектации уточняем доступный вариант поставки, актуальную цену и срок. До сверки эти данные не фиксируем.</p>
                    </details>
                  </div>
                </div>
              )}
            </section>
          )}
        </section>

        <section className="border-y border-white/10 bg-[#151515]">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
            <div>
              <h2 className="font-bebas text-3xl font-bold uppercase tracking-wide md:text-4xl">{copy.brandsTitle}</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-gray-400">{copy.brandsDescription}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {supportedBrands.map((item) => {
                  const landing = catalogBrandLandings.find((brandItem) => brandItem.name === item);
                  const count = landing ? brandStats.get(landing.slug) || 0 : 0;
                  if (complete && count === 0) {
                    return <span key={item} className="min-h-10 rounded border border-white/10 bg-[#0e0e0e] px-4 py-2 text-sm font-semibold text-gray-500">{item} · по запросу</span>;
                  }
                  return (
                    <Link
                      key={item}
                      href={(routeBrand?.name === item ? "/catalog" : `/catalog/brand/${landing?.slug || ""}`) + (partQuery.trim() ? `?q=${encodeURIComponent(partQuery.trim())}` : "")}
                      aria-current={routeBrand?.name === item ? "page" : undefined}
                      className={`min-h-10 rounded border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] ${
                        routeBrand?.name === item ? "border-[#FFC000] bg-[#FFC000] text-black" : "border-white/15 bg-[#0e0e0e] text-gray-200 hover:border-white/35"
                      }`}
                    >
                      {item}{count ? ` · ${count}` : ""}
                    </Link>
                  );
                })}
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

        {complete && navigationModels.length > 0 && <CatalogDirectory
          home={!isLandingPage}
          models={navigationModels}
          brands={catalogBrandLandings.map(item => ({ ...item, count: brandStats.get(item.slug) || 0 })).filter(item => item.count > 0)}
        />}

          {!isLandingPage && <section className="mx-auto max-w-[1600px] border-t border-gray-200 bg-white px-4 py-10 text-[#111827]" aria-labelledby="catalog-sections-title">
            <h2 id="catalog-sections-title" className="text-xl font-bold">Каталог запчастей по узлам</h2>
            <p className="mt-3 max-w-4xl leading-relaxed text-gray-700">{catalogHomeSeo.selection}</p>
            <nav aria-label="Все разделы каталога" className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {catalogCategoryLandings.map(item => <Link key={item.id} href={`/catalog/category/${item.id}/`} className="flex min-h-11 items-center text-sm text-[#8a6100] underline underline-offset-4">{item.title}</Link>)}
            </nav>
          </section>}

        <section id="catalog-delivery" className="mx-auto max-w-[1600px] px-4 py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded border border-white/10 bg-[#151515] p-6">
              <Truck className="h-7 w-7 text-[#FFC000]" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-bold">{copy.deliveryTitle}</h2>
              <p className="mt-3 leading-relaxed text-gray-400">{copy.deliveryText}</p>
              <Link href="/delivery-and-returns/" className="mt-3 inline-flex min-h-11 items-center text-[#8a6100] underline">{language === "ru" ? "Доставка, оплата и возврат" : language === "kz" ? "Жеткізу, төлем және қайтару" : "Delivery, payment and returns"}</Link>
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
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-8 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
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

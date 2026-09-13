export type CatalogAvailability = "in_stock" | "on_request" | "out_of_stock";

export interface CatalogProduct {
  id: string;
  slug: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  oem: string[];
  machineModels: string[];
  description: string;
  image?: string;
  sourcePrice?: number;
  sourceCurrency?: "CNY" | "USD" | "KZT";
  markupPercent: number;
  priceKzt?: number;
  availability: CatalogAvailability;
  featured?: boolean;
  isDemo?: boolean;
}

/**
 * Applies a commercial markup without changing currency.
 * Currency conversion is intentionally kept separate because FX rates are dynamic.
 */
export function applyMarkup(basePrice: number, markupPercent = 50): number {
  return Math.round(basePrice * (1 + markupPercent / 100));
}

export function formatKzt(price?: number): string {
  if (!price) return "Цена по запросу";
  return `${new Intl.NumberFormat("ru-KZ").format(price)} ₸`;
}

export const catalogProducts: CatalogProduct[] = [
  {
    id: "demo-k5v160dt",
    slug: "hydraulic-pump-k5v160dt",
    sku: "K5V160DT",
    title: "Гидравлический насос K5V160DT",
    brand: "Kawasaki",
    category: "Гидронасосы",
    oem: ["K5V160DT"],
    machineModels: ["Экскаваторы 30–40 т — применяемость уточняется по шильдику"],
    description:
      "Карточка-шаблон для каталога ACA Hydraulic. Перед продажей совместимость подтверждается по полному номеру насоса, регулятору, валу, фланцу и портам.",
    markupPercent: 50,
    availability: "on_request",
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-k3v112dt",
    slug: "hydraulic-pump-k3v112dt",
    sku: "K3V112DT",
    title: "Гидравлический насос K3V112DT",
    brand: "Kawasaki",
    category: "Гидронасосы",
    oem: ["K3V112DT"],
    machineModels: ["Экскаваторы 20–25 т — применяемость уточняется по серийному номеру"],
    description:
      "Демонстрационная карточка. В рабочем каталоге здесь будут реальные фото, OEM-номера, совместимые модели, цена, срок поставки и статус наличия.",
    markupPercent: 50,
    availability: "on_request",
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-a8vo160",
    slug: "hydraulic-pump-a8vo160",
    sku: "A8VO160",
    title: "Гидравлический насос A8VO160",
    brand: "Bosch Rexroth",
    category: "Гидронасосы",
    oem: ["A8VO160"],
    machineModels: ["Спецтехника — точная применяемость по исполнению насоса"],
    description:
      "Демонстрационная карточка для проверки структуры каталога, поиска по артикулу и отображения технической применяемости.",
    markupPercent: 50,
    availability: "on_request",
    isDemo: true,
  },
  {
    id: "demo-m5x180",
    slug: "swing-motor-m5x180",
    sku: "M5X180",
    title: "Гидромотор поворота M5X180",
    brand: "Kawasaki",
    category: "Гидромоторы",
    oem: ["M5X180"],
    machineModels: ["Экскаваторы — совместимость уточняется по маркировке"],
    description:
      "Шаблон товарной позиции. В массовом импорте товар будет находиться по SKU, OEM, бренду и модели техники.",
    markupPercent: 50,
    availability: "on_request",
    isDemo: true,
  },
  {
    id: "demo-main-control-valve",
    slug: "main-control-valve-excavator",
    sku: "MCV-DEMO-001",
    title: "Основной гидрораспределитель экскаватора",
    brand: "OEM / Aftermarket",
    category: "Гидрораспределители",
    oem: ["Подбор по OEM"],
    machineModels: ["CAT", "Komatsu", "Hitachi", "Hyundai", "SANY", "XCMG"],
    description:
      "Демонстрационная карточка категории гидрораспределителей. Точная конфигурация подбирается по модели техники и OEM-номеру.",
    markupPercent: 50,
    availability: "on_request",
    isDemo: true,
  },
  {
    id: "demo-pump-regulator",
    slug: "hydraulic-pump-regulator",
    sku: "REG-DEMO-001",
    title: "Регулятор гидравлического насоса",
    brand: "OEM / Aftermarket",
    category: "Регуляторы и сервопоршни",
    oem: ["Подбор по OEM"],
    machineModels: ["Экскаваторы и погрузчики"],
    description:
      "Шаблон позиции для регуляторов насосов. В рабочем каталоге будут варианты по бренду насоса, модели техники и OEM-номеру.",
    markupPercent: 50,
    availability: "on_request",
    isDemo: true,
  },
];

export const catalogBrands = Array.from(
  new Set(catalogProducts.map((product) => product.brand))
).sort();

export const catalogCategories = Array.from(
  new Set(catalogProducts.map((product) => product.category))
).sort();

export function findCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}

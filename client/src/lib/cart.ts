import type { CatalogIndexProduct, CatalogProduct, CatalogVariant } from "@/types/catalog";

export const CART_STORAGE_KEY = "aca-hydraulic-cart-v1";
export const MAX_CART_QUANTITY = 99;

export type CartPriceMode = "fixed" | "quote";

export type CartItem = {
  id: string;
  productId: string;
  productHandle: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  sku: string;
  imageUrl: string | null;
  fitment: string | null;
  available: boolean;
  priceMode: CartPriceMode;
  unitPriceKzt: number | null;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "set-quantity"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

export type CartSummary = {
  itemCount: number;
  lineCount: number;
  fixedLineCount: number;
  quoteLineCount: number;
  totalKzt: number;
  canRequestOnlinePayment: boolean;
};

function clampQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(MAX_CART_QUANTITY, Math.trunc(quantity)));
}

function verifiedFixedPrice(product: CatalogIndexProduct, candidate: number | null) {
  const verified = Boolean(product.approvedSale || product.ownerSale || product.ownerProduct);
  return verified && candidate !== null && Number.isFinite(candidate) && candidate >= 0
    ? candidate
    : null;
}

export function cartItemFromProduct(
  product: CatalogIndexProduct,
  variant?: CatalogVariant,
): CartItem {
  const isExactProductPrice = product.minPriceKzt !== null
    && product.maxPriceKzt !== null
    && product.minPriceKzt === product.maxPriceKzt;
  const candidate = variant?.priceKzt ?? (isExactProductPrice ? product.minPriceKzt : null);
  const unitPriceKzt = verifiedFixedPrice(product, candidate);
  const variantId = variant?.id;

  return {
    id: variantId ? `${product.handle}:${variantId}` : product.handle,
    productId: product.id,
    productHandle: product.handle,
    variantId,
    title: product.catalogTitle || product.title,
    variantTitle: variant?.title || undefined,
    sku: variant?.sku || product.sku || product.id,
    imageUrl: product.imageUrl,
    fitment: product.fitment,
    available: variant?.available ?? product.available,
    priceMode: unitPriceKzt === null ? "quote" : "fixed",
    unitPriceKzt,
    quantity: 1,
  };
}

export function preferredCartItem(product: CatalogProduct) {
  return cartItemFromProduct(product, product.variants.length === 1 ? product.variants[0] : undefined);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "clear") return { items: [] };
  if (action.type === "remove") return { items: state.items.filter((item) => item.id !== action.id) };
  if (action.type === "set-quantity") {
    return {
      items: state.items.map((item) => item.id === action.id
        ? { ...item, quantity: clampQuantity(action.quantity) }
        : item),
    };
  }

  const existing = state.items.find((item) => item.id === action.item.id);
  if (!existing) {
    return { items: [...state.items, { ...action.item, quantity: clampQuantity(action.item.quantity) }] };
  }

  return {
    items: state.items.map((item) => item.id === action.item.id
      ? { ...action.item, quantity: clampQuantity(item.quantity + action.item.quantity) }
      : item),
  };
}

export function summarizeCart(items: CartItem[]): CartSummary {
  const fixedItems = items.filter((item) => item.priceMode === "fixed" && item.unitPriceKzt !== null);
  const quoteLineCount = items.length - fixedItems.length;
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    lineCount: items.length,
    fixedLineCount: fixedItems.length,
    quoteLineCount,
    totalKzt: fixedItems.reduce((sum, item) => sum + (item.unitPriceKzt || 0) * item.quantity, 0),
    canRequestOnlinePayment: items.length > 0 && quoteLineCount === 0,
  };
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return typeof item.id === "string"
    && typeof item.productId === "string"
    && typeof item.productHandle === "string"
    && typeof item.title === "string"
    && typeof item.sku === "string"
    && (item.imageUrl === null || typeof item.imageUrl === "string")
    && (item.fitment === null || typeof item.fitment === "string")
    && typeof item.available === "boolean"
    && (item.priceMode === "fixed" || item.priceMode === "quote")
    && (item.unitPriceKzt === null || (typeof item.unitPriceKzt === "number" && item.unitPriceKzt >= 0))
    && typeof item.quantity === "number";
}

export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(raw) as { version?: unknown; items?: unknown };
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) return { items: [] };
    return {
      items: parsed.items
        .filter(isCartItem)
        .map((item) => ({ ...item, quantity: clampQuantity(item.quantity) })),
    };
  } catch {
    return { items: [] };
  }
}

export function serializeCart(state: CartState) {
  return JSON.stringify({ version: 1, items: state.items });
}

export function formatKzt(value: number) {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₸`;
}

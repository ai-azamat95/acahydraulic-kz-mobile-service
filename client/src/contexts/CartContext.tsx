import { createContext, type ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react";

import {
  CART_STORAGE_KEY,
  cartReducer,
  parseStoredCart,
  serializeCart,
  summarizeCart,
  type CartItem,
  type CartSummary,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  summary: CartSummary;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function initialState() {
  if (typeof window === "undefined") return { items: [] };
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initialState);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state));
    } catch {
      // The cart still works for the current session when storage is unavailable.
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => ({
    items: state.items,
    summary: summarizeCart(state.items),
    drawerOpen,
    setDrawerOpen,
    addItem: (item) => dispatch({ type: "add", item }),
    setQuantity: (id, quantity) => dispatch({ type: "set-quantity", id, quantity }),
    removeItem: (id) => dispatch({ type: "remove", id }),
    clearCart: () => dispatch({ type: "clear" }),
  }), [drawerOpen, state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

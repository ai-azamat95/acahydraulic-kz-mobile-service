import { afterEach, describe, expect, it, vi } from "vitest";

import { checkoutApiUrl, checkoutWhatsappText, validateCheckout, type CheckoutCustomer } from "@/lib/checkout";
import type { CartItem } from "@/lib/cart";

const customer: CheckoutCustomer = {
  fullName: "Азамат",
  phone: "+7 771 417 79 25",
  email: "info@acahydraulic.kz",
  city: "Астана",
  deliveryMethod: "transport-company",
  deliveryAddress: "Терминал в Астане",
  bin: "123456789012",
  comment: "Нужна проверка по шильдику",
  consent: true,
};

const item: CartItem = {
  id: "pump",
  productId: "1",
  productHandle: "pump",
  title: "Гидронасос",
  sku: "K5V160",
  imageUrl: null,
  fitment: null,
  available: true,
  priceMode: "quote",
  unitPriceKzt: null,
  quantity: 2,
};

describe("checkout", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("accepts a complete order and requires an address for delivery", () => {
    expect(validateCheckout(customer, [item])).toEqual({});
    expect(validateCheckout({ ...customer, deliveryAddress: "" }, [item])).toHaveProperty("deliveryAddress");
    expect(validateCheckout({ ...customer, deliveryMethod: "pickup", deliveryAddress: "" }, [item])).not.toHaveProperty("deliveryAddress");
  });

  it("reports missing consent, contact details and cart", () => {
    const errors = validateCheckout({ ...customer, fullName: "", phone: "12", city: "", consent: false }, []);
    expect(errors).toMatchObject({ cart: expect.any(String), fullName: expect.any(String), phone: expect.any(String), city: expect.any(String), consent: expect.any(String) });
  });

  it("creates a useful manager handoff without claiming a final price", () => {
    const text = checkoutWhatsappText(customer, [item]);
    expect(text).toContain("Гидронасос");
    expect(text).toContain("2 шт.");
    expect(text).toContain("подтвердить совместимость, наличие, итоговую цену и срок");
  });

  it("keeps online API disabled unless sandbox is explicit", () => {
    vi.stubEnv("VITE_CHECKOUT_API_URL", "https://checkout-api.example.kz");
    vi.stubEnv("VITE_CHECKOUT_MODE", "");
    expect(checkoutApiUrl()).toBe("");
    vi.stubEnv("VITE_CHECKOUT_MODE", "production");
    expect(checkoutApiUrl()).toBe("");
    vi.stubEnv("VITE_CHECKOUT_MODE", "sandbox");
    expect(checkoutApiUrl()).toBe("https://checkout-api.example.kz");
    vi.stubEnv("VITE_CHECKOUT_API_URL", "http://checkout-api.example.kz");
    expect(checkoutApiUrl()).toBe("");
  });
  it("rejects invalid cart quantities", () => {
    for (const quantity of [0, -1, 1.5, 100, Infinity]) {
      expect(validateCheckout(customer, [{ ...item, quantity }])).toHaveProperty("cart");
    }
  });
});

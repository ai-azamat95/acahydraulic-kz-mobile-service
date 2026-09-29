import { afterEach, describe, expect, it, vi } from "vitest";

import { CHECKOUT_PAYMENT_PROVIDER, checkoutWhatsappText, createPayment, validateCheckout, type CheckoutCustomer } from "@/lib/checkout";
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

  it("identifies Kaspi to the protected backend without sending a browser-calculated amount", async () => {
    vi.stubEnv("VITE_CHECKOUT_API_URL", "https://checkout-api.example.kz");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      orderId: "ACA-2026-000001",
      paymentUrl: "https://pay.example.kz/session",
    }), { status: 200, headers: { "content-type": "application/json" } }));
    const { consent: _consent, ...customerPayload } = customer;

    await createPayment({
      provider: CHECKOUT_PAYMENT_PROVIDER,
      cartVersion: 1,
      items: [{ productId: item.productId, productHandle: item.productHandle, quantity: item.quantity }],
      customer: customerPayload,
      returnUrl: "https://acahydraulic.kz/checkout?payment=return",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://checkout-api.example.kz/payments");
    const payload = JSON.parse(String(init?.body));
    expect(payload.provider).toBe("kaspi-webpay");
    expect(payload).not.toHaveProperty("amount");
    expect(payload).not.toHaveProperty("total");
  });
});

import type { CartItem } from "@/lib/cart";

export type DeliveryMethod = "pickup" | "courier" | "transport-company";

export type CheckoutCustomer = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  bin: string;
  comment: string;
  consent: boolean;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutCustomer | "cart", string>>;

export type PaymentRequest = {
  cartVersion: 1;
  items: Array<Pick<CartItem, "productId" | "productHandle" | "variantId" | "quantity">>;
  customer: Omit<CheckoutCustomer, "consent">;
  returnUrl: string;
};

export type PaymentResponse = {
  orderId: string;
  paymentUrl: string;
  expiresAt?: string;
};

const PHONE_DIGITS_MIN = 10;

export function validateCheckout(customer: CheckoutCustomer, items: CartItem[]): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (items.length === 0) errors.cart = "Добавьте хотя бы один товар.";
  if (customer.fullName.trim().length < 2) errors.fullName = "Укажите имя получателя.";
  if (customer.phone.replace(/\D/g, "").length < PHONE_DIGITS_MIN) errors.phone = "Укажите корректный номер телефона.";
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) errors.email = "Проверьте адрес электронной почты.";
  if (customer.city.trim().length < 2) errors.city = "Укажите город доставки.";
  if (customer.deliveryMethod !== "pickup" && customer.deliveryAddress.trim().length < 5) {
    errors.deliveryAddress = "Укажите адрес или отделение транспортной компании.";
  }
  if (customer.bin && !/^\d{12}$/.test(customer.bin.replace(/\s/g, ""))) errors.bin = "БИН должен содержать 12 цифр.";
  if (!customer.consent) errors.consent = "Подтвердите согласие на обработку данных.";
  return errors;
}

export function checkoutWhatsappText(customer: CheckoutCustomer, items: CartItem[]) {
  const deliveryLabels: Record<DeliveryMethod, string> = {
    pickup: "Самовывоз",
    courier: "Доставка по адресу",
    "transport-company": "Транспортная компания",
  };
  const lines = items.map((item, index) => {
    const variant = item.variantTitle ? `, ${item.variantTitle}` : "";
    return `${index + 1}. ${item.title}${variant} — SKU ${item.sku}, ${item.quantity} шт.`;
  });
  return [
    "Здравствуйте! Хочу оформить заказ из корзины ACA Hydraulic.",
    "",
    ...lines,
    "",
    `Получатель: ${customer.fullName}`,
    `Телефон: ${customer.phone}`,
    customer.email ? `Email: ${customer.email}` : "",
    `Город: ${customer.city}`,
    `Доставка: ${deliveryLabels[customer.deliveryMethod]}`,
    customer.deliveryAddress ? `Адрес / отделение: ${customer.deliveryAddress}` : "",
    customer.bin ? `БИН: ${customer.bin}` : "",
    customer.comment ? `Комментарий: ${customer.comment}` : "",
    "",
    "Прошу подтвердить совместимость, наличие, итоговую цену и срок до оплаты.",
  ].filter(Boolean).join("\n");
}

export function paymentApiUrl() {
  return (import.meta.env.VITE_CHECKOUT_API_URL || "").trim();
}

export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const endpoint = paymentApiUrl();
  if (!endpoint) throw new Error("PAYMENT_NOT_CONFIGURED");
  const response = await fetch(`${endpoint.replace(/\/$/, "")}/payments`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("PAYMENT_CREATE_FAILED");
  const payload = await response.json() as PaymentResponse;
  const paymentUrl = new URL(payload.paymentUrl);
  if (paymentUrl.protocol !== "https:") throw new Error("PAYMENT_URL_INVALID");
  return payload;
}

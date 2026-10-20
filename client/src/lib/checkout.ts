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

export type { CheckoutPaymentProvider } from "@shared/checkout";

const PHONE_DIGITS_MIN = 10;

export function validateCheckout(customer: CheckoutCustomer, items: CartItem[]): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (items.length > 100 || items.some(item => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) errors.cart = "Проверьте количество товаров.";
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

export function checkoutApiUrl() {
  // Explicit sandbox opt-in. Setting the old API URL alone never enables payment.
  if (import.meta.env.VITE_CHECKOUT_MODE !== "sandbox") return "";
  const value = (import.meta.env.VITE_CHECKOUT_API_URL || "").trim();
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return "";
    return value.replace(/\/$/, "");
  } catch { return ""; }
}

export const CATALOG_WHATSAPP_NUMBER = "77714177925";

function singleLine(value, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

export function buildCatalogInquiryMessage({ inquiry, quantity, url }) {
  if (!inquiry || inquiry.kind !== "hydraulic-seal") {
    throw new TypeError("A hydraulic-seal catalogue inquiry is required");
  }

  const partNumber = singleLine(inquiry.partNumber);
  const type = singleLine(inquiry.type);
  const dimensions = singleLine(inquiry.dimensions);
  const productUrl = singleLine(url);
  if (!partNumber || !type || !dimensions || !productUrl) {
    throw new TypeError("Part number, type, dimensions and product URL are required");
  }

  const requestedQuantity = singleLine(quantity, "уточню").slice(0, 80);
  return [
    "Здравствуйте! Нужен подбор гидравлического уплотнения.",
    `Артикул: ${partNumber}`,
    `Тип: ${type}`,
    `Размеры: ${dimensions}`,
    `Количество: ${requestedQuantity}`,
    `Ссылка: ${productUrl}`,
    "",
    "Прошу уточнить возможность поставки, стоимость и срок. При необходимости отправлю фото старого уплотнения и шильдика техники.",
  ].join("\n");
}

export function buildCatalogWhatsappUrl({ inquiry, quantity, url }) {
  const message = buildCatalogInquiryMessage({ inquiry, quantity, url });
  return `https://wa.me/${CATALOG_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

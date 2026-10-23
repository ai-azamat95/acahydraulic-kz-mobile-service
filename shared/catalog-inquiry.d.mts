export type HydraulicSealCatalogInquiry = {
  kind: "hydraulic-seal";
  partNumber: string;
  type: string;
  dimensions: string;
};

export const CATALOG_WHATSAPP_NUMBER: string;

export function buildCatalogInquiryMessage(input: {
  inquiry: HydraulicSealCatalogInquiry;
  quantity?: string;
  url: string;
}): string;

export function buildCatalogWhatsappUrl(input: {
  inquiry: HydraulicSealCatalogInquiry;
  quantity?: string;
  url: string;
}): string;

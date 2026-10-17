import { trackCatalogEvent } from "@/lib/catalogAnalytics";

const SITE_ORIGIN = "https://acahydraulic.kz";
const ATTRIBUTION_PARAM = /^(utm_[a-z0-9_]+|ttclid)$/i;

type CaseWhatsAppOptions = {
  caseTitle: string;
  casePath: string;
  requestText?: string;
};

type CaseContactIntent = {
  caseId: string;
  caseModel: string;
  requestType?: string;
};

function currentSearch() {
  return typeof window === "undefined" ? "" : window.location.search;
}

export function caseCanonicalUrl(casePath: string) {
  const url = new URL(casePath, SITE_ORIGIN);
  url.search = "";
  url.hash = "";
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url.toString();
}

/**
 * Carries only campaign attribution into the catalog. Search queries and other
 * arbitrary values are deliberately not copied from the case URL.
 */
export function caseCatalogHref(targetHref: string, caseSource: string, search = currentSearch()) {
  const target = new URL(targetHref, SITE_ORIGIN);
  const existingKeys = new Set<string>();
  target.searchParams.forEach((_value, key) => {
    existingKeys.add(key.toLowerCase());
  });

  new URLSearchParams(search).forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (!ATTRIBUTION_PARAM.test(normalizedKey) || existingKeys.has(normalizedKey)) return;
    target.searchParams.set(normalizedKey, value);
    existingKeys.add(normalizedKey);
  });

  target.searchParams.set("case_source", caseSource);
  return `${target.pathname}${target.search}${target.hash}`;
}

export function buildCaseWhatsAppUrl({ caseTitle, casePath, requestText }: CaseWhatsAppOptions) {
  const message = [
    requestText?.trim() || "Здравствуйте! Нужна помощь с подбором запчасти или ремонтом.",
    `Кейс: ${caseTitle}`,
    `Страница: ${caseCanonicalUrl(casePath)}`,
  ].join("\n");

  return `https://wa.me/77714177925?text=${encodeURIComponent(message)}`;
}

/** A WhatsApp click is contact intent, not a received inquiry, lead or sale. */
export function trackCaseContactIntent({ caseId, caseModel, requestType }: CaseContactIntent) {
  trackCatalogEvent("case_whatsapp_click", {
    case_id: caseId,
    case_model: caseModel,
    request_type: requestType,
    contact_method: "whatsapp",
    contact_source: "case_page",
    lead_stage: "contact_intent",
  });
}

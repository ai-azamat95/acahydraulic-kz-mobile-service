import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildCaseWhatsAppUrl,
  caseCanonicalUrl,
  caseCatalogHref,
  trackCaseContactIntent,
} from "./caseConversion";

afterEach(() => vi.unstubAllGlobals());

describe("case conversion path", () => {
  it("preserves UTM and TikTok attribution on the way to the catalog", () => {
    const href = caseCatalogHref(
      "/catalog/category/hydraulic-pumps/?q=K5V160DT#results",
      "sany-sy365h",
      "?utm_source=tiktok&utm_medium=social&utm_campaign=pumps&ttclid=tt-123&phone=77001234567",
    );
    const url = new URL(href, "https://acahydraulic.kz");

    expect(url.pathname).toBe("/catalog/category/hydraulic-pumps/");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      q: "K5V160DT",
      utm_source: "tiktok",
      utm_medium: "social",
      utm_campaign: "pumps",
      ttclid: "tt-123",
      case_source: "sany-sy365h",
    });
    expect(url.hash).toBe("#results");
    expect(url.search).not.toContain("phone");
  });

  it("does not replace attribution already set on the catalog link", () => {
    const href = caseCatalogHref(
      "/catalog/?utm_source=case-card",
      "cases-hub",
      "?utm_source=tiktok&ttclid=tt-456",
    );
    const params = new URL(href, "https://acahydraulic.kz").searchParams;
    expect(params.get("utm_source")).toBe("case-card");
    expect(params.get("ttclid")).toBe("tt-456");
    expect(params.get("case_source")).toBe("cases-hub");
  });

  it("puts the case model and canonical URL into WhatsApp", () => {
    const href = buildCaseWhatsAppUrl({
      caseTitle: "SANY SY365H — поставка K5V160DT, замена и запуск",
      casePath: "/cases/sany-sy365h-zamena-gidronasosa-video",
      requestText: "Здравствуйте! Нужен насос для моей техники.",
    });
    const message = new URL(href).searchParams.get("text");

    expect(message).toContain("SANY SY365H");
    expect(message).toContain("https://acahydraulic.kz/cases/sany-sy365h-zamena-gidronasosa-video/");
    expect(caseCanonicalUrl("/cases/example?ignored=1#ignored")).toBe(
      "https://acahydraulic.kz/cases/example/",
    );
  });

  it("records the click only as case contact intent", () => {
    const gtag = vi.fn();
    const reportConversion = vi.fn();
    vi.stubGlobal("window", {
      __ACA_COOKIE_CONSENT__: { analytics: true, marketing: true },
      __ACA_ANALYTICS_EXCLUDE__: false,
      gtag,
      gtag_report_conversion: reportConversion,
    });

    trackCaseContactIntent({
      caseId: "xcmg-xz200-pump-installation",
      caseModel: "XCMG XZ200",
      requestType: "pump-803001730",
    });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag.mock.calls[0]).toEqual([
      "event",
      "case_whatsapp_click",
      {
        case_id: "xcmg-xz200-pump-installation",
        case_model: "XCMG XZ200",
        request_type: "pump-803001730",
        contact_method: "whatsapp",
        contact_source: "case_page",
        lead_stage: "contact_intent",
      },
    ]);
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/generate_lead|qualified_lead|purchase|revenue/);
    expect(reportConversion).not.toHaveBeenCalled();
  });
});

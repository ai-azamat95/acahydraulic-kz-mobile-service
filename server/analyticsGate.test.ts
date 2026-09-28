import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const gateSource = fs.readFileSync(
  path.resolve("client/public/analytics-gate.js"),
  "utf8"
);

type GateOptions = {
  consent?: { analytics: boolean; marketing: boolean; updatedAt?: number };
  search?: string;
  userAgent?: string;
  webdriver?: boolean;
};

function runGate(options: GateOptions = {}) {
  const values = new Map<string, string>();
  const scripts: Array<{ id: string; src: string }> = [];
  if (options.consent) {
    values.set(
      "aca_cookie_consent_v1",
      JSON.stringify({
        version: 1,
        necessary: true,
        analytics: options.consent.analytics,
        marketing: options.consent.marketing,
        updatedAt: options.consent.updatedAt ?? Date.now(),
      })
    );
  }

  const documentMock = {
    cookie: "",
    head: {
      appendChild: (script: { id: string; src: string }) =>
        scripts.push(script),
    },
    createElement: () => ({ id: "", src: "", async: false }),
    getElementById: (id: string) => scripts.find(script => script.id === id),
    referrer: "",
    title: "Catalog",
  };
  const events: Array<{ type: string; detail?: unknown }> = [];
  class CustomEventMock {
    type: string;
    detail?: unknown;

    constructor(type: string, init?: { detail?: unknown }) {
      this.type = type;
      this.detail = init?.detail;
    }
  }
  const windowMock = {
    CustomEvent: CustomEventMock,
    dispatchEvent: (event: { type: string; detail?: unknown }) => {
      events.push(event);
      return true;
    },
    location: {
      hash: "",
      hostname: "acahydraulic.kz",
      href: "https://acahydraulic.kz/catalog",
      pathname: "/catalog",
      search: options.search || "",
    },
    history: { replaceState: () => undefined },
    localStorage: {
      getItem: (key: string) => values.get(key) || null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
    navigator: {
      userAgent: options.userAgent || "Mozilla/5.0",
      webdriver: options.webdriver || false,
    },
  } as Record<string, any>;

  new Function("window", "document", "URLSearchParams", gateSource)(
    windowMock,
    documentMock,
    URLSearchParams
  );

  return { events, scripts, values, windowMock };
}

describe("analytics consent and traffic gate", () => {
  it("keeps every optional vendor blocked before a visitor chooses", () => {
    const { scripts, windowMock } = runGate();

    expect(windowMock.__ACA_ANALYTICS_EXCLUDE__).toBe(false);
    expect(windowMock.__ACA_COOKIE_CONSENT__).toBe(null);
    expect(scripts).toHaveLength(0);
    expect(windowMock.dataLayer[0]).toEqual([
      "consent",
      "default",
      expect.objectContaining({
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      }),
    ]);

    windowMock.gtag("event", "catalog_search", { query: "K5V80" });
    expect(windowMock.dataLayer).toHaveLength(2);
  });

  it("loads only analytics vendors for analytics-only consent", () => {
    const { scripts, windowMock } = runGate({
      consent: { analytics: true, marketing: false },
    });

    expect(scripts.map(script => script.id)).toEqual([
      "aca-google-tag",
      "aca-yandex-metrika",
    ]);
    expect(windowMock.__ACA_GA4_CONFIGURED__).toBe(true);
    expect(windowMock.__ACA_ADS_CONFIGURED__).toBeUndefined();
    expect(windowMock.__ACA_TIKTOK_INITIALIZED__).toBeUndefined();

    const queuedBeforeEvents = windowMock.dataLayer.length;
    windowMock.gtag("event", "catalog_search", { query: "K5V80" });
    windowMock.gtag("event", "conversion", { send_to: "AW-test" });
    expect(windowMock.dataLayer).toHaveLength(queuedBeforeEvents + 1);
    expect(windowMock.dataLayer.at(-1)[1]).toBe("catalog_search");
  });

  it("loads advertising vendors only after marketing consent", () => {
    const { scripts, windowMock } = runGate({
      consent: { analytics: false, marketing: true },
    });

    expect(scripts.map(script => script.id)).toEqual([
      "aca-google-tag",
      "aca-tiktok-pixel",
    ]);
    expect(windowMock.__ACA_ADS_CONFIGURED__).toBe(true);
    expect(windowMock.__ACA_TIKTOK_INITIALIZED__).toBe(true);
    expect(windowMock.__ACA_YANDEX_INITIALIZED__).toBeUndefined();

    const queuedBeforeEvents = windowMock.dataLayer.length;
    windowMock.gtag("event", "catalog_search", { query: "K5V80" });
    windowMock.gtag("event", "conversion", { send_to: "AW-test" });
    expect(windowMock.dataLayer).toHaveLength(queuedBeforeEvents + 1);
    expect(windowMock.dataLayer.at(-1)[1]).toBe("conversion");
  });

  it("marks the current device as internal and never loads vendors", () => {
    const { scripts, windowMock } = runGate({
      consent: { analytics: true, marketing: true },
      search: "?aca_internal=1",
    });

    expect(windowMock.__ACA_ANALYTICS_EXCLUDE__).toBe(true);
    expect(windowMock.__ACA_ANALYTICS_EXCLUSION_REASON__).toBe("internal");
    expect(windowMock["ga-disable-G-XZB9KZ4VCH"]).toBe(true);
    expect(scripts).toHaveLength(0);
  });

  it("excludes webdriver and known crawler user agents", () => {
    expect(
      runGate({ webdriver: true }).windowMock.__ACA_ANALYTICS_EXCLUSION_REASON__
    ).toBe("automated");
    expect(
      runGate({ userAgent: "Googlebot/2.1" }).windowMock
        .__ACA_ANALYTICS_EXCLUSION_REASON__
    ).toBe("automated");
  });

  it("expires a saved choice after twelve months", () => {
    const { scripts, values, windowMock } = runGate({
      consent: {
        analytics: true,
        marketing: true,
        updatedAt: Date.now() - 366 * 24 * 60 * 60 * 1000,
      },
    });

    expect(windowMock.__ACA_COOKIE_CONSENT__).toBe(null);
    expect(values.has("aca_cookie_consent_v1")).toBe(false);
    expect(scripts).toHaveLength(0);
  });
});

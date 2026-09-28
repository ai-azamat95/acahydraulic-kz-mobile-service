export const COOKIE_CONSENT_STORAGE_KEY = "aca_cookie_consent_v1";
export const COOKIE_CONSENT_VERSION = 1 as const;
export const COOKIE_CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
export const COOKIE_CONSENT_EVENT = "aca:cookie-consent-changed";
export const OPEN_COOKIE_SETTINGS_EVENT = "aca:open-cookie-settings";

export type CookieConsent = {
  version: typeof COOKIE_CONSENT_VERSION;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: number;
};

function isValidConsent(value: unknown): value is CookieConsent {
  if (!value || typeof value !== "object") return false;
  const consent = value as Partial<CookieConsent>;
  return (
    consent.version === COOKIE_CONSENT_VERSION &&
    consent.necessary === true &&
    typeof consent.analytics === "boolean" &&
    typeof consent.marketing === "boolean" &&
    typeof consent.updatedAt === "number" &&
    Date.now() - consent.updatedAt <= COOKIE_CONSENT_MAX_AGE_MS
  );
}

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  const earlyConsent = window.__ACA_COOKIE_CONSENT__;
  if (isValidConsent(earlyConsent)) return earlyConsent;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (isValidConsent(parsed)) return parsed;
    if (stored) window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }

  return null;
}

export function saveCookieConsent(preference: {
  analytics: boolean;
  marketing: boolean;
}): CookieConsent {
  const consent: CookieConsent = {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics: preference.analytics,
    marketing: preference.marketing,
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(consent)
    );
  } catch {
    // The current-page choice still applies when private browsing blocks storage.
  }

  if (window.__ACA_APPLY_COOKIE_CONSENT__) {
    window.__ACA_APPLY_COOKIE_CONSENT__(consent);
  } else {
    window.__ACA_COOKIE_CONSENT__ = consent;
    window.dispatchEvent(
      new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, {
        detail: consent,
      })
    );
  }

  return consent;
}

export function hasMarketingConsent(): boolean {
  return getStoredCookieConsent()?.marketing === true;
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

import type { CookieConsent } from "@/lib/cookieConsent";

declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean;
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    __ACA_ANALYTICS_EXCLUDE__?: boolean;
    __ACA_ANALYTICS_EXCLUSION_REASON__?: "internal" | "automated" | null;
    __ACA_COOKIE_CONSENT__?: CookieConsent | null;
    __ACA_APPLY_COOKIE_CONSENT__?: (consent: CookieConsent) => void;
    __ACA_GOOGLE_TAG_INITIALIZED__?: boolean;
    __ACA_GA4_CONFIGURED__?: boolean;
    __ACA_ADS_CONFIGURED__?: boolean;
    __ACA_YANDEX_INITIALIZED__?: boolean;
    __ACA_TIKTOK_INITIALIZED__?: boolean;
    ym?: ((...args: any[]) => void) & { a?: IArguments[]; l?: number };
    ttq?: any;
    TiktokAnalyticsObject?: string;
  }
}

export {};

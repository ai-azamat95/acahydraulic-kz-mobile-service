// Global type declarations for window extensions

interface Window {
  gtag_report_conversion: (url?: string) => boolean;
  gtag: (...args: any[]) => void;
  dataLayer: any[];
  __ACA_ANALYTICS_EXCLUDE__?: boolean;
  __ACA_ANALYTICS_EXCLUSION_REASON__?: "internal" | "automated" | null;
}

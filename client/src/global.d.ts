// Global type declarations for window extensions

interface Window {
  gtag_report_conversion: (url?: string) => boolean;
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}

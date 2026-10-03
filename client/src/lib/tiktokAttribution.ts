import { hasMarketingConsent } from './cookieConsent';

const STORAGE_KEY = 'aca_tiktok_attribution_v1';
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term', 'ttclid'] as const;
export type Attribution = Partial<Record<typeof KEYS[number], string>>;
let pending: Attribution = {};

export function captureTikTokAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  if (window.__ACA_ANALYTICS_EXCLUDE__) return {};
  const params = new URLSearchParams(window.location.search);
  if (params.has('utm_source') || params.has('ttclid')) {
    pending = {};
    for (const key of KEYS) {
      const value = params.get(key)?.replace(/[\r\n]/g, ' ').slice(0, 256);
      if (value) pending[key] = value;
    }
  }
  if (!hasMarketingConsent()) {
    try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
    return {};
  }
  try {
    if (Object.keys(pending).length) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}');
    const result: Attribution = {};
    for (const key of KEYS) if (typeof saved[key] === 'string') result[key] = saved[key].slice(0, 256);
    return result;
  } catch { return { ...pending }; }
}

export function attributionMessage(): string {
  const attribution = captureTikTokAttribution();
  // Click identifiers stay on the site; human-readable campaign labels go to the operator.
  const labels = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content'] as const;
  const parts = labels.filter(key => attribution[key]).map(key => `${key}: ${attribution[key]}`);
  return parts.length ? `Источник обращения: ${parts.join(' | ')}` : '';
}

export function trackTikTokContact(contactType: string): void {
  trackTikTokEvent('Contact', { content_name: contactType });
}

export function trackTikTokEvent(event: 'Contact' | 'ViewContent', properties: Record<string, unknown>): void {
  if (typeof window === 'undefined' || window.__ACA_ANALYTICS_EXCLUDE__ || !hasMarketingConsent()) return;
  window.ttq?.track?.(event, properties);
}

export function contactTypeForHref(href: string): 'whatsapp' | 'phone' | null {
  if (href.startsWith('tel:')) return 'phone';
  try {
    const url = new URL(href);
    if (url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com'].includes(url.hostname)) return 'whatsapp';
  } catch { /* Ignore non-contact links. */ }
  return null;
}

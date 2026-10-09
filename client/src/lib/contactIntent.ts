// A prepared message / WhatsApp click is not a received or qualified lead.
// Keep the existing Ads label for continuity; its action must be secondary.
export const GOOGLE_ADS_FORM_INTENT = 'AW-17847190636/JZkfCOu_84McEOyImr5C';

export function trackFormContactIntent(source: 'b2b_form' | 'calculator') {
  if (typeof window === 'undefined' || window.__ACA_ANALYTICS_EXCLUDE__) return;
  const consent = window.__ACA_COOKIE_CONSENT__;
  const params = {
    form_source: source,
    lead_stage: 'contact_intent',
    paid_diagnostics_acknowledged: true,
    price_agreement_pending: true,
  };
  // Never pass free-text model/location, message text or contact details here.
  // Each vendor is isolated: a blocked tracker must not break the contact path.
  if (consent?.analytics) {
    try { window.gtag?.('event', 'form_whatsapp_click', params); } catch (_) {}
  }
  if (consent?.marketing) {
    try {
      window.gtag?.('event', 'conversion', { send_to: GOOGLE_ADS_FORM_INTENT });
    } catch (_) {}
    try {
      (window as any).ttq?.track?.('Contact', { content_type: 'service', ...params });
    } catch (_) {}
  }
}

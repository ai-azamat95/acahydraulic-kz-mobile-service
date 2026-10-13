// A prepared message / WhatsApp click is not a received or qualified lead.
// Google Ads conversion reporting must happen only after the inquiry is
// received and qualified in the CRM/offline sales process.

export function createContactIntentId() {
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `ACA-${Date.now().toString(36)}-${randomPart}`.toUpperCase();
}

export function trackFormContactIntent(source: 'b2b_form' | 'calculator', contactIntentId?: string) {
  if (typeof window === 'undefined' || window.__ACA_ANALYTICS_EXCLUDE__) return;
  const consent = window.__ACA_COOKIE_CONSENT__;
  const params = {
    form_source: source,
    lead_stage: 'contact_intent',
    ...(contactIntentId ? { contact_intent_id: contactIntentId } : {}),
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
      (window as any).ttq?.track?.('Contact', { content_type: 'service', ...params });
    } catch (_) {}
  }
}

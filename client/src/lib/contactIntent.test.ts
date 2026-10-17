import { afterEach, describe, expect, it, vi } from 'vitest';
import { createContactIntentId, trackFormContactIntent } from './contactIntent';

afterEach(() => vi.unstubAllGlobals());

function setup(analytics: boolean, marketing: boolean, excluded = false) {
  const gtag = vi.fn();
  const track = vi.fn();
  const reportConversion = vi.fn();
  const yandexGoal = vi.fn();
  vi.stubGlobal('window', {
    __ACA_COOKIE_CONSENT__: { analytics, marketing },
    __ACA_ANALYTICS_EXCLUDE__: excluded,
    __ACA_TRACK_YANDEX_GOAL__: yandexGoal,
    gtag, ttq: { track }, gtag_report_conversion: reportConversion,
  });
  return { gtag, track, yandexGoal, reportConversion };
}

describe('form contact intent (never a received lead)', () => {
  for (const source of ['b2b_form', 'calculator'] as const) {
    it(`${source}: records intent and calls only the existing secondary Ads helper`, () => {
      const { gtag, track, yandexGoal, reportConversion } = setup(true, true);
      trackFormContactIntent(source, 'ACA-TEST-123');
      expect(gtag.mock.calls).toEqual([
        ['event', 'form_whatsapp_click', {
          form_source: source, lead_stage: 'contact_intent',
          contact_intent_id: 'ACA-TEST-123',
          paid_diagnostics_acknowledged: true, price_agreement_pending: true,
        }],
      ]);
      expect(track).toHaveBeenCalledOnce();
      expect(yandexGoal).toHaveBeenCalledWith('form_whatsapp_click', {
        form_source: source, lead_stage: 'contact_intent', contact_intent_id: 'ACA-TEST-123',
        paid_diagnostics_acknowledged: true, price_agreement_pending: true,
      });
      expect(reportConversion).toHaveBeenCalledOnce();
      expect(track.mock.calls[0][0]).toBe('Contact');
      expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/conversion|send_to|qualified_lead|generate_lead|phone|email|location|model/);
    });
  }
  it('does not track without consent or for excluded traffic', () => {
    for (const excluded of [false, true]) {
      const { gtag, track, reportConversion } = setup(excluded, excluded, excluded);
      trackFormContactIntent('b2b_form');
      expect(gtag).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
      expect(reportConversion).not.toHaveBeenCalled();
    }
    vi.stubGlobal('window', {});
    expect(() => trackFormContactIntent('b2b_form')).not.toThrow();
  });
  it('respects separate analytics and marketing choices', () => {
    const analytics = setup(true, false);
    trackFormContactIntent('calculator');
    expect(analytics.gtag).toHaveBeenCalledOnce();
    expect(analytics.yandexGoal).toHaveBeenCalledOnce();
    expect(analytics.gtag.mock.calls[0][1]).toBe('form_whatsapp_click');
    expect(analytics.track).not.toHaveBeenCalled();
    expect(analytics.reportConversion).not.toHaveBeenCalled();
    const marketing = setup(false, true);
    trackFormContactIntent('calculator');
    expect(marketing.gtag).not.toHaveBeenCalled();
    expect(marketing.yandexGoal).not.toHaveBeenCalled();
    expect(marketing.track).toHaveBeenCalledOnce();
    expect(marketing.reportConversion).toHaveBeenCalledOnce();
  });
  it('blocked vendors never prevent the customer continuing to WhatsApp', () => {
    vi.stubGlobal('window', {
      __ACA_COOKIE_CONSENT__: { analytics: true, marketing: true },
      gtag: () => { throw Error('blocked'); },
      __ACA_TRACK_YANDEX_GOAL__: () => { throw Error('blocked'); },
      ttq: { track: () => { throw Error('blocked'); } },
    });
    expect(() => trackFormContactIntent('b2b_form')).not.toThrow();
  });
  it('is safe during server rendering', () => {
    vi.stubGlobal('window', undefined);
    expect(() => trackFormContactIntent('calculator')).not.toThrow();
  });

  it('creates a non-PII reference that can be reconciled with the WhatsApp inquiry', () => {
    expect(createContactIntentId()).toMatch(/^ACA-[A-Z0-9-]{8,}$/);
  });
});

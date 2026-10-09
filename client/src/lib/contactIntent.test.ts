import { afterEach, describe, expect, it, vi } from 'vitest';
import { GOOGLE_ADS_FORM_INTENT, trackFormContactIntent } from './contactIntent';

afterEach(() => vi.unstubAllGlobals());

function setup(analytics: boolean, marketing: boolean, excluded = false) {
  const gtag = vi.fn();
  const track = vi.fn();
  vi.stubGlobal('window', {
    __ACA_COOKIE_CONSENT__: { analytics, marketing },
    __ACA_ANALYTICS_EXCLUDE__: excluded,
    gtag, ttq: { track },
  });
  return { gtag, track };
}

describe('form contact intent (never a received lead)', () => {
  for (const source of ['b2b_form', 'calculator'] as const) {
    it(`${source}: sends one intent and one secondary Ads signal without customer data`, () => {
      const { gtag, track } = setup(true, true);
      trackFormContactIntent(source);
      expect(gtag.mock.calls).toEqual([
        ['event', 'form_whatsapp_click', {
          form_source: source, lead_stage: 'contact_intent',
          paid_diagnostics_acknowledged: true, price_agreement_pending: true,
        }],
        ['event', 'conversion', { send_to: GOOGLE_ADS_FORM_INTENT }],
      ]);
      expect(track).toHaveBeenCalledOnce();
      expect(track.mock.calls[0][0]).toBe('Contact');
      expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/qualified_lead|generate_lead|phone|email|location|model/);
    });
  }
  it('does not track without consent or for excluded traffic', () => {
    for (const excluded of [false, true]) {
      const { gtag, track } = setup(excluded, excluded, excluded);
      trackFormContactIntent('b2b_form');
      expect(gtag).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
    }
    vi.stubGlobal('window', {});
    expect(() => trackFormContactIntent('b2b_form')).not.toThrow();
  });
  it('respects separate analytics and marketing choices', () => {
    const analytics = setup(true, false);
    trackFormContactIntent('calculator');
    expect(analytics.gtag).toHaveBeenCalledOnce();
    expect(analytics.gtag.mock.calls[0][1]).toBe('form_whatsapp_click');
    expect(analytics.track).not.toHaveBeenCalled();
    const marketing = setup(false, true);
    trackFormContactIntent('calculator');
    expect(marketing.gtag).toHaveBeenCalledOnce();
    expect(marketing.gtag.mock.calls[0][1]).toBe('conversion');
  });
  it('blocked vendors never prevent the customer continuing to WhatsApp', () => {
    vi.stubGlobal('window', {
      __ACA_COOKIE_CONSENT__: { analytics: true, marketing: true },
      gtag: () => { throw Error('blocked'); },
      ttq: { track: () => { throw Error('blocked'); } },
    });
    expect(() => trackFormContactIntent('b2b_form')).not.toThrow();
  });
  it('is safe during server rendering', () => {
    vi.stubGlobal('window', undefined);
    expect(() => trackFormContactIntent('calculator')).not.toThrow();
  });
});

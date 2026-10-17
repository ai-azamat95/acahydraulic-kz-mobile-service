import fs from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackCatalogEvent } from '../client/src/lib/catalogAnalytics';
import { trackFormContactIntent } from '../client/src/lib/contactIntent';

const html = fs.readFileSync('client/index.html', 'utf8');
const helpers = html.match(/<script>\s*(\/\/ Compatibility helpers[\s\S]*?)<\/script>/)![1];
const tracker = html.split('<!-- Contact-intent tracker.')[1].match(/<script>([\s\S]*?)<\/script>/)![1];
const ADS_FORM = 'AW-17847190636/JZkfCOu_84McEOyImr5C';
const ADS_PHONE = 'AW-17847190636/MNy9COmB06QcEOyImr5C';
const PRIVATE = 'PRIVATE_CLIENT_CONTENT';
const catalogAttributes = {
  href: `https://wa.me/77714177925?text=${PRIVATE}`,
  'data-aca-contact-event': 'catalog_whatsapp_click',
  'data-aca-contact-source': 'product_card',
  'data-aca-item-id': 'public-product-123',
  'data-aca-item-category': 'hydraulic-pumps',
};

afterEach(() => vi.unstubAllGlobals());

function setup(consent?: { analytics: boolean; marketing: boolean }, excluded = false) {
  let listener: (event: unknown) => void;
  const gtag = vi.fn(), track = vi.fn(), open = vi.fn();
  const window: Record<string, any> = {
    __ACA_COOKIE_CONSENT__: consent, __ACA_ANALYTICS_EXCLUDE__: excluded,
    gtag, ttq: { track }, open,
    location: { href: `https://acahydraulic.kz/contacts/?text=${PRIVATE}` },
  };
  const context = { window, document: { addEventListener: (_: string, fn: typeof listener) => { listener = fn; } } };
  vm.runInNewContext(helpers, context);
  window.gtag_report_conversion = (context as any).gtag_report_conversion;
  vm.runInNewContext(tracker, context);
  vi.stubGlobal('window', window);
  const click = (attributes: Record<string, string> | null, isTrusted = true) => {
    const preventDefault = vi.fn();
    listener({ isTrusted, preventDefault, target: { closest: () => attributes && ({ getAttribute: (key: string) => attributes[key] || null }) } });
    expect(preventDefault).not.toHaveBeenCalled();
  };
  const conversions = () => gtag.mock.calls.filter(call => call[1] === 'conversion');
  return { window, gtag, track, open, click, conversions };
}

function runHandler(file: string, start: string, end: string, name: string, context: Record<string, unknown>, args: unknown[] = []) {
  const source = fs.readFileSync(file, 'utf8');
  const begin = source.indexOf(start);
  const finish = source.indexOf(end, begin);
  expect(begin).toBeGreaterThanOrEqual(0);
  expect(finish).toBeGreaterThan(begin);
  const code = transformSync(source.slice(begin, finish), { loader: 'tsx' }).code;
  vm.runInNewContext(`${code}\n${name}(...args);`, { ...context, args });
}

const choices = [undefined,
  { analytics: false, marketing: false },
  { analytics: true, marketing: false },
  { analytics: false, marketing: true },
  { analytics: true, marketing: true },
];

describe('consented contact clicks (no network or vendor SDK)', () => {
  for (const consent of choices) {
    for (const path of ['delegated catalog anchor', 'React catalog button']) {
      it(`${path}: ${JSON.stringify(consent)}`, () => {
        const f = setup(consent);
        if (path === 'delegated catalog anchor') f.click(catalogAttributes);
        else {
          f.click(null); // Actual React catalog controls are buttons, not WhatsApp anchors.
          trackCatalogEvent('catalog_whatsapp_click', { catalog_source: 'product_page', item_id: 'public-product-123' });
        }
        expect(f.gtag.mock.calls.map(call => call[1])).toEqual(consent?.analytics ? ['catalog_whatsapp_click'] : []);
        expect(f.conversions()).toEqual([]); // Catalog Ads measurement remains GA4-imported only.
        expect(f.track.mock.calls).toEqual(consent?.marketing ? [['Contact', {
          content_type: 'product', contact_method: 'whatsapp', lead_stage: 'contact_intent',
        }]] : []);
        expect(JSON.stringify([f.gtag.mock.calls, f.track.mock.calls])).not.toContain(PRIVATE);
      });
    }
    it(`form + delegated WhatsApp anchor: ${JSON.stringify(consent)}`, () => {
      const f = setup(consent);
      f.click({ href: `https://wa.me/77714177925?text=${PRIVATE}` });
      trackFormContactIntent('calculator', 'ACA-TEST-123');
      expect(f.gtag.mock.calls.filter(call => call[1] === 'form_whatsapp_click')).toHaveLength(consent?.analytics ? 1 : 0);
      expect(f.conversions()).toEqual(consent?.marketing ? [['event', 'conversion', { send_to: ADS_FORM }]] : []);
      expect(f.track).toHaveBeenCalledTimes(consent?.marketing ? 1 : 0);
      expect(JSON.stringify([f.gtag.mock.calls, f.track.mock.calls])).not.toContain(PRIVATE);
    });
  }

  it('stops both new events immediately after consent withdrawal', () => {
    const f = setup({ analytics: true, marketing: true });
    f.click(catalogAttributes);
    trackFormContactIntent('b2b_form', 'ACA-TEST-123');
    f.gtag.mockClear(); f.track.mockClear();
    f.window.__ACA_COOKIE_CONSENT__ = { analytics: false, marketing: false };
    f.click(catalogAttributes);
    trackCatalogEvent('catalog_whatsapp_click');
    trackFormContactIntent('b2b_form', 'ACA-TEST-123');
    expect(f.gtag).not.toHaveBeenCalled();
    expect(f.track).not.toHaveBeenCalled();
  });

  it('excludes internal/automated traffic, including the compatibility helper', () => {
    const f = setup({ analytics: true, marketing: true }, true);
    f.click(catalogAttributes);
    trackCatalogEvent('catalog_whatsapp_click');
    trackFormContactIntent('b2b_form');
    f.window.gtag_report_conversion();
    expect(f.gtag).not.toHaveBeenCalled();
    expect(f.track).not.toHaveBeenCalled();
  });

  it('ignores scripted delegated clicks and does not turn unrelated catalog events into Contact', () => {
    const f = setup({ analytics: true, marketing: true });
    f.click(catalogAttributes, false);
    trackCatalogEvent('view_item');
    expect(f.track).not.toHaveBeenCalled();
    expect(f.conversions()).toEqual([]);
  });

  it('keeps the phone label unchanged and does not send form Ads conversions for catalog clicks', () => {
    const f = setup({ analytics: true, marketing: true });
    f.click({ href: 'tel:+77714177925' });
    expect(f.conversions()).toEqual([['event', 'conversion', { send_to: ADS_PHONE }]]);
    expect(f.track).not.toHaveBeenCalled();
  });

  for (const path of ['delegated', 'React']) {
    it(`${path}: a missing/blocked Google tracker does not suppress TikTok or cancel navigation`, () => {
      const f = setup({ analytics: true, marketing: true });
      for (const gtag of [undefined, () => { throw Error('blocked'); }]) {
        f.window.gtag = gtag;
        f.track.mockClear();
        expect(() => path === 'delegated' ? f.click(catalogAttributes) : trackCatalogEvent('catalog_whatsapp_click')).not.toThrow();
        expect(f.track).toHaveBeenCalledOnce();
      }
    });
  }

  it('a blocked TikTok tracker does not suppress the existing secondary form Ads action', () => {
    const f = setup({ analytics: true, marketing: true });
    f.window.ttq.track = () => { throw Error('blocked'); };
    expect(() => trackFormContactIntent('b2b_form')).not.toThrow();
    expect(f.conversions()).toEqual([['event', 'conversion', { send_to: ADS_FORM }]]);
  });

  it('runs the real product request handler: one Contact, one GA4 event and the original WhatsApp URL', () => {
    const f = setup({ analytics: true, marketing: true });
    runHandler('client/src/pages/CatalogProduct.tsx', '  const requestProduct =', '\n  if (loading)', 'requestProduct', {
      window: f.window, trackCatalogEvent, language: 'ru', WHATSAPP_NUMBER: '77714177925',
      product: { id: '123', title: 'Public pump', category: 'hydraulic-pumps' }, copy: { whatsappPhoto: 'Фото шильдика' },
    });
    expect(f.open).toHaveBeenCalledOnce();
    const url = new URL(f.open.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe('https://wa.me/77714177925');
    expect(url.searchParams.get('text')).toContain('Public pump');
    expect(f.gtag.mock.calls.map(call => call[1])).toEqual(['catalog_whatsapp_click']);
    expect(f.track).toHaveBeenCalledOnce();
    expect(f.conversions()).toEqual([]);
    for (const file of ['Catalog', 'CatalogProduct']) {
      expect(fs.readFileSync(`client/src/pages/${file}.tsx`, 'utf8')).not.toContain('useTikTokContact');
    }
  });

  for (const blocked of [false, true]) {
    it(`runs the real B2B submit handler without leaking form content (blocked trackers: ${blocked})`, () => {
      const f = setup({ analytics: true, marketing: true });
      if (blocked) {
        f.window.gtag = () => { throw Error('blocked'); };
        f.window.ttq.track = () => { throw Error('blocked'); };
      }
      runHandler('client/src/components/B2BLeadForm.tsx', '  const handleSubmit =', '\n\n  return (', 'handleSubmit', {
        window: f.window, trackFormContactIntent, createContactIntentId: () => 'ACA-TEST-123',
        budgetAccepted: true, setIsSubmitting: vi.fn(), onSuccess: vi.fn(), toast: { error: vi.fn(), info: vi.fn() },
        formData: { name: PRIVATE, phone: '+70000000000', location: PRIVATE, model: PRIVATE, email: 'fake@example.test' },
      }, [{ preventDefault: vi.fn() }]);
      expect(f.open).toHaveBeenCalledOnce();
      expect(new URL(f.open.mock.calls[0][0]).searchParams.get('text')).toContain(PRIVATE);
      expect(JSON.stringify([f.gtag.mock.calls, f.track.mock.calls])).not.toMatch(/PRIVATE_CLIENT_CONTENT|70000000000|fake@example.test/);
      if (!blocked) {
        expect(f.conversions()).toEqual([['event', 'conversion', { send_to: ADS_FORM }]]);
        expect(f.track).toHaveBeenCalledOnce();
      }
    });
  }
});

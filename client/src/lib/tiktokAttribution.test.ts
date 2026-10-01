import { beforeEach, describe, expect, it, vi } from 'vitest';

let values: Map<string, string>;
let browser: any;
beforeEach(() => {
  vi.resetModules();
  values = new Map();
  browser = {
    location: { search: '?utm_source=tiktok&utm_medium=paid&utm_campaign=repair&utm_content=cat&ttclid=click-123' },
    __ACA_COOKIE_CONSENT__: { version: 1, necessary: true, analytics: true, marketing: true, updatedAt: Date.now() },
    localStorage: { getItem: () => null },
    sessionStorage: {
      getItem: (key: string) => values.get(key) || null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
    ttq: { track: vi.fn() },
  };
  vi.stubGlobal('window', browser);
});

describe('TikTok site attribution', () => {
  it('retains campaign and click ID after navigation but excludes click ID from WhatsApp text', async () => {
    const api = await import('./tiktokAttribution');
    api.captureTikTokAttribution();
    browser.location.search = '';
    expect(api.captureTikTokAttribution()).toMatchObject({ utm_campaign: 'repair', ttclid: 'click-123' });
    expect(api.attributionMessage()).toContain('utm_content: cat');
    expect(api.attributionMessage()).not.toContain('click-123');
  });
  it('stores nothing and sends no event without marketing consent, then captures after consent', async () => {
    const api = await import('./tiktokAttribution');
    browser.__ACA_COOKIE_CONSENT__.marketing = false;
    expect(api.captureTikTokAttribution()).toEqual({});
    api.trackTikTokContact('whatsapp');
    expect(values.size).toBe(0);
    expect(browser.ttq.track).not.toHaveBeenCalled();
    browser.location.search = '';
    browser.__ACA_COOKIE_CONSENT__.marketing = true;
    expect(api.captureTikTokAttribution().utm_campaign).toBe('repair');
  });
  it('replaces the campaign for a new tagged visit and removes persisted attribution on opt-out', async () => {
    const api = await import('./tiktokAttribution');
    api.captureTikTokAttribution();
    browser.location.search = '?utm_source=tiktok&utm_medium=organic';
    expect(api.captureTikTokAttribution()).toEqual({ utm_source: 'tiktok', utm_medium: 'organic' });
    browser.__ACA_COOKIE_CONSENT__.marketing = false;
    expect(api.attributionMessage()).toBe('');
    expect(values.size).toBe(0);
  });
  it('records contact intent without reporting a submitted form or sale', async () => {
    const api = await import('./tiktokAttribution');
    api.trackTikTokContact('whatsapp');
    expect(browser.ttq.track).toHaveBeenCalledWith('Contact', { content_name: 'whatsapp' });
    browser.__ACA_ANALYTICS_EXCLUDE__ = true;
    api.trackTikTokContact('phone');
    expect(browser.ttq.track).toHaveBeenCalledTimes(1);
    expect(api.captureTikTokAttribution()).toEqual({});
  });
  it('recognizes only exact WhatsApp hosts and telephone links', async () => {
    const { contactTypeForHref } = await import('./tiktokAttribution');
    expect(contactTypeForHref('https://wa.me/77714177925')).toBe('whatsapp');
    expect(contactTypeForHref('https://api.whatsapp.com/send?phone=77714177925')).toBe('whatsapp');
    expect(contactTypeForHref('tel:+77714177925')).toBe('phone');
    expect(contactTypeForHref('https://wa.me.example.com/')).toBeNull();
    expect(contactTypeForHref('/catalog/')).toBeNull();
  });
  it('keeps contact flow available when storage is blocked', async () => {
    const api = await import('./tiktokAttribution');
    browser.sessionStorage.setItem = () => { throw new Error('blocked'); };
    expect(api.attributionMessage()).toContain('utm_campaign: repair');
  });
});

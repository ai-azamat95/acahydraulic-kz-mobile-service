// Local QA only: external requests, tel navigation and popups are blocked.
// Run against the built preview with PLAYWRIGHT_MODULE pointing to an installed runtime.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:5187');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Use a local preview only');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  return url.origin === base.origin && !url.pathname.startsWith('/api/') ? route.continue() : route.abort();
});
const page = await context.newPage();
const report = { checks: [], errors: [] };
page.on('pageerror', error => report.errors.push(error.message));
const states = [
  { name: 'no-choice' },
  { name: 'denied', analytics: false, marketing: false },
  { name: 'analytics-only', analytics: true, marketing: false },
  { name: 'marketing-only', analytics: false, marketing: true },
  { name: 'both', analytics: true, marketing: true },
  { name: 'withdrawn', analytics: false, marketing: false },
  { name: 'excluded', analytics: true, marketing: true, excluded: true },
];
async function instrument() {
  await page.evaluate(() => {
    window.__calls = [];
    window.__contacts = [];
    window.gtag = (...args) => window.__calls.push(['google', ...args]);
    window.__ACA_TRACK_YANDEX_GOAL__ = (...args) => window.__calls.push(['yandex', ...args]);
    window.open = () => null;
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a[href]');
      if (!link || !/^(tel:|https:)/.test(link.href)) return;
      window.__contacts.push({ href: link.href, alreadyPrevented: event.defaultPrevented });
      event.preventDefault();
    });
  });
}
try {
  for (const route of ['/', '/catalog/brand/rexroth/']) {
    await page.goto(new URL(route, base).href);
    await page.locator('a[href^="tel:"]:visible').first().waitFor();
    const deny = page.getByRole('button', { name: 'Только обязательные', exact: true });
    if (await deny.isVisible()) await deny.click();
    await instrument();
    for (const state of states) {
      await page.evaluate(state => {
        window.__ACA_COOKIE_CONSENT__ = state.name === 'no-choice' ? undefined : { analytics: state.analytics, marketing: state.marketing };
        window.__ACA_ANALYTICS_EXCLUDE__ = Boolean(state.excluded);
        window.__calls = []; window.__contacts = [];
      }, state);
      const link = page.locator('a[href^="tel:"]:visible').first();
      await link.click();
      const result = await page.evaluate(() => ({ calls: window.__calls, contacts: window.__contacts }));
      const expected = state.excluded ? [] : state.analytics ? ['acahydraulic_phone_click'] : state.marketing ? ['conversion'] : [];
      assert.deepEqual(result.calls.filter(call => call[0] === 'google' && ['acahydraulic_phone_click', 'conversion'].includes(call[2])).map(call => call[2]), expected);
      assert.equal(result.calls.filter(call => call[0] === 'yandex').length, !state.excluded && state.analytics ? 1 : 0);
      assert.equal(result.contacts.length, 1);
      assert.equal(result.contacts[0].alreadyPrevented, false, 'Production tracker must not cancel the contact path');
      if (expected[0] === 'conversion') assert.equal(result.calls.find(call => call[0] === 'google' && call[2] === 'conversion')[3].send_to, 'AW-17847190636/MNy9COmB06QcEOyImr5C');
      report.checks.push({ route, consent: state.name, googleEvents: expected, yandexEvents: result.calls.filter(call => call[0] === 'yandex').length });
    }
    await page.evaluate(() => {
      window.__ACA_COOKIE_CONSENT__ = { analytics: true, marketing: true };
      window.__ACA_ANALYTICS_EXCLUDE__ = false;
      window.__calls = [];
    });
    const link = page.locator('a[href^="tel:"]:visible').first();
    await link.click(); await link.click();
    assert.deepEqual(await page.evaluate(() => window.__calls.filter(call => call[0] === 'google' && ['acahydraulic_phone_click', 'conversion'].includes(call[2])).map(call => call[2])), ['acahydraulic_phone_click', 'acahydraulic_phone_click']);
    report.checks.push({ route, consent: 'both', scenario: 'two distinct clicks preserved' });
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.failure = error.stack;
  throw error;
} finally {
  fs.mkdirSync('docs/phone-conversion-artifacts', { recursive: true });
  fs.writeFileSync('docs/phone-conversion-artifacts/browser-checks.json', JSON.stringify(report, null, 2) + '\n');
  await browser.close();
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, errors: report.errors, failure: report.failure }));
}

// Isolated local QA: all outbound requests, API submissions and contact navigation are blocked.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { catalogPagePath } from '../shared/catalog-pagination.mjs';

const runtime = process.env.ACA_PLAYWRIGHT_PATH || `${process.env.RUNNER_TEMP}/aca-ui/node_modules/playwright/index.mjs`;
const { chromium } = await import(runtime);
const root = path.resolve('dist/public');
const out = path.resolve('output/seo-pagination-cookie');
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, `.${name}`);
  if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { file = path.join(root, '404.html'); res.statusCode = 404; }
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const executablePath = process.env.ACA_CHROME_EXECUTABLE;
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const report = { origin, checks: [], errors: [], blockedOutbound: 0, apiSubmissions: 0 };
async function context(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block', ...options });
  ctx.qaVendorRequests = [];
  await ctx.route('**/*', route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin && !url.pathname.startsWith('/api/')) return route.continue();
    if (url.origin === origin) report.apiSubmissions++;
    else {
      report.blockedOutbound++;
      if (/googletagmanager|google-analytics|googleadservices|analytics\.tiktok|mc\.yandex/i.test(url.hostname)) ctx.qaVendorRequests.push(url.hostname);
    }
    return route.abort();
  });
  ctx.on('page', page => page.on('pageerror', error => report.errors.push(error.message)));
  return ctx;
}
const ready = page => page.waitForFunction(() => document.querySelector('[data-index-complete]')?.dataset.indexComplete === 'true');
const paths = ['/catalog/category/gear-pumps/', '/catalog/category/gear-pumps/page/2/', '/catalog/category/controllers/page/2/', '/catalog/category/fuel-injectors/page/2/', '/catalog/brand/komatsu/page/2/', '/catalog/model/pc200-8/page/2/', '/catalog/page/1/', '/catalog/page/2/'];
try {
  const rawContext = await context({ javaScriptEnabled: false });
  const raw = await rawContext.newPage();
  const expected = new Map();
  for (const route of paths) {
    assert.equal((await raw.goto(origin + route)).status(), 200, route);
    const urls = await raw.locator('[data-static-product-id] a').evaluateAll(nodes => nodes.map(n => new URL(n.href).pathname.replace(/\/$/, '')));
    assert.equal(urls.length, 10, route);
    assert.equal(await raw.locator('link[rel=canonical]').getAttribute('href'), `https://acahydraulic.kz${route}`);
    assert(await raw.locator('[data-static-pagination] a[rel=next]').count(), route);
    expected.set(route, urls);
    report.checks.push({ route, javaScript: false, products: urls.length });
  }
  await raw.goto(origin + paths[1]);
  await raw.screenshot({ path: path.join(out, 'gear-page-2-no-js.png') });
  for (const route of ['/catalog/category/gear-pumps/page/0/', '/catalog/page/999999/', '/catalog/category/unknown/page/2/']) {
    assert.equal((await raw.goto(origin + route)).status(), 404);
    assert((await raw.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
  }
  await rawContext.close();

  const ctx = await context();
  const page = await ctx.newPage();
  for (const route of paths) {
    await page.goto(origin + route, { waitUntil: 'networkidle' }); await ready(page);
    const urls = await page.locator('.aca-product-card h3 a').evaluateAll(nodes => nodes.map(n => new URL(n.href).pathname.replace(/\/$/, '')));
    assert.deepEqual(urls, expected.get(route), route);
    assert.equal(await page.locator('link[rel=canonical]').count(), 1);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://acahydraulic.kz${route}`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route);
    if (route.startsWith('/catalog/page/')) assert(await page.locator('a[href="/catalog/#section-hydraulics"]').count(), 'numbered inventory links sections back to the chooser');
    report.checks.push({ route, javaScript: true, matchesHtml: true });
  }
  await page.goto(`${origin}/catalog/category/gear-pumps/?page=2&utm_source=google&gclid=local-qa#catalog-results`, { waitUntil: 'networkidle' }); await ready(page);
  await page.waitForURL(url => url.pathname.endsWith('/page/2/'));
  assert.equal(new URL(page.url()).searchParams.get('utm_source'), 'google');
  assert.equal(new URL(page.url()).searchParams.get('gclid'), 'local-qa');
  assert.equal(new URL(page.url()).hash, '#catalog-results');
  assert(!new URL(page.url()).searchParams.has('page'));
  await page.locator('[data-page-next]').click(); await ready(page);
  assert(new URL(page.url()).pathname.endsWith('/page/3/'));
  await page.goBack(); await ready(page);
  assert(new URL(page.url()).pathname.endsWith('/page/2/'));
  await page.locator('#catalog-search input').first().fill('pump');
  await page.waitForFunction(() => document.querySelector('[data-page]')?.dataset.page === '1');
  assert(await page.locator('#catalog-search input').first().evaluate(el => el === document.activeElement));
  report.checks.push({ legacyQuery: 'replaced', attribution: 'preserved', nextBack: 'passed', filterFocus: 'passed' });

  await page.goto(`${origin}/catalog/brand/komatsu/?category=hydraulic-pumps&page=2`, { waitUntil: 'networkidle' }); await ready(page);
  assert.equal(new URL(page.url()).searchParams.get('category'), 'hydraulic-pumps');
  assert((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
  assert.equal(new URL(await page.locator('link[rel=canonical]').getAttribute('href')).pathname, '/catalog/brand/komatsu/');
  for (const invalid of ['0', '-1', '02', 'abc', '999999']) {
    const response = await page.goto(`${origin}/catalog/category/gear-pumps/page/${invalid}/`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 404);
    await page.getByRole('heading', { name: 'Страница каталога не найдена', exact: true }).waitFor();
    assert((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));
    assert.equal(await page.locator('.aca-product-card').count(), 0);
  }
  for (const legacy of ['abc', '0', '-1']) {
    await page.goto(`${origin}/catalog/category/gear-pumps/?page=${legacy}`, { waitUntil: 'networkidle' }); await ready(page);
    await page.waitForURL(url => !url.searchParams.has('page'));
    assert.equal(await page.locator('[data-page]').getAttribute('data-page'), '1');
  }
  await page.goto(`${origin}/catalog/category/gear-pumps/?page=999999`, { waitUntil: 'networkidle' }); await ready(page);
  const count = Number(await page.locator('[data-result-count]').getAttribute('data-result-count'));
  await page.waitForURL(url => url.pathname === catalogPagePath('/catalog/category/gear-pumps/', Math.ceil(count / 10)));
  await page.goto(origin + paths[1], { waitUntil: 'networkidle' }); await ready(page);
  await page.locator('#catalog-results').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(out, 'gear-page-2-390.png') });
  await ctx.close();

  for (const width of [320, 390, 430, 768, 1024, 1280, 1440]) {
    const c = await context({ viewport: { width, height: width < 768 ? 844 : 900 } }); const p = await c.newPage();
    await p.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.deepEqual(await p.evaluate(() => [Boolean(window.__ACA_COOKIE_CONSENT__?.analytics), Boolean(window.__ACA_COOKIE_CONSENT__?.marketing)]), [false, false]);
    assert.deepEqual(c.qaVendorRequests, [], 'no analytics/marketing SDK request before a choice');
    const notice = p.locator('[data-cookie-initial]'); await notice.waitFor();
    const box = await notice.boundingBox();
    if (width < 1280) {
      assert(box.height <= 240, `cookie height ${width}: ${box.height}`);
      assert.equal(await notice.evaluate(n => getComputedStyle(n).position), 'relative');
      assert(box.y >= 112, 'home navigation must not cover notice');
    }
    for (const name of ['Только обязательные', 'Принять все', 'Настроить']) assert(await p.getByRole('button', { name, exact: true }).isVisible());
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width === 390 || width === 1440) await p.screenshot({ path: path.join(out, `cookie-initial-${width}.png`) });
    const cta = p.locator('.home-hero-actions a[href^="tel:"]'); await cta.scrollIntoViewIfNeeded();
    assert(await cta.evaluate(n => { const r = n.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('a') === n; }), `CTA covered at ${width}px`);
    if (width === 390) {
      const trigger = p.getByRole('button', { name: 'Описать поломку', exact: true });
      await trigger.click();
      const form = p.locator('.home-form-dialog'); await form.waitFor();
      assert(await form.locator('button[type=submit]').isDisabled());
      await p.screenshot({ path: path.join(out, 'repair-form-390.png') });
      await p.keyboard.press('Escape'); await form.waitFor({ state: 'hidden' });
      assert(await trigger.evaluate(n => n === document.activeElement));
    }
    report.checks.push({ width, cookieHeight: box.height, ctaUncovered: true, noConsentVendors: true });
    await c.close();
  }

  for (const mode of ['necessary', 'analytics', 'marketing', 'both']) {
    const c = await context(); const p = await c.newPage(); await p.goto(origin + '/', { waitUntil: 'networkidle' });
    if (mode === 'necessary') await p.getByRole('button', { name: 'Только обязательные', exact: true }).click();
    else if (mode === 'both') await p.getByRole('button', { name: 'Принять все', exact: true }).click();
    else {
      await p.getByRole('button', { name: 'Настроить', exact: true }).click();
      const label = mode === 'analytics' ? 'Аналитика' : 'Реклама';
      await p.getByText(label, { exact: true }).click();
      assert(await p.getByRole('checkbox', { name: label, exact: true }).isChecked());
      await p.getByRole('button', { name: 'Сохранить выбор', exact: true }).click();
    }
    await p.reload({ waitUntil: 'networkidle' });
    const flags = await p.evaluate(() => ({ analytics: window.__ACA_COOKIE_CONSENT__?.analytics, marketing: window.__ACA_COOKIE_CONSENT__?.marketing }));
    assert.deepEqual(flags, { analytics: ['analytics', 'both'].includes(mode), marketing: ['marketing', 'both'].includes(mode) });
    await p.getByRole('button', { name: 'Открыть настройки cookie', exact: true }).click();
    assert.equal(await p.getByRole('checkbox', { name: 'Аналитика', exact: true }).isChecked(), flags.analytics);
    assert.equal(await p.getByRole('checkbox', { name: 'Реклама', exact: true }).isChecked(), flags.marketing);
    if (mode === 'both') {
      await p.screenshot({ path: path.join(out, 'cookie-settings-390.png') });
      await p.getByText('Аналитика', { exact: true }).click(); await p.getByText('Реклама', { exact: true }).click();
      await Promise.all([p.waitForEvent('load'), p.getByRole('button', { name: 'Сохранить выбор', exact: true }).click()]);
      assert.deepEqual(await p.evaluate(() => [window.__ACA_COOKIE_CONSENT__.analytics, window.__ACA_COOKIE_CONSENT__.marketing]), [false, false]);
    }
    report.checks.push({ consent: mode, persisted: true, reopened: true }); await c.close();
  }
  await browser.close();
  const result = await promisify(execFile)(process.execPath, ['scripts/verify-phone-consent.mjs'], { env: { ...process.env, PREVIEW_URL: origin, PLAYWRIGHT_MODULE: runtime, ACA_PHONE_ARTIFACT_DIR: out + '/phone' } });
  report.phoneVerification = result.stdout.trim();
  assert.equal(report.apiSubmissions, 0); assert.deepEqual(report.errors, []); report.passed = true;
} catch (error) { report.failure = error.stack; throw error; }
finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(out, 'browser-checks.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, failure: report.failure }));
}

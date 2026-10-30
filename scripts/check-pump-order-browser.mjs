import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import selection from '../shared/pump-order-selection.json' with { type: 'json' };

const runtime = process.env.ACA_PLAYWRIGHT_MODULE
  || `${process.env.RUNNER_TEMP}/aca-ui/node_modules/playwright/index.mjs`;
const { chromium } = await import(pathToFileURL(runtime).href);
const root = path.resolve('dist/public');
const output = path.resolve('output/playwright/pump-order');
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((request, response) => {
  let file = path.resolve(root, `.${decodeURIComponent(request.url.split('?')[0])}`);
  if (!file.startsWith(`${root}${path.sep}`) && file !== root) return response.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return response.writeHead(404).end();
  response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const results = [];
const brandRoutes = Object.entries(selection.brands).map(([slug, brand]) => ({
  route: `/catalog/brand/${slug}/`, slug, families: brand.families,
}));
const routes = [...brandRoutes, { route: '/catalog/category/hydraulic-pumps/' },
  { route: '/services/hydraulic-pumps/' }, { route: '/regions/astana/' }];

async function localPage(options = {}) {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 }, locale: 'ru-RU', ...options });
  // No analytics, form receiver, WhatsApp or other external requests can leave this test.
  await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  await page.addInitScript(() => localStorage.setItem('aca_cookie_consent_v1', JSON.stringify({
    version: 1, necessary: true, analytics: false, marketing: false, updatedAt: Date.now(),
  })));
  return page;
}

async function assertMetadata(page, route) {
  assert.equal(await page.locator('h1').count(), 1, `${route}: one h1`);
  assert.equal(await page.locator('title').count(), 1, `${route}: one title`);
  assert.equal(await page.locator('meta[name="description"]').count(), 1, `${route}: one description`);
  assert.deepEqual(await page.locator('link[rel="canonical"]').evaluateAll(nodes => nodes.map(node => node.href)), [`https://acahydraulic.kz${route}`]);
  assert.doesNotMatch((await page.locator('meta[name="robots"]').getAttribute('content')) || '', /noindex/i);
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const raw of schemas) JSON.parse(raw);
  if (route.includes('/brand/')) {
    assert(schemas.some(raw => JSON.parse(raw)['@type'] === 'CollectionPage'), `${route}: CollectionPage`);
    assert(!schemas.some(raw => /"@type"\s*:\s*"(?:Product|Offer)"/.test(raw)), `${route}: selection does not invent Product/Offer`);
  }
}

async function assertFits(page, label) {
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert(dimensions.document <= dimensions.viewport + 1, `${label}: horizontal overflow ${JSON.stringify(dimensions)}`);
}

try {
  for (const width of [320, 360, 390, 1280]) {
    const page = await localPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const item of routes) {
      await page.goto(`${origin}${item.route}`, { waitUntil: 'networkidle' });
      await page.locator('h1').waitFor();
      if (item.slug) await page.locator(`[data-pump-order-selection="${item.slug}"]`).waitFor();
      await assertMetadata(page, item.route);
      await assertFits(page, `${item.route} @${width}`);
      if (item.slug) {
        for (const family of item.families) {
          const article = page.locator(`[data-pump-family="${family.id}"]`);
          assert.equal(await article.count(), 1);
          const link = article.locator('a[href^="https://wa.me/"]').first();
          const wa = new URL(await link.getAttribute('href'));
          assert.equal(wa.pathname, '/77714177925');
          assert(wa.searchParams.get('text').includes(family.name));
          assert(wa.searchParams.get('text').includes(`https://acahydraulic.kz${item.route}#${family.id}`));
          assert.equal(await article.locator('a[href="tel:+77714177925"]').count(), 1);
          await article.locator('summary').click();
          await assertFits(page, `expanded ${family.id} @${width}`);
          const button = article.locator('button[type="submit"]');
          const fits = await button.evaluate(node => node.scrollWidth <= node.clientWidth + 1 && node.getBoundingClientRect().height >= 44);
          assert(fits, `${family.id}: wrapped accessible form CTA @${width}`);
          if (width === 320 || width === 1280) await article.screenshot({ path: path.join(output, `${family.id}-${width}.png`), animations: 'disabled' });
        }
      } else if (item.route.includes('/category/')) {
        assert.equal(await page.locator('[data-pump-order-navigation] a').count(), 5);
      } else {
        const button = page.getByRole('button', { name: 'ПОДТВЕРДИТЬ И ПЕРЕЙТИ В WHATSAPP', exact: true });
        assert(await button.evaluate(node => node.scrollWidth <= node.clientWidth + 1 && node.getBoundingClientRect().height >= 44), `${item.route}: B2B CTA fits @${width}`);
        if (width === 320) await button.locator('xpath=ancestor::form').screenshot({ path: path.join(output, `${item.route.includes('/regions/') ? 'astana' : 'service'}-form-${width}.png`), animations: 'disabled' });
      }
      results.push({ route: item.route, width, layout: 'pass', metadata: 'pass' });
    }
    assert.deepEqual(errors, [], `runtime errors @${width}`);
    await page.close();
  }

  // Every advertised fragment reaches a real family after React has rendered.
  const page = await localPage();
  for (const item of brandRoutes) for (const family of item.families) {
    await page.goto(`${origin}${item.route}#${family.id}`, { waitUntil: 'networkidle' });
    const article = page.locator(`[data-pump-family="${family.id}"]`);
    await article.waitFor();
    const box = await article.boundingBox();
    assert(box.y >= 0 && box.y < 300, `advertised fragment ${family.id} scrolls to its section: y=${box.y}`);
  }

  await page.goto(`${origin}/catalog/brand/rexroth/#a10vso`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    window.__pumpEvents = [];
    window.__pumpPrepared = [];
    window.gtag = (...args) => window.__pumpEvents.push(args);
    window.__ACA_TRACK_YANDEX_GOAL__ = () => {};
    window.ttq = { track: () => {} };
    window.open = url => { window.__pumpPrepared.push(url); return null; };
    document.addEventListener('click', event => {
      if (event.target.closest('a[href^="https://wa.me/"]')) event.preventDefault();
    }, true);
  });
  const article = page.locator('[data-pump-family="a10vso"]');
  const direct = article.locator('a[href^="https://wa.me/"]').first();
  // The real browser exclusion and consent denial both suppress test traffic.
  await direct.click();
  assert.deepEqual(await page.evaluate(() => window.__pumpEvents), []);
  await page.evaluate(() => {
    window.__ACA_ANALYTICS_EXCLUDE__ = false;
    window.__ACA_COOKIE_CONSENT__ = { analytics: true, marketing: true };
  });
  await direct.click();
  let events = await page.evaluate(() => window.__pumpEvents);
  assert.equal(events.length, 1, 'one physical CTA click emits one event');
  assert.equal(events[0][1], 'catalog_whatsapp_click');
  assert.equal(events[0][2].lead_stage, 'contact_intent');
  await article.locator('summary').click();
  await article.locator('#a10vso-model').fill('TEST-MODEL-ONLY');
  await article.locator('#a10vso-city').fill('TEST-CITY-ONLY');
  await article.locator('#a10vso-machine').fill('TEST-MACHINE-ONLY');
  await article.locator('button[type="submit"]').click();
  events = await page.evaluate(() => window.__pumpEvents);
  assert.equal(events.length, 2);
  assert.equal(events[1][2].request_type, 'prepared_request');
  assert.match(events[1][2].contact_intent_id, /^ACA-/);
  assert.doesNotMatch(JSON.stringify(events), /TEST-(?:MODEL|CITY|MACHINE)|generate_lead|qualified_lead|form_submit_success|SubmitForm/);
  const prepared = await page.evaluate(() => window.__pumpPrepared);
  assert.equal(prepared.length, 1);
  const message = new URL(prepared[0]).searchParams.get('text');
  assert(message.includes(events[1][2].contact_intent_id));
  assert(message.includes('TEST-MODEL-ONLY') && message.includes('TEST-CITY-ONLY'));
  assert(await article.getByRole('status').isVisible());
  await page.close();
  results.push({ localTracking: 'single intent only', preparedMessage: 'intercepted, never sent', privateFieldsInAnalytics: false });

  const noJs = await localPage({ javaScriptEnabled: false });
  for (const item of brandRoutes) {
    await noJs.goto(`${origin}${item.route}`, { waitUntil: 'domcontentloaded' });
    await assertMetadata(noJs, item.route);
    for (const family of item.families) {
      assert.equal(await noJs.locator(`#${family.id}`).count(), 1);
      assert.equal(await noJs.locator(`#${family.id} a[href^="https://wa.me/"]`).count(), 1);
    }
  }
  await noJs.close();
  results.push({ withoutJavaScript: 'all five family sections and contact links pass' });
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, checks: results.length, output }));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

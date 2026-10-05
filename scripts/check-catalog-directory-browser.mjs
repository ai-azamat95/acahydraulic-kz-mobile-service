import assert from 'node:assert/strict';
import fs from 'node:fs';

export async function checkCatalogDirectory(page, origin, label) {
  const published = JSON.parse(fs.readFileSync('dist/public/catalog-data/landing-pages.json', 'utf8'));
  await page.goto(`${origin}/catalog/`, { waitUntil: 'networkidle' });
  const cookies = page.getByRole('button', { name: 'Только обязательные' });
  if (await cookies.isVisible()) await cookies.click();
  const directory = page.locator('[data-catalog-directory]');
  await page.waitForFunction(expected => document.querySelectorAll('[data-catalog-directory] a[href^="/catalog/model/"]').length === expected, published.models.length);
  const expected = [...published.models.map(model => `/catalog/model/${model.slug}/`), ...published.brands.map(brand => `/catalog/brand/${brand.slug}/`)].sort();
  assert.deepEqual((await directory.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).sort(), expected);
  await directory.locator('[data-model-brand="Kubota"] summary').click();
  const formerlyOrphaned = directory.locator('a[href="/catalog/model/d905/"]');
  await formerlyOrphaned.scrollIntoViewIfNeeded();
  assert.ok(await formerlyOrphaned.isVisible());
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `directory overflow ${label}`);
  await directory.screenshot({ path: `catalog-ui-check/directory-${label}.png` });
  await formerlyOrphaned.click();
  await page.waitForURL('**/catalog/model/d905/');
  assert.match(await page.locator('h1').innerText(), /Kubota D905/i);
  assert.ok(!await page.locator('[data-catalog-directory] a[href="/catalog/model/d905/"]').count(), 'model navigation must not self-link');

  await page.goto(`${origin}/catalog/brand/cummins/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('[data-catalog-directory] [data-model-brand="Cummins"]'));
  const modelLinks = await page.locator('[data-catalog-directory] a[href^="/catalog/model/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  assert.ok(modelLinks.includes('/catalog/model/k19/'));
  assert.ok(!modelLinks.includes('/catalog/model/pc200-6/'), 'Cummins must not show global Komatsu top models');
  assert.equal((await page.locator('link[rel="canonical"]').all()).length, 1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://acahydraulic.kz/catalog/brand/cummins/');
  const nojs = await page.context().browser().newPage({ javaScriptEnabled: false, viewport: page.viewportSize() });
  try {
    await nojs.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await nojs.goto(`${origin}/catalog/`);
    assert.deepEqual((await nojs.locator('[data-catalog-directory] a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).sort(), expected);
    await nojs.locator('[data-model-brand="Kubota"] summary').click();
    await nojs.locator('[data-catalog-directory] a[href="/catalog/model/d905/"]').click();
    await nojs.waitForURL('**/catalog/model/d905/');
    assert.match(await nojs.locator('h1').innerText(), /Kubota D905/i);
  } finally {
    await nojs.close();
  }
  return { catalogDirectory: 'pass', brands: published.brands.length, models: published.models.length };
}

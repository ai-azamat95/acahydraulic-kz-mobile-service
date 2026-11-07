import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const { chromium } = await import(process.env.ACA_PLAYWRIGHT_PATH || `${process.env.RUNNER_TEMP}/aca-ui/node_modules/playwright/index.mjs`);
const root = path.resolve('dist/public');
const output = path.resolve('output/nsh');
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((request, response) => {
  let file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) && file !== root) return response.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return response.writeHead(404).end();
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
  response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const executablePath = process.env.ACA_CHROME_EXECUTABLE;
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const results = [];

try {
  for (const width of [320, 390, 1440]) {
    const height = width < 400 ? 844 : 1000;
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    const transfers = [];
    await context.route('https://wa.me/**', async route => {
      transfers.push(route.request().url());
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<title>WhatsApp draft intercepted by test</title>' });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/catalog/category/gear-pumps/`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Только обязательные', exact: true }).click();
    await page.locator('[data-nsh-series="nsh-32"]').waitFor();
    await page.waitForFunction(() => document.querySelector('[data-index-complete="true"]'));
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('[data-nsh-selection] [data-nsh-series]').count(), 5);
    const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, firstBottom: document.querySelector('[data-nsh-series="nsh-10"]').getBoundingClientRect().bottom, searchTop: document.querySelector('#catalog-search').getBoundingClientRect().top, selectionBottom: document.querySelector('#nsh-selection').getBoundingClientRect().bottom }));
    assert.ok(layout.scrollWidth <= width + 1, `${width}: horizontal overflow`);
    assert.ok(layout.firstBottom < height - 76, `${width}: first NSh choice is below the first viewport`);
    assert.ok(layout.searchTop >= layout.selectionBottom, 'selection must precede generic search');
    const [popup] = await Promise.all([context.waitForEvent('page'), page.locator('[data-nsh-series="nsh-32"]').click()]);
    await popup.waitForLoadState('domcontentloaded');
    assert.equal(transfers.length, 1, 'one click must open one draft, with no real WhatsApp request');
    const draft = new URL(transfers[0]);
    assert.equal(draft.pathname, '/77714177925');
    assert.match(draft.searchParams.get('text'), /Нужен насос НШ-32 под заказ/);
    assert.match(draft.searchParams.get('text'), /Полная маркировка насоса/);
    await popup.close();
    if (width === 390) {
      for (const [value, expected] of [['kz', 'НШ сорғысы керек пе?'], ['en', 'Need an NSh pump?'], ['ru', 'Нужен насос НШ?']]) {
        await page.getByLabel('Язык каталога').selectOption(value);
        assert.ok((await page.locator('#nsh-selection h2').textContent()).includes(expected));
      }
    }
    await page.screenshot({ path: path.join(output, `after-${width}.png`) });
    await page.locator('#catalog-search input').first().fill('705-51-20170');
    await page.locator('#catalog-search button[type="submit"]').click();
    await page.waitForFunction(() => location.search.includes('705-51-20170') && Number(document.querySelector('[data-result-count]')?.getAttribute('data-result-count')) > 0 && Number(document.querySelector('[data-result-count]')?.getAttribute('data-result-count')) < 602);
    assert.ok((await page.locator('#catalog-results').innerText()).includes('705-51-20170'));
    assert.deepEqual(errors, [], `${width}: browser runtime errors`);
    results.push({ width, layout, draftTransfersIntercepted: transfers.length, catalogueSearch: 'passed', runtimeErrors: errors });
    await context.close();
  }
  fs.writeFileSync(path.join(output, 'browser-check.json'), JSON.stringify({ passed: true, results }, null, 2) + '\n');
  console.log(JSON.stringify({ passed: true, widths: results.map(result => result.width), actualMessagesSent: 0 }));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

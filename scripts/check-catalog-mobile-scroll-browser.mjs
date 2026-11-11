import assert from 'node:assert/strict';
import fs from 'node:fs';

export async function checkCatalogMobileScroll(browser, origin, engineName) {
  const checks = [];
  for (const width of [320, 375, 390, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, locale: 'ru-RU' });
    try {
      await context.route('**/*', route => {
        const request = route.request();
        return request.url().startsWith(origin) && ['GET', 'HEAD'].includes(request.method()) && !new URL(request.url()).pathname.startsWith('/api/')
          ? route.continue() : route.fulfill({ status: 204, body: '' });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/catalog/?category=turbochargers`, { waitUntil: 'networkidle' });
      await page.locator('.aca-product-card').first().waitFor();
      const necessary = page.getByRole('button', { name: 'Только обязательные', exact: true });
      if (await necessary.isVisible()) await necessary.click();

      async function geometry() {
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        return page.evaluate(() => {
          const rect = selector => {
            const node = document.querySelector(selector);
            const box = node.getBoundingClientRect();
            return { top: box.top, bottom: box.bottom, height: box.height, left: box.left, right: box.right };
          };
          return {
            y: scrollY, width: innerWidth, height: innerHeight,
            nav: rect('[aria-label="Быстрые переходы"]'),
            header: rect('.aca-catalog-header'),
            content: rect('.site-quick-nav-offset'),
            bottom: rect('.aca-mobile-nav'),
            cookie: rect('[aria-label="Открыть настройки cookie"]'),
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          };
        });
      }

      // The navigation must reserve its own row. A fixed bar plus compensating
      // padding leaves the two mobile bars in different viewport positioning systems.
      const start = await geometry();
      assert(Math.abs(start.content.top - start.nav.bottom) <= 1, `${engineName} ${width}: navigation has no normal-flow row`);

      for (const height of [844, 700, 600, 844]) {
        await page.setViewportSize({ width, height });
        for (const delta of [900, -280, 650, -420, 500, -750]) {
          await page.evaluate(delta => window.scrollBy(0, delta), delta);
          const state = await geometry();
          assert(Math.abs(state.nav.top) <= 1, `${engineName} ${width}×${height}: gap above navigation`);
          assert(Math.abs(state.header.top - state.nav.bottom) <= 1, `${engineName} ${width}×${height}: header detached from navigation`);
          assert(!state.overflow, `${engineName} ${width}: horizontal overflow`);
          if (state.bottom.height) assert(state.cookie.bottom <= state.bottom.top + 1, `${engineName} ${width}: cookie launcher overlaps bottom navigation`);
        }
        checks.push({ engine: engineName, width, height, scrollDirections: 6 });
      }
      await page.screenshot({ path: `catalog-ui-check/mobile-scroll-${engineName}-${width}.png` });

      if (engineName === 'chromium') {
        const cdp = await context.newCDPSession(page);
        for (const insets of [{ top: 0, bottom: 34 }, { top: 47, bottom: 34 }, { top: 0, bottom: 0 }]) {
          await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { ...insets, left: 0, right: 0 } });
          await page.evaluate(() => window.scrollBy(0, -120));
          const state = await geometry();
          assert(Math.abs(state.nav.top) <= 1);
          assert(Math.abs(state.header.top - state.nav.bottom) <= 1, `${width}: header ignores safe-area change`);
          const firstLink = await page.locator('[aria-label="Быстрые переходы"] a').first().boundingBox();
          assert(firstLink.y >= insets.top, `${width}: navigation is under the unsafe top inset`);
          assert(state.cookie.bottom <= state.bottom.top + 1, `${width}: unsafe bottom overlap`);
          checks.push({ engine: engineName, width, safeAreaInsets: insets });
        }
        await cdp.detach();
      }

      await page.evaluate(() => window.scrollTo(0, 0));
      const refine = page.locator('.aca-refine-toggle');
      await refine.click();
      assert.equal(await refine.getAttribute('aria-expanded'), 'true');
      assert(await page.locator('#catalog-refine-fields').isVisible());
      await refine.click();
      assert.equal(await refine.getAttribute('aria-expanded'), 'false');

      await page.locator('.aca-product-card').first().getByRole('button', { name: 'В корзину', exact: true }).click();
      await page.getByRole('button', { name: 'Корзина: 1 товаров', exact: true }).click();
      const drawer = page.getByRole('dialog', { name: 'Корзина', exact: true });
      await drawer.waitFor();
      const close = page.getByRole('button', { name: 'Закрыть корзину', exact: true });
      await close.click({ trial: true });
      assert(await close.evaluate(node => {
        const box = node.getBoundingClientRect();
        return node.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
      }), `${engineName} ${width}: cart controls are covered`);
      await close.click();
      await drawer.waitFor({ state: 'hidden' });

      await page.getByRole('link', { name: 'Разделы сайта', exact: true }).click();
      await page.waitForURL(/\/sitemap\/?$/);
      await page.goBack();
      await page.locator('.aca-catalog-header').waitFor();
      await page.evaluate(() => window.scrollTo(0, 0));
      const returned = await geometry();
      assert(Math.abs(returned.header.top - returned.nav.bottom) <= 1, `${engineName} ${width}: header shifts after navigation back`);

      await page.setViewportSize({ width: 844, height: width });
      await page.evaluate(() => window.scrollBy(0, 1000));
      const landscape = await geometry();
      assert(Math.abs(landscape.nav.top) <= 1 && Math.abs(landscape.header.top - landscape.nav.bottom) <= 1, `${engineName} ${width}: detached landscape header`);
      assert(!landscape.overflow);
      checks.push({ engine: engineName, width: 844, height: width, landscape: true, cartAndNavigation: true });
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
  fs.writeFileSync(`catalog-ui-check/mobile-scroll-${engineName}.json`, JSON.stringify(checks, null, 2));
}

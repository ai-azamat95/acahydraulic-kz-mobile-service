import assert from 'node:assert/strict';

export async function checkSiteNavigation(browser, origin, productHandle) {
  const page = await browser.newPage({viewport:{width:390,height:844},locale:'ru-RU'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /DialogContent|validateDOMNesting|cannot be a descendant/.test(message.text())) errors.push(message.text());
  });
  await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  try {
    for (const path of ['/catalog/', `/catalog/${productHandle}`]) {
      await page.goto(origin + path,{waitUntil:'networkidle'});
      const logo = page.getByRole('link',{name:'ACA Hydraulic',exact:true});
      await Promise.all([
        page.waitForNavigation({waitUntil:'networkidle'}),
        logo.click(),
      ]);
      assert.equal(new URL(page.url()).pathname,'/','logo must load homepage document');
      await page.getByRole('heading',{name:'Ремонт гидравлики в Астане',exact:true}).waitFor();
    }
    for (const width of [320,390,768,1024,1440]) {
      await page.setViewportSize({width,height:740});
      await page.goto(origin,{waitUntil:'networkidle'});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
      if (width >= 1280) {
        assert.equal(await page.getByRole('button',{name:'Открыть меню',exact:true}).isVisible(),false);
        continue;
      }
      let expectedLinks;
      for (const next of ['Услуги','Отзывы','Контакты','Главная']) {
        const trigger = page.getByRole('button',{name:'Открыть меню',exact:true});
        await trigger.click();
        const menu = page.getByRole('dialog',{name:'Меню',exact:true});
        await menu.waitFor();
        const links = await menu.locator('nav[aria-label="Основные разделы"] a').evaluateAll(nodes => nodes.map(node => ({label:node.textContent,href:node.getAttribute('href')})));
        if (!expectedLinks) expectedLinks = links;
        assert.deepEqual(links,expectedLinks,'all pages must have the same mobile menu');
        assert.equal(links.length,8);
        assert.equal(await menu.getByRole('link',{name:'Запчасти',exact:true}).count(),1);
        assert.equal(await page.locator('button button').count(),0,'no nested menu buttons');
        const close = await menu.getByRole('button',{name:'Закрыть меню',exact:true}).boundingBox();
        assert(close.width >= 44 && close.height >= 44);
        await page.waitForFunction(() => {
          const box = document.querySelector('[data-site-menu]')?.getBoundingClientRect();
          return box && box.x >= 0 && box.right <= innerWidth + 1;
        });
        const box = await menu.boundingBox();
        assert(box.x >= 0 && box.x + box.width <= width + 1,'menu fits narrow screens');
        await menu.getByRole('link',{name:next,exact:true}).click();
        await menu.waitFor({state:'hidden'});
        await page.locator('h1').waitFor();
      }
      // Closing must restore focus and the page must remain usable.
      await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
      await page.keyboard.press('Escape');
      await page.locator('[data-site-menu]').waitFor({state:'hidden'});
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),'Открыть меню');
    }
    await page.setViewportSize({width:390,height:480});
    await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
    const menuLayout = await page.locator('[data-site-menu]').evaluate(menu => {
      const sections = [...menu.querySelectorAll(':scope > div, :scope > nav')].map(node => node.getBoundingClientRect());
      return {scrolls:menu.scrollHeight > menu.clientHeight,overlaps:sections.some((box,index) => index > 0 && box.top < sections[index-1].bottom - 1)};
    });
    assert.equal(menuLayout.scrolls,true,'short screens must scroll the complete menu');
    assert.equal(menuLayout.overlaps,false,'menu sections must never shrink over each other');
    assert.deepEqual(errors,[],'navigation must not produce runtime or dialog errors');
    return {homepageLogo:'pass',consistentMobileMenu:'pass',widths:[320,390,768,1024,1440],runtimeErrors:errors};
  } finally {
    await page.close();
  }
}

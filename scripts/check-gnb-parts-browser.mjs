import assert from 'node:assert/strict';
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('shared/gnb-parts.json','utf8'));

export async function checkGnbParts(browser, origin, engine) {
  const results = [];
  for (const width of [390,1440]) {
    const page = await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await page.goto(origin+'/catalog/',{waitUntil:'networkidle'});
    const cookies = page.getByRole('button',{name:'Только обязательные'});
    if(await cookies.isVisible()) await cookies.click();
    await page.getByRole('link',{name:data.title,exact:true}).click();
    await page.getByRole('heading',{level:1,name:data.title,exact:true}).waitFor();
    assert.equal(await page.locator('[data-gnb-group]').count(),6);
    assert.equal(await page.locator('link[rel="canonical"]').count(),1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://acahydraulic.kz'+data.path);
    assert((await page.title()).includes(data.title));
    const requestUrl = await page.locator('[data-gnb-cta]').getAttribute('href');
    const request = new URL(requestUrl).searchParams.get('text');
    for(const field of ['Модель установки:','Год:','Серийный номер:','Город:','Нужный срок:','Резьба / диаметр / нагрузка']) assert(request.includes(field));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'GNB landing fits viewport');
    await page.screenshot({path:`catalog-ui-check/gnb-${engine}-${width}.png`,fullPage:true});
    await page.getByRole('link',{name:'Карточка насоса 803001730',exact:true}).click();
    await page.locator('.aca-product-fitment-detail').waitFor();
    assert.equal(new URL(page.url()).pathname.replace(/\/$/,''),data.productPath.replace(/\/$/,''));
    assert((await page.locator('h1').innerText()).includes('803001730'));
    await page.goBack({waitUntil:'networkidle'});
    await page.getByRole('link',{name:'Поставка и установка на XCMG XZ200',exact:true}).click();
    assert.equal(new URL(page.url()).pathname.replace(/\/$/,''),data.casePath.replace(/\/$/,''));
    await page.getByRole('heading',{level:1}).waitFor();
    assert((await page.locator('h1').innerText()).includes('XZ200'));
    assert.deepEqual(errors,[],'GNB catalog-to-product-to-case runtime errors');
    await page.close();
    const context = await browser.newContext({javaScriptEnabled:false,viewport:{width,height:900}});
    const staticPage = await context.newPage();
    await staticPage.goto(origin+data.path,{waitUntil:'load'});
    await staticPage.getByRole('heading',{level:1,name:data.title,exact:true}).waitFor();
    assert.equal(await staticPage.locator('[data-gnb-group]').count(),6);
    assert.equal(await staticPage.getByRole('link',{name:'Карточка насоса 803001730',exact:true}).getAttribute('href'),data.productPath);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'),'https://acahydraulic.kz'+data.path);
    await context.close();
    results.push({engine,width,gnbCatalogJourney:'pass',gnbWithoutJavaScript:'pass',gnbRequestFields:'pass'});
  }
  return results;
}

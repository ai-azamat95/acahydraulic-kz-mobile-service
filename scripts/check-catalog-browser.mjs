import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { checkSiteNavigation } from './check-site-navigation.mjs';
import { checkCatalogPagination } from './check-catalog-pagination-browser.mjs';
import { checkCatalogDirectory } from './check-catalog-directory-browser.mjs';
const { chromium, webkit } = await import(process.env.RUNNER_TEMP + '/aca-ui/node_modules/playwright/index.mjs');
const root = path.resolve('dist/public');
const catalogDir = path.join(root, 'catalog-data');
const catalogManifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
const catalogLandingIndex = JSON.parse(fs.readFileSync(path.join(catalogDir, 'landing-pages.json'), 'utf8'));
const expectedCategoryCardCount = catalogLandingIndex.categories.length + 1;
const completeIndexPath = catalogManifest.indexFile ? path.join(catalogDir, catalogManifest.indexFile) : null;
const catalogProducts = completeIndexPath && fs.existsSync(completeIndexPath)
  ? JSON.parse(fs.readFileSync(completeIndexPath, 'utf8'))
  : fs.readdirSync(catalogDir)
      .filter((file) => /^search-index-\d+\.json$/.test(file))
      .flatMap((file) => JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')));
const expectedControlValveCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('control-valves')).length;
const expectedGearPumpCount = catalogProducts.filter((product) => product.category === 'gear-pumps').length;
const expectedPistonPumpCount = catalogProducts.filter((product) => product.category === 'piston-pumps').length;
const expectedHydraulicMotorCount = catalogProducts.filter((product) => product.category === 'hydraulic-motors').length;
const expectedMainControlValveCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('main-control-valves')).length;
const expectedWiringHarnessCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('wiring-harnesses')).length;
const expectedFuelInjectorCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('fuel-injectors')).length;
const expectedFuelPumpCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('fuel-pumps')).length;
const expectedFuelCommonRailCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('fuel-common-rails')).length;
const expectedEngineRebuildKitCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('engine-rebuild-kits')).length;
const expectedControllerCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('controllers')).length;
const expectedMonitorCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('monitors')).length;
const server = http.createServer((req,res) => {
  let file = path.join(root,decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root + path.sep) && file !== root){res.writeHead(403).end();return;}
  if(fs.existsSync(file) && fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file))file=path.join(root,'index.html');
  res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
async function selectCatalogLanguage(page, language) {
  const mobileSelect = page.getByRole('combobox', { name: 'Язык каталога' });
  if (await mobileSelect.isVisible()) {
    await mobileSelect.selectOption(language.toLowerCase());
    return;
  }
  await page.getByRole('button', { name: language, exact: true }).click();
}
async function acceptEssentialCookies(page) {
  const essentialCookiesButton = page.getByRole('button', { name: 'Только обязательные' });
  if (await essentialCookiesButton.isVisible()) {
    await essentialCookiesButton.click();
  }
}
fs.mkdirSync('catalog-ui-check',{recursive:true});
const results=[];
try {
  for(const [engineName,engine] of Object.entries(process.env.CATALOG_BROWSER_ENGINE === "chromium" ? {chromium} : {chromium,webkit})){
    const browser=await engine.launch();
    try{
      for(const width of [320,390,430,768,1024,1440,1920]){
        const page=await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
        await page.goto(origin+'/catalog',{waitUntil:'networkidle'});
        await acceptEssentialCookies(page);
        await page.locator('.aca-category-card').first().waitFor();
        await page.waitForFunction(
          (expected) => document.querySelector('.aca-category-card[href="/catalog/category/controllers"] .aca-category-count')?.textContent?.replace(/\s/g, '').includes(String(expected)),
          expectedControllerCount,
        );
        for(const lang of ['RU','KZ','EN']){
          await selectCatalogLanguage(page, lang);
          assert.equal(await page.locator('.aca-category-card:visible').count(),expectedCategoryCardCount);
          assert.equal(await page.locator('.aca-category-count:visible').count(),expectedCategoryCardCount);
          assert.equal(await page.locator('[data-complete-engine-category]:visible').count(),1);
          assert.equal(
            new URL(await page.locator('[data-complete-engine-category] img').getAttribute('src'),origin).pathname,
            '/catalog-assets/complete-engine-category.webp',
            'complete engine category must use the generated engine image'
          );
          assert.equal(
            await page.locator('[data-complete-engine-category]').evaluate((node)=>getComputedStyle(node).backgroundColor),
            'rgb(255, 255, 255)',
            'complete engine category must use the same white surface as the other categories'
          );
          assert.equal(await page.locator('[data-catalog-section="engines"] [data-complete-engine-category]').getAttribute('href'),'/parts/engines-complete/');
          assert.equal(await page.locator('[data-catalog-section]').count(),4);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+engineName+' '+width+' '+lang);
          const clipped=await page.locator('.aca-category-label').evaluateAll(nodes=>nodes.filter(n=>n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1).map(n=>n.textContent));
          assert.deepEqual(clipped,[],'clipped labels '+width+' '+lang);
          if(width<768){
            assert.equal(await page.locator('.aca-mobile-promos a:visible').count(),2);
            const imgs=await page.locator('.aca-mobile-promos img').evaluateAll(nodes=>nodes.map(n=>({loaded:n.complete&&n.naturalWidth>0,ratio:n.clientWidth/n.clientHeight,natural:n.naturalWidth/n.naturalHeight})));
            assert(imgs.every(i=>i.loaded&&Math.abs(i.ratio-i.natural)<.05),'banner load/aspect ratio');
            const promoPaths=await page.locator('.aca-mobile-promos img').evaluateAll(nodes=>nodes.map(n=>new URL(n.src).pathname));
            assert.deepEqual(promoPaths,['/catalog-assets/promo-first-order.jpg','/catalog-assets/promo-china-delivery.jpg'],'approved local banner assets');
            const promo=await page.locator('.aca-mobile-promos').boundingBox();
            const categories=await page.locator('.aca-category-grid').first().boundingBox();
            assert(promo.y>=categories.y+categories.height-1,'promotions must remain secondary after categories on mobile');
            assert(await page.locator('.aca-mobile-nav').isVisible());
            await page.locator('.aca-mobile-nav a[href="#catalog-delivery"]').click();
            const delivery=await page.locator('#catalog-delivery').boundingBox();
            assert(delivery.y>=0&&delivery.y<900,'delivery link must scroll to visible content');
          }
          if(width>=1440){
            const hero=await page.locator('.aca-catalog-hero').boundingBox();
            assert(hero.height<820,'desktop hero should reveal categories in the first viewport');
            assert.equal(await page.locator('.aca-desktop-nav:visible').count(),1,'desktop navigation must be visible');
            for (const section of await page.locator('[data-catalog-section]').all()) {
              assert(await section.locator('.aca-category-card').count() >= 4, 'each department must retain its categories');
            }
            assert.equal(await page.locator('.aca-product-card').count(),0,'catalog home must start with category choices instead of a mixed product list');
            assert.equal(await page.locator('.aca-desktop-banner:visible').count(),2,'desktop must show both promotional banners');
            const desktopBannerImages=await page.locator('.aca-desktop-banner img').evaluateAll(nodes=>nodes.map(node=>({loaded:node.complete&&node.naturalWidth>0,ratio:node.clientWidth/node.clientHeight,natural:node.naturalWidth/node.naturalHeight})));
            assert(desktopBannerImages.every(image=>image.loaded&&Math.abs(image.ratio-image.natural)<.05),'desktop banners must load without distortion');
            const contentWidth=await page.locator('.aca-catalog-hero-inner').evaluate(node=>node.getBoundingClientRect().width);
            assert(contentWidth>=Math.min(width-32,1600)-1,'desktop catalogue should use the available wide-screen space');
            assert.equal(await page.locator('#catalog-search label').first().evaluate(node=>getComputedStyle(node).color),'rgb(55, 65, 81)','desktop form labels need readable contrast');
          }
        }
        await selectCatalogLanguage(page, 'RU');
        assert.equal(await page.locator('.aca-product-fitment').count(),await page.locator('.aca-product-card').count(),'every product card needs a fitment description');
        // Departments make the directory taller. WebKit loads only nearby
        // lazy images; visit each card rather than jumping past the middle.
        for (const image of await page.locator('.aca-category-card img').all()) {
          await image.scrollIntoViewIfNeeded();
          await page.waitForFunction(node => node.complete && node.naturalWidth > 0, await image.elementHandle());
        }
        await page.waitForFunction(()=>[...document.querySelectorAll('.aca-category-card img')].every(node=>node.complete&&node.naturalWidth>0));
        const categoryImages=await page.locator('.aca-category-card img').evaluateAll(nodes=>nodes.map(node=>({path:new URL(node.src).pathname,loaded:node.complete&&node.naturalWidth>0})));
        assert.equal(categoryImages.length,expectedCategoryCardCount,'each category needs a product image');
        assert(categoryImages.every(image=>image.path.startsWith('/catalog-assets/')&&image.loaded),'category images must be local and loaded');
        assert(categoryImages.some(image => image.path === '/catalog-assets/complete-engine-category.webp'));
        assert(categoryImages.some(image => image.path === '/catalog-assets/final-drive-category.jpg'));
        assert.equal(await page.locator('.aca-category-card[href="/catalog/category/controllers"] img').getAttribute('src'),'/catalog-assets/category-controller.jpg','controller category must use a real controller image');
        assert.equal(await page.locator('.aca-category-card[href="/catalog/category/monitors"] img').getAttribute('src'),'/catalog-assets/category-monitor.jpg','monitor category must keep the monitor image');
        assert.equal(await page.locator('.aca-category-card[href="/catalog/category/fuel-common-rails"] img').getAttribute('src'),'/catalog-assets/category-fuel-common-rail.webp','Common Rail category must use a real local fuel rail photo');
        assert.match(await page.locator('.aca-category-card[href="/catalog/category/controllers"] .aca-category-count').textContent(),new RegExp(expectedControllerCount.toLocaleString('ru-RU').replace(/\s/g,'\\s?')),'controller count must use the complete category summary');
        assert.match(await page.locator('.aca-category-card[href="/catalog/category/monitors"] .aca-category-count').textContent(),new RegExp(expectedMonitorCount.toLocaleString('ru-RU').replace(/\s/g,'\\s?')),'monitor count must use the complete category summary');
        if(width===1440){
          assert.equal(await page.locator('.aca-category-card').first().getAttribute('href'),'/catalog/category/hydraulic-pumps','category cards must be crawlable links');
          await page.locator('.aca-category-card').first().click();
          await page.locator('#catalog-results').waitFor();
          assert.equal(await page.locator('.aca-category-grid').count(),0,'category page must not repeat the full category grid above products');
          assert.equal(new URL(page.url()).pathname,'/catalog/category/hydraulic-pumps','category click must create a clean shareable URL');
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://acahydraulic.kz/catalog/category/hydraulic-pumps/','category needs a self canonical');
          assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),'10','hydraulic pump category must show 10 items per page');
          assert.equal(await page.locator('.aca-product-card').count(),10,'hydraulic pump category must render 10 real product cards');
          await page.goto(origin+'/catalog',{waitUntil:'networkidle'});
          if(expectedGearPumpCount>0){
            await page.goto(origin+'/catalog/category/gear-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedGearPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedGearPumpCount),'gear pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedGearPumpCount)),'gear pumps must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedGearPumpCount),'gear pumps must render the first page');
          }
          if(expectedPistonPumpCount>0){
            await page.goto(origin+'/catalog/category/piston-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedPistonPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedPistonPumpCount),'piston pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedPistonPumpCount)),'piston pumps must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedPistonPumpCount),'piston pumps must render the first page');
          }
          await page.goto(origin+'/catalog/category/hydraulic-motors',{waitUntil:'networkidle'});
          await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedHydraulicMotorCount);
          assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedHydraulicMotorCount),'hydraulic motor URL must contain the complete supplier collection');
          assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedHydraulicMotorCount)),'hydraulic motors must show a 10-item page');
          assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedHydraulicMotorCount),'hydraulic motors must render the first page');
          if(expectedMainControlValveCount>0){
            await page.goto(origin+'/catalog/category/main-control-valves',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedMainControlValveCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedMainControlValveCount),'main control valve URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedMainControlValveCount)),'main control valves must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedMainControlValveCount),'main control valves must render the first page');
            assert.equal(await page.locator('.aca-product-code').first().textContent(),'Основные гидрораспределители','cards must use the localized active category badge');
          }
          if(expectedWiringHarnessCount>0){
            await page.goto(origin+'/catalog/category/wiring-harnesses',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedWiringHarnessCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedWiringHarnessCount),'wiring harness URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedWiringHarnessCount)),'wiring harnesses must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedWiringHarnessCount),'wiring harnesses must render the first page');
          }
          if(expectedFuelInjectorCount>0){
            await page.goto(origin+'/catalog/category/fuel-injectors',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedFuelInjectorCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedFuelInjectorCount),'fuel injector URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedFuelInjectorCount)),'fuel injectors must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedFuelInjectorCount),'fuel injectors must render the first page');
          }
          if(expectedFuelPumpCount>0){
            await page.goto(origin+'/catalog/category/fuel-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedFuelPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedFuelPumpCount),'fuel pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedFuelPumpCount)),'fuel pumps must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedFuelPumpCount),'fuel pumps must render the first page');
          }
          if(expectedFuelCommonRailCount>0){
            await page.goto(origin+'/catalog/category/fuel-common-rails',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedFuelCommonRailCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedFuelCommonRailCount),'Common Rail URL must contain the curated supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedFuelCommonRailCount)),'Common Rail products must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedFuelCommonRailCount),'Common Rail products must render the first page');
            assert.equal(await page.locator('.aca-product-card').filter({hasText:'8973060634'}).count(),0,'the injector from the supplier collection must not be mislabelled as a fuel rail');
          }
          if(expectedEngineRebuildKitCount>0){
            await page.goto(origin+'/catalog/category/engine-rebuild-kits',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedEngineRebuildKitCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedEngineRebuildKitCount),'engine rebuild kit URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(Math.min(10, expectedEngineRebuildKitCount)),'engine rebuild kits must show a 10-item page');
            assert.equal(await page.locator('.aca-product-card').count(),Math.min(10, expectedEngineRebuildKitCount),'engine rebuild kits must render the first page');
          }
          for (const [slug, expected] of [['controllers', expectedControllerCount], ['monitors', expectedMonitorCount]]) {
            await page.goto(`${origin}/catalog/category/${slug}`, { waitUntil: 'networkidle' });
            await page.waitForFunction((count) => document.querySelector('[data-result-count]')?.getAttribute('data-result-count') === String(count), expected);
            assert.equal(await page.locator('.aca-product-card').count(), Math.min(10, expected));
            if (expected > 10) {
              const firstIds = await page.locator('.aca-product-card > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
              await page.locator('[data-page-next]').click();
              await page.waitForFunction(() => document.querySelector('[data-page]')?.getAttribute('data-page') === '2');
              assert.equal(new URL(page.url()).searchParams.get('page'), '2');
              const secondIds = await page.locator('.aca-product-card > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
              assert(secondIds.every(id => !firstIds.includes(id)), 'pages must not repeat products');
              await page.reload({ waitUntil: 'networkidle' });
              await page.waitForFunction(() => document.querySelector('[data-index-complete]')?.getAttribute('data-index-complete') === 'true');
              assert.deepEqual(await page.locator('.aca-product-card > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))), secondIds, 'reload must retain page 2');
              await page.locator('[data-page-prev]').click();
              await page.waitForFunction(() => document.querySelector('[data-page]')?.getAttribute('data-page') === '1');
              assert.deepEqual(await page.locator('.aca-product-card > a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))), firstIds);
            }
          }
          await page.goto(origin+'/catalog/category/control-valves',{waitUntil:'networkidle'});
          await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedControlValveCount);
          assert.equal(await page.locator('.aca-category-grid').count(),0,'URL category must lead directly to products without repeating category choices');
          assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedControlValveCount),'URL category must filter product results');
          const detailProduct=catalogProducts[0];
          await page.goto(origin+'/catalog/'+detailProduct.handle,{waitUntil:'networkidle'});
          await page.locator('.aca-product-fitment-detail').waitFor();
          assert(await page.locator('.aca-product-fitment-detail').isVisible(),'product page must show fitment details');
          const productSchema=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(node=>{try{return JSON.parse(node.textContent||'{}')}catch{return null}}).find(value=>value?.['@type']==='Product'));
          assert(productSchema?.description,'product page schema must include a description');
        }
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({path:'catalog-ui-check/'+engineName+'-'+width+'.png'});
        if(width===390){
          await page.goto(origin+'/parts/engines-complete/',{waitUntil:'networkidle'});
          await page.locator('[data-engine-product-card]').first().waitFor();
          assert.equal(await page.locator('[data-engine-product-card]').count(),9,'first engine page must show 9 families plus the specific SD32 offer');
          while (!await page.locator('#n855 [data-engine-product-link]').count()) {
            await page.locator('[data-page-next]').click();
          }
          assert.equal(
            await page.locator('#n855 [data-engine-product-link]').getAttribute('href'),
            '/parts/engines-complete/cummins/n855-nt855-nta855',
            'N855 engine card must link to the dedicated family page'
          );
          await page.locator('#n855 [data-engine-product-link]').click();
          await page.getByRole('heading',{level:1,name:/N855 \/ NT855 \/ NTA855/}).waitFor();
          assert.equal(
            await page.locator('link[rel="canonical"]').getAttribute('href'),
            'https://acahydraulic.kz/parts/engines-complete/cummins/n855-nt855-nta855/',
            'engine product needs a self canonical'
          );
          const engineSchemas=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(node=>{try{return JSON.parse(node.textContent||'{}')}catch{return null}}));
          const engineServiceSchema=engineSchemas.find(value=>value?.['@type']==='Service'&&value?.name==='Подбор и поставка двигателя Cummins N855 / NT855 / NTA855 в сборе');
          assert(engineServiceSchema,'engine page must expose an honest service schema');
          assert.equal(engineSchemas.some(value=>value?.['@type']==='Product'),false,'engine page must not publish an invalid Product without price or verified reviews');
          assert.equal(await page.locator('[data-engine-case]').count(),1,'verified Shantui case must appear on N855 family only');
          await page.goto(origin+'/parts/engines-complete/cummins/',{waitUntil:'networkidle'});
          await page.locator('[data-cummins-engine-card]').first().waitFor();
          assert.equal(await page.locator('[data-cummins-engine-card]').count(),9,'Cummins first page must show 9 families plus the SD32 offer');
          assert(await page.locator('img[src="/catalog-assets/cummins-engine-range.webp"]').evaluate(node=>node.complete&&node.naturalWidth>0),'Cummins catalogue visual must load');
          const cumminsImages=page.locator('[data-cummins-engine-image]');
          assert.equal(await cumminsImages.count(),9,'Every visible Cummins card must have a supplier photo');
          for(const image of await cumminsImages.all())await image.scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>[...document.querySelectorAll('[data-cummins-engine-image]')].every(node=>node.complete&&node.naturalWidth>0));
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Cummins catalogue must not overflow mobile viewport');
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://acahydraulic.kz/parts/engines-complete/cummins/','Cummins catalogue needs a self canonical');
          await page.goto(origin+'/parts/engines-complete/cummins/qsb6-7/',{waitUntil:'networkidle'});
          await page.getByRole('heading',{level:1,name:/QSB6\.7/}).waitFor();
          assert.equal(await page.locator('[data-engine-case]').count(),0,'unverified engine families must not show a case');
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'engine product must not overflow mobile viewport');
        }
        assert.deepEqual(errors,[],'runtime errors');
        results.push({engine:engineName,width,languages:3,categoryLabels:'pass',bannerLayout:'pass',navigation:'pass'});
        console.log(JSON.stringify(results.at(-1)));
        await page.close();
      }
      for (const width of [390, 1440]) {
        const landing = await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
        await landing.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        await landing.goto(origin + '/catalog/category/hydraulic-pumps/', {waitUntil:'networkidle'});
        const heading = landing.locator('.aca-landing-intro h2').first();
        await heading.waitFor();
        const contrast = await heading.evaluate(element => {
          const luminance = color => {
            const channels = color.match(/[\d.]+/g).slice(0,3).map(Number).map(value => {
              const normalized = value / 255;
              return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
            });
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
          };
          const text = luminance(getComputedStyle(element).color);
          const surface = luminance(getComputedStyle(element.closest('.aca-landing-intro')).backgroundColor);
          return (Math.max(text,surface) + 0.05) / (Math.min(text,surface) + 0.05);
        });
        assert(contrast >= 4.5, `${engineName} ${width}px category guide heading contrast: ${contrast}`);
        results.push({engine:engineName,width,categoryGuideHeadingContrast:contrast});
        await landing.close();
      }
      const journey = await browser.newPage({viewport:{width:390,height:844},locale:'ru-RU'});
      const journeyErrors = [];
      journey.on('pageerror', error => journeyErrors.push(error.message));
      await journey.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
      await journey.goto(origin+'/cases/postavka-zamena-gidronasosa',{waitUntil:'networkidle'});
      await acceptEssentialCookies(journey);
      await journey.getByRole('link',{name:'Найти K5V160DT в запчастях',exact:true}).click();
      await journey.locator('[data-supply-offer="sany-k5v160dt"]').waitFor();
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'K5V160DT');
      await journey.waitForFunction(() => Number(document.querySelector('[data-result-count]')?.getAttribute('data-result-count')) > 0);
      assert.equal(await journey.locator('[data-supply-offer]').count(),1);
      // This journey checks navigation after loading; do not tear down WebKit's
      // in-flight index batches during a reload (reported as access-control errors).
      await journey.waitForLoadState('networkidle');
      await journey.reload({waitUntil:'networkidle'});
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'K5V160DT','URL search survives reload');
      await journey.locator('[data-catalog-back][href="/catalog?q=K5V160DT"]').click();
      assert.equal(new URL(journey.url()).searchParams.get('q'),'K5V160DT','category navigation preserves query');
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'K5V160DT');
      await journey.locator('#catalog-search input').first().fill('HANDOK');
      await journey.locator('[data-supply-offer="handok-h5v80dtp"]').waitFor();
      await journey.locator('[data-supply-offer="sany-k5v160dt"]').waitFor({state:'detached'});
      await journey.locator('[data-supply-offer="handok-h5v80dtp"]').getByRole('link',{name:'Открыть предложение: HANDOK H5V80DTP-12T',exact:true}).click();
      await journey.getByRole('heading',{name:'Гидронасос HANDOK H5V80DTP-12T / K5V80DTP YKSKR-9K00 — корейский аналог',exact:true}).waitFor();
      assert.equal(new URL(journey.url()).pathname,'/catalog/handok-h5v80dtp-12t-ykskr-9k00-korean-hydraulic-pump');
      await journey.getByRole('link',{name:'Реальный заказ HANDOK для Hitachi ZX160W',exact:true}).click();
      await journey.getByRole('heading',{name:'Hitachi ZX160W: клиент выбрал корейский HANDOK',exact:true}).waitFor();
      assert.equal(new URL(journey.url()).hash,'#hitachi-order');
      await journey.waitForFunction(() => {
        const top = document.getElementById('hitachi-order')?.getBoundingClientRect().top;
        return top >= 0 && top < window.innerHeight;
      });
      await journey.getByRole('link',{name:'Искать запчасти для ZX160W',exact:true}).click();
      await journey.locator('[data-supply-offer="handok-h5v80dtp"]').waitFor();
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'ZX160W');
      await journey.waitForFunction(() => Number(document.querySelector('[data-result-count]')?.getAttribute('data-result-count')) > 0);
      await journey.waitForLoadState('networkidle');
      const journeyProductLink = journey.locator('.aca-product-card > a').first();
      const journeyProductPath = await journeyProductLink.getAttribute('href');
      assert(journeyProductPath?.startsWith('/catalog/'), 'search result must link to a catalog product');
      await journeyProductLink.scrollIntoViewIfNeeded();
      await journey.waitForTimeout(500);
    await journey.goto(new URL(journeyProductPath, origin).href, { waitUntil: 'networkidle' });
      await journey.locator('.aca-product-fitment-detail').waitFor();
      await journey.goBack({waitUntil:'networkidle'});
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'ZX160W','return from product preserves model');
      for (const width of [320,768,1024,1440]) {
        await journey.setViewportSize({width,height:900});
        assert.equal(await journey.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,'search results must fit viewport');
      }
      assert.deepEqual(journeyErrors,[],'case/catalog journey runtime errors');
      results.push({engine:engineName,caseCatalogJourney:'pass',queryPersistence:'pass',caseAnchor:'pass'});
      console.log(JSON.stringify(results.at(-1)));
      await journey.close();
      for (const width of [390, 1440]) {
        const huscoPage = await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
        const huscoErrors = [];
        huscoPage.on('pageerror', error => huscoErrors.push(error.message));
        await huscoPage.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        await huscoPage.goto(origin + '/catalog?q=C16E303', {waitUntil:'networkidle'});
        await acceptEssentialCookies(huscoPage);
        const card = huscoPage.locator('.aca-product-card').filter({hasText:'C16E303'});
        await card.waitFor();
        assert.equal(await card.count(),1,'HUSCO nameplate search must return exactly one owned product');
        await card.locator('a').first().click();
        await huscoPage.getByRole('heading',{level:1,name:'Гидрораспределитель HUSCO 6600-E163 A00 — C16E303, F18/22233',exact:true}).waitFor();
        assert.equal(await huscoPage.locator('link[rel="canonical"]').getAttribute('href'),'https://acahydraulic.kz/catalog/husco-6600-e163-a00-c16e303-f18-22233-hydraulic-control-valve/');
        assert(await huscoPage.getByText('Цена по запросу',{exact:false}).count() > 0);
        await huscoPage.getByText('Фото снятого узла из выполненной работы; комплектация и состояние поставляемого изделия согласуются отдельно.',{exact:true}).waitFor();
        await huscoPage.getByRole('heading',{name:'Маркировка узла из выполненной работы',exact:true}).waitFor();
        const schema = await huscoPage.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent)).find(value => value['@type'] === 'Product'));
        assert.equal(schema.brand.name,'HUSCO');
        assert.equal(schema.mpn,'C16E303');
        assert.equal(schema.offers,undefined,'price-on-request HUSCO must not invent an Offer');
        assert.equal(schema.itemCondition,undefined,'job evidence must not imply a new supplied product');
        const nameplate = huscoPage.getByRole('img',{name:"Шильдик снятого гидрораспределителя HUSCO 6600-E163 A00, C16E303, F18/22233",exact:true});
        await nameplate.waitFor({state:'visible'});
        assert.equal(await nameplate.count(),1,'The real nameplate photo must be visible');
        await nameplate.evaluate(image => image.decode());
        assert(await nameplate.evaluate(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0),'Authorized nameplate photo must decode');
        const imageResponse = await huscoPage.request.get(origin + "/catalog-assets/husco-c16e303/husco-c16e303-nameplate.webp");
        assert.equal(imageResponse.status(),200,'Photo URL must resolve in the built site');
        assert(schema.image.includes('https://acahydraulic.kz' + "/catalog-assets/husco-c16e303/husco-c16e303-nameplate.webp"),'Product schema must reference the authorized image');
        await huscoPage.screenshot({path:`catalog-ui-check/husco-${engineName}-${width}.png`,fullPage:true});
        const huscoLayout = await huscoPage.evaluate(() => ({viewport:innerWidth,width:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('main *')].filter(node => node.getBoundingClientRect().right > innerWidth + 1).slice(0,8).map(node => ({tag:node.tagName,class:node.className,text:node.textContent?.slice(0,100)}))}));
        assert(huscoLayout.width <= huscoLayout.viewport,'HUSCO detail must fit viewport: ' + JSON.stringify(huscoLayout));
        for (const category of ['main-control-valves','control-valves']) {
          await huscoPage.goto(origin + '/catalog/category/' + category + '?q=C16E303',{waitUntil:'networkidle'});
          await huscoPage.locator('.aca-product-card').filter({hasText:'C16E303'}).waitFor();
          assert.equal(await huscoPage.locator('.aca-product-card').count(),1,'HUSCO must appear once in each matching category');
        }
        assert.deepEqual(huscoErrors,[],'HUSCO search-to-product runtime errors');
        results.push({engine:engineName,width,huscoSearchProductCategories:'pass',priceOnRequest:'pass',authorizedNameplatePhoto:'pass'});
        console.log(JSON.stringify(results.at(-1)));
        await huscoPage.close();
      }
      for (const width of [390, 1440]) {
        const directoryPage = await browser.newPage({ viewport: { width, height: 900 }, locale: 'ru-RU' });
        const errors = [];
        directoryPage.on('pageerror', error => errors.push(error.message));
        await directoryPage.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        try {
          results.push({ engine: engineName, width, ...await checkCatalogDirectory(directoryPage, origin, `${engineName}-${width}`) });
          results.push({ engine: engineName, width, ...await checkCatalogPagination(directoryPage, origin) });
          assert.deepEqual(errors, [], 'catalogue directory and pagination runtime errors');
          console.log(JSON.stringify(results.at(-1)));
        } finally { await directoryPage.close(); }
      }
      await browser.close();
      if (engineName === 'chromium') {
        const navigationBrowser = await engine.launch();
        try {
          results.push({engine:engineName,navigation:await checkSiteNavigation(navigationBrowser,origin,catalogProducts[0].handle)});
          console.log(JSON.stringify(results.at(-1)));
        } finally {
          await navigationBrowser.close();
        }
      } else {
        results.push({engine:engineName,navigation:{coverage:'chromium',catalogWebKit:'pass'}});
        console.log(JSON.stringify(results.at(-1)));
      }
    }finally{await browser.close();}
  }
}finally{
  fs.writeFileSync('catalog-ui-check/results.json',JSON.stringify(results,null,2));
  // Preserve the actual CI-built static site for independent contrast retesting.
  if (process.env.CI) {
    const event = process.env.GITHUB_EVENT_PATH
      ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : {};
    const manifest = {
      sourceHead: event.pull_request?.head?.sha || process.env.GITHUB_SHA,
      checkoutSha: process.env.GITHUB_SHA,
      runId: process.env.GITHUB_RUN_ID,
      builtAt: new Date().toISOString(),
      fixture: 'Normal prepare-public-catalog production inputs, including category summaries',
      purpose: 'Independent QA of catalogue guide contrast; not a production deployment',
    };
    fs.cpSync(root, 'catalog-ui-check/exact-build', {recursive:true});
    fs.writeFileSync('catalog-ui-check/exact-build/qa-build-manifest.json', JSON.stringify(manifest,null,2));
  }

  server.close();
}

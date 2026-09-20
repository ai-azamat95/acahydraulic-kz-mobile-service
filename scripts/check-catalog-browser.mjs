import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { checkSiteNavigation } from './check-site-navigation.mjs';
const { chromium, webkit } = await import(process.env.RUNNER_TEMP + '/aca-ui/node_modules/playwright/index.mjs');
const root = path.resolve('dist/public');
const catalogDir = path.join(root, 'catalog-data');
const catalogProducts = fs.readdirSync(catalogDir)
  .filter((file) => /^search-index-\d+\.json$/.test(file))
  .flatMap((file) => JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')));
const expectedControlValveCount = catalogProducts.filter((product) => product.category === 'control-valves').length;
const expectedGearPumpCount = catalogProducts.filter((product) => product.category === 'gear-pumps').length;
const expectedPistonPumpCount = catalogProducts.filter((product) => product.category === 'piston-pumps').length;
const expectedHydraulicMotorCount = catalogProducts.filter((product) => product.category === 'hydraulic-motors').length;
const expectedMainControlValveCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('main-control-valves')).length;
const expectedWiringHarnessCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('wiring-harnesses')).length;
const expectedFuelInjectorCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('fuel-injectors')).length;
const expectedFuelPumpCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('fuel-pumps')).length;
const expectedEngineRebuildKitCount = catalogProducts.filter((product) => (product.categories || [product.category]).includes('engine-rebuild-kits')).length;
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
fs.mkdirSync('catalog-ui-check',{recursive:true});
const results=[];
try {
  for(const [engineName,engine] of Object.entries({chromium,webkit})){
    const browser=await engine.launch();
    try{
      for(const width of [320,390,430,768,1024,1440,1920]){
        const page=await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
        await page.goto(origin+'/catalog',{waitUntil:'networkidle'});
        await page.locator('.aca-category-card').first().waitFor();
        for(const lang of ['RU','KZ','EN']){
          await page.getByRole('button',{name:lang,exact:true}).click();
          assert.equal(await page.locator('.aca-category-card:visible').count(),19);
          assert.equal(await page.locator('.aca-category-count:visible').count(),19);
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
            const form=await page.locator('#catalog-search').boundingBox();
            assert(promo.y+promo.height<=form.y,'banner overlaps search');
            assert(await page.locator('.aca-mobile-nav').isVisible());
            await page.locator('.aca-mobile-nav a[href="#catalog-delivery"]').click();
            const delivery=await page.locator('#catalog-delivery').boundingBox();
            assert(delivery.y>=0&&delivery.y<900,'delivery link must scroll to visible content');
          }
          if(width>=1440){
            const hero=await page.locator('.aca-catalog-hero').boundingBox();
            assert(hero.height<820,'desktop hero should reveal categories in the first viewport');
            assert.equal(await page.locator('.aca-desktop-nav:visible').count(),1,'desktop navigation must be visible');
            assert.deepEqual(await page.locator('.aca-category-card').evaluateAll(nodes=>Object.values(nodes.reduce((rows,node)=>{const top=Math.round(node.getBoundingClientRect().top);rows[top]=(rows[top]||0)+1;return rows},{}))),[5,5,5,4],'desktop categories should use four balanced rows');
            assert.equal(await page.locator('.aca-product-card').evaluateAll(nodes=>nodes.filter(node=>Math.abs(node.getBoundingClientRect().top-nodes[0].getBoundingClientRect().top)<2).length),5,'desktop product grid should show five cards per row');
            assert.equal(await page.locator('.aca-desktop-banner:visible').count(),2,'desktop must show both promotional banners');
            const desktopBannerImages=await page.locator('.aca-desktop-banner img').evaluateAll(nodes=>nodes.map(node=>({loaded:node.complete&&node.naturalWidth>0,ratio:node.clientWidth/node.clientHeight,natural:node.naturalWidth/node.naturalHeight})));
            assert(desktopBannerImages.every(image=>image.loaded&&Math.abs(image.ratio-image.natural)<.05),'desktop banners must load without distortion');
            const contentWidth=await page.locator('.aca-catalog-hero-inner').evaluate(node=>node.getBoundingClientRect().width);
            assert(contentWidth>=Math.min(width-32,1600)-1,'desktop catalogue should use the available wide-screen space');
            assert.equal(await page.locator('#catalog-search label').first().evaluate(node=>getComputedStyle(node).color),'rgb(55, 65, 81)','desktop form labels need readable contrast');
          }
        }
        await page.getByRole('button',{name:'RU',exact:true}).click();
        assert.equal(await page.locator('.aca-product-fitment').count(),await page.locator('.aca-product-card').count(),'every product card needs a fitment description');
        await page.locator('.aca-category-card').last().scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>[...document.querySelectorAll('.aca-category-card img')].every(node=>node.complete&&node.naturalWidth>0));
        const categoryImages=await page.locator('.aca-category-card img').evaluateAll(nodes=>nodes.map(node=>({path:new URL(node.src).pathname,loaded:node.complete&&node.naturalWidth>0})));
        assert.equal(categoryImages.length,19,'each category needs a product image');
        assert(categoryImages.every(image=>image.path.startsWith('/catalog-assets/')&&image.loaded),'category images must be local and loaded');
        assert.equal(categoryImages[6].path,'/catalog-assets/final-drive-category.jpg');
        if(width===1440){
          assert.equal(await page.locator('.aca-category-card').first().getAttribute('href'),'/catalog/category/hydraulic-pumps','category cards must be crawlable links');
          await page.locator('.aca-category-card').first().click();
          assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-current'),'page');
          assert.equal(new URL(page.url()).pathname,'/catalog/category/hydraulic-pumps','category click must create a clean shareable URL');
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://acahydraulic.kz/catalog/category/hydraulic-pumps/','category needs a self canonical');
          assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),'800','hydraulic pump category must expose at least 800 cards immediately');
          assert.equal(await page.locator('.aca-product-card').count(),800,'hydraulic pump category must render 800 real product cards');
          await page.locator('.aca-category-card').first().click();
          assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-current'),null);
          assert.equal(new URL(page.url()).pathname,'/catalog','clearing a category must return to the catalogue');
          if(expectedGearPumpCount>0){
            await page.goto(origin+'/catalog/category/gear-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedGearPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedGearPumpCount),'gear pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedGearPumpCount),'all gear pumps must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedGearPumpCount,'all gear pumps must render as real product cards');
          }
          if(expectedPistonPumpCount>0){
            await page.goto(origin+'/catalog/category/piston-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedPistonPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedPistonPumpCount),'piston pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedPistonPumpCount),'all piston pumps must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedPistonPumpCount,'all piston pumps must render as real product cards');
          }
          await page.goto(origin+'/catalog/category/hydraulic-motors',{waitUntil:'networkidle'});
          await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedHydraulicMotorCount);
          assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedHydraulicMotorCount),'hydraulic motor URL must contain the complete supplier collection');
          assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedHydraulicMotorCount),'all hydraulic motors must be visible without pagination');
          assert.equal(await page.locator('.aca-product-card').count(),expectedHydraulicMotorCount,'all hydraulic motors must render as real product cards');
          if(expectedMainControlValveCount>0){
            await page.goto(origin+'/catalog/category/main-control-valves',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedMainControlValveCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedMainControlValveCount),'main control valve URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedMainControlValveCount),'all main control valves must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedMainControlValveCount,'all main control valves must render as real product cards');
            const overlappingValve = page.locator('.aca-product-card').filter({hasText:'Control Valve Assy for Kobelco Excavator SK250LC'});
            assert.equal(await overlappingValve.locator('.aca-product-code').textContent(),'main-control-valves','overlapping products must show the active category badge');
          }
          if(expectedWiringHarnessCount>0){
            await page.goto(origin+'/catalog/category/wiring-harnesses',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedWiringHarnessCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedWiringHarnessCount),'wiring harness URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedWiringHarnessCount),'all wiring harnesses must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedWiringHarnessCount,'all wiring harnesses must render as real product cards');
          }
          if(expectedFuelInjectorCount>0){
            await page.goto(origin+'/catalog/category/fuel-injectors',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedFuelInjectorCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedFuelInjectorCount),'fuel injector URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedFuelInjectorCount),'all fuel injectors must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedFuelInjectorCount,'all fuel injectors must render as real product cards');
          }
          if(expectedFuelPumpCount>0){
            await page.goto(origin+'/catalog/category/fuel-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedFuelPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedFuelPumpCount),'fuel pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedFuelPumpCount),'all fuel pumps must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedFuelPumpCount,'all fuel pumps must render as real product cards');
          }
          if(expectedEngineRebuildKitCount>0){
            await page.goto(origin+'/catalog/category/engine-rebuild-kits',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedEngineRebuildKitCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedEngineRebuildKitCount),'engine rebuild kit URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedEngineRebuildKitCount),'all engine rebuild kits must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedEngineRebuildKitCount,'all engine rebuild kits must render as real product cards');
          }
          await page.goto(origin+'/catalog/category/control-valves',{waitUntil:'networkidle'});
          await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedControlValveCount);
          assert.equal(await page.locator('.aca-category-card[aria-current="page"]').count(),1,'URL category must select exactly one category');
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
        assert.deepEqual(errors,[],'runtime errors');
        results.push({engine:engineName,width,languages:3,categoryLabels:'pass',bannerLayout:'pass',navigation:'pass'});
        console.log(JSON.stringify(results.at(-1)));
        await page.close();
      }
      const journey = await browser.newPage({viewport:{width:390,height:844},locale:'ru-RU'});
      const journeyErrors = [];
      journey.on('pageerror', error => journeyErrors.push(error.message));
      await journey.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
      await journey.goto(origin+'/cases/postavka-zamena-gidronasosa',{waitUntil:'networkidle'});
      await journey.getByRole('link',{name:'Найти K5V160DT в запчастях',exact:true}).click();
      await journey.locator('[data-supply-offer="sany-k5v160dt"]').waitFor();
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'K5V160DT');
      await journey.waitForFunction(() => Number(document.querySelector('[data-result-count]')?.getAttribute('data-result-count')) > 0);
      assert.equal(await journey.locator('[data-supply-offer]').count(),1);
      await journey.reload({waitUntil:'networkidle'});
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'K5V160DT','URL search survives reload');
      await journey.locator('.aca-category-card[href="/catalog?q=K5V160DT"]').click();
      assert.equal(new URL(journey.url()).searchParams.get('q'),'K5V160DT','category navigation preserves query');
      assert.equal(await journey.locator('#catalog-search input').first().inputValue(),'K5V160DT');
      await journey.locator('#catalog-search input').first().fill('HANDOK');
      await journey.locator('[data-supply-offer="handok-h5v80dtp"]').waitFor();
      await journey.locator('[data-supply-offer="sany-k5v160dt"]').waitFor({state:'detached'});
      await journey.locator('[data-supply-offer="handok-h5v80dtp"]').getByRole('link',{name:'Насос и история заказа',exact:true}).click();
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
      await journey.locator('.aca-product-card > a').first().click();
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
      results.push({engine:engineName,navigation:await checkSiteNavigation(browser,origin,catalogProducts[0].handle)});
      console.log(JSON.stringify(results.at(-1)));
    }finally{await browser.close();}
  }
}finally{
  fs.writeFileSync('catalog-ui-check/results.json',JSON.stringify(results,null,2));
  server.close();
}

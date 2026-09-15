import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
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
          assert.equal(await page.locator('.aca-category-card:visible').count(),16);
          assert.equal(await page.locator('.aca-category-count:visible').count(),16);
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
            assert.equal(await page.locator('.aca-category-card').evaluateAll(nodes=>new Set(nodes.map(node=>Math.round(node.getBoundingClientRect().top))).size),2,'desktop categories should use two compact rows');
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
        await page.locator('.aca-category-card').last().scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>[...document.querySelectorAll('.aca-category-card img')].every(node=>node.complete&&node.naturalWidth>0));
        const categoryImages=await page.locator('.aca-category-card img').evaluateAll(nodes=>nodes.map(node=>({path:new URL(node.src).pathname,loaded:node.complete&&node.naturalWidth>0})));
        assert.equal(categoryImages.length,16,'each category needs a product image');
        assert(categoryImages.every(image=>image.path.startsWith('/catalog-assets/')&&image.loaded),'category images must be local and loaded');
        assert.equal(categoryImages[6].path,'/catalog-assets/final-drive-category.jpg');
        if(width===1440){
          await page.locator('.aca-category-card').first().click();
          assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-pressed'),'true');
          assert.equal(new URL(page.url()).searchParams.get('category'),'hydraulic-pumps','category click must create a shareable URL');
          assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),'800','hydraulic pump category must expose at least 800 cards immediately');
          assert.equal(await page.locator('.aca-product-card').count(),800,'hydraulic pump category must render 800 real product cards');
          await page.locator('.aca-category-card').first().click();
          assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-pressed'),'false');
          assert.equal(new URL(page.url()).searchParams.has('category'),false,'clearing a category must clear the URL filter');
          if(expectedGearPumpCount>0){
            await page.goto(origin+'/catalog?category=gear-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedGearPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedGearPumpCount),'gear pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedGearPumpCount),'all gear pumps must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedGearPumpCount,'all gear pumps must render as real product cards');
          }
          if(expectedPistonPumpCount>0){
            await page.goto(origin+'/catalog?category=piston-pumps',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedPistonPumpCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedPistonPumpCount),'piston pump URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedPistonPumpCount),'all piston pumps must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedPistonPumpCount,'all piston pumps must render as real product cards');
          }
          await page.goto(origin+'/catalog?category=hydraulic-motors',{waitUntil:'networkidle'});
          await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedHydraulicMotorCount);
          assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedHydraulicMotorCount),'hydraulic motor URL must contain the complete supplier collection');
          assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedHydraulicMotorCount),'all hydraulic motors must be visible without pagination');
          assert.equal(await page.locator('.aca-product-card').count(),expectedHydraulicMotorCount,'all hydraulic motors must render as real product cards');
          if(expectedMainControlValveCount>0){
            await page.goto(origin+'/catalog?category=main-control-valves',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedMainControlValveCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedMainControlValveCount),'main control valve URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedMainControlValveCount),'all main control valves must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedMainControlValveCount,'all main control valves must render as real product cards');
            const overlappingValve = page.locator('.aca-product-card').filter({hasText:'Control Valve Assy for Kobelco Excavator SK250LC'});
            assert.equal(await overlappingValve.locator('.aca-product-code').textContent(),'main-control-valves','overlapping products must show the active category badge');
          }
          if(expectedWiringHarnessCount>0){
            await page.goto(origin+'/catalog?category=wiring-harnesses',{waitUntil:'networkidle'});
            await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedWiringHarnessCount);
            assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedWiringHarnessCount),'wiring harness URL must contain the complete supplier collection');
            assert.equal(await page.locator('[data-visible-count]').getAttribute('data-visible-count'),String(expectedWiringHarnessCount),'all wiring harnesses must be visible without pagination');
            assert.equal(await page.locator('.aca-product-card').count(),expectedWiringHarnessCount,'all wiring harnesses must render as real product cards');
          }
          await page.goto(origin+'/catalog?category=control-valves',{waitUntil:'networkidle'});
          await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedControlValveCount);
          assert.equal(await page.locator('.aca-category-card[aria-pressed="true"]').count(),1,'URL category must select exactly one category');
          assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedControlValveCount),'URL category must filter product results');
        }
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({path:'catalog-ui-check/'+engineName+'-'+width+'.png'});
        assert.deepEqual(errors,[],'runtime errors');
        results.push({engine:engineName,width,languages:3,categoryLabels:'pass',bannerLayout:'pass',navigation:'pass'});
        console.log(JSON.stringify(results.at(-1)));
        await page.close();
      }
    }finally{await browser.close();}
  }
}finally{
  fs.writeFileSync('catalog-ui-check/results.json',JSON.stringify(results,null,2));
  server.close();
}

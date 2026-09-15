import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.RUNNER_TEMP + '/aca-ui/node_modules/playwright/index.mjs');
const root = path.resolve('dist/public');
const catalogDir = path.join(root, 'catalog-data');
const expectedControlValveCount = fs.readdirSync(catalogDir)
  .filter((file) => /^search-index-\d+\.json$/.test(file))
  .flatMap((file) => JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')))
  .filter((product) => product.category === 'control-valves').length;
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
      for(const width of [320,390,430,768,1440]){
        const page=await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
        await page.goto(origin+'/catalog',{waitUntil:'networkidle'});
        await page.locator('.aca-category-card').first().waitFor();
        for(const lang of ['RU','KZ','EN']){
          await page.getByRole('button',{name:lang,exact:true}).click();
          assert.equal(await page.locator('.aca-category-card:visible').count(),12);
          assert.equal(await page.locator('.aca-category-count:visible').count(),12);
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
        }
        await page.getByRole('button',{name:'RU',exact:true}).click();
        await page.locator('.aca-category-card').last().scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>[...document.querySelectorAll('.aca-category-card img')].every(node=>node.complete&&node.naturalWidth>0));
        const categoryImages=await page.locator('.aca-category-card img').evaluateAll(nodes=>nodes.map(node=>({path:new URL(node.src).pathname,loaded:node.complete&&node.naturalWidth>0})));
        assert.equal(categoryImages.length,12,'each category needs a product image');
        assert(categoryImages.every(image=>image.path.startsWith('/catalog-assets/')&&image.loaded),'category images must be local and loaded');
        assert.equal(categoryImages[3].path,'/catalog-assets/final-drive-category.jpg');
        await page.locator('.aca-category-card').first().click();
        assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-pressed'),'true');
        assert.equal(new URL(page.url()).searchParams.get('category'),'hydraulic-pumps','category click must create a shareable URL');
        await page.locator('.aca-category-card').first().click();
        assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-pressed'),'false');
        assert.equal(new URL(page.url()).searchParams.has('category'),false,'clearing a category must clear the URL filter');
        await page.goto(origin+'/catalog?category=control-valves',{waitUntil:'networkidle'});
        await page.waitForFunction((expected)=>document.querySelector('[data-result-count]')?.getAttribute('data-result-count')===String(expected),expectedControlValveCount);
        assert.equal(await page.locator('.aca-category-card[aria-pressed="true"]').count(),1,'URL category must select exactly one category');
        assert.equal(await page.locator('[data-result-count]').getAttribute('data-result-count'),String(expectedControlValveCount),'URL category must filter product results');
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

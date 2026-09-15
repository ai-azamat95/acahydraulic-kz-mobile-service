import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE || process.env.RUNNER_TEMP + '/aca-ui/node_modules/playwright/index.mjs');
const root = path.resolve('dist/public');
const server = http.createServer((req,res) => {
  let file = path.join(root,decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root + path.sep) && file !== root){res.writeHead(403).end();return;}
  if(fs.existsSync(file) && fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file))file=path.join(root,'index.html');
  res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
fs.mkdirSync('catalog-ui-check',{recursive:true});
const results=[];
try {
  for(const [engineName,engine] of Object.entries(process.env.CATALOG_BROWSER === 'webkit' ? {webkit} : {chromium,webkit})){
    const browser=await engine.launch();
    try{
      for(const width of [320,390,430,768,1440]){
        const page=await browser.newPage({viewport:{width,height:900},locale:'ru-RU'});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
        await page.goto(origin+'/catalog',{waitUntil:'networkidle'});
        await page.locator('.aca-category-card').first().waitFor();
        assert.equal(await page.locator('.aca-mobile-promos a:visible').count(),2,'banners visible at every viewport');
        const categoryImages=await page.locator('.aca-category-media img').evaluateAll(async nodes=>{await Promise.all(nodes.map(n=>{n.loading='eager';return n.decode().catch(()=>{})}));return nodes.map(n=>n.complete&&n.naturalWidth>0)});
        assert(categoryImages.every(Boolean),'local category images load');
        for(const lang of ['RU','KZ','EN']){
          await page.getByRole('button',{name:lang,exact:true}).click();
          assert.equal(await page.locator('.aca-category-card:visible').count(),12);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+engineName+' '+width+' '+lang);
          const clipped=await page.locator('.aca-category-label').evaluateAll(nodes=>nodes.filter(n=>n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1).map(n=>n.textContent));
          assert.deepEqual(clipped,[],'clipped labels '+width+' '+lang);
          if(width<768){
            assert.equal(await page.locator('.aca-mobile-promos a:visible').count(),2);
            const imgs=await page.locator('.aca-mobile-promos img').evaluateAll(nodes=>nodes.map(n=>n.complete&&n.naturalWidth>0));
            assert(imgs.every(Boolean),'banner images load');
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
        await page.locator('.aca-category-card').first().click();
        assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-pressed'),'true');
        await page.locator('.aca-category-card').first().click();
        assert.equal(await page.locator('.aca-category-card').first().getAttribute('aria-pressed'),'false');
        const index=JSON.parse(fs.readFileSync('client/public/catalog-data/search-index.json','utf8'));
        await page.locator('.aca-category-card').first().click();
        const resultLinks=await page.locator('#catalog-results article h3 a').evaluateAll(nodes=>nodes.map(n=>({title:n.textContent,href:n.getAttribute('href')})));
        assert(resultLinks.length>0,'hydraulic pumps must have results');
        for(const link of resultLinks){const record=index.find(p=>'/catalog/'+p.handle===link.href);assert(record&&record.category==='hydraulic-pumps'&&record.title===link.title,'wrong product in hydraulic pumps');}
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

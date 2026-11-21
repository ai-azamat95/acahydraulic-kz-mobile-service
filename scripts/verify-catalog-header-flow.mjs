import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve('dist/public');
const server = process.env.SITE_ORIGIN ? null : http.createServer((req,res)=>{
  let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file))return res.writeHead(404).end();
  res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
if(server)await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=process.env.SITE_ORIGIN||`http://127.0.0.1:${server.address().port}`;
const output=process.env.EVIDENCE_DIR||'ui-check/catalog-header-flow';fs.mkdirSync(output,{recursive:true});
const results=[];

const measure=()=>{
 const box=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {top:r.top,bottom:r.bottom,position:s.position,display:s.display};};
 return {y:scrollY,overflow:document.documentElement.scrollWidth>innerWidth,nav:box(document.querySelector('.site-quick-nav-catalog')),header:box(document.querySelector('header')),bars:[...document.querySelectorAll('.aca-mobile-nav,main ~ .fixed.bottom-0')].map(e=>({...box(e),html:e.innerHTML})),main:box(document.querySelector('main'))};
};
try{
 for(const [engine,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch();
 try{
 let productPath;
 for(const width of [320,360,390,768,1440]){
  for(const [kind,route] of [['root','/catalog/'],['category','/catalog/category/turbochargers/'],['product',productPath]]){
   const page=await browser.newPage({viewport:{width,height:900},locale:'ru-RU',reducedMotion:'reduce'});
   await page.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+(kind==='product'?productPath:route),{waitUntil:'networkidle'});
   await page.locator('.site-quick-nav-catalog').waitFor();
   const consent=page.getByRole('button',{name:'Только обязательные',exact:true});if(await consent.isVisible())await consent.click();
   if(kind==='category')productPath=await page.locator('.aca-product-card a[href^="/catalog/"]').first().getAttribute('href');
   await page.evaluate(()=>{window.scrollTo(0,0);return document.fonts.ready;});
   const top=await page.evaluate(measure);
   assert.equal(top.nav.position,'relative');assert.equal(top.header.position,'relative');assert.equal(top.header.top,top.nav.bottom);assert(!top.overflow);
   await page.screenshot({path:`${output}/${engine}-${kind}-${width}-top.png`});
   await page.evaluate(()=>scrollTo(0,1000));await page.waitForFunction(()=>scrollY>200);
   const scrolled=await page.evaluate(measure);assert(scrolled.header.bottom<0);assert(scrolled.nav.bottom<0);assert(!scrolled.overflow);assert.deepEqual(scrolled.bars,top.bars);
   await page.screenshot({path:`${output}/${engine}-${kind}-${width}-scroll.png`});
   await page.evaluate(()=>scrollTo(0,0));
   const language=page.getByRole('combobox',{name:'Язык каталога'});
   if(await language.isVisible()){await language.selectOption('en');await language.selectOption('ru');}
   else{await page.getByRole('button',{name:'EN',exact:true}).click();await page.getByRole('button',{name:'RU',exact:true}).click();}
   const refine=page.locator('.aca-refine-toggle');
   if(await refine.isVisible()){await refine.click();assert.equal(await refine.getAttribute('aria-expanded'),'true');await refine.click();}
   await page.locator('.site-quick-nav-catalog a[href="/"]').click();await page.locator('.home-header').waitFor();
   assert.deepEqual(errors,[]);results.push({engine,kind,width,route:route||productPath,top,scrolled,language:true,refine:true,navigation:true});
   fs.writeFileSync(`${output}/results.json`,JSON.stringify({origin,results},null,2));await page.close();
  }
 }
 }finally{await browser.close();}
 }
}finally{server?.close();}
assert.equal(results.length,30);console.log(JSON.stringify({origin,count:results.length,status:'pass',output}));

const { chromium } = await import(process.env.RUNNER_TEMP + '/aca-ui/node_modules/playwright/index.mjs');
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const root=path.resolve('dist/public');
fs.mkdirSync('ui-check',{recursive:true});
const server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const origin='http://127.0.0.1:'+server.address().port;
const errors=[];let checked=0;
try{for(const width of [320,768,1024,1440]){const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('aca_cookie_consent_v1',JSON.stringify({version:1,necessary:true,analytics:false,marketing:false,updatedAt:Date.now()})));
for(const route of ['/payment/','/offer/','/privacy/','/delivery-and-returns/','/contacts/','/checkout/','/']){await page.goto(origin+route,{waitUntil:'networkidle'});await page.locator('h1').first().waitFor();assert.equal(await page.locator('h1').count(),1,route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,route+' '+width);assert.ok(await page.getByText('ИП Тлеуғазы',{exact:false}).count(),route);for(const href of ['/payment/','/offer/','/delivery-and-returns/','/privacy/'])assert.ok(await page.locator('a[href="'+href+'"]').count(),route+' '+href);if(width===320&&route==='/contacts/'||width===1440&&route==='/payment/')await page.screenshot({path:'ui-check/halyk-'+width+'-'+route.replaceAll('/','')+'.png',fullPage:true});checked++;}
await page.goto(origin+'/privacy/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Открыть настройки cookie',exact:true}).click();await page.getByRole('dialog').waitFor();await page.close();}
assert.deepEqual(errors,[]);console.log(JSON.stringify({checked,errors,viewports:[320,768,1024,1440]}));}finally{await browser.close();server.close();}

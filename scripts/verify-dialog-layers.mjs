// Local-only regression. Never sends forms, opens WhatsApp or contacts analytics.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve('dist/public');
const out = process.env.DIALOG_QA_OUT || 'ui-check/dialog-layers';
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => {
 let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
 if (!file.startsWith(root + path.sep) && file !== root) return res.writeHead(403).end();
 if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
 if (!fs.existsSync(file)) { if (path.extname(file)) return res.writeHead(404).end(); file = path.join(root, 'index.html'); }
 res.setHeader('Content-Type', ({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.jpg':'image/jpeg'})[path.extname(file)] || 'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const report = { browser: browser.version(), base: origin, sizes: [], errors: [], externalRequestsBlocked: 0, unexpectedMutations: [] };
const waitForClose = async dialog => dialog.waitFor({ state: 'hidden' });
const verifyLayer = async (page, dialog) => {
 const result = await dialog.evaluate(el => {
  const box = el.getBoundingClientRect();
  const points = [[box.x+8,box.y+8],[box.right-8,box.y+8],[box.x+box.width/2,box.y+box.height/2],[box.right-8,box.bottom-8]];
  const overlay = document.querySelector('[data-slot="dialog-overlay"]');
  const nav = document.querySelector('[aria-label="Быстрые переходы"]');
  const nr = nav.getBoundingClientRect();
  return { box:box.toJSON(), modalZ:+getComputedStyle(el).zIndex, overlayZ:+getComputedStyle(overlay).zIndex, navZ:+getComputedStyle(nav).zIndex,
   points:points.map(([x,y])=>el.contains(document.elementFromPoint(x,y))),
   navCovered:document.elementFromPoint(nr.x+nr.width/2,nr.y+nr.height/2)?.closest('[data-slot="dialog-overlay"],[data-slot="dialog-content"]')!==null,
   overflow:document.documentElement.scrollWidth > innerWidth };
 });
 assert.equal(result.overflow,false);
 assert.ok(result.box.y>=0 && result.box.bottom<=page.viewportSize().height+1, 'dialog fits viewport height');
 assert.ok(result.box.x>=0 && result.box.right<=page.viewportSize().width+1, 'dialog fits viewport width');
 assert.ok(result.points.every(Boolean),'dialog hit targets are not covered');
 assert.ok(result.modalZ>result.overlayZ && result.overlayZ>result.navZ,'correct modal stack');
 assert.equal(result.navCovered,true,'quick nav is covered by modal');
 return result;
};
try {
 for (const [width,height] of [[320,740],[360,800],[390,844],[500,817],[768,1024],[1024,768],[1440,900],[1920,1080],[844,390]]) {
  const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce', locale:'ru-RU' });
  await context.route('**/*', route=>{
   const req=route.request();
   if(new URL(req.url()).origin!==origin){report.externalRequestsBlocked++;return route.abort();}
   if(req.method()!=='GET'){report.unexpectedMutations.push(req.url());return route.abort();}
   return route.continue();
  });
  const page=await context.newPage(); page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(origin,{waitUntil:'networkidle'});
  const cookie=page.getByRole('dialog',{name:'Управление файлами cookie'});
  await cookie.getByRole('button',{name:'Только обязательные',exact:true}).click(); await waitForClose(cookie);
  await page.evaluate(()=>document.fonts.ready);
  const logo=page.locator('.home-brand-logo');
  assert.equal(await logo.count(),2,'header/footer share logo');
  assert.ok(await logo.evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)));
  const trigger=page.getByRole('button',{name:'Описать поломку',exact:true});
  await trigger.click();
  const dialog=page.locator('[data-slot="dialog-content"]'); await dialog.waitFor();
  const result=await verifyLayer(page,dialog);
  for(let i=0;i<20;i++){await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)),'focus remains in form');}
  for(let i=0;i<4;i++){await page.keyboard.press('Shift+Tab');assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)));}
  for(const label of ['Тип техники','Срочность ремонта']) {
   const select=dialog.getByRole('combobox',{name:label});await select.click();
   const options=page.getByRole('listbox');await options.waitFor();
   assert.ok(await options.evaluate(el=>{const r=el.getBoundingClientRect();return +getComputedStyle(el).zIndex>+getComputedStyle(document.querySelector('[data-slot="dialog-content"]')).zIndex && el.contains(document.elementFromPoint(r.x+r.width/2,r.y+Math.min(r.height/2,30)));}),'select options above modal');
   await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');await waitForClose(options);
  }
  const submit=dialog.locator('button[type=submit]');await submit.scrollIntoViewIfNeeded();assert.equal(await submit.isDisabled(),true);
  await dialog.evaluate(el=>el.scrollTop=0);
  if([390,500,1440].includes(width))await page.screenshot({path:`${out}/form-${width}.png`,animations:'disabled'});
  await page.keyboard.press('Escape');await waitForClose(dialog);
  assert.ok(await trigger.evaluate(el=>el===document.activeElement),'focus returns to the form opener');
  await page.keyboard.press('Enter');await dialog.waitFor();await page.keyboard.press('Escape');await waitForClose(dialog);
  await trigger.click();await dialog.waitFor();await dialog.locator('[data-slot="dialog-close"]').click();await waitForClose(dialog);
  await trigger.click();await dialog.waitFor();await page.mouse.click(2,Math.round(height/2));await waitForClose(dialog);
  assert.equal(new URL(page.url()).pathname,'/','dismissal does not navigate');
  await page.evaluate(()=>scrollTo(0,0));
  if([390,500,1440].includes(width))await page.screenshot({path:`${out}/home-${width}.png`,animations:'disabled'});
  const menu=page.getByRole('button',{name:'Открыть меню'}); if(await menu.isVisible()){await menu.click();await page.locator('[data-site-menu]').waitFor();await page.keyboard.press('Escape');await page.locator('[data-site-menu]').waitFor({state:'hidden'});}
  report.sizes.push({width,height,...result,selects:'pass',keyboardTrap:'pass',escapeCloseReopen:'pass',focusReturn:'pass',closeButton:'pass',outsideDismiss:'pass',menu:'pass'});
  await context.close();
 }
 // A form also covers consent when the visitor has not made a cookie choice.
 const fresh=await browser.newContext({viewport:{width:500,height:817},reducedMotion:'reduce'});
 await fresh.route('**/*',route=>new URL(route.request().url()).origin===origin && route.request().method()==='GET' ? route.continue() : route.abort());
 const page=await fresh.newPage();await page.goto(origin,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Описать поломку',exact:true}).scrollIntoViewIfNeeded();
 // Narrow consent can obscure the opening button; keyboard focus is still available.
 await page.getByRole('button',{name:'Описать поломку',exact:true}).focus();await page.keyboard.press('Enter');
 const modal=page.locator('[data-slot="dialog-content"]');await modal.waitFor();await verifyLayer(page,modal);
 const consentBounds=await page.locator('[aria-labelledby="cookie-consent-title"]').boundingBox();
 assert.ok(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('[data-slot="dialog-overlay"],[data-slot="dialog-content"]')!==null,{x:consentBounds.x+20,y:consentBounds.y+20}), 'consent is below active form');
 await page.keyboard.press('Escape');await waitForClose(modal);await fresh.close();
 report.cookieLayer='pass';
 assert.deepEqual(report.errors,[]);
 assert.deepEqual(report.unexpectedMutations,[]);
} catch(e){report.failure=e.stack;throw e;}
finally {fs.writeFileSync(`${out}/results.json`,JSON.stringify(report,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));console.log(JSON.stringify(report,null,2));}

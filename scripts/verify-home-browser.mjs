// Local Chromium checks. No real messages or analytics requests leave the browser.
// PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node scripts/verify-home-browser.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5175';
const out = 'docs/homepage-four-screens-artifacts';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { base, browser: browser.version(), sizes: [], interactions: [], screenshots: [], errors: [] };
const intersects = (a,b) => a.x < b.x+b.width-1 && a.x+a.width > b.x+1 && a.y < b.y+b.height-1 && a.y+a.height > b.y+1;
try {
for (const [width,height] of [[360,800],[390,844],[768,1024],[1440,900],[1920,1080]]) {
 const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'reduce' });
 await context.route('**/*', route => {
  const u = new URL(route.request().url());
  return u.origin === new URL(base).origin ? route.continue() : route.abort();
 });
 const page = await context.newPage();
 page.on('pageerror', e => report.errors.push(e.message));
 await page.goto(base); await page.locator('.home-v2').waitFor();
 const consent = page.getByRole('button',{name:'Только обязательные',exact:true});
 if (await consent.isVisible()) await consent.click();
 await page.evaluate(()=>document.fonts.ready);
 const layout = await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,sections:document.querySelectorAll('.home-screen').length,iframes:document.querySelectorAll('iframe').length,labels:[...document.querySelectorAll('.home-map text')].map(e=>{const b=e.getBBox();return {name:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height}})}));
 layout.collisions=[];
 for(let i=0;i<layout.labels.length;i++) for(let j=i+1;j<layout.labels.length;j++) if(intersects(layout.labels[i],layout.labels[j])) layout.collisions.push([layout.labels[i].name,layout.labels[j].name]);
 layout.outside=layout.labels.filter(b=>b.x<0||b.x+b.width>660||b.y<0||b.y+b.height>425).map(b=>b.name);
 report.sizes.push({width,height,...layout});
 assert.equal(layout.scroll,width,'horizontal page overflow');assert.equal(layout.h1,1);assert.equal(layout.sections,4);assert.equal(layout.iframes,0);
 assert.deepEqual(layout.collisions,[],'map labels overlap');assert.deepEqual(layout.outside,[],'map labels clipped');
 if(width===390||width===1440) {
  for(const id of ['home-brand','home-repair','home-parts','home-work']) {
   // Capture the whole section at the requested viewport width, even when content grows taller.
   const loc=page.locator(`#${id}`); await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(150);
   const file=`${out}/${width}-${id}.png`; await loc.screenshot({path:file,animations:'disabled'});report.screenshots.push(file);
  }
 }
 await page.getByRole('button',{name:'Описать поломку',exact:false}).click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();
 assert.ok(await dialog.getByLabel('Где находится техника? *', { exact: true }).isVisible());
 assert.ok(await dialog.locator('button[type=submit]').isDisabled());
 const bounds=await dialog.boundingBox();assert.ok(bounds.x>=0 && bounds.x+bounds.width<=width+1);
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
 report.interactions.push(`${width}: modal open/disabled submit/Escape/bounds pass`);
 await page.getByRole('button',{name:'Открыть меню'}).first().click();
 await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');
 report.interactions.push(`${width}: menu open/Escape pass`);
 await context.close();
}
assert.equal(report.screenshots.length,8);
assert.deepEqual(report.errors,[]);
} catch(e) { report.failure=e.stack; throw e; }
finally {fs.writeFileSync(`${out}/browser-layout.json`,JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report,null,2));}

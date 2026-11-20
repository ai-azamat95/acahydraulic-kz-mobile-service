import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve('dist/public');
const server = process.env.SITE_ORIGIN ? null : http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + '/') && file !== root) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type', ({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = process.env.SITE_ORIGIN || `http://127.0.0.1:${server.address().port}`;
const output = process.env.EVIDENCE_DIR || 'ui-check/header-flow';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const measure = () => {
  const box = selector => {
    const el = document.querySelector(selector), r = el.getBoundingClientRect(), css = getComputedStyle(el);
    return { top:r.top, bottom:r.bottom, height:r.height, position:css.position, display:css.display };
  };
  return { scrollY, width:innerWidth, overflow:document.documentElement.scrollWidth > innerWidth,
    header:box('.home-header'), quickNav:box('.site-quick-nav-home'), main:box('#home-main'), bar:box('.sticky-home'),
    headerCount:document.querySelectorAll('.home-header').length,
    navCount:document.querySelectorAll('nav[aria-label="Быстрые переходы"]').length,
    contacts:[...document.querySelectorAll('.sticky-home a')].map(a=>({href:a.getAttribute('href'),target:a.getAttribute('target'),rel:a.getAttribute('rel')})) };
};
try {
  for (const width of [320, 360, 390, 768, 1440]) {
    const page = await browser.newPage({viewport:{width,height:900},locale:'ru-RU',reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await page.goto(origin, {waitUntil:'networkidle'});
    const cookies=page.getByRole('dialog',{name:'Управление файлами cookie'});
    if (await cookies.isVisible()) await cookies.getByRole('button',{name:'Только обязательные',exact:true}).click();
    await page.locator('.home-header').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    const top=await page.evaluate(measure);
    assert.equal(top.headerCount,1);assert.equal(top.navCount,1);
    assert.equal(top.header.position,'relative');assert.equal(top.quickNav.position,'relative');
    assert.equal(top.header.top,0);assert.equal(top.quickNav.top,top.header.bottom);assert.equal(top.main.top,top.quickNav.bottom);
    assert.equal(top.overflow,false);
    assert.equal(top.bar.position,'fixed');
    assert.equal(top.bar.display,width<768?'flex':'none');
    assert.equal(top.contacts.length,2);
    assert.match(top.contacts[0].href,/^tel:/);assert.match(top.contacts[1].href,/^https:\/\/wa.me\//);
    await page.screenshot({path:`${output}/top-${width}.png`});
    await page.evaluate(()=>window.scrollTo(0,1000));
    await page.waitForFunction(()=>scrollY>=1000);
    const scrolled=await page.evaluate(measure);
    assert(scrolled.header.bottom<0);assert(scrolled.quickNav.bottom<0);assert.equal(scrolled.overflow,false);
    assert.deepEqual(scrolled.contacts,top.contacts);
    if(width<768){assert.equal(scrolled.bar.bottom,900);assert.equal(scrolled.bar.top,top.bar.top);}
    await page.screenshot({path:`${output}/scrolled-${width}.png`});
    await page.evaluate(()=>{location.hash='home-repair';});
    await page.waitForFunction(()=>Math.abs(document.querySelector('#home-repair').getBoundingClientRect().top)<2);
    const anchor=await page.locator('#home-repair').boundingBox();assert(Math.abs(anchor.y)<2);
    await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
    await page.screenshot({path:`${output}/bottom-${width}.png`});
    assert.equal((await page.evaluate(measure)).overflow,false);
    await page.evaluate(()=>window.scrollTo(0,0));
    if(width<1280){
      await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
      await page.locator('[data-site-menu]').waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.screenshot({path:`${output}/menu-${width}.png`});
      await page.keyboard.press('Escape');await page.locator('[data-site-menu]').waitFor({state:'hidden'});
      await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
      await page.locator('[data-site-menu] a[href="/services"]').click();
    }else{
      await page.locator('.home-desktop-nav a[href="/services/"]').click();
    }
    await page.waitForURL(/\/services\/?$/);
    await page.locator('.home-header').waitFor({state:'detached'});
    await page.locator('[data-site-menu]').waitFor({state:'hidden'});
    assert.equal(await page.locator('nav[aria-label="Быстрые переходы"]').count(),1, await page.locator('nav[aria-label="Быстрые переходы"]').evaluateAll(els=>els.map(el=>el.outerHTML).join('\n')));
    await page.locator('nav[aria-label="Быстрые переходы"] a[href="/"]').click();
    await page.locator('.home-header').waitFor();
    assert.equal(await page.locator('.site-quick-nav-home').count(),1);
    await page.locator('.site-quick-nav-home a[href="/catalog"]').click();
    await page.waitForURL(/\/catalog\/?$/);
    await page.locator('.aca-catalog-header').waitFor();
    await page.locator('nav[aria-label="Быстрые переходы"] a[href="/"]').click();
    await page.locator('.home-header').waitFor();
    assert.deepEqual(errors,[]);
    results.push({width,top,scrolled,anchorTop:anchor.y,menu:'pass',internalLinks:'pass',pageErrors:errors});
    await page.close();
  }
} finally {
  fs.writeFileSync(`${output}/results.json`,JSON.stringify({origin,results},null,2));
  await browser.close();server?.close();
}
assert.equal(results.length,5);
console.log(JSON.stringify({origin,widths:results.map(r=>r.width),status:'pass',output},null,2));

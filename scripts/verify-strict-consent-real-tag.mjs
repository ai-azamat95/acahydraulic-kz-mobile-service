// Real Google JavaScript only; all collection and other off-origin traffic is
// aborted BEFORE delivery. Never use vendor mocks as withdrawal acceptance.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:5197');
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const results=[];
const isMeasurement = url => /(?:google-analytics\.com|analytics\.google\.com|googletagmanager\.com|googleadservices\.com|googlesyndication\.com|doubleclick\.net|www\.google\.[^/]+\/(?:g\/collect|ccm|ads|rmkt|pagead))/.test(url);
try {
 for (const width of [390,1440]) for (const marketing of [false,true]) {
  const report={width,marketing,requests:[],scripts:[],checks:[]}; results.push(report);
  let phase='cold';
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width,height:900},userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'});
  await context.route('**/*',async route=>{
   const request=route.request(), url=new URL(request.url());
   if(url.origin===base.origin&&!url.pathname.startsWith('/api/'))return route.continue();
   if(request.method()==='GET'&&url.hostname==='www.googletagmanager.com'&&/^\/gtag\/(js|destination)$/.test(url.pathname)) {
    const response=await route.fetch(); const body=await response.body();
    report.scripts.push({phase,url:url.href,status:response.status(),sha256:crypto.createHash('sha256').update(body).digest('hex')});
    return route.fulfill({response,body});
   }
   if(isMeasurement(url.href)) report.requests.push({phase,url:url.href,body:request.postData()});
   return route.abort();
  });
  await context.addInitScript(()=>{
   Object.defineProperty(navigator,'webdriver',{get:()=>false});
   window.open=(...args)=>{(window.__qaPopups??=[]).push(args);return null;};
   window.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(a&&(a.protocol==='tel:'||a.origin!==location.origin))event.preventDefault();});
  });
  const page=await context.newPage();
  const apply=async(a,m)=>page.evaluate(({a,m})=>{const c={version:1,necessary:true,analytics:a,marketing:m,updatedAt:Date.now()};localStorage.setItem('aca_cookie_consent_v1',JSON.stringify(c));window.__ACA_APPLY_COOKIE_CONSENT__(c);},{a,m});
  await page.goto(new URL('/services/mobile-repair/',base).href,{waitUntil:'networkidle'});
  assert.equal(report.scripts.length,0);assert.equal(report.requests.length,0);report.checks.push('no Google before consent');
  phase='grant';await apply(true,marketing);
  await page.waitForFunction(()=>window.google_tag_manager?.['G-XZB9KZ4VCH']);
  await page.waitForTimeout(5000);
  assert(report.requests.some(r=>new URL(r.url).searchParams.get('tid')==='G-XZB9KZ4VCH'),'real GA destination must run');
  await page.getByRole('button',{name:'Оставить заявку',exact:true}).click();
  let form=page.locator('form').filter({has:page.locator('input[name="location"]')}).first();
  for(const [name,value] of Object.entries({name:'QA-NAME-ONLY',phone:'0000000000',location:'QA-LOCATION-ONLY',model:'QA-MODEL-ONLY'}))await form.locator(`input[name="${name}"]`).fill(value);
  await page.waitForTimeout(2500);
  const documentId=await page.evaluate(()=>window.__qaDocument=crypto.randomUUID());
  phase='withdraw';await apply(false,false);
  await page.waitForFunction(id=>window.__qaDocument!==id,documentId);
  await page.waitForLoadState('networkidle');
  await page.getByRole('button',{name:'Оставить заявку',exact:true}).click();
  form=page.locator('form').filter({has:page.locator('input[name="location"]')}).first();
  assert.equal(await form.locator('input[name="name"]').inputValue(),'QA-NAME-ONLY','unsent draft retained');
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('aca_consent_reload_service_draft')),null,'draft consumed');
  phase='future';
  await form.locator('input[name="model"]').fill('QA-AFTER-REVOKE');
  await form.locator('input[type="checkbox"]').check();
  await form.locator('button[type="submit"]').click();
  assert.equal(await page.evaluate(()=>window.__qaPopups?.length),1,'form still prepares one popup');
  await page.keyboard.press('Escape');
  await page.locator('[data-slot="dialog-overlay"]').waitFor({state:'detached'});
  await page.evaluate(()=>{
   for(const event of ['page_view','scroll','click','form_start','form_submit','user_engagement','acahydraulic_whatsapp_click','acahydraulic_phone_click','catalog_whatsapp_click','case_whatsapp_click','form_whatsapp_click'])gtag('event',event,{test_marker:'strict-probe'});
   history.pushState({},'',location.pathname+'?strict_probe=1');
   window.scrollTo(0,document.body.scrollHeight);
  });
  await page.locator('a[href^="https://wa.me/"]:visible').first().click();
  await page.waitForTimeout(12000);
  assert.equal(report.requests.filter(r=>['withdraw','future'].includes(r.phase)).length,0,'no Google measurement attempts from withdrawal onward');
  assert.equal(report.scripts.filter(r=>['withdraw','future'].includes(r.phase)).length,0,'no Google reload under denied consent');
  report.checks.push('withdrawal + actual form/contact + direct events + history + scroll silent; draft retained');
  for(const path of ['/catalog/brand/rexroth/','/']){
   await page.goto(new URL(path,base).href,{waitUntil:'networkidle'});
   await page.locator('a[href^="https://wa.me/"]:visible').first().click();
  }
  assert.equal(report.requests.filter(r=>r.phase==='future').length,0);report.checks.push('denied navigation remains silent');
  phase='regrant';await apply(true,marketing);await page.waitForTimeout(5000);
  await page.evaluate(()=>gtag('event','strict_regrant_probe'));await page.waitForTimeout(3000);
  assert(report.requests.some(r=>r.phase==='regrant'&&new URL(r.url).searchParams.get('tid')==='G-XZB9KZ4VCH'),'regrant collection restored');
  report.checks.push('regrant real collection restored');
  // Exercise the actual settings UI too: withdraw analytics while retaining
  // marketing (Ads requests are permitted, GA4 requests are not).
  if(marketing){
   await page.getByRole('button',{name:'Открыть настройки cookie',exact:true}).click();
   const analyticsBox=page.getByRole('checkbox',{name:'Аналитика',exact:true});
   const marketingBox=page.getByRole('checkbox',{name:'Реклама',exact:true});
   if(await analyticsBox.isChecked())await analyticsBox.locator('xpath=ancestor::label').click();
   if(!await marketingBox.isChecked())await marketingBox.locator('xpath=ancestor::label').click();
   phase='partial';
   await page.getByRole('button',{name:'Сохранить выбор',exact:true}).click();
   await page.waitForLoadState('networkidle');await page.waitForTimeout(5000);
   await page.locator('a[href^="https://wa.me/"]:visible').first().click();
   await page.waitForTimeout(3000);
   assert(!report.requests.some(r=>r.phase==='partial'&&new URL(r.url).searchParams.get('tid')==='G-XZB9KZ4VCH'),'partial withdrawal must not collect GA4');
   assert.equal(await page.evaluate(()=>window.__ACA_COOKIE_CONSENT__.marketing),true);
   report.checks.push('settings UI partial withdrawal preserves marketing, disables GA4');
  }
  if(marketing){
   phase='restore-both';await apply(true,true);await page.waitForTimeout(4000);
   const id=await page.evaluate(()=>window.__qaDocument=crypto.randomUUID());
   phase='marketing-withdraw';await apply(true,false);
   await page.waitForFunction(id=>window.__qaDocument!==id,id);
   await page.waitForLoadState('networkidle');await page.waitForTimeout(5000);
   assert.equal(await page.evaluate(()=>window.__ACA_COOKIE_CONSENT__.analytics),true);
   assert.equal(await page.evaluate(()=>window.__ACA_COOKIE_CONSENT__.marketing),false);
   assert(report.requests.some(r=>r.phase==='marketing-withdraw'&&new URL(r.url).searchParams.get('tid')==='G-XZB9KZ4VCH'));
   assert(!report.requests.some(r=>r.phase==='marketing-withdraw'&&/doubleclick|googleadservices|\/pagead\/|\/ccm\//.test(r.url)),'no Ads requests after marketing withdrawal');
   report.checks.push('marketing withdrawal preserves working GA4, no Ads collection');
  }
  // A blocked localStorage write must not leave the previous saved grant.
  phase='storage-fallback';
  await page.evaluate(()=>{
   const original=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(this===localStorage&&k==='aca_cookie_consent_v1')throw new DOMException('QA blocked','QuotaExceededError');return original.call(this,k,v);};
   window.__ACA_APPLY_COOKIE_CONSENT__({version:1,necessary:true,analytics:false,marketing:false,updatedAt:Date.now()});
  });
  await page.waitForURL(/aca_consent_reset=1/);await page.waitForLoadState('networkidle');
  assert.equal(await page.evaluate(()=>window.__ACA_COOKIE_CONSENT__),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('aca_cookie_consent_v1')),null);
  await page.goto(new URL('/services/mobile-repair/',base).href,{waitUntil:'networkidle'});
  assert.equal(report.requests.filter(r=>r.phase==='storage-fallback').length,0);
  report.checks.push('storage write failure resets safely; subsequent navigation denied');
  // An expired or malformed tab-local draft is removed, never restored.
  for(const at of [Date.now()-120000,'invalid',Date.now()+120000]){
   await page.evaluate(at=>sessionStorage.setItem('aca_consent_reload_service_draft',JSON.stringify({path:location.pathname,at,value:{name:'EXPIRED-QA'}})),at);
   await page.reload({waitUntil:'networkidle'});
   await page.getByRole('button',{name:'Оставить заявку',exact:true}).click();
   assert.equal(await page.locator('input[name="name"]').first().inputValue(),'');
   assert.equal(await page.evaluate(()=>sessionStorage.getItem('aca_consent_reload_service_draft')),null);
   await page.keyboard.press('Escape');
  }
  await page.clock.install();
  await page.evaluate(()=>sessionStorage.setItem('aca_consent_reload_service_draft','unclaimed-QA'));
  await page.reload({waitUntil:'networkidle'});await page.clock.fastForward(61000);
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('aca_consent_reload_service_draft')),null);
  report.checks.push('expired/malformed/future and unclaimed drafts deleted');
  assert(!JSON.stringify(report.requests).includes('QA-NAME-ONLY'));
  assert(!JSON.stringify(report.requests).includes('QA-LOCATION-ONLY'));
  report.passed=true;
  await context.close();
 }
 console.log('PASS real-tag strict consent',results.map(r=>({width:r.width,marketing:r.marketing,checks:r.checks})));
} catch(error){console.error(error);process.exitCode=1;results.push({error:String(error)});}
finally{fs.writeFileSync(process.env.EVIDENCE_PATH||'/tmp/aca-strict-consent.json',JSON.stringify(results,null,2));await browser.close();}

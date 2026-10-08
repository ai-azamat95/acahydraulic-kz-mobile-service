import assert from 'node:assert/strict';

export async function checkCatalogPagination(page, origin) {
 const ready=()=>page.waitForFunction(()=>document.querySelector('[data-index-complete]')?.dataset.indexComplete==='true');
 await page.goto(origin+'/catalog/category/controllers/?page=2',{waitUntil:'networkidle'});await ready();
 const input=page.locator('#catalog-search input').first();await input.fill('controller');
 await page.waitForFunction(()=>document.querySelector('[data-page]')?.dataset.page==='1');
 assert(await input.evaluate(n=>n===document.activeElement),'editing must keep input focus');
 await page.goto(origin+'/catalog/category/controllers/?page=999999',{waitUntil:'networkidle'});await ready();
 const total=Number(await page.locator('[data-result-count]').getAttribute('data-result-count'));
 const last=Math.ceil(total/10);await page.waitForURL(url=>url.searchParams.get('page')===String(last));
 assert.equal(await page.locator('.aca-product-card').count(),total%10||10);
 await page.goto(origin+'/catalog/?q=267-2755',{waitUntil:'networkidle'});await ready();
 const found=await page.locator('.aca-product-card').allTextContents();assert(found.some(text=>text.includes('267-2755')));
 const link=await page.locator('.aca-product-card').filter({hasText:'267-2755'}).first().locator('a[href^="https://wa.me/"]').getAttribute('href');
 assert(new URL(link).searchParams.get('text').includes('267-2755'));
 const handles=[];
 await page.goto(origin+'/parts/engines-complete/',{waitUntil:'networkidle'});
 for(let number=1;number<=3;number++) {
  await page.waitForFunction(n=>document.querySelector('[data-engine-page]')?.dataset.enginePage===String(n),number);
  const count=await page.locator('[data-engine-product-card], [data-complete-engine-offer-card]').count();assert.equal(count,number<3?10:6);
  handles.push(...await page.locator('[data-engine-product-link]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))));
  if(number<3) await page.locator('[data-page-next]').click();
 }
 assert.equal(new Set(handles).size,25);assert.equal(handles.length,25);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 return { pagination: 'pass', filterFocus: 'pass', lastPage: 'pass', oemWhatsApp: 'pass', enginePages: [10, 10, 6], allEngineFamilies: 25 };
}

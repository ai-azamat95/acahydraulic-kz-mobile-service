import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const cases = [
 ['blog/remont-ili-zamena-gidronasosa/', 'Ремонт или замена гидронасоса экскаватора'],
 ['blog/padaet-davlenie-gidravliki-ekskavatora/', 'Падает давление гидравлики экскаватора: причины'],
 ['blog/kapitalnyy-remont-shantui-sd32/', 'Ремонт SHANTUI SD32: дефектовка и объём работ'],
 ['catalog/category/hydraulic-pumps/', 'Гидронасосы под заказ — Астана и Казахстан'],
];
for (const [route,title] of cases) test(`complete reviewed metadata: ${route}`,()=>{
 const html=fs.readFileSync(`dist/public/${route}index.html`,'utf8');
 assert.equal(html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1], `${title} | ACA Hydraulic`);
 assert.ok(html.includes(`href="https://acahydraulic.kz/${route}"`));
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
});
test('full article headline remains separate from SEO title',()=>{
 const article=JSON.parse(fs.readFileSync('shared/seo-articles.json')).find(x=>x.slug==='remont-ili-zamena-gidronasosa');
 assert.equal(article.title,'Ремонт или замена гидронасоса экскаватора: что проверить до покупки');
 assert.ok(fs.readFileSync('dist/public/blog/remont-ili-zamena-gidronasosa/index.html','utf8').includes(article.title));
});

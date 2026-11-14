import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import owners from '../shared/catalog-owner-products.json' with {type:'json'};
const handle='cat-253-0618-original-fuel-injector';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
test('CAT 253-0618 owner original is distinct from the preserved aftermarket offer',()=>{
 const p=owners.find(p=>p.handle===handle);assert(p);
 assert.equal(p.mpn,'253-0618');assert.equal(p.brand,'CAT');
 assert.deepEqual(p.categories,['engine-fuel','fuel-injectors']);assert.equal(p.category,'fuel-injectors');
 assert.equal(p.minPriceKzt,null);assert.equal(p.maxPriceKzt,null);assert.equal(p.available,false);
 assert(p.variants.every(v=>v.priceKzt===null && v.available===false));
 assert.match(p.catalogDescription,/Оригинальность заявлена продавцом/);
 assert.match(p.catalogQualityNote,/Независимая проверка подлинности экземпляра не проводилась/);
 assert.equal(p.gallery[0],p.imageUrl);assert.equal(p.gallery.length,1);
 const bytes=fs.readFileSync('client/public'+p.imageUrl);assert.equal(bytes.toString('ascii',8,12),'WEBP');
 const source=read('client/public/catalog-data/search-index.json');
 assert.equal(source.filter(p=>p.handle===handle).length,1);
 const aftermarket=source.find(p=>p.id==='8034003222690');assert(aftermarket.tags.includes('Caterpillar Aftermarket Parts'));
 assert.equal(aftermarket.minPriceKzt,322950);assert.equal(aftermarket.maxPriceKzt,1866750);
 assert.equal(aftermarket.handle,'253-0618-10r-2772-fuel-injector-for-caterpillar-c15-c18-c32-diesel-engine');
});
test('CAT original static route and category indexes publish exact PN and inquiry price',()=>{
 const html=fs.readFileSync(`dist/public/catalog/${handle}/index.html`,'utf8');
 for(const s of ['253-0618','Оригинальная топливная форсунка CAT','Цена по запросу','/catalog-assets/cat-253-0618/01-main.webp','Оригинальность заявлена продавцом'])assert(html.includes(s),s);
 assert(!html.includes('data-static-product-schema'));
 for(const c of ['engine-fuel','fuel-injectors'])assert.equal(read(`dist/public/catalog-data/category-indexes/${c}.json`).filter(p=>p.handle===handle).length,1);
});

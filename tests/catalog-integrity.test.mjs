import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { detectCategory } from '../scripts/catalog-classification.mjs';
const dir='client/public/catalog-data/';
test('search cards resolve to the same product, photo, category and price',()=>{
 const manifest=JSON.parse(fs.readFileSync(dir+'manifest.json'));
 const index=JSON.parse(fs.readFileSync(dir+'search-index.json'));
 const map=JSON.parse(fs.readFileSync(dir+'product-map.json'));
 const ids=new Set();
 for(let chunk=1;chunk<=manifest.chunkCount;chunk++){
  const products=JSON.parse(fs.readFileSync(dir+`products-${String(chunk).padStart(3,'0')}.json`));
  for(const p of products){
   assert(!ids.has(p.id),'duplicate product ID');ids.add(p.id);
   const card=index.find(x=>x.id===p.id);
   assert(card,p.handle);assert.equal(map[p.handle],chunk);assert.equal(card.handle,p.handle);assert.equal(card.imageUrl,p.imageUrl);assert.equal(card.category,p.category);assert.equal(card.minPriceKzt,p.minPriceKzt);assert.equal(p.category,detectCategory(p),p.title);
   assert.equal(p.imageUrl,p.gallery[0]||null);
  }
 }
 assert.equal(ids.size,manifest.productCount);
});

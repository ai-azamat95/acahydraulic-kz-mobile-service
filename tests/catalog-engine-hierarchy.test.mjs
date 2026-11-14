import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { correctEngineTaxonomy } from '../shared/catalog-engine-taxonomy.mjs';
import mapping from '../shared/catalog-engine-taxonomy.json' with { type: 'json' };
import imported from '../shared/catalog-turbocharger-products.json' with { type: 'json' };
import owners from '../shared/catalog-owner-products.json' with { type: 'json' };
const additionalEngineOwners = owners.filter(p => p.categories.includes('engine-fuel') && !mapping.some(r => r.id === p.id));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const withoutTaxonomy = ({category, categories, ...rest}) => rest;
test('reviewed taxonomy is ID-scoped, lossless and idempotent', () => {
 const products = fs.readdirSync('client/public/catalog-data').filter(f => /^products-\d+\.json$/.test(f)).flatMap(f => read(`client/public/catalog-data/${f}`));
 const ids = new Set(products.map(p => p.id));
 assert.equal(ids.size, 12293 + additionalEngineOwners.length);
 assert.equal(mapping.length, 4010);
 assert.equal(new Set(mapping.map(r => r.id)).size, mapping.length);
 const assigned = {};
 for (const row of mapping) {
  const p = products.find(p => p.id === row.id); assert(p, row.id);
  assert.equal(p.handle, row.handle); assert.equal(p.title, row.title);
  const result = correctEngineTaxonomy(p);
  assert.deepEqual(withoutTaxonomy(result), withoutTaxonomy(p));
  assert.equal(correctEngineTaxonomy(result), result);
  assert(result.categories.includes('engine-fuel'));
  if(row.destination) { assigned[row.destination] = (assigned[row.destination] || 0) + 1; assert(result.categories.includes(row.destination)); }
  else assert(!result.categories.some(c => ['fuel-injectors','fuel-pumps','turbochargers','air-compressors'].includes(c)));
  if (row.destination === 'fuel-pumps') assert(!/hydraulic pump|oil pump|water pump|гидронасос/i.test(p.title.split(/\s+for\s+/i)[0]));
 }
 assert.deepEqual(assigned, {'fuel-pumps':598,'fuel-injectors':1044,turbochargers:831,'air-compressors':1});
 assert.equal(imported.length,152);
 for(const p of imported) assert.equal(mapping.find(r=>r.id===p.id)?.destination,'turbochargers');
 const unknown = {id:'unknown',category:'hydraulic-pumps',categories:['hydraulic-pumps'],title:'Fuel pump'};
 assert.equal(correctEngineTaxonomy(unknown), unknown);
});
test('published parent and child indexes are deduplicated and exact',()=>{
 const dir='dist/public/catalog-data/category-indexes';
 const parent=read(`${dir}/engine-fuel.json`); assert.equal(parent.length,4010 + additionalEngineOwners.length);
 assert.equal(new Set(parent.map(p=>p.id)).size,4010 + additionalEngineOwners.length);
 for(const c of ['fuel-injectors','fuel-pumps','turbochargers','air-compressors']) {
  const rows=read(`${dir}/${c}.json`); const expected=[...mapping.filter(r=>r.destination===c).map(r=>r.id), ...additionalEngineOwners.filter(p=>p.categories.includes(c)).map(p=>p.id)].sort();
  assert.deepEqual(rows.map(p=>p.id).sort(),expected);
  const html=fs.readFileSync(`dist/public/catalog/category/${c}/index.html`,'utf8');
  assert(html.includes('href="/catalog/category/engine-fuel/"'));
  assert(html.includes(`https://acahydraulic.kz/catalog/category/${c}/`));
 }
 for(const r of mapping) assert(parent.some(p=>p.id===r.id));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyOwnerCatalogProducts, ownerCatalogProducts } from '../scripts/catalog-owner-products.mjs';
import { verifyOwnerCatalogInputs } from '../scripts/check-owner-catalog-inputs.mjs';

test('deployment inputs reject an unprepared catalogue and preserve legacy products after preparation', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-owner-deploy-'));
  const legacy = { id:'legacy-valve',handle:'legacy-valve',category:'control-valves',categories:['control-valves'],title:'Legacy valve',minPriceKzt:42000,maxPriceKzt:42000,available:true,gallery:[],imageUrl:null,variants:[{id:'legacy',sku:'LEGACY',priceKzt:42000,available:true}] };
  try {
    const write = (file, value) => fs.writeFileSync(path.join(dir, file), JSON.stringify(value));
    const read = file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    write('manifest.json',{productCount:1,pageSize:250,chunkCount:1});
    write('product-map.json',{'legacy-valve':1});
    write('products-001.json',[legacy]);
    write('search-index-001.json',[legacy]);
    write('search-index.json',[legacy]);
    write('category-summary.json',{'control-valves':{count:1,imageUrl:null}});
    assert.throws(() => verifyOwnerCatalogInputs(dir), /Missing owner product map entry/);
    applyOwnerCatalogProducts(dir);
    assert.equal(verifyOwnerCatalogInputs(dir).passed,true);
    assert.deepEqual(read('products-001.json').find(product => product.id === legacy.id),legacy);
    const husco = read('products-001.json').find(product => product.brand === 'HUSCO');
    assert(husco);
    assert.equal(husco.minPriceKzt,null);
    assert.equal(husco.variants[0].priceKzt,null);
    assert.equal(husco.imageUrl,null);
    assert.deepEqual(husco.gallery,[]);
    const snapshot = fs.readdirSync(dir).map(file => [file,fs.readFileSync(path.join(dir,file),'utf8')]);
    applyOwnerCatalogProducts(dir);
    assert.equal(verifyOwnerCatalogInputs(dir).passed,true);
    assert.deepEqual(fs.readdirSync(dir).map(file => [file,fs.readFileSync(path.join(dir,file),'utf8')]),snapshot);
    assert.equal(read('manifest.json').productCount,1+ownerCatalogProducts.length);
  } finally {
    fs.rmSync(dir,{recursive:true,force:true});
  }
});

test('production prepares and verifies owner inputs before build and route publication', () => {
  const workflow = fs.readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
  const prepare = workflow.indexOf('node scripts/prepare-public-catalog.mjs');
  const sourceCheck = workflow.indexOf('node scripts/check-owner-catalog-inputs.mjs client/public/catalog-data');
  const build = workflow.indexOf('run: pnpm build');
  const routes = workflow.indexOf('pnpm catalog:routes');
  const distCheck = workflow.indexOf('node scripts/check-owner-catalog-inputs.mjs dist/public/catalog-data');
  const upload = workflow.indexOf('uses: actions/upload-pages-artifact');
  assert(prepare >= 0 && prepare < sourceCheck && sourceCheck < build,'Production must prepare owner data and verify it before Vite copies catalog inputs');
  assert(build < routes && routes < distCheck && distCheck < upload,'Production must verify generated catalogue inputs before artifact upload');
  const prepareScript = fs.readFileSync(new URL('../scripts/prepare-public-catalog.mjs',import.meta.url),'utf8');
  assert.match(prepareScript,/applyOwnerCatalogProducts\(catalogDir\)/);
});

test('browser QA uses the normal preparation pipeline including category summaries', () => {
  const workflow = fs.readFileSync(new URL('../.github/workflows/catalog-browser-check.yml',import.meta.url),'utf8');
  assert.match(workflow,/node scripts\/prepare-public-catalog\.mjs/);
  assert.match(workflow,/node scripts\/check-owner-catalog-inputs\.mjs client\/public\/catalog-data/);
  assert.doesNotMatch(workflow,/updateCategorySummary: false/);
  assert(workflow.indexOf('node scripts/prepare-public-catalog.mjs') < workflow.indexOf('run: pnpm build'));
});

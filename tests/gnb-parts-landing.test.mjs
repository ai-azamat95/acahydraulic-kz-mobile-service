import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {gnbParts, renderGnbPartsPage} from '../scripts/lib/gnb-parts-page.mjs';

test('GNB is a sourcing landing, with six request groups and the existing owned example', () => {
  assert.equal(gnbParts.groups.length, 6);
  assert.deepEqual(gnbParts.groups.map(group => group.id), ['pumps','motors','swivels','rods','reamers','heads']);
  const text = JSON.stringify(gnbParts);
  for (const term of ['серийный номер','шильдика','город','срок','резьба','диаметр','нагрузка']) assert(text.toLowerCase().includes(term), term);
  assert.equal(gnbParts.productPath, '/catalog/803001730-hydraulic-pump-xcmg-xz200-xz200e-hdd/');
  const sale = JSON.parse(fs.readFileSync('shared/xcmg-xz200-pump-sale.json','utf8'));
  assert.equal(gnbParts.casePath, sale.casePath + '/');
  assert.equal(gnbParts.productPath, '/catalog/' + sale.handle + '/');
  assert(!/DDW220|NewCondition|Offer|priceKzt|РВД|в наличии|гарантия \d/i.test(text));
  const request = new URL(gnbParts.whatsappUrl).searchParams.get('text');
  for (const field of ['Модель установки:','Год:','Серийный номер:','Город:','Нужный срок:','Резьба / диаметр / нагрузка']) assert(request.includes(field));
});

test('static landing replaces homepage metadata and schemas without scripts', () => {
  const fixture = '<html><head><title>Old</title><meta name="description" content="old"><link rel="canonical" href="https://old/"><script type="application/ld+json">{"@type":"Product","offers":{}}</script></head><body><div id="root"></div></body></html>';
  const html = renderGnbPartsPage(fixture).html;
  assert(!html.includes('https://old/'));
  assert(!html.includes('"offers"'));
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert(html.includes('<h1>' + gnbParts.title + '</h1>'));
  assert.equal((html.match(/data-gnb-group=/g)||[]).length,6);
});

test('actual production HTML, canonical, sitemap and catalog entry link agree', () => {
  const root = path.resolve('dist/public');
  const html = fs.readFileSync(path.join(root,gnbParts.path,'index.html'),'utf8');
  const home = fs.readFileSync(path.join(root,'catalog/index.html'),'utf8');
  const sitemap = fs.readFileSync(path.join(root,'sitemap-catalog-landings.xml'),'utf8');
  assert(home.includes('href="' + gnbParts.path + '"'));
  assert(html.includes('rel="canonical" href="https://acahydraulic.kz' + gnbParts.path + '"'));
  assert(html.includes('<title data-rh="true">' + gnbParts.title + ' | ACA Hydraulic</title>'));
  assert.equal((sitemap.match(/<loc>https:\/\/acahydraulic.kz\/catalog\/gnb-parts\/<\/loc>/g)||[]).length,1);
  for (const target of [gnbParts.productPath,...gnbParts.related.map(item=>item.path)]) assert(fs.existsSync(path.join(root,target,'index.html')), target);
  for (const group of gnbParts.groups) assert(html.includes(group.title));
  assert(html.includes(gnbParts.casePath));
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.equal(schemas.length,1);
  assert.equal(schemas[0]['@type'],'CollectionPage');
  assert.equal(schemas[0].mainEntity.numberOfItems,1);
  assert.equal(schemas[0].mainEntity.itemListElement[0].url,'https://acahydraulic.kz'+gnbParts.productPath);
  assert(!html.includes('"offers"'));
  const categories = JSON.parse(fs.readFileSync('shared/catalog-landings.json','utf8')).categories;
  const generated = JSON.parse(fs.readFileSync(path.join(root,'catalog-data/landing-pages.json'),'utf8')).categories;
  assert.equal(categories.length,20);
  assert.deepEqual(generated.map(c=>c.id),categories.map(c=>c.id));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import products from '../shared/catalog-turbocharger-products.json' with { type: 'json' };
import rows from '../docs/turbocharger-import/rows.json' with { type: 'json' };
import copy from '../shared/catalog-turbocharger-copy.json' with { type: 'json' };
import { catalogProductSeo } from '../shared/catalog-product-seo.mjs';

test('152 turbocharger metadata records preserve exact PN, source engines and inquiry status', () => {
  assert.equal(Object.keys(copy).length, 152);
  const descriptions = new Set();
  for (const p of products) {
    const seo = catalogProductSeo(p);
    assert(seo.title.includes(p.sku));
    assert(seo.metaDescription.includes(p.sku));
    const engine = rows.find(r => r.handle === p.handle).engine.replaceAll('\n', ', ');
    assert(seo.metaDescription.includes(engine), p.sku);
    assert.match(seo.metaDescription, /Цена по запросу/);
    assert.match(seo.metaDescription, /Применяемость и наличие уточняем/);
    assert.doesNotMatch(seo.metaDescription, /OEM|оригинал|в наличии/);
    assert(seo.metaDescription.length <= 165);
    descriptions.add(seo.metaDescription);
    const html = fs.readFileSync(`dist/public/catalog/${p.handle}/index.html`, 'utf8');
    assert(html.includes(seo.metaDescription));
    assert.doesNotMatch(html, /"offers"\s*:|"price"\s*:/);
  }
  assert.equal(descriptions.size, 152);
});

test('existing engine category exposes turbocharger guide and all 152 crawlable product links', () => {
  const html = fs.readFileSync('dist/public/catalog/category/engine-fuel/index.html', 'utf8');
  assert(html.includes('Турбокомпрессоры: поиск по номеру и проверка исполнения'));
  assert(html.includes('320/06016'));
  for (const p of products) assert(html.includes(`href="/catalog/${p.handle}/"`));
});

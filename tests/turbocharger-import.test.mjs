import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import products from '../shared/catalog-turbocharger-products.json' with { type: 'json' };
import provenance from '../docs/turbocharger-import/rows.json' with { type: 'json' };

test('all source rows map to exactly one exact-PN card and their own photo cell', () => {
  assert.equal(provenance.length, 153);
  assert.equal(products.length, 152);
  assert.equal(new Set(products.map(p => p.sku)).size, 152);
  assert.equal(new Set(products.map(p => p.handle)).size, 152);
  for (const row of provenance) {
    const matches = products.filter(p => p.sku === row.pn);
    assert.equal(matches.length, 1, row.pn);
    const p = matches[0];
    assert.equal(p.mpn, row.pn);
    assert.equal(p.handle, row.handle);
    assert(p.gallery.includes(row.publicImage));
    assert.equal(row.images.length, 1);
    const [a,b,c,d] = row.cells[2];
    const [x,y,z,w] = row.images[0].bbox;
    assert(x >= a-1 && y >= b-1 && z <= c+1 && w <= d+1, row.pn);
    const bytes = fs.readFileSync(`client/public${row.publicImage}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), row.publicImageSha256);
    assert(p.fitment.includes(row.engine.replaceAll('\n', ', ')));
  }
  const repeat = products.find(p => p.sku === '8980928220');
  assert.equal(repeat.gallery.length, 2);
});

test('inquiry-only content has no hidden prices, supplier identity or unsupported stock claims', () => {
  for (const p of products) {
    assert.equal(p.minPriceKzt, null);
    assert.equal(p.maxPriceKzt, null);
    assert.equal(p.available, false);
    assert.equal(p.variants[0].priceKzt, null);
    assert.equal(p.variants[0].sku, p.sku);
    assert.match(p.catalogDescription, /Цена по запросу/);
    assert.doesNotMatch(JSON.stringify(p), /DNS|IMPETUS|￥|¥|CNY|OEM|оригинал|in_stock/i);
    assert.equal(new Set(p.tags).size, p.tags.length);
  }
});

test('every imported product is discoverable and has its canonical static route without offers', () => {
  const index = JSON.parse(fs.readFileSync('dist/public/catalog-data/search-index.json'));
  const category = JSON.parse(fs.readFileSync('dist/public/catalog-data/category-indexes/engine-fuel.json'));
  const sitemap = fs.readFileSync('dist/public/sitemap-products.xml', 'utf8');
  for (const p of products) {
    assert.equal(index.filter(x => x.handle === p.handle).length, 1);
    assert.equal(category.filter(x => x.handle === p.handle).length, 1);
    const html = fs.readFileSync(`dist/public/catalog/${p.handle}/index.html`, 'utf8');
    assert(html.includes(p.sku), p.sku);
    assert(html.includes(p.imageUrl), p.sku);
    assert(html.includes('Цена по запросу'));
    assert(html.includes(`https://acahydraulic.kz/catalog/${p.handle}`));
    assert.doesNotMatch(html, /DNS|IMPETUS|￥|¥|CNY|"offers"\s*:|"price"\s*:/i);
    assert(sitemap.includes(`/catalog/${p.handle}`));
  }
});

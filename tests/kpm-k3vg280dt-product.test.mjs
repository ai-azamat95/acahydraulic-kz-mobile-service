import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import owners from '../shared/catalog-owner-products.json' with { type: 'json' };
import { catalogProductSeo, catalogProductSelection, catalogProductBrandLanding } from '../shared/catalog-product-seo.mjs';

const handle = 'kpm-k3vg280dt-tandem-hydraulic-pump';
const product = owners.find(item => item.handle === handle);
const dir = 'client/public/catalog-data';
const read = file => JSON.parse(fs.readFileSync(dir + '/' + file, 'utf8'));

test('K3VG280DT preserves the photographed base model without unsupported fitment or offer', () => {
  assert(product);
  assert.equal(product.brand, 'Kawasaki');
  assert.equal(product.model, 'K3VG280DT');
  assert.equal(product.sku, 'K3VG280DT');
  assert.equal(product.mpn, 'K3VG280DT');
  assert.match(product.catalogTitle, /KPM K3VG280DT/);
  assert.equal(product.available, false);
  for (const value of [product.minPriceKzt, product.maxPriceKzt, product.variants[0].priceKzt]) assert.equal(value, null);
  assert.equal(product.variants[0].available, false);
  for (const key of ['ownerInventory', 'ownerProduct', 'ownerSale', 'approvedSale', 'ownerCase']) assert.equal(product[key], undefined);
  assert.match(product.fitment, /не подтверждён перечень конкретных моделей машин/);
  assert.deepEqual(product.categories, ['hydraulic-pumps', 'piston-pumps']);
  const seo = catalogProductSeo(product);
  assert.match(seo.description, /промышленного оборудования с открытым контуром/);
  assert.match(seo.description, /Цена по запросу/);
  assert.match(catalogProductSelection(product), /полный код исполнения/);
  assert.match(catalogProductSelection(product), /направление вращения/);
  assert.match(catalogProductSelection(product), /не подтверждает взаимозаменяемость/);
  assert.equal(catalogProductBrandLanding(product).slug, 'kawasaki');
  assert.doesNotMatch(JSON.stringify(product) + seo.description, /KMP|K3V280DTH|EC700|ZX850|ZX870|385C|390D|Made in Japan|оригинальн|в наличии|гарантия/iu);
});

test('four original photographs are present, unchanged and unique', () => {
  const hashes = ['fddef1b34b7fe2b3deee8d3415c98db0bf89292e311967b79754004737ad31e3', '82a28d7d371686caa574d89e80acf33cc9ad5d54f26b5e6569e7cdbad1195165', '8342ab7bf5dd4535886a185d6cd91fd499a3b794fdd8f1a0ac6f9030616036b1', '7b4dc3b3a8b92d86909d12d56145b939315af2addad5ae46693bd4b6547d8264'];
  assert.equal(product.gallery.length, 4);
  assert.equal(product.imageUrl, product.gallery[0]);
  product.gallery.forEach((file, index) => {
    const bytes = fs.readFileSync('client/public' + file);
    assert.equal(bytes.subarray(0, 2).toString('hex'), 'ffd8');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hashes[index]);
  });
  assert.equal(new Set(hashes).size, 4);
});

test('public catalogue, category indexes and search contain one K3VG280DT card', () => {
  assert.equal(read('product-map.json')[handle], 1);
  for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json', 'category-indexes/hydraulic-pumps.json', 'category-indexes/piston-pumps.json']) {
    const rows = read(file);
    const matches = rows.filter(item => item.handle === handle);
    assert.equal(matches.length, 1, file);
    assert.equal(matches[0].minPriceKzt, null);
    assert.match(JSON.stringify(matches[0]), /KPM/);
  }
  const all = read('search-index.json');
  assert.equal(all.filter(item => /K3VG280DT/i.test(item.model || item.title)).length, 1);
  assert.equal(read('manifest.json').productCount, all.length);
});

test('static route has price on request, photos, selection, canonical and revision date', () => {
  const html = fs.readFileSync('dist/public/catalog/' + handle + '/index.html', 'utf8');
  const canonical = 'https://acahydraulic.kz/catalog/' + handle + '/';
  assert(html.includes('rel="canonical" href="' + canonical + '"'));
  assert.match(html, /Цена по запросу/);
  assert.match(html, /промышленного оборудования с открытым контуром/);
  assert(html.includes(catalogProductSelection(product)));
  for (const photo of product.gallery) assert(html.includes(photo));
  assert(html.includes(product.catalogQualityNote));
  assert.doesNotMatch(html, /Доступны оригинальные, OEM и проверенные аналоговые варианты/);
  assert.doesNotMatch(html, /data-static-product-schema|"@type":"Product"|"@type":"Offer"|InStock/);
  const sitemap = fs.readFileSync('dist/public/sitemap-products.xml', 'utf8');
  const entry = sitemap.match(/<url>[\s\S]*?<\/url>/g).find(block => block.includes(canonical));
  assert(entry.includes('<lastmod>2026-11-08</lastmod>'));
});

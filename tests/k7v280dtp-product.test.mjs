import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import ownerProducts from '../shared/catalog-owner-products.json' with { type: 'json' };
import { catalogProductSeo, catalogProductSelection, catalogProductBrandLanding } from '../shared/catalog-product-seo.mjs';

const root = new URL('../', import.meta.url);
const handle = 'k7v280dtp-hydraulic-pump';
const item = ownerProducts.find(product => product.handle === handle);
const readJson = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));

test('K7V280DTP has one inquiry-only card without invented OEM, stock or manufacturer claims', () => {
  assert(item);
  assert.equal(ownerProducts.filter(product => product.model === 'K7V280DTP').length, 1);
  assert.equal(item.id, 'ACA-K7V280DTP');
  assert.equal(item.sku, 'K7V280DTP');
  assert.equal(item.model, 'K7V280DTP');
  assert.equal(item.brand, null);
  assert.equal(item.mpn, undefined);
  assert.equal(catalogProductBrandLanding(item), undefined);
  assert.equal(item.category, 'piston-pumps');
  assert.deepEqual(item.categories, ['hydraulic-pumps', 'piston-pumps']);
  assert.equal(item.available, false);
  assert.equal(item.minPriceKzt, null);
  assert.equal(item.maxPriceKzt, null);
  assert.equal(item.variants.length, 1);
  assert.equal(item.variants[0].priceKzt, null);
  assert.equal(item.variants[0].available, false);
  for (const field of ['ownerInventory', 'ownerSale', 'ownerProduct', 'approvedSale']) assert.equal(item[field], undefined);
  assert.doesNotMatch(JSON.stringify(item), /566-8632|627-1302|627-1304|K7V280DTH|280RD|Made in|гарантия\s+\d|\d+\s*(?:бар|МПа|см³|cc\/rev)/i);
});

test('K7V280DTP keeps each CAT application conditional on exact serial and configuration', () => {
  for (const model of ['349', '352', '374', '395']) assert(item.fitment.includes(`CAT ${model}`));
  assert.match(item.fitment, /проверяем индивидуально по серийному номеру/);
  assert.match(item.fitment, /не подтверждает взаимозаменяемость/);
  assert.match(item.catalogImageCaption, /шильдик на фото отсутствует/);
  assert.match(item.catalogPriceNote, /Цена и наличие по запросу/);
  assert.match(item.catalogQualityNote, /Производителя, происхождение, полное исполнение/);
  const selection = catalogProductSelection(item);
  for (const detail of ['шильдика', 'серийный номер', 'вала', 'фланца', 'портов', 'регулятора', 'разъёмов']) assert(selection.includes(detail));
  assert.match(selection, /не подтверждает совместимость/);
  const seo = catalogProductSeo(item);
  assert.equal(seo.name, 'Гидравлический насос K7V280DTP');
  assert.match(seo.description, /исполнение, производитель и применяемость требуют проверки/);
  assert.match(seo.metaDescription, /цена по запросу/i);
  assert(seo.title.length <= 59);
  assert(seo.metaDescription.length <= 160);
});

test('K7V280DTP uses all four supplied original photographs without duplicates or substitutions', () => {
  const expectedHashes = [
    'd6250c9cb8873605ccf1155fe6bccf0bc85167f6bf6b326186970d5133922071',
    '0a57b0e2eb975821e2090329b62032f139e65257fbaecc734546339edb8967ae',
    'fb655cf2efb7a7eda95efe581935bdb087d008dca68e06cc57b6a57d62b9cf79',
    '7d15479e463953d6085390856d76fa96db8cff1a19077f5f679fd927abf2fb10',
  ];
  assert.equal(item.gallery.length, 4);
  assert.equal(item.imageUrl, item.gallery[0]);
  const actualHashes = item.gallery.map(image => {
    assert(image.startsWith('/catalog-assets/k7v280dtp/'));
    const data = fs.readFileSync(new URL(`client/public${image}`, root));
    assert.equal(data.subarray(0, 3).toString('hex'), 'ffd8ff');
    assert(data.length > 100_000 && data.length < 400_000);
    return createHash('sha256').update(data).digest('hex');
  });
  assert.deepEqual(actualHashes, expectedHashes);
  assert.equal(new Set(actualHashes).size, 4);
});

test('K7V280DTP occurs once in the committed product, search and category snapshots', () => {
  const map = readJson('client/public/catalog-data/product-map.json');
  assert.equal(map[handle], 1);
  for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json', 'category-indexes/hydraulic-pumps.json', 'category-indexes/piston-pumps.json']) {
    const rows = readJson(`client/public/catalog-data/${file}`);
    const matches = rows.filter(product => product.handle === handle);
    assert.equal(matches.length, 1, file);
    assert.equal(matches[0].minPriceKzt, null);
    assert.deepEqual(matches[0].gallery, item.gallery);
    assert.equal(rows.filter(product => product.model === 'K7V280DTP').length, 1, file);
  }
});

const route = new URL(`dist/public/catalog/${handle}/index.html`, root);
test('generated K7V280DTP page contains the gallery and caveats with no priced Product offer', { skip: !fs.existsSync(new URL('dist/public/index.html', root)) }, () => {
  assert(fs.existsSync(route), 'Built catalogue must contain the K7V280DTP route');
  const html = fs.readFileSync(route, 'utf8');
  assert.equal(html.match(/<h1[\s>]/g)?.length, 1);
  assert.match(html, /Гидравлический насос K7V280DTP/);
  assert.match(html, /Цена по запросу/);
  assert.match(html, /не подтверждает взаимозаменяемость/);
  assert.match(html, /шильдик на фото отсутствует/);
  assert.match(html, /data-product-gallery/);
  for (const image of item.gallery) assert(html.includes(image));
  assert.doesNotMatch(html, /data-static-product-schema/);
  assert(html.includes(item.catalogQualityNote));
  assert.doesNotMatch(html, /Доступны оригинальные, OEM/);
  assert.doesNotMatch(html, /"@type":"Offer"|"@type":"AggregateOffer"|>В наличии</);
  const canonical = `https://acahydraulic.kz/catalog/${handle}/`;
  assert(html.includes(`rel="canonical" href="${canonical}"`));
  const sitemap = fs.readFileSync(new URL('dist/public/sitemap-products.xml', root), 'utf8');
  assert.equal(sitemap.split(canonical).length - 1, 1);
});

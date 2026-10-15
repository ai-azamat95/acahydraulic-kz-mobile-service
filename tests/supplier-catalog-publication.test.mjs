import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import products from '../shared/catalog-supplier-products.json' with { type: 'json' };
import { catalogProductSeo, catalogProductSelection } from '../shared/catalog-product-seo.mjs';

const publicDir = path.resolve('dist/public');
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

test('reviewed supplement retains identities, manufacturer distinction and honest commercial terms', () => {
  assert.equal(products.length, 1606);
  assert.equal(products.filter(product => product.category === 'construction-machinery').length, 49);
  assert.equal(products.filter(product => product.category === 'attachments').length, 10);
  assert.equal(new Set(products.map(product => product.id)).size, products.length);
  assert.equal(new Set(products.map(product => product.handle)).size, products.length);
  assert.equal(new Set(products.map(product => catalogProductSeo(product).description)).size, products.length);
  assert.doesNotMatch(JSON.stringify(products), /semerci|sif\.com|sourceUrl|sourcePrice|\+90\s|дилер|в наличии|гарантия\s+\d/i);
  for (const product of products) {
    assert.equal(product.available, false, product.handle);
    assert.equal(product.minPriceKzt, null, product.handle);
    assert.equal(product.maxPriceKzt, null, product.handle);
    const reference = product.category === 'construction-machinery' ? product.sku.replace(/ PLATFORM$/, '') : product.sku;
    assert.ok(reference && product.title.includes(reference) || product.category === 'attachments', product.handle);
    assert.ok(catalogProductSelection(product).length > 100, product.handle);
    assert.ok(!product.brand || product.title.includes(product.brand), product.handle);
    if (product.applicationBrand === 'Caterpillar') assert.notEqual(product.brand, 'Caterpillar', product.handle);
    for (const variant of product.variants) {
      assert.equal(variant.available, false, product.handle);
      assert.equal(variant.priceKzt, null, product.handle);
    }
    assert.deepEqual(product.gallery, product.imageUrl ? [product.imageUrl] : [], product.handle);
    for (const image of product.gallery) {
      assert.ok(image.startsWith('/catalog-assets/'), product.handle);
      assert.ok(fs.statSync(path.join('client/public', image)).size > 0, product.handle);
      assert.ok(product.catalogImageCaption, product.handle);
    }
  }
  assert.ok(!products.some(product => ['5183854', '85826303', '113-1141'].includes(product.sku)));
});

test('every supplement page is discoverable, quote-only and linked to the exact inquiry', {
  skip: !fs.existsSync(path.join(publicDir, 'catalog', products[0].handle, 'index.html')),
}, () => {
  const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap-products.xml'), 'utf8');
  for (const product of products) {
    const html = fs.readFileSync(path.join(publicDir, 'catalog', product.handle, 'index.html'), 'utf8');
    const canonical = `https://acahydraulic.kz/catalog/${product.handle}/`;
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), product.handle);
    assert.ok(html.includes(`<h1>${escapeHtml(product.title)}</h1>`), product.handle);
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`), product.handle);
    assert.doesNotMatch(html, /data-static-product-schema/, product.handle);
    assert.match(html, /Цена по запросу/, product.handle);
    const inquiry = html.match(/href="(https:\/\/wa\.me\/77714177925\?text=[^"]+)"/)?.[1];
    assert.ok(inquiry, product.handle);
    assert.ok(new URL(inquiry).searchParams.get('text').includes(canonical), product.handle);
    for (const category of product.categories) assert.ok(html.includes(`/catalog/category/${category}/`), product.handle);
  }
  for (const [category, label] of [['construction-machinery', 'Спецтехника JCB'], ['attachments', 'Навесное оборудование JCB']]) {
    const html = fs.readFileSync(path.join(publicDir, 'catalog/category', category, 'index.html'), 'utf8');
    assert.ok(html.includes(label), category);
    assert.ok(html.includes('data-category-selection'), category);
  }
  const brand = fs.readFileSync(path.join(publicDir, 'catalog/brand/jcb/index.html'), 'utf8');
  assert.ok(brand.includes('Техника, навесное оборудование и запчасти JCB'));
});

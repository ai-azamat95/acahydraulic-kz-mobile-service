import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { applyOwnerCatalogProducts, ownerCatalogProductByHandle } from '../scripts/catalog-owner-products.mjs';
import { catalogProductCategories, catalogProductSeo } from '../shared/catalog-product-seo.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const handle = 'kawasaki-kpm-k7v63dtp1x9r-9n0e-2av-original-hydraulic-pump';
const product = ownerCatalogProductByHandle(handle);
const assetPrefix = '/catalog-assets/kawasaki-k7v63dtp-9n0e-2av/';

test('Kawasaki K7V63 card records exact original-unit evidence without inventing stock or fitment', () => {
  assert(product);
  assert.equal(product.id, 'ACA-KAWASAKI-K7V63DTP-29100601-4585');
  assert.equal(product.brand, 'Kawasaki');
  assert.equal(product.model, 'K7V63DTP1X9R-9N0E-2AV');
  assert.equal(product.sku, '29100601-4585');
  assert.equal(product.mpn, '29100601-4585');
  assert.deepEqual(product.categories, ['hydraulic-pumps', 'piston-pumps']);
  assert.deepEqual(
    catalogProductCategories(product).map(category => category.id).sort(),
    ['hydraulic-pumps', 'piston-pumps'],
  );

  const searchable = JSON.stringify(product);
  for (const value of ['K7V63DTP1X9R-9N0E-2AV', '29100601-4585', '18628158', 'Made in Japan']) {
    assert(searchable.includes(value), value);
  }
  assert.match(product.catalogTitle, /Оригинальный гидронасос Kawasaki KPM/);
  assert.match(product.ownerEvidence.facts.join(' '), /Kawasaki Heavy Industries/);
  assert.match(product.ownerEvidence.facts.join(' '), /серийный номер совпадает/i);
  assert.match(product.fitment, /Модель техники.*не указана/i);
  assert.match(product.catalogSelection, /полный код K7V63DTP1X9R-9N0E-2AV/);
  assert.doesNotMatch(searchable, /CX130|CX160|SH130|SH160|CLG856|LiuGong/i);

  assert.equal(product.available, false);
  assert.equal(product.minPriceKzt, null);
  assert.equal(product.maxPriceKzt, null);
  assert.equal(product.ownerInventory, undefined);
  assert.equal(product.ownerProduct, undefined);
  assert.equal(product.ownerSale, undefined);
  assert.equal(product.approvedSale, undefined);
  assert.equal(product.variants.length, 1);
  assert.equal(product.variants[0].available, false);
  assert.equal(product.variants[0].priceKzt, null);
  assert(product.variants[0].options.includes('Цена и наличие по запросу'));
});

test('Kawasaki K7V63 card uses four distinct real WebP images', () => {
  assert.equal(product.gallery.length, 4);
  assert.equal(product.imageUrl, product.gallery[0]);
  assert(product.gallery.every(image => image.startsWith(assetPrefix)));

  const digests = product.gallery.map(image => {
    const file = path.join(root, 'client/public', image);
    assert(fs.existsSync(file), image);
    const bytes = fs.readFileSync(file);
    assert(bytes.length > 40_000, image);
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    return createHash('sha256').update(bytes).digest('hex');
  });
  assert.equal(new Set(digests).size, product.gallery.length);
});

test('Kawasaki K7V63 SEO preserves the full execution and price-on-request state', () => {
  const seo = catalogProductSeo(product);
  assert.match(seo.name, /K7V63DTP1X9R-9N0E-2AV/);
  assert.match(seo.name, /29100601-4585/);
  assert.match(seo.description, /Цена по запросу/);
  assert.match(seo.description, /сверяем|совместим/i);
  assert(seo.title.length <= 70, seo.title);
  assert(seo.metaDescription.length <= 180, seo.metaDescription);
});

test('prepared catalog and static route publish the Kawasaki card once with no invented offer', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-kawasaki-k7v63-'));
  try {
    const catalogDir = path.join(dir, 'dist/public/catalog-data');
    fs.mkdirSync(catalogDir, { recursive: true });
    const write = (file, value) => fs.writeFileSync(path.join(catalogDir, file), JSON.stringify(value));
    write('manifest.json', { productCount: 0, pageSize: 250, chunkCount: 1, importedAt: '2026-11-09T00:00:00Z' });
    write('product-map.json', {});
    write('category-summary.json', {});
    for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) write(file, []);
    applyOwnerCatalogProducts(catalogDir);

    const index = JSON.parse(fs.readFileSync(path.join(catalogDir, 'search-index.json'), 'utf8'));
    assert.equal(index.filter(item => item.handle === handle).length, 1);
    for (const query of ['K7V63DTP1X9R-9N0E-2AV', '29100601-4585', '291006014585', '18628158']) {
      assert(JSON.stringify(index.find(item => item.handle === handle)).includes(query), query);
    }

    const publicDir = path.join(dir, 'dist/public');
    fs.writeFileSync(path.join(publicDir, 'index.html'), '<html><head><title>ACA</title></head><body><div id="root"></div></body></html>');
    const run = spawnSync(process.execPath, [path.join(root, 'scripts/create-catalog-route-copies.mjs')], {
      cwd: dir,
      encoding: 'utf8',
      timeout: 20_000,
    });
    assert.equal(run.status, 0, run.stderr);

    const html = fs.readFileSync(path.join(publicDir, 'catalog', handle, 'index.html'), 'utf8');
    assert.match(html, /Оригинальный гидронасос Kawasaki KPM/);
    assert.match(html, /K7V63DTP1X9R-9N0E-2AV/);
    assert.match(html, /29100601-4585/);
    assert.match(html, /18628158/);
    assert.match(html, /Цена по запросу/);
    assert.match(html, /data-product-gallery/);
    assert.match(html, new RegExp(`https://acahydraulic\\.kz/catalog/${handle}/`));
    assert.doesNotMatch(html, /data-static-product-schema/);
    assert.doesNotMatch(html, /InStock|"price"/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

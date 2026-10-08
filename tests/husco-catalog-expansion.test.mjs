import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { applyOwnerCatalogProducts, ownerCatalogProductByHandle } from '../scripts/catalog-owner-products.mjs';
import { catalogProductCategories, catalogProductSeo } from '../shared/catalog-product-seo.mjs';
import landingConfig from '../shared/catalog-landings.json' with { type: 'json' };
import seoContent from '../shared/catalog-seo-content.json' with { type: 'json' };

const root = fileURLToPath(new URL('../', import.meta.url));
const requestedProducts = [
  {
    handle: 'husco-jcb-332-f8152-front-hydraulic-control-valve',
    refs: ['332/F8152', '332F8152', '3CX', '4CX'],
    assetDirectory: 'husco-332-f8152',
    imageCount: 5,
  },
  {
    handle: 'husco-hidromek-544s0555-f25-21125-f25-21120-control-valve',
    refs: ['544S0555', 'F25/21125', 'F25/21120', 'HMK 102B'],
    assetDirectory: 'husco-544s0555',
    imageCount: 6,
  },
  {
    handle: 'husco-jcb-332-y3028-rear-hydraulic-control-valve-3dx',
    refs: ['332/Y3028', '332Y3028', '3DX', 'без гидромолота'],
    assetDirectory: 'husco-332-y3028',
    imageCount: 5,
  },
  {
    handle: 'husco-jcb-334-f6978-128-g5234-hydraulic-control-valve',
    refs: ['334/F6978', '334F6978', '128/G5234', '128G5234'],
    assetDirectory: 'husco-334-f6978',
    imageCount: 6,
  },
  {
    handle: 'husco-jcb-332-f6665-25-222930-rear-hydraulic-control-valve',
    refs: ['332/F6665', '332F6665', '25/222930', '25222930'],
    assetDirectory: 'husco-332-f6665',
    imageCount: 5,
  },
  {
    handle: 'husco-jcb-25-624300-25-615600-rear-hydraulic-control-valve',
    refs: ['25/624300', '25624300', '25/615600', '25615600'],
    assetDirectory: 'husco-25-624300',
    imageCount: 5,
  },
  {
    handle: 'husco-jcb-25-222579-25-221129-25-624000-front-control-valve',
    refs: ['25/222579', '25222579', '25/221129', '25/624000'],
    assetDirectory: 'husco-25-222579',
    imageCount: 7,
  },
];

test('seven HUSCO control-valve listings are searchable without invented commercial claims', () => {
  for (const expected of requestedProducts) {
    const product = ownerCatalogProductByHandle(expected.handle);
    assert(product, expected.handle);
    assert.equal(product.brand, 'HUSCO');
    assert.equal(product.available, false);
    assert.equal(product.minPriceKzt, null);
    assert.equal(product.maxPriceKzt, null);
    assert.equal(product.imageUrl, `/catalog-assets/${expected.assetDirectory}/01.webp`);
    assert.equal(product.gallery.length, expected.imageCount);
    assert.equal(product.gallery[0], product.imageUrl);
    for (const image of product.gallery) {
      assert.match(image, new RegExp(`^/catalog-assets/${expected.assetDirectory}/\\d{2}\\.webp$`));
      const bytes = fs.readFileSync(path.join(root, 'client/public', image));
      assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    }
    assert.equal(product.ownerProduct, undefined);
    assert.equal(product.ownerSale, undefined);
    assert.equal(product.approvedSale, undefined);
    assert.deepEqual(product.categories, ['main-control-valves', 'control-valves']);
    assert.deepEqual(catalogProductCategories(product).map(category => category.id).sort(), ['control-valves', 'main-control-valves']);
    assert.match(catalogProductSeo(product).description, /Цена по запросу/);
    assert.match(product.fitment, /серийн|шильдик/i);
    assert.equal(product.variants.length, 1);
    assert.equal(product.variants[0].available, false);
    assert.equal(product.variants[0].priceKzt, null);
    const searchable = JSON.stringify(product).toLowerCase();
    for (const reference of expected.refs) assert(searchable.includes(reference.toLowerCase()), `${expected.handle}: ${reference}`);
    assert.doesNotMatch(searchable, /jcbpro|srsltid|наличи[ея]\s*[:—-]?\s*(?:да|есть)|гарантия\s+\d/i);
  }
});

test('HUSCO category copy supports exact-number searches and compatibility qualification', () => {
  const main = landingConfig.categories.find(category => category.id === 'main-control-valves');
  const valves = landingConfig.categories.find(category => category.id === 'control-valves');
  const husco = landingConfig.brands.find(brand => brand.slug === 'husco');
  assert(main && valves && husco);
  assert.match(`${main.title} ${main.description} ${main.intro}`, /HUSCO/);
  assert.match(main.intro, /шильдик/);
  assert.match(main.intro, /серийн(?:ый|ому) номер/);
  assert.match(valves.intro, /фотографии шильдика/);
  assert(seoContent['main-control-valves'].queries.includes('гидрораспределитель HUSCO'));
  assert.match(seoContent['main-control-valves'].selection, /комплектацию/);
  assert.match(fs.readFileSync(path.join(root, 'client/src/components/catalog/ProductResults.tsx'), 'utf8'), /Фото по запросу/);
  assert.match(fs.readFileSync(path.join(root, 'client/src/pages/CatalogProduct.tsx'), 'utf8'), /Фото товара по запросу/);
});

test('prepared catalogue and static routes publish each requested product once with price on request', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-husco-expansion-'));
  try {
    const catalogDir = path.join(dir, 'dist/public/catalog-data');
    fs.mkdirSync(catalogDir, { recursive: true });
    const write = (file, value) => fs.writeFileSync(path.join(catalogDir, file), JSON.stringify(value));
    write('manifest.json', { productCount: 0, pageSize: 250, chunkCount: 1, importedAt: '2026-10-03T00:00:00Z' });
    write('product-map.json', {});
    write('category-summary.json', {});
    for (const file of ['products-001.json', 'search-index-001.json', 'search-index.json']) write(file, []);
    applyOwnerCatalogProducts(catalogDir);

    const index = JSON.parse(fs.readFileSync(path.join(catalogDir, 'search-index.json'), 'utf8'));
    for (const expected of requestedProducts) {
      assert.equal(index.filter(product => product.handle === expected.handle).length, 1);
    }

    fs.writeFileSync(path.join(dir, 'dist/public/index.html'), '<html><head><title>ACA</title></head><body><div id="root"></div></body></html>');
    const run = spawnSync(process.execPath, [path.join(root, 'scripts/create-catalog-route-copies.mjs')], {
      cwd: dir,
      encoding: 'utf8',
      timeout: 20_000,
    });
    assert.equal(run.status, 0, run.stderr);
    const sitemap = fs.readFileSync(path.join(dir, 'dist/public/sitemap-products.xml'), 'utf8');
    for (const expected of requestedProducts) {
      const html = fs.readFileSync(path.join(dir, 'dist/public/catalog', expected.handle, 'index.html'), 'utf8');
      assert.match(html, /Цена по запросу/);
      assert.match(html, /Поставка под заказ/);
      assert.doesNotMatch(html, /jcbpro|srsltid/i);
      assert.doesNotMatch(html, /data-static-product-schema/);
      for (const image of Array.from({ length: expected.imageCount }, (_, index) =>
        `https://acahydraulic.kz/catalog-assets/${expected.assetDirectory}/${String(index + 1).padStart(2, '0')}.webp`
      )) assert(html.includes(image), `missing crawlable HUSCO image: ${image}`);
      assert(sitemap.includes(`/catalog/${expected.handle}/`));
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

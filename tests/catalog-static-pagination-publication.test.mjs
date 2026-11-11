import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { CATALOG_PAGE_SIZE, catalogPagePath } from '../shared/catalog-pagination.mjs';
import { extractBrandSlugs, extractModelLandings, landingSearchText } from '../scripts/lib/catalog-landings.mjs';

const root = 'dist/public';
const manifest = JSON.parse(fs.readFileSync(`${root}/catalog-data/manifest.json`, 'utf8'));
const index = JSON.parse(fs.readFileSync(`${root}/catalog-data/landing-pages.json`, 'utf8'));
const chunks = Array.from({ length: manifest.chunkCount }, (_, i) => JSON.parse(fs.readFileSync(`${root}/catalog-data/search-index-${String(i + 1).padStart(3, '0')}.json`, 'utf8'))).flat();
const products = manifest.indexFile && fs.existsSync(`${root}/catalog-data/${manifest.indexFile}`)
  ? JSON.parse(fs.readFileSync(`${root}/catalog-data/${manifest.indexFile}`, 'utf8')) : chunks;
const membership = new Map(products.map(product => [product.id, {
  category: product.categories || [product.category],
  brand: extractBrandSlugs(landingSearchText(product)),
  model: extractModelLandings(landingSearchText(product)).map(model => model.slug),
}]));

test('every collection is complete and nonoverlapping in HTML without JavaScript', () => {
  assert.deepEqual(new Set(products.map(x => x.id)), new Set(chunks.map(x => x.id)));
  const collections = [
    ...index.categories.map(x => ({ type: 'category', slug: x.id })),
    ...index.brands.map(x => ({ type: 'brand', slug: x.slug })),
    ...index.models.map(x => ({ type: 'model', slug: x.slug })),
    { type: 'all', slug: '' },
  ];
  const sitemap = fs.readFileSync(`${root}/sitemap-catalog-landings.xml`, 'utf8');
  for (const { type, slug } of collections) {
    const matching = products.filter(product => type === 'all' || membership.get(product.id)[type].includes(slug));
    const categoryFile = type === 'category' && manifest.categoryIndexFiles?.[slug];
    const expected = categoryFile ? JSON.parse(fs.readFileSync(`${root}/catalog-data/${categoryFile}`, 'utf8')) : matching;
    assert.deepEqual(new Set(expected.map(x => x.id)), new Set(matching.map(x => x.id)), slug);
    const base = type === 'all' ? '/catalog/' : `/catalog/${type}/${slug}/`;
    const total = Math.max(1, Math.ceil(expected.length / CATALOG_PAGE_SIZE));
    const seen = [];
    for (let page = 1; page <= total; page++) {
      const route = catalogPagePath(base, page);
      const html = fs.readFileSync(`${root}${route}index.html`, 'utf8');
      const ids = [...html.matchAll(/data-static-product-id="([^"]+)"/g)].map(x => x[1]);
      assert.deepEqual(ids, expected.slice((page - 1) * CATALOG_PAGE_SIZE, page * CATALOG_PAGE_SIZE).map(x => x.id), route);
      assert(html.includes(`rel="canonical" href="https://acahydraulic.kz${route}"`), route);
      assert(sitemap.includes(`<loc>https://acahydraulic.kz${route}</loc>`), route);
      if (page < total) assert(html.includes(`rel="next" href="${catalogPagePath(base, page + 1)}"`), route);
      if (page > 1) assert(html.includes(`rel="prev" href="${catalogPagePath(base, page - 1)}"`), route);
      const schema = JSON.parse(html.match(/<script[^>]*data-static-collection-schema[^>]*>([\s\S]*?)<\/script>/)[1]);
      assert.equal(schema.mainEntity.itemListElement.length, ids.length, route);
      assert.equal(schema.mainEntity.itemListElement[0]?.position, ids.length ? (page - 1) * CATALOG_PAGE_SIZE + 1 : undefined);
      seen.push(...ids);
    }
    assert.equal(new Set(seen).size, expected.length, base);
    assert.deepEqual(seen, expected.map(x => x.id), base);
    for (const invalid of ['0', '-1', 'abc', '02', String(total + 1)]) assert(!fs.existsSync(`${root}${base}page/${invalid}/index.html`), base + invalid);
  }
});

test('the catalogue chooser is preserved and leads to the full paginated inventory', () => {
  const html = fs.readFileSync(`${root}/catalog/index.html`, 'utf8');
  assert.equal((html.match(/data-all-catalog-products/g) || []).length, 1);
  assert(html.includes('href="/catalog/page/1/"'));
  assert(html.includes('data-catalog-directory'));
});

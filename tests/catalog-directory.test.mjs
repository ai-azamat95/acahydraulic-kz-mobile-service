import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { groupCatalogModels } from '../shared/catalog-directory.mjs';
import { catalogCategoryLandings, extractBrandSlugs, extractModelLandings, landingSearchText } from '../scripts/lib/catalog-landings.mjs';

const dir = 'dist/public';
const published = JSON.parse(fs.readFileSync(`${dir}/catalog-data/landing-pages.json`, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(`${dir}/catalog-data/manifest.json`, 'utf8'));
const products = Array.from({ length: manifest.chunkCount }, (_, i) => JSON.parse(fs.readFileSync(`${dir}/catalog-data/search-index-${String(i + 1).padStart(3, '0')}.json`, 'utf8'))).flat();
const memberships = products.map(product => ({
  categories: product.categories || [product.category],
  brands: extractBrandSlugs(landingSearchText(product)),
  models: extractModelLandings(landingSearchText(product)).map(model => model.slug),
}));

test('catalogue root links to every published brand and model, without adding pages', () => {
  const html = fs.readFileSync(`${dir}/catalog/index.html`, 'utf8');
  const directory = html.match(/<section data-catalog-directory>[\s\S]*?<\/section>/)?.[0];
  assert.ok(directory);
  assert.equal((html.match(/<section data-catalog-directory>/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('rel="canonical" href="https://acahydraulic.kz/catalog/"'));
  const expected = [...published.brands.map(item => `/catalog/brand/${item.slug}/`), ...published.models.map(item => `/catalog/model/${item.slug}/`)].sort();
  const actual = [...directory.matchAll(/href="([^"]+)"/g)].map(match => match[1]).sort();
  assert.deepEqual(actual, expected);
  for (const href of actual) assert.ok(fs.existsSync(`${dir}${href}index.html`), href);
  assert.ok(published.models.every(model => model.count >= 8));
  for (const slug of ['sk140-8', 'd905', 'pc200-8m0']) assert.ok(actual.includes(`/catalog/model/${slug}/`), `previously orphaned ${slug}`);
});

test('landing related links have shared products and never link to themselves', () => {
  const pages = [
    ...published.categories.map(page => ({ type: 'category', key: 'categories', slug: page.id })),
    ...published.brands.map(page => ({ type: 'brand', key: 'brands', slug: page.slug })),
    ...published.models.map(page => ({ type: 'model', key: 'models', slug: page.slug })),
  ];
  for (const page of pages) {
    const html = fs.readFileSync(`${dir}/catalog/${page.type}/${page.slug}/index.html`, 'utf8');
    const related = html.match(/<section><h2>Другие разделы каталога<\/h2>[\s\S]*?<\/section>/)?.[0];
    assert.ok(related);
    const matches = memberships.filter(product => product[page.key].includes(page.slug));
    for (const [, type, slug] of related.matchAll(/href="\/catalog\/(category|brand|model)\/([^/]+)\/"/g)) {
      const key = type === 'category' ? 'categories' : `${type}s`;
      assert.ok(type !== page.type || slug !== page.slug, `self link ${type}/${slug}`);
      assert.ok(matches.some(product => product[key].includes(slug)), `unrelated ${page.type}/${page.slug} -> ${type}/${slug}`);
    }
  }
  assert.equal(published.categories.length, catalogCategoryLandings.length);
});

test('directory grouping retains all models including brands without a brand landing', () => {
  const groups = groupCatalogModels(published.models);
  assert.equal(groups.reduce((sum, group) => sum + group.models.length, 0), published.models.length);
  assert.ok(groups.some(group => group.brand === 'Kubota' && group.models.some(model => model.slug === 'd905')));
  assert.deepEqual(groupCatalogModels([{ brand: 'Empty', label: 'X', slug: 'x', count: 0 }]), []);
});

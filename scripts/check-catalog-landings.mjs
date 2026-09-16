import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { catalogCategoryLandings } from './lib/catalog-landings.mjs';

const publicDir = path.resolve('dist/public');
const landingIndex = JSON.parse(fs.readFileSync(path.join(publicDir, 'catalog-data', 'landing-pages.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap-catalog-landings.xml'), 'utf8');
const robots = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf8');
const pages = [
  ...landingIndex.categories.map((page) => ({ type: 'category', slug: page.id, count: page.count })),
  ...landingIndex.brands.map((page) => ({ type: 'brand', slug: page.slug, count: page.count })),
  ...landingIndex.models.map((page) => ({ type: 'model', slug: page.slug, count: page.count })),
];

assert.equal(landingIndex.categories.length, 19, 'all 19 catalogue categories need landing pages');
assert.deepEqual(landingIndex.categories.map((item) => item.id), catalogCategoryLandings.map((item) => item.id), 'category landing list must match UI categories');
assert(landingIndex.brands.length >= 10, 'brand landing coverage is unexpectedly small');
assert(landingIndex.models.length >= 20, 'model landing coverage is unexpectedly small');
assert(landingIndex.models.every((item) => item.count >= 8), 'thin model pages must not be indexed');
assert(robots.includes('Sitemap: https://acahydraulic.kz/sitemap-catalog-landings.xml'), 'robots.txt must announce the landing sitemap');

const descriptions = new Set();
for (const page of pages) {
  assert(page.count > 0, `${page.type}/${page.slug} must not be empty`);
  const route = `/catalog/${page.type}/${page.slug}/`;
  assert(sitemap.includes(`<loc>https://acahydraulic.kz${route}</loc>`), `${route} is missing from sitemap`);
  const file = path.join(publicDir, route, 'index.html');
  assert(fs.existsSync(file), `${route} static HTML is missing`);
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes(`rel="canonical" href="https://acahydraulic.kz${route}"`), `${route} needs a self canonical`);
  assert(/<h1>[^<]{4,}<\/h1>/.test(html), `${route} needs a visible H1`);
  assert(/<a href="\/catalog\/[^/]+\/">/.test(html), `${route} needs direct product links`);
  const productLinkCount = (html.match(/<a href="\/catalog\/(?!category\/|brand\/|model\/)[^/]+\/">/g) || []).length;
  assert(productLinkCount >= page.count, `${route} must link directly to every matching product`);
  assert(html.includes('data-static-collection-schema'), `${route} needs CollectionPage schema`);
  assert(!/sinocmp/i.test(html), `${route} exposes supplier identity`);
  const description = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i)?.[1];
  assert(description && description.length >= 90, `${route} needs a useful meta description`);
  assert(!descriptions.has(description), `${route} duplicates another meta description`);
  descriptions.add(description);
}

const sitemapUrlCount = (sitemap.match(/<loc>/g) || []).length;
assert.equal(sitemapUrlCount, pages.length, 'landing sitemap URL count must match generated pages');
console.log(JSON.stringify({ passed: true, categories: landingIndex.categories.length, brands: landingIndex.brands.length, models: landingIndex.models.length, sitemapUrls: sitemapUrlCount }, null, 2));

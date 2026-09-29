import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const directory = JSON.parse(fs.readFileSync('shared/service-directory.json', 'utf8'));
const showcase = JSON.parse(fs.readFileSync('shared/service-showcase.json', 'utf8'));
const html = fs.readFileSync('dist/public/services/index.html', 'utf8');

test('service directory links resolve to published pages and real application routes', () => {
  const routes = fs.readFileSync('client/src/App.tsx', 'utf8');
  const sitemap = fs.readFileSync('dist/public/sitemap.xml', 'utf8');
  for (const category of directory.categories) {
    const items = category.subcategories.length ? category.subcategories : [{ link: category.link }];
    for (const { link } of items) {
      if (!link || link === '#') continue;
      assert.ok(link.startsWith('/services/') && link.endsWith('/'), link);
      assert.ok(routes.includes('"' + link.slice(0, -1) + '"'), link);
      assert.ok(sitemap.includes('<loc>https://acahydraulic.kz' + link + '</loc>'), link);
      const target = fs.readFileSync('dist/public' + link + 'index.html', 'utf8');
      assert.ok(target.includes('href="https://acahydraulic.kz' + link + '"'), link);
      assert.doesNotMatch(target, /content="noindex/);
      assert.ok(html.includes('href="' + link + '"'), link);
    }
  }
});

test('HTML service directory exposes every redesigned service entry without JavaScript', () => {
  assert.ok(html.includes('Ремонт гидравлики и спецтехники в Астане — услуги ACA Hydraulic'));
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  for (const [slug, service] of Object.entries(showcase)) {
    assert.ok(html.includes(`href="/services/${slug}/"`), slug);
    assert.ok(html.includes(service.summary), slug);
  }
  assert.doesNotMatch(html, /href="#"|\/services\/dump-truck-repair|\/services\/hydraulic-distributors/);
});

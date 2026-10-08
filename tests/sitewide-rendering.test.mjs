import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import directory from '../shared/site-directory.json' with { type: 'json' };

const read = route => fs.readFileSync(`dist/public/${route ? route + '/' : ''}index.html`, 'utf8');
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

test('commercial pages expose actual service, region and brand content before JavaScript', () => {
  for (const [route, text] of [
    ['', 'Гидрораспределители'],
    ['services', 'Гидравлические узлы'],
    ['brands/komatsu', 'Komatsu PC200'],
    ['regions/karaganda', 'Угольные разрезы'],
    ['about', 'Наши'],
    ['contacts', 'Место работы и самовывоза'],
    ['corporate', 'Документы для бухгалтерии'],
    ['blog/remont-gidravliki-liebherr-r950', 'Что проверять'],
  ]) {
    const html = read(route);
    assert.ok(html.toLocaleLowerCase('ru-RU').includes(text.toLocaleLowerCase('ru-RU')), route);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, route);
    assert.ok(html.includes('/sitemap/'), route);
  }
});

test('site directory links to every commercial, regional and editorial sitemap URL', () => {
  const links = new Set(directory.flatMap(section => section.links.map(link => link.href)));
  const html = read('sitemap');
  for (const file of ['sitemap.xml', 'sitemap-cases.xml', 'sitemap-catalog-landings.xml']) {
    const sitemap = fs.readFileSync(`dist/public/${file}`, 'utf8');
    for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const route = new URL(url).pathname;
      if (route === '/' || route === '/sitemap/') continue;
      assert.ok(links.has(route), route);
      assert.ok(html.includes(`href="${route}"`), route);
    }
  }
});

test('breadcrumbs contain unique canonical URLs with sequential positions', () => {
  for (const route of ['about', 'regions/karaganda', 'brands/komatsu', 'contacts', 'sitemap']) {
    const trail = schemas(read(route)).find(schema => schema['@type'] === 'BreadcrumbList');
    assert.ok(trail, route);
    const items = trail.itemListElement;
    assert.equal(items[0].item, 'https://acahydraulic.kz/');
    assert.equal(new Set(items.map(item => item.item)).size, items.length, route);
    items.forEach((item, index) => {
      assert.equal(item.position, index + 1);
      assert.ok(item.item.endsWith('/'), item.item);
    });
  }
});

test('public pages do not amplify unverified business totals and credit promises', () => {
  assert.doesNotMatch(read('about'), /1500\+/);
  assert.doesNotMatch(read('corporate'), /отсрочка платежа до 30 дней|Аккредитованы на всех/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const content = JSON.parse(fs.readFileSync('shared/service-content.json', 'utf8'));

test('priority services publish the same useful content and metadata without JavaScript', () => {
  for (const [route, page] of Object.entries(content)) {
    const html = fs.readFileSync('dist/public' + route + '/index.html', 'utf8');
    assert.ok(html.includes('<title data-rh="true">' + page.title + '</title>'), route);
    for (const section of page.sections) {
      assert.ok(html.includes(section.title), route);
      assert.ok(html.includes(section.text), route);
    }
    for (const faq of page.faq) {
      assert.ok(html.includes(faq.question), route);
      assert.ok(html.includes(faq.answer), route);
    }
    for (const link of page.related) {
      assert.ok(fs.existsSync('dist/public' + link.href + 'index.html'), link.href);
      assert.ok(html.includes('href="' + link.href + '"'), link.href);
    }
    assert.doesNotMatch(html, /Диагностика бесплатно|Гарантия 12 месяцев/);
  }
});

test('specialized mining and piling pages have distinct copy and self canonicals', () => {
  const pages = [
    ['mining-loader-repair', 'MiningLoaderRepair.tsx', 'шахтных погрузчиков'],
    ['piledriver-repair', 'PiledriverRepair.tsx', 'сваебойных установок'],
    ['mining-truck-repair', 'MiningTruckRepair.tsx', 'карьерных самосвалов'],
  ];

  const titles = new Set();
  const descriptions = new Set();
  for (const [slug, file, subject] of pages) {
    const route = `/services/${slug}`;
    const page = content[route];
    const source = fs.readFileSync(`client/src/pages/services/${file}`, 'utf8');
    const html = fs.readFileSync(`dist/public${route}/index.html`, 'utf8');

    assert.ok(page, route);
    assert.match(page.title.toLowerCase(), new RegExp(subject));
    assert.match(source.toLowerCase(), new RegExp(subject));
    assert.ok(source.includes(`canonical="${route}"`), route);
    assert.doesNotMatch(source, /Ремонт экскаваторов всех марок/);
    assert.ok(html.includes(`<title data-rh="true">${page.title}</title>`), route);
    assert.ok(html.includes(`rel="canonical" href="https://acahydraulic.kz${route}/"`), route);

    titles.add(page.title);
    descriptions.add(page.description);
  }

  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
});

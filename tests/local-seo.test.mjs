import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('published routes contain the corrected address and no old map location', () => {
  for (const route of ['', 'contacts/', 'regions/astana/', 'services/excavator-repair/']) {
    const html = fs.readFileSync(`dist/public/${route}index.html`, 'utf8');
    assert.match(html, /трасса Астана–Караганда, 81/);
    assert.doesNotMatch(html, /Абая|51\.167758|71\.423135|70000001111695391/);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      JSON.parse(match[1]);
    }
  }
});

test('local repair content is shared between the client and generated HTML', () => {
  const content = JSON.parse(fs.readFileSync('shared/local-repair-content.json', 'utf8'));
  for (const [route, item] of Object.entries(content)) {
    const htmlPath = route === '/' ? 'dist/public/index.html' : `dist/public${route}/index.html`;
    const html = fs.readFileSync(htmlPath, 'utf8');
    assert.ok(html.includes(item.title));
    for (const link of item.links) {
      assert.ok(fs.existsSync(`dist/public${link.href}index.html`), link.href);
      assert.ok(html.includes(link.href));
    }
  }
});

test('traffic-led diagnostic articles expose query-aligned metadata and content', () => {
  const pressure = fs.readFileSync('dist/public/blog/padaet-davlenie-gidravliki-ekskavatora/index.html', 'utf8');
  const diagnosis = fs.readFileSync('dist/public/blog/kak-opredelit-neispravnost-gidravliki/index.html', 'utf8');

  assert.match(pressure, /<title[^>]*>Давление в гидросистеме экскаватора: причины падения \| ACA Hydraulic<\/title>/);
  assert.match(pressure, /Падает давление в гидросистеме экскаватора: что проверять/);
  assert.match(pressure, /Порядок диагностики без замены деталей наугад/);
  assert.match(pressure, /2026-09-25/);

  assert.match(diagnosis, /<title[^>]*>Не работает гидравлика спецтехники: 10 признаков \| ACA Hydraulic<\/title>/);
  assert.match(diagnosis, /Проблемы по гидравлике часто выглядят одинаково/);
  assert.match(diagnosis, /Если гидравлика не работает совсем/);
  assert.match(diagnosis, /href="\/blog\/padaet-davlenie-gidravliki-ekskavatora"/);

  assert.equal([...pressure.matchAll(/<h1\b/g)].length, 1);
  assert.equal([...diagnosis.matchAll(/<h1\b/g)].length, 1);
});

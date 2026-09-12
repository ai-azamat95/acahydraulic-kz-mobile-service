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

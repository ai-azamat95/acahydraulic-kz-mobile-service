import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import priorityCopy from '../shared/catalog-product-priority-copy.json' with { type: 'json' };

const readPage = route => fs.readFileSync(`dist/public${route}index.html`, 'utf8');
const categoryPath = '/catalog/category/gear-pumps/';
const reviewedHandles = Object.entries(priorityCopy).filter(([, copy]) => copy.modifiedDate === '2026-11-08').map(([handle]) => handle);

test('NSh enquiries are above the generic catalogue and actionable without JavaScript', () => {
  const html = readPage(categoryPath);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<title[^>]*>[^<]*НШ[^<]*Казахстане/);
  assert.ok(html.includes(`rel="canonical" href="https://acahydraulic.kz${categoryPath}"`));
  const section = html.match(/<section id="nsh-selection"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.ok(html.indexOf(section) < html.indexOf('Найдено позиций:'));
  assert.equal((section.match(/data-aca-contact-event="catalog_whatsapp_click"/g) || []).length, 5);
  for (const series of [10, 32, 50, 100]) assert.ok(section.includes(`data-nsh-series="nsh-${series}"`));
  assert.doesNotMatch(section, /InStock|"@type"|₸|бесплатно|24\/7/);
  for (const category of ['hydraulic-pumps', 'piston-pumps']) {
    assert.doesNotMatch(readPage(`/catalog/category/${category}/`), /data-nsh-selection/);
  }
});

test('the three reviewed pump cards keep their URLs, identity and specific selection guidance', () => {
  assert.equal(reviewedHandles.length, 3);
  for (const handle of reviewedHandles) {
    const html = readPage(`/catalog/${handle}/`);
    const copy = priorityCopy[handle];
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="https://acahydraulic.kz/catalog/${handle}/"`));
    assert.ok(html.includes(copy.name));
    assert.ok(html.includes(copy.selection));
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="noindex/);
    const catalogue = readPage(`/catalog/category/${copy.selectionCategory}/`);
    assert.ok(catalogue.includes(`href="/catalog/${handle}/"`), `${handle}: contextual catalogue link missing`);
  }
});

test('changed pages receive a truthful revision date without rewriting the entire sitemap', () => {
  const findDate = (file, route) => {
    const blocks = fs.readFileSync(file, 'utf8').match(/<url>[\s\S]*?<\/url>/g) || [];
    return blocks.find(block => block.includes(`<loc>https://acahydraulic.kz${route}</loc>`))?.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
  };
  for (const category of ['gear-pumps', 'piston-pumps', 'hydraulic-pumps']) {
    assert.equal(findDate('dist/public/sitemap-catalog-landings.xml', `/catalog/category/${category}/`), '2026-11-08');
  }
  for (const handle of reviewedHandles) assert.equal(findDate('dist/public/sitemap-products.xml', `/catalog/${handle}/`), '2026-11-08');
});

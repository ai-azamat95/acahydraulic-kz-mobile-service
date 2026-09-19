import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { articles } from '../scripts/seo-article-content.mjs';

const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const sitemap = fs.readFileSync('dist/public/sitemap.xml', 'utf8');
const blog = fs.readFileSync('dist/public/blog/index.html', 'utf8');

test('new guides publish full readable content and functional section anchors without JavaScript', () => {
  for (const article of articles) {
    const html = fs.readFileSync(`dist/public/blog/${article.slug}/index.html`, 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(escape(article.intro)));
    for (const section of article.sections) {
      assert.ok(html.includes(`id="${section.id}"`));
      assert.ok(html.includes(`href="#${section.id}"`));
      for (const text of [...section.paragraphs, ...section.bullets]) assert.ok(html.includes(escape(text)));
    }
    const contact = html.match(/href="(https:\/\/wa\.me\/77714177925\?text=[^"]+)"/)?.[1];
    assert.ok(contact);
    assert.equal(new URL(contact).searchParams.get('text'), article.cta);
  }
});

test('guides have one matching canonical and Article schema with truthful organisation authorship', () => {
  for (const article of articles) {
    const html = fs.readFileSync(`dist/public/blog/${article.slug}/index.html`, 'utf8');
    const url = `https://acahydraulic.kz/blog/${article.slug}/`;
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="${url}"`));
    assert.doesNotMatch(html, /noindex/);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).filter(schema => schema['@type'] === 'Article');
    assert.equal(schemas.length, 1);
    assert.equal(schemas[0].headline, article.title);
    assert.equal(schemas[0].mainEntityOfPage, url);
    assert.equal(schemas[0].datePublished, article.publishedDate);
    assert.deepEqual(schemas[0].author, { '@type': 'Organization', name: 'ACA Hydraulic', url: 'https://acahydraulic.kz/about/' });
    assert.ok(html.includes(escape(new URL(article.image, 'https://acahydraulic.kz').href)));
    assert.ok(sitemap.includes(url));
    assert.ok(blog.includes(`href="/blog/${article.slug}/"`));
  }
});

test('guides link to catalog and real cases, and preserve supported price and order boundaries', () => {
  for (const article of articles) {
    const html = fs.readFileSync(`dist/public/blog/${article.slug}/index.html`, 'utf8');
    assert.ok(article.related.some(link => link.href.startsWith('/catalog')));
    assert.ok(article.related.some(link => link.href.startsWith('/cases/')));
    for (const link of article.related) assert.ok(html.includes(`href="${escape(link.href)}"`));
  }
  const comparison = fs.readFileSync('dist/public/blog/k5v80dtp-handok-hitachi-zx160w/index.html', 'utf8');
  assert.match(comparison, /1 700 000 ₸/);
  assert.match(comparison, /2 530 000 ₸/);
  assert.match(comparison, /830 000 ₸/);
  assert.match(comparison, /ожидание поставки на 17 сентября 2026 года/);
  assert.match(comparison, /не представляем этот заказ как завершённую установку/);
});

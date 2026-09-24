import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import catSale from '../shared/cat-432e-sale.json' with { type: 'json' };

const out = 'dist/public';
const cases = JSON.parse(fs.readFileSync('shared/video-cases.json', 'utf8'));
const redirects = JSON.parse(fs.readFileSync('shared/legacy-redirects.json', 'utf8'));
const read = route => fs.readFileSync(path.join(out, route, 'index.html'), 'utf8');
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

test('watch pages expose matching video metadata and useful content without JavaScript', () => {
  for (const item of cases) {
    const route = `cases/${item.slug}`;
    const html = read(route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`href="https://acahydraulic.kz/${route}/"`));
    assert.ok(html.includes(item.summary));
    const pageSchemas = schemas(html);
    assert.equal(pageSchemas.length, 1);
    assert.equal(pageSchemas[0]['@type'], 'VideoObject');
    assert.equal(pageSchemas[0].contentUrl, `https://acahydraulic.kz${item.video}`);
    assert.equal(pageSchemas[0].mainEntityOfPage, `https://acahydraulic.kz/${route}/`);
    assert.ok(html.includes(`poster="${item.poster}"`));
    assert.ok(html.includes(`src="${item.video}"`));
    assert.doesNotMatch(html, /<video[^>]*autoplay/);
    assert.doesNotMatch(html, /noindex/);
    for (const media of [item.video, item.poster]) assert.ok(fs.statSync(path.join(out, media)).size > 1000);
    for (const link of item.links) assert.ok(html.includes(link.href.replace(/&/g, '&amp;')));
  }
});

test('watch pages are discoverable from video sitemap, cases sitemap and existing case pages', () => {
  const videoMap = fs.readFileSync(path.join(out, 'sitemap-videos.xml'), 'utf8');
  const caseMap = fs.readFileSync(path.join(out, 'sitemap-cases.xml'), 'utf8');
  assert.match(videoMap, /xmlns:video="http:\/\/www.google.com\/schemas\/sitemap-video\/1.1"/);
  assert.ok(fs.readFileSync(path.join(out, 'robots.txt'), 'utf8').includes('/sitemap-videos.xml'));
  for (const item of cases) {
    const route = `/cases/${item.slug}/`;
    assert.ok(videoMap.includes(route));
    assert.ok(caseMap.includes(route));
    assert.ok(videoMap.includes(`<video:content_loc>https://acahydraulic.kz${item.video}</video:content_loc>`));
    for (const source of ['cases', 'cases/postavka-zamena-gidronasosa']) assert.ok(read(source).includes(`href="${route}"`));
  }
  assert.ok(videoMap.includes(`<loc>https://acahydraulic.kz${catSale.casePath}/</loc>`));
  assert.ok(videoMap.includes(`<video:content_loc>https://acahydraulic.kz${catSale.video}</video:content_loc>`));
  const catalogCaseSchemas = schemas(read(catSale.casePath.slice(1)));
  const catalogVideo = catalogCaseSchemas.find(schema => schema['@type'] === 'VideoObject');
  assert.equal(catalogVideo.contentUrl, `https://acahydraulic.kz${catSale.video}`);
  assert.equal(catalogVideo.mainEntityOfPage, `https://acahydraulic.kz${catSale.casePath}/`);
});

test('old service URLs redirect only to existing relevant pages, without redirect loops', () => {
  for (const [from, to] of Object.entries(redirects)) {
    const html = read(from);
    assert.ok(html.includes(`http-equiv="refresh" content="0;url=${to}"`));
    assert.ok(html.includes(`rel="canonical" href="https://acahydraulic.kz${to}"`));
    assert.ok(read(to).includes('<h1'));
    assert.ok(!Object.hasOwn(redirects, to.replace(/\/$/, '')));
    assert.notEqual(to, '/');
  }
});

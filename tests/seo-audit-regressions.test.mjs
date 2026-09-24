import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = route => fs.readFileSync(`dist/public/${route}index.html`, 'utf8');
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));

test('business schema uses confirmed identity and appointment-only availability', () => {
  const business = schemas(read('')).find(s => s['@id']?.endsWith('#business'));
  assert.equal(business.legalName, 'ТОО «АСА-ГС»');
  assert.equal(business.openingHoursSpecification, undefined);
  assert.equal(business.contactPoint.hoursAvailable, undefined);
  assert.match(business.description, /по договорённости/);
  assert.doesNotMatch(JSON.stringify(business), /24\/7|23:59/);
});

test('pressure article contains actual diagnosis content before JavaScript runs', () => {
  const html = read('blog/padaet-davlenie-gidravliki-ekskavatora/');
  for (const text of ['Регулятор насоса и управляющее давление', 'Электрика, датчики и соленоиды', 'Что подготовить перед выездом специалиста']) assert.ok(html.includes(text), text);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal(schemas(html).filter(s => s['@type'] === 'BlogPosting').length, 1);
});

test('technical blog articles expose Article schema before JavaScript runs', () => {
  for (const route of [
    'remont-gidravliki-frezy-wirtgen-1500',
    'kapitalnyy-remont-shantui-sd32',
    'remont-gidravliki-liebherr-r950',
    'vosstanovlenie-gidromotora-volvo-ec380',
  ]) {
    const article = schemas(read(`blog/${route}/`)).find(schema => schema['@type'] === 'Article');
    assert.ok(article, route);
    assert.equal(article.mainEntityOfPage, `https://acahydraulic.kz/blog/${route}/`);
    assert.equal(article.publisher['@id'], 'https://acahydraulic.kz/#business');
  }
});

test('real cases contain case content instead of copied homepage and have matching metadata', () => {
  for (const [route, model] of [
    ['cat-330dl-teryaet-moshchnost-na-goryachuyu', '330DL'],
    ['sany-sy365h-gidravlika-na-goryachuyu', 'SY365H'],
    ['hitachi-330-5g-plavaet-davlenie-strela-ryvkami', '330-5G'],
  ]) {
    const url = `https://acahydraulic.kz/cases/${route}/`;
    const html = read(`cases/${route}/`);
    assert.ok(html.includes(model));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.ok(html.includes('https://www.tiktok.com/@acaservice01/video/'));
    assert.equal(schemas(html).find(s => s['@type'] === 'WebPage').url, url);
  }
});

test('duplicate projects listing redirects to cases and is excluded from sitemaps', () => {
  assert.match(read('projects/'), /http-equiv="refresh"/);
  for (const file of ['sitemap.xml', 'sitemap-cases.xml']) assert.ok(!fs.readFileSync(`dist/public/${file}`, 'utf8').includes('<loc>https://acahydraulic.kz/projects/</loc>'));
});

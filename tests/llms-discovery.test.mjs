import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('client/public');
const llmsPath = path.join(publicDir, 'llms.txt');
const fullPath = path.join(publicDir, 'llms-full.txt');
const llms = fs.readFileSync(llmsPath, 'utf8');
const full = fs.readFileSync(fullPath, 'utf8');

const links = (source) => [...source.matchAll(/\[[^\]]+\]\((https:\/\/acahydraulic\.kz\/[^)]+)\)/g)].map((match) => match[1]);

test('llms.txt follows the compact discovery format and names the verified operator', () => {
  assert.match(llms, /^# ACA Hydraulic\n\n> /);
  assert.match(llms, /ТОО «ACA ГИДРАВЛИК СЕРВИС»/);
  assert.match(llms, /## О компании/);
  assert.match(llms, /## Услуги/);
  assert.match(llms, /## Каталог и поставка/);
  assert.match(llms, /## Optional/);
  assert.ok(Buffer.byteLength(llms) < 12_000, 'llms.txt must remain compact');
});

test('every linked ACA Markdown resource is committed under client/public', () => {
  const markdownLinks = links(llms).filter((url) => /(?:\.md|llms-full\.txt)$/.test(url));
  assert.ok(markdownLinks.length >= 10, 'expected curated Markdown resources');
  for (const url of markdownLinks) {
    const pathname = decodeURIComponent(new URL(url).pathname).replace(/^\//, '');
    assert.ok(fs.existsSync(path.join(publicDir, pathname)), `${url} must exist in client/public`);
  }
});

test('agent pages preserve commercial caveats and avoid unsupported outcomes', () => {
  const source = [llms, full, ...links(llms)
    .filter((url) => url.endsWith('.md'))
    .map((url) => fs.readFileSync(path.join(publicDir, new URL(url).pathname), 'utf8'))]
    .join('\n');

  assert.match(source, /БИН: 240540017992/);
  assert.match(source, /трасса Астана–Караганда, 81/);
  assert.match(source, /\+7 \(771\) 417-79-25/);
  assert.match(source, /совместимост/iu);
  assert.match(source, /подтвержд/iu);
  assert.doesNotMatch(source, /гарантированн(?:ая|ые) продаж/iu);
  assert.doesNotMatch(source, /всегда в наличии/iu);
});

test('full agent summary stays lightweight and discovery is declared in HTML', () => {
  assert.match(full, /^# ACA Hydraulic — сводка для ИИ-агентов\n\n> /);
  assert.ok(Buffer.byteLength(full) < 30_000, 'llms-full.txt must stay small enough for agent context');
  const html = fs.readFileSync('client/index.html', 'utf8');
  assert.match(html, /<link rel="describedby" href="\/llms\.txt" type="text\/plain" \/>/);
});

test('published key pages advertise their matching Markdown representation', () => {
  const routes = ['', 'services', 'services/hydraulic-pumps', 'catalog', 'parts/engines-complete', 'cases', 'contacts', 'payment', 'offer', 'delivery-and-returns'];
  for (const route of routes) {
    const htmlPath = path.join('dist/public', route, 'index.html');
    const markdownPath = route ? `/${route}/index.md` : '/index.md';
    assert.ok(fs.existsSync(htmlPath), `${htmlPath} must exist before this test`);
    assert.match(fs.readFileSync(htmlPath, 'utf8'), new RegExp(`<link rel="alternate" type="text/markdown" href="${markdownPath.replaceAll('/', '\\/')}">`));
  }
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import selection from '../shared/pump-order-selection.json' with { type: 'json' };
import landings from '../shared/catalog-landings.json' with { type: 'json' };
import {
  buildPumpOrderWhatsAppUrl,
  pumpOrderBrand,
  pumpOrderPageUrl,
  renderPumpOrderNavigation,
  renderPumpOrderSelection,
} from '../shared/pump-order-selection.mjs';

const expected = {
  rexroth: ['a10vso', 'a11vo'],
  kawasaki: ['k3v', 'k5v'],
  danfoss: ['danfoss-90'],
};
const siteOrigin = 'https://acahydraulic.kz';

test('five pump inquiry families reuse three published brand collections', () => {
  assert.deepEqual(Object.keys(selection.brands).sort(), Object.keys(expected).sort());
  assert.equal(selection.modifiedDate, '2026-10-30');
  for (const [brandSlug, familyIds] of Object.entries(expected)) {
    const brand = pumpOrderBrand(brandSlug);
    assert.deepEqual(brand.families.map(family => family.id), familyIds);
    assert.ok(landings.brands.find(landing => landing.slug === brandSlug)?.title);
    assert.equal(pumpOrderBrand(brandSlug, 'hydraulic-pumps'), brand);
    assert.equal(pumpOrderBrand(brandSlug, 'piston-pumps'), brand);
    for (const category of ['gear-pumps', 'hydraulic-motors', 'pump-parts', 'engine-fuel']) {
      assert.equal(pumpOrderBrand(brandSlug, category), undefined);
    }
    for (const family of brand.families) {
      assert.equal(pumpOrderPageUrl(brandSlug, family.id), `${siteOrigin}/catalog/brand/${brandSlug}/#${family.id}`);
      assert.ok(family.checklist.length >= 3);
      assert.ok(['www.boschrexroth.com', 'global.kawasaki.com', 'assets.danfoss.com'].includes(new URL(family.documentationUrl).hostname));
    }
  }
  assert.equal(pumpOrderBrand('unknown'), undefined);
  for (const slug of ['constructor', 'toString', '__proto__']) assert.equal(pumpOrderBrand(slug), undefined);
  assert.throws(() => pumpOrderPageUrl('rexroth', 'unknown'), /Unknown pump family/);
});

test('WhatsApp requests contain the exact family and clean page URL without importing browsing data', () => {
  for (const [brandSlug, brand] of Object.entries(selection.brands)) {
    for (const family of brand.families) {
      const url = new URL(buildPumpOrderWhatsAppUrl(brandSlug, family.id));
      assert.equal(url.origin, 'https://wa.me');
      assert.equal(url.pathname, '/77714177925');
      assert.deepEqual([...url.searchParams.keys()], ['text']);
      const message = url.searchParams.get('text');
      assert.ok(message.includes(family.name));
      assert.ok(message.includes(pumpOrderPageUrl(brandSlug, family.id)));
      assert.doesNotMatch(message, /utm_|gclid|ttclid|contact_intent_id|https?:\/\/[^\s]+\?/i);
      assert.doesNotMatch(message, /Номер обращения:/);
    }
  }
  assert.throws(() => buildPumpOrderWhatsAppUrl('unknown', 'a10vso'), /Unknown pump family/);
});

test('prepared form text carries only explicit visitor fields and its valid correlation ID', () => {
  const url = new URL(buildPumpOrderWhatsAppUrl('rexroth', 'a10vso', {
    model: '  TEST-A10VSO\nFULL  ', city: '  Астана ', machine: 'TEST-MACHINE',
    contactIntentId: 'ACA-TEST123-ABCD1234',
  }));
  const message = url.searchParams.get('text');
  assert.ok(message.includes('Модель / номер со шильдика: TEST-A10VSO FULL'));
  assert.ok(message.includes('Город поставки: Астана'));
  assert.ok(message.includes('Техника: TEST-MACHINE'));
  assert.ok(message.includes('Номер обращения: ACA-TEST123-ABCD1234'));
  const empty = new URL(buildPumpOrderWhatsAppUrl('rexroth', 'a10vso', { model: ' ', city: '', contactIntentId: 'not-an-inquiry-id' })).searchParams.get('text');
  assert.doesNotMatch(empty, /Модель \/ номер|Город поставки|Техника:|Номер обращения/);
  const long = new URL(buildPumpOrderWhatsAppUrl('rexroth', 'a10vso', { model: 'x'.repeat(300) })).searchParams.get('text');
  assert.ok(long.includes('x'.repeat(180)));
  assert.ok(!long.includes('x'.repeat(181)));
});

test('static family content has matching WhatsApp navigation and preserves phone access without scripts', () => {
  const navigation = renderPumpOrderNavigation();
  for (const [brandSlug, brand] of Object.entries(selection.brands)) {
    const html = renderPumpOrderSelection(brandSlug);
    assert.ok(html.includes(selection.cta));
    assert.ok(html.includes('с подготовленным текстом'));
    assert.ok(html.includes('href="tel:+77714177925"'));
    assert.doesNotMatch(html, /"@type"\s*:\s*"(?:Product|Offer)"|<form|<script/i);
    for (const family of brand.families) {
      assert.equal((html.match(new RegExp(`id="${family.id}"`, 'g')) || []).length, 1);
      assert.ok(navigation.includes(`href="/catalog/brand/${brandSlug}/#${family.id}"`));
      assert.ok(html.includes(`data-pump-family="${family.id}"`));
      assert.ok(html.includes(`data-aca-pump-family="${family.id}"`));
      const url = buildPumpOrderWhatsAppUrl(brandSlug, family.id);
      assert.ok(html.includes(`href="${url}"`));
    }
  }
  assert.equal(renderPumpOrderSelection('unknown'), '');
});

test('built pump family landings retain single self canonical, indexability and collection schema', () => {
  const sitemap = fs.readFileSync('dist/public/sitemap-catalog-landings.xml', 'utf8');
  const categoryHtml = fs.readFileSync('dist/public/catalog/category/hydraulic-pumps/index.html', 'utf8');
  assert.ok(categoryHtml.includes('data-pump-order-navigation'));
  for (const [brandSlug, brand] of Object.entries(selection.brands)) {
    const html = fs.readFileSync(`dist/public/catalog/brand/${brandSlug}/index.html`, 'utf8');
    const canonicalTags = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi) || [];
    assert.equal(canonicalTags.length, 1);
    assert.ok(canonicalTags[0].includes(`href="${siteOrigin}/catalog/brand/${brandSlug}/"`));
    assert.doesNotMatch(html, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i);
    assert.ok(html.includes(`data-pump-order-selection="${brandSlug}"`));
    assert.ok(html.includes(landings.brands.find(landing => landing.slug === brandSlug).title));
    const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
    assert.ok(schemas.some(schema => schema['@type'] === 'CollectionPage'));
    assert.ok(sitemap.includes(`<loc>${siteOrigin}/catalog/brand/${brandSlug}/</loc>`));
    for (const family of brand.families) {
      assert.equal((html.match(new RegExp(`id="${family.id}"`, 'g')) || []).length, 1);
      assert.ok(categoryHtml.includes(`/catalog/brand/${brandSlug}/#${family.id}`));
      assert.ok(!sitemap.includes(`#${family.id}`));
    }
  }
});

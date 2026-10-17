import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import products from '../shared/catalog-hydrauvision-products.json' with { type: 'json' };
import inventory from '../data/hydrauvision-pumps-20261017/source-products.json' with { type: 'json' };
import imageManifest from '../data/hydrauvision-pumps-20261017/image-manifest.json' with { type: 'json' };
import sourceSnapshot from '../data/hydrauvision-pumps-20261017/source-snapshot.json' with { type: 'json' };
import { extractBrandSlugs } from '../scripts/lib/catalog-landings.mjs';
import {
  HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT,
  baseHydrauvisionPriceKzt,
  hasHydrauvisionSelectedPriceAdjustment,
  hydrauvisionRetailPriceKzt,
} from '../scripts/lib/hydrauvision-pricing.mjs';

const publicDir = path.resolve('dist/public');
const clientPublicDir = path.resolve('client/public');
const expectedBrandSlugs = new Map([
  ['Danfoss', 'danfoss'],
  ['Parker', 'parker'],
  ['Bosch Rexroth', 'rexroth'],
  ['Eaton', 'eaton'],
  ['Daikin', 'daikin'],
  ['Denison', 'denison'],
  ['Von Roll', 'von-roll'],
]);

function normalizedIdentity(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

test('reviewed pump inventory reconciles every source category row before publication', () => {
  assert.equal(inventory.sourceReportedCount, 234);
  assert.equal(inventory.enumeratedApiCount, 233);
  assert.equal(sourceSnapshot.items.length, 233);
  assert.equal(sourceSnapshot.capturedOn, '2026-10-17');
  assert.equal(inventory.listingPages.length, 8);
  assert.equal(inventory.listingPages.reduce((sum, page) => sum + page.rows, 0), 234);
  assert.deepEqual(inventory.counts, { published: 105, held: 1, excluded: 128 });
  assert.equal(inventory.products.length, 234);
  assert.equal(products.length, 105);
  assert.equal(new Set(inventory.products.map(product => product.sourceId)).size, 234);
  assert.equal(new Set(products.map(product => product.id)).size, products.length);
  assert.equal(new Set(products.map(product => product.handle)).size, products.length);
  assert.equal(new Set(products.map(product => normalizedIdentity(product.sku))).size, products.length);

  const held = inventory.products.filter(product => product.decision === 'held');
  assert.equal(held.length, 1);
  assert.equal(held[0].sourceId, 1971);
  assert.match(held[0].sourceName, /83095379.*H1-B-060/);
  assert.match(held[0].reason, /motor family/i);
  assert.ok(!products.some(product => product.id === held[0].publicId || product.title.includes('83095379')));

  const excluded = inventory.products.filter(product => product.decision === 'excluded');
  assert.ok(excluded.some(product => product.sourceName === '1700956 Danfoss Shaft Pump'));
  assert.ok(excluded.some(product => /Pump Configurator/i.test(product.sourceName)));
  assert.ok(excluded.some(product => /O-Ring Assortment/i.test(product.sourceName)));
});

test('published pumps retain exact identities, reviewed taxonomy and the authorized KZT calculation', () => {
  const auditById = new Map(inventory.products.filter(product => product.decision === 'published').map(product => [product.publicId, product]));
  const brandCounts = Object.fromEntries([...expectedBrandSlugs].map(([brand]) => [brand, products.filter(product => product.brand === brand).length]));
  assert.deepEqual(brandCounts, { Danfoss: 85, Parker: 7, 'Bosch Rexroth': 7, Eaton: 1, Daikin: 1, Denison: 1, 'Von Roll': 3 });
  assert.equal(products.filter(product => product.category === 'gear-pumps').length, 48);
  assert.equal(products.filter(product => product.category === 'piston-pumps').length, 51);
  assert.equal(products.filter(product => product.category === 'hydraulic-pumps').length, 6);

  for (const product of products) {
    const audit = auditById.get(product.id);
    assert.ok(audit, product.handle);
    assert.equal(product.title, product.catalogTitle, product.handle);
    assert.match(product.title, /[а-яё]/i, product.handle);
    assert.ok(product.title.includes(product.sku), product.handle);
    assert.ok(
      normalizedIdentity(`${audit.sourceName} ${audit.sourceUrl}`).includes(normalizedIdentity(product.sku)),
      product.handle,
    );
    assert.ok(!product.tags.includes(audit.sourceName), product.handle);
    assert.doesNotMatch(
      JSON.stringify([product.title, product.catalogTitle, product.tags]),
      /\b(?:axial|radial|piston|internal|gear|vane|charge|hydraulic|pump|motor|overhauled|used|equipment)\b|cc\s*\/\s*rev/i,
      product.handle,
    );
    assert.equal(product.available, false, product.handle);
    assert.ok(audit.sourcePriceExclTaxEur > 0, product.handle);
    const expectedPrice = hydrauvisionRetailPriceKzt(audit.sourcePriceExclTaxEur);
    assert.equal(product.minPriceKzt, expectedPrice, product.handle);
    assert.equal(product.maxPriceKzt, expectedPrice, product.handle);
    assert.equal(product.variants.length, 1, product.handle);
    assert.equal(product.variants[0].available, false, product.handle);
    assert.equal(product.variants[0].priceKzt, expectedPrice, product.handle);
    assert.equal(product.variants[0].sku, product.sku, product.handle);
    assert.equal(product.mpn, product.sku, product.handle);
    assert.ok(product.categories.includes('hydraulic-pumps'), product.handle);
    if (product.category !== 'hydraulic-pumps') assert.ok(product.categories.includes(product.category), product.handle);
    assert.ok(product.catalogSelection.length > 180, product.handle);
    assert.doesNotMatch(product.catalogTitle, /см³\/об,.*см³\/об|(?:cc|cm³)\/rev/i, product.handle);
    assert.match(product.catalogPriceNote, /17\.10\.2026/);
    assert.match(product.catalogPriceNote, /не включены/);
    assert.ok(product.catalogDescription.includes(product.catalogPriceNote), product.handle);
    assert.doesNotMatch(product.catalogDescription, /рассчитана по курсу НБК/i, product.handle);
    assert.ok(extractBrandSlugs(`${product.title} ${product.tags.join(' ')}`).includes(expectedBrandSlugs.get(product.brand)), product.handle);
    assert.doesNotMatch(JSON.stringify(product), /hydrauvision|sourceUrl|sourcePrice|in stock|lead time/i, product.handle);
  }

  const overhauled = products.find(product => product.id === 'ACA-PUMP-1801');
  assert.match(overhauled.catalogTitle, /^Восстановленный /);
  assert.match(overhauled.catalogDescription, /восстановленный/);
  const used = products.find(product => product.id === 'ACA-PUMP-1818');
  assert.match(used.catalogTitle, /^Бывший в эксплуатации /);
  assert.match(used.catalogDescription, /бывший в эксплуатации/);
  const correctedClassification = products.find(product => product.id === 'ACA-PUMP-1978');
  assert.match(correctedClassification.catalogTitle, /^Поршневой насос /);
  assert.doesNotMatch(correctedClassification.catalogTitle, /Радиально/);
  assert.match(products.find(product => product.sku === '9510665-26-RF').catalogTitle, /SPV 26, вращение по часовой стрелке \(CW\)/);
  assert.match(products.find(product => product.sku === '83108336').catalogTitle, /D1P193/);
  for (const sku of ['R902077512', 'R902170281', 'R902233773']) {
    assert.match(products.find(product => product.sku === sku).catalogTitle, /A11VLO (?:130|260)/, sku);
  }

  const canonicalReplacement = products.find(product => product.sku === 'R901147104');
  assert.equal(canonicalReplacement.id, '8705189118114');
  assert.equal(canonicalReplacement.handle, 'pgh4-3x-050re11vu2-internal-gear-pump-rexroth-r901147104');
  assert.match(auditById.get(canonicalReplacement.id).canonicalExistingProduct.reason, /Exact existing catalogue match/);

  const adjustedProducts = products
    .filter(product => hasHydrauvisionSelectedPriceAdjustment(auditById.get(product.id).sourcePriceExclTaxEur))
    .sort((a, b) => a.minPriceKzt - b.minPriceKzt);
  assert.equal(adjustedProducts.length, HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT.expectedAffectedPublishedProducts);
  assert.equal(adjustedProducts[0].sku, '111.10.002.00');
  assert.equal(adjustedProducts[0].minPriceKzt, HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT.expectedMinimumRetailPriceKzt);
  assert.equal(products.find(product => product.brand === 'Daikin').minPriceKzt, 1_298_000);
  assert.equal(products.find(product => product.sku === 'R901147104').minPriceKzt, 1_158_000);
  for (const product of adjustedProducts) {
    const audit = auditById.get(product.id);
    assert.equal(
      product.minPriceKzt,
      baseHydrauvisionPriceKzt(audit.sourcePriceExclTaxEur) + HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT.upliftKzt,
      product.handle,
    );
  }
  assert.deepEqual(inventory.pricing.selectedPriceAdjustment, {
    method: 'fixed uplift through the selected Daikin price boundary',
    sourcePriceCeilingExclTaxEur: 1_244.67,
    upliftKzt: 348_000,
    throughBrand: 'Daikin',
    throughSku: 'J-V 38SA 3BL X-95',
    affectedPublishedProducts: 49,
    minimumRetailPriceKzt: 500_000,
  });
});

test('local pump images are complete, hashed and never replace source placeholders with a false product photo', () => {
  assert.equal(imageManifest.count, 81);
  assert.equal(imageManifest.images.length, 81);
  assert.equal(new Set(imageManifest.images.map(image => image.publicId)).size, 81);
  const imageByProduct = new Map(imageManifest.images.map(image => [image.publicId, image]));
  const productsWithoutPhoto = products.filter(product => !product.imageUrl);
  assert.equal(productsWithoutPhoto.length, 24);
  for (const sku of ['111.20.140.00', '111.20.282.00', '80006071', '83070096', 'F11-010-RB-CV-K-000-0000-00', 'TF40 - P162', 'A4VG90EP4D1/32L']) {
    assert.ok(productsWithoutPhoto.some(product => product.sku === sku), sku);
  }

  const auditById = new Map(inventory.products.map(product => [product.publicId, product]));
  assert.equal(inventory.products.filter(product => ['published', 'published-existing-aca'].includes(product.imagePublicationDecision) && product.decision === 'published').length, 81);
  assert.equal(inventory.products.filter(product => product.imagePublicationDecision === 'published-existing-aca' && product.decision === 'published').length, 1);
  for (const product of productsWithoutPhoto) {
    assert.equal(auditById.get(product.id).imagePublicationDecision, 'excluded', product.handle);
    assert.ok(auditById.get(product.id).imagePublicationReason, product.handle);
  }
  for (const sku of ['503630', '515782']) {
    const product = products.find(item => item.sku === sku);
    assert.equal(product.catalogImageLabel, 'Иллюстрация серии', sku);
  }

  for (const product of products) {
    assert.equal(product.gallery[0] || null, product.imageUrl, product.handle);
    if (!product.imageUrl) {
      assert.equal(imageByProduct.has(product.id), false, product.handle);
      continue;
    }
    assert.match(product.imageUrl, /^\/catalog-assets\/supplier-pumps-20261017\/[a-z0-9-]+\.webp$/);
    assert.ok(product.catalogImageCaption, product.handle);
    const manifestImage = imageByProduct.get(product.id);
    assert.ok(manifestImage, product.handle);
    assert.equal(manifestImage.localPath, product.imageUrl, product.handle);
    const body = fs.readFileSync(path.join(clientPublicDir, product.imageUrl));
    assert.equal(body.subarray(0, 4).toString('ascii'), 'RIFF', product.handle);
    assert.equal(createHash('sha256').update(body).digest('hex'), manifestImage.sha256, product.handle);
    assert.equal(body.length, manifestImage.bytes, product.handle);
  }
});

test('reviewed pump references do not collide with existing catalogue identities', () => {
  const newIds = new Set(products.map(product => product.id));
  const existingIdentities = new Set();
  const catalogDir = path.resolve('client/public/catalog-data');
  const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
  for (let chunk = 1; chunk <= manifest.chunkCount; chunk += 1) {
    const rows = JSON.parse(fs.readFileSync(path.join(catalogDir, `products-${String(chunk).padStart(3, '0')}.json`), 'utf8'));
    for (const product of rows) {
      if (newIds.has(product.id)) continue;
      for (const identity of [product.sku, product.mpn]) if (identity) existingIdentities.add(normalizedIdentity(identity));
    }
  }
  for (const product of products) assert.ok(!existingIdentities.has(normalizedIdentity(product.sku)), product.sku);
});

test('static pages publish the calculated price, caveat, local image and exact inquiry without supplier identity', {
  skip: !fs.existsSync(path.join(publicDir, 'catalog', products[0].handle, 'index.html')),
}, () => {
  const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap-products.xml'), 'utf8');
  const auditById = new Map(inventory.products.filter(product => product.decision === 'published').map(product => [product.publicId, product]));
  for (const product of products) {
    const file = path.join(publicDir, 'catalog', product.handle, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    const canonical = `https://acahydraulic.kz/catalog/${product.handle}/`;
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), product.handle);
    assert.ok(html.includes(`<h1>${escapeHtml(product.catalogTitle)}</h1>`), product.handle);
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`), product.handle);
    assert.ok(html.includes(escapeHtml(product.catalogPriceNote)), product.handle);
    assert.ok(html.includes(`"lowPrice":${product.minPriceKzt}`), product.handle);
    assert.ok(!html.includes('"availability"'), product.handle);
    assert.doesNotMatch(html, /hydrauvision|webshop\.|<p lang="en">/i, product.handle);
    assert.ok(!html.includes(escapeHtml(auditById.get(product.id).sourceName)), product.handle);
    if (product.imageUrl) {
      assert.ok(html.includes(product.imageUrl), product.handle);
      assert.ok(html.includes(`https://acahydraulic.kz${product.imageUrl}`), product.handle);
    }
    for (const [, imageUrl] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      assert.ok(imageUrl.startsWith('/') || imageUrl.startsWith('https://acahydraulic.kz/'), `${product.handle}: ${imageUrl}`);
    }
    const inquiry = html.match(/href="(https:\/\/wa\.me\/77714177925\?text=[^"]+)"/)?.[1];
    assert.ok(inquiry, product.handle);
    assert.ok(new URL(inquiry).searchParams.get('text').includes(canonical), product.handle);
  }
  for (const slug of expectedBrandSlugs.values()) {
    assert.ok(fs.existsSync(path.join(publicDir, 'catalog', 'brand', slug, 'index.html')), slug);
  }
});

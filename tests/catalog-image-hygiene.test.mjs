import assert from 'node:assert/strict';
import test from 'node:test';

import {
  catalogImageExclusionReason,
  catalogImageIdentityKey,
  isExcludedCatalogImage,
} from '../scripts/lib/catalog-image-hygiene.mjs';

test('image identity ignores Shopify UUID, rendition suffix, extension, and query string', () => {
  assert.equal(
    catalogImageIdentityKey(
      'https://cdn.shopify.com/files/IMG_2226-min_01ea85d3-3647-42ef-b3ba-fe55c6f5c383.jpg?v=1',
    ),
    'img2226',
  );
  assert.equal(catalogImageIdentityKey('https://cdn.shopify.com/files/IMG_2226.PNG?v=2'), 'img2226');
});

test('visible supplier marks are excluded per audited product', () => {
  const marked = 'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/IMG_2226-min.jpg?v=1767371743';
  assert.equal(catalogImageExclusionReason('7100655534242', marked), 'visible-supplier-mark');
  assert.equal(isExcludedCatalogImage('7100655534242', marked), true);
  assert.equal(isExcludedCatalogImage('different-product', marked), false);
});

test('Volvo 14390248 controller excludes both SinoCMP-labelled views only', () => {
  const labelledViews = [
    'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/14390248-VOE14390248-Volvo-ECU-Controller_01.jpg?v=1775146522',
    'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/14390248-VOE14390248-Volvo-ECU-Controller_02.jpg?v=1775146522',
  ];
  const cleanViews = [
    'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/14390248-VOE14390248-Volvo-ECU-Controller_03.jpg?v=1775146523',
    'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/14390248-VOE14390248-Volvo-ECU-Controller_04.jpg?v=1775146524',
  ];

  for (const imageUrl of labelledViews) {
    assert.equal(catalogImageExclusionReason('7102671487138', imageUrl), 'visible-supplier-mark');
  }
  for (const imageUrl of cleanViews) {
    assert.equal(isExcludedCatalogImage('7102671487138', imageUrl), false);
  }
});

test('only perceptually verified duplicate files are excluded', () => {
  const duplicate = 'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/IMG_2227.jpg?v=1764777907';
  const cleanOriginal = 'https://cdn.shopify.com/s/files/1/0594/4046/4034/files/IMG_2227-min.jpg?v=1767371743';
  assert.equal(catalogImageExclusionReason('7100655534242', duplicate), 'verified-duplicate');
  assert.equal(isExcludedCatalogImage('7100655534242', cleanOriginal), false);
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  buildCommercialReview,
  individuallyConfirmedPriceIds,
} from '../scripts/audit-catalog-commercial-review.mjs';

const products = JSON.parse(fs.readFileSync(path.resolve('client/public/catalog-data/search-index.json'), 'utf8'));
const review = buildCommercialReview(products);

test('legacy hydraulic prices stay a review queue and exclude saved confirmations', () => {
  assert.equal(review.prices.length, 778);
  assert(review.prices.every((row) => Number.isFinite(row.currentMinPriceKzt) && row.currentMinPriceKzt > 0));
  assert(review.prices.every((row) => !String(row.id).startsWith('ACA-PUMP-')));
  assert(review.prices.every((row) => !individuallyConfirmedPriceIds.has(row.id)));
});

test('category review reproduces the bounded candidate list without changing catalog data', () => {
  assert.equal(review.categories.length, 41);
  assert.equal(review.categories.filter((row) => row.status === 'Исправлено').length, 41);
  assert.equal(review.categories.filter((row) => row.status === 'Отложено').length, 0);
  assert(review.categories.filter((row) => row.status === 'Исправлено').every((row) => row.currentCategory === row.reviewedCategory));
  assert(review.categories.filter((row) => row.status === 'Отложено').every((row) => row.reviewedCategory === ''));
});

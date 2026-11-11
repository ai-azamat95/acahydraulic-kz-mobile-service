import assert from 'node:assert/strict';
import test from 'node:test';
import { catalogBasePath, catalogPathPage, catalogPage, catalogStaticPageHref as catalogPageHref, catalogPageMetadata } from '../shared/catalog-pagination.mjs';

test('catalogue pagination uses real static paths and keeps attribution', () => {
  const base = '/catalog/category/gear-pumps/';
  assert.equal(catalogPageHref(base, '?page=2&utm_source=google&gclid=abc', 3), `${base}page/3/?utm_source=google&gclid=abc`);
  assert.equal(catalogPageHref(`${base}page/2/`, '', 1), base);
  assert.equal(catalogPageHref('/catalog/brand/komatsu', '', 2), '/catalog/brand/komatsu/page/2/');
  assert.equal(catalogPageHref('/catalog/model/pc200-8/', '', 2), '/catalog/model/pc200-8/page/2/');
  assert.equal(catalogPageHref('/catalog/', '', 1), '/catalog/page/1/');
});

test('dynamic search and category refinements keep their query and page semantics', () => {
  assert.equal(catalogPageHref('/catalog/page/2/', '?q=K3V&utm_source=tiktok', 3), '/catalog/?q=K3V&utm_source=tiktok&page=3');
  assert.equal(catalogPageHref('/catalog/brand/danfoss/', '?category=hydraulic-pumps', 2), '/catalog/brand/danfoss/?category=hydraulic-pumps&page=2');
  assert.equal(catalogPageHref('/parts/engines-complete/', '?utm_source=google', 2), '/parts/engines-complete/?utm_source=google&page=2');
});

test('invalid numbered paths are distinct from legacy query normalization', () => {
  for (const raw of ['0', '-1', '02', 'abc', '9007199254740992']) assert.equal(catalogPathPage(`/catalog/category/gear-pumps/page/${raw}/`), 0);
  assert.equal(catalogPathPage('/catalog/category/gear-pumps/page/2/'), 2);
  assert.equal(catalogPathPage('/catalog/category/gear-pumps/'), null);
  assert.equal(catalogBasePath('/catalog/brand/danfoss/page/2/'), '/catalog/brand/danfoss');
  assert.equal(catalogPage('?page=oops'), 1);
  assert.notEqual(catalogPageMetadata('Насосы', 'Подбор насоса.', 2, 61).title, catalogPageMetadata('Насосы', 'Подбор насоса.', 3, 61).title);
});

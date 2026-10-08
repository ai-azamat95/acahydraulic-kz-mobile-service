import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CATALOG_PAGE_SIZE, catalogPage, catalogPageHref, catalogPageNumbers } from '../shared/catalog-pagination.mjs';

test('departments cover every existing category exactly once', () => {
  const sections = JSON.parse(fs.readFileSync('shared/catalog-sections.json'));
  const categorySource = fs.readFileSync('client/src/content/partsCatalog.ts', 'utf8').split('export const partCategories = [')[1].split('] as const;')[0];
  const expected = [...categorySource.matchAll(/id: "([^"]+)"/g)].map(match => match[1]);
  const grouped = sections.flatMap(section => section.categories);
  assert.equal(new Set(grouped).size, grouped.length);
  assert.deepEqual(grouped.toSorted(), expected.toSorted());
  assert(sections.find(section => section.id === 'engines').categories.includes('fuel-pumps'));
  assert(sections.find(section => section.id === 'electrical').categories.includes('wiring-harnesses'));
  assert(!sections.find(section => section.id === 'hydraulics').categories.includes('fuel-pumps'));
});

test('pagination handles invalid links without losing OEM, language or attribution parameters', () => {
  assert.equal(CATALOG_PAGE_SIZE, 10);
  for (const invalid of ['', 'page=-1', 'page=0', 'page=2.5', 'page=1e3', 'page=NaN', 'page=99999999999999999']) assert.equal(catalogPage(invalid), 1);
  assert.equal(catalogPage('q=CAT&page=3'), 3);
  const query = 'q=267-2755+CAT+432E&lang=ru&utm_source=google&page=2';
  const next = new URL(catalogPageHref('/catalog/category/hydraulic-pumps/', query, 3), 'https://acahydraulic.kz');
  assert.equal(next.searchParams.get('q'), '267-2755 CAT 432E');
  assert.equal(next.searchParams.get('utm_source'), 'google');
  assert.equal(next.searchParams.get('lang'), 'ru');
  assert.equal(next.searchParams.get('page'), '3');
  assert(!new URL(catalogPageHref(next.pathname, next.search, 1), next.origin).searchParams.has('page'));
});

test('page controls always reach the first, current and last page with bounded output', () => {
  for (const pages of [1, 2, 3, 4, 50, 1000]) for (const page of [1, Math.ceil(pages / 2), pages]) {
    const controls = catalogPageNumbers(page, pages);
    const numbers = controls.filter(value => typeof value === 'number');
    assert(numbers.includes(1) && numbers.includes(page) && numbers.includes(pages));
    assert(numbers.every(value => value >= 1 && value <= pages));
    assert.equal(new Set(numbers).size, numbers.length);
    assert(controls.length <= 9);
    assert.deepEqual(numbers.toSorted((a, b) => a - b), numbers);
  }
});

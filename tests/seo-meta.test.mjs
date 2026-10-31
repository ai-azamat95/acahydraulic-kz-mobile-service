import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compactSeoDescription,
  compactSeoTitleBase,
  formatSeoTitle,
} from '../shared/seo-meta.mjs';

test('SEO titles keep one brand suffix and stay within the search-result budget', () => {
  const title = formatSeoTitle('Замена гидронасоса SANY SY365H: поставка K5V160DT и запуск на видео');
  assert.ok(title.length <= 68);
  assert.equal((title.match(/ACA Hydraulic/g) || []).length, 1);
  assert.match(title, /SANY SY365H/u);
  assert.equal(formatSeoTitle('Контакты | ACA Hydraulic'), 'Контакты | ACA Hydraulic');
});

test('SEO title base does not split a word when a useful boundary is available', () => {
  const title = compactSeoTitleBase('Гидронасос 708-2L-00500 для экскаватора Komatsu PC200-8', 44);
  assert.ok(title.length <= 44);
  assert.doesNotMatch(title, /экскаватор$/u);
  assert.match(title, /708-2L-00500/u);
  assert.doesNotMatch(compactSeoTitleBase('Электрическая запчасть 0437411 Solenoid Valve for Hitachi EX200-3', 52), /\bfor$/iu);
});

test('SEO descriptions prefer complete sentences and enforce the snippet budget', () => {
  const source = 'Диагностика гидравлики на объекте. Проверяем давление, температуру и работу под нагрузкой. Стоимость и сроки согласуем до выезда и ремонта.';
  const description = compactSeoDescription(source, 110);
  assert.ok(description.length <= 110);
  assert.equal(description, 'Диагностика гидравлики на объекте. Проверяем давление, температуру и работу под нагрузкой.');
});

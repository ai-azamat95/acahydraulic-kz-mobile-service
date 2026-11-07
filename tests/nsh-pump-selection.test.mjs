import test from 'node:test';
import assert from 'node:assert/strict';
import { nshPumpRequestHref, renderNshPumpSelection } from '../shared/nsh-pump-selection.mjs';

test('each advertised NSh series prepares a specific enquiry to ACA', () => {
  for (const number of [10, 32, 50, 100]) {
    const url = new URL(nshPumpRequestHref(`nsh-${number}`));
    assert.equal(url.origin + url.pathname, 'https://wa.me/77714177925');
    const text = url.searchParams.get('text');
    assert.ok(text.includes(`НШ-${number}`));
    assert.match(text, /Полная маркировка насоса/);
    assert.match(text, /Город и количество/);
    assert.match(text, /исполнение, вращение, цену и срок/);
    assert.match(text, /#nsh-selection$/);
  }
  assert.throws(() => nshPumpRequestHref('nsh-999'), /Unknown NSh series/);
  assert.throws(() => nshPumpRequestHref('<script>'), /Unknown NSh series/);
});

test('selection remains actionable without JavaScript and does not invent inventory', () => {
  const html = renderNshPumpSelection();
  assert.equal((html.match(/href="https:\/\/wa.me\//g) || []).length, 5);
  assert.match(html, /Цену, наличие и срок подтверждаем после проверки/);
  assert.doesNotMatch(html, /application\/ld\+json|InStock|"@type"|₸|бесплатно|24\/7/);
  const other = new URL(nshPumpRequestHref('other')).searchParams.get('text');
  assert.match(other, /по маркировке или фотографии/);
  assert.doesNotMatch(other, /Нужен насос НШ-\d/);
});

test('Kazakh and English selections retain the model, contact and qualification steps', () => {
  assert.match(renderNshPumpSelection('kz'), /Серияны таңдаңыз|Серияны|серияны таңдаңыз/);
  assert.match(renderNshPumpSelection('en'), /Choose the series/);
  for (const language of ['kz', 'en']) {
    const text = new URL(nshPumpRequestHref('nsh-50', language)).searchParams.get('text');
    assert.ok(text.includes('НШ-50'));
    assert.ok(text.includes('____'));
  }
});

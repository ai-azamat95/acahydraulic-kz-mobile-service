import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('return policy is published with the confirmed shipping and defect terms', () => {
  const html = fs.readFileSync('dist/public/delivery-and-returns/index.html', 'utf8');
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.match(html, /180 000–200 000/);
  assert.match(html, /в течение 3 суток/);
  assert.match(html, /14 дней после получения/);
  assert.match(html, /оплачивает клиент/);
  assert.match(html, /не ограничивают обязательные права покупателя/);
  assert.match(html, /https:\/\/acahydraulic.kz\/delivery-and-returns\//);
});

test('Merchant feed contains only three approved offers with conservative delivery cost', () => {
  const xml = fs.readFileSync('dist/public/feeds/google-merchant-pumps.xml', 'utf8');
  assert.equal((xml.match(/<item>/g) || []).length, 3);
  assert.equal((xml.match(/<g:price>1600000 KZT<\/g:price>/g) || []).length, 2);
  assert.equal((xml.match(/<g:price>1700000 KZT<\/g:price>/g) || []).length, 1);
  assert.equal((xml.match(/<g:price>200000 KZT<\/g:price>/g) || []).length, 3);
  assert.equal((xml.match(/<g:max_handling_time>3<\/g:max_handling_time>/g) || []).length, 3);
  assert.equal((xml.match(/<g:availability>in_stock<\/g:availability>/g) || []).length, 3);
  assert.doesNotMatch(xml, /<g:(?:gtin|mpn|availability_date)>/);
});

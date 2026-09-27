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

test('Merchant feed contains four enriched offers and preserves item-specific delivery cost', () => {
  const xml = fs.readFileSync('dist/public/feeds/google-merchant-pumps.xml', 'utf8');
  assert.equal((xml.match(/<item>/g) || []).length, 4);
  assert.equal((xml.match(/<g:price>1600000 KZT<\/g:price>/g) || []).length, 2);
  assert.equal((xml.match(/<g:price>1700000 KZT<\/g:price>/g) || []).length, 1);
  assert.equal((xml.match(/<g:price>2530000 KZT<\/g:price>/g) || []).length, 1);
  assert.equal((xml.match(/<g:price>200000 KZT<\/g:price>/g) || []).length, 3);
  assert.equal((xml.match(/<g:price>0 KZT<\/g:price>/g) || []).length, 1);
  assert.equal((xml.match(/<g:max_handling_time>3<\/g:max_handling_time>/g) || []).length, 3);
  assert.equal((xml.match(/<g:availability>in_stock<\/g:availability>/g) || []).length, 4);
  assert.equal((xml.match(/<g:identifier_exists>no<\/g:identifier_exists>/g) || []).length, 3);
  assert.equal((xml.match(/<g:identifier_exists>yes<\/g:identifier_exists>/g) || []).length, 1);
  assert.equal((xml.match(/<g:google_product_category>1795<\/g:google_product_category>/g) || []).length, 4);
  assert.equal((xml.match(/<g:product_type>Запчасти для спецтехники &gt; Гидравлика &gt; Гидронасосы<\/g:product_type>/g) || []).length, 4);
  assert.equal((xml.match(/<g:shipping_label>heavy_hydraulic_pump<\/g:shipping_label>/g) || []).length, 3);
  assert.equal((xml.match(/<g:shipping_label>shipping_included<\/g:shipping_label>/g) || []).length, 1);
  assert.equal((xml.match(/<g:custom_label_[0-4]>/g) || []).length, 20);
  assert.equal((xml.match(/<g:additional_image_link>/g) || []).length, 11);
  assert.match(xml, /Гидронасос K3V112DT для Volvo EC210B/);
  assert.match(xml, /Гидронасос K5V160DT 14632316 для Volvo EC300D \/ EC350D/);
  assert.match(xml, /YF10V00006F1 \/ YF10V00006F3 \/ YN10V00043F1/);
  assert.match(xml, /HANDOK H5V80DTP-12T YKSKR-9K00/);
  assert.match(xml, /<g:brand>HANDOK<\/g:brand>/);
  assert.match(xml, /<g:mpn>YKSKR-9K00<\/g:mpn>/);
  assert.doesNotMatch(xml, /<g:(?:gtin|availability_date)>/);
});

import fs from 'node:fs';
import assert from 'node:assert/strict';
import { approvedPumpPrices } from './catalog-approved-prices.mjs';

const data = JSON.parse(fs.readFileSync(new URL('../shared/merchant-pumps.json', import.meta.url), 'utf8'));
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const element = (name, value) => value === undefined || value === null || value === '' ? '' : `<g:${name}>${xml(value)}</g:${name}>`;

const items = data.products.map(product => {
  assert.equal(product.price, `${approvedPumpPrices.find(item => item.handle === product.handle)?.priceKzt} KZT`, 'Merchant price must match the approved catalog price');
  assert(product.link.startsWith('https://acahydraulic.kz/catalog/'));
  assert(['in_stock', 'out_of_stock', 'preorder', 'backorder'].includes(product.availability));
  assert(product.description.length >= 150, `${product.id} needs a useful product-specific description`);

  const additionalImages = (product.additional_image_links || [])
    .filter(link => link && link !== product.image_link)
    .slice(0, 10)
    .map(link => element('additional_image_link', link))
    .join('');
  const customLabels = (product.customLabels || [])
    .slice(0, 5)
    .map((label, index) => element(`custom_label_${index}`, label))
    .join('');
  const highlights = [
    'Новый гидронасос в сборе',
    'Проверка исполнения по шильдику до оплаты',
    'Отгрузка в течение 3 суток после полной оплаты',
  ].map(value => element('product_highlight', value)).join('');

  return `<item>${element('id', product.id)}${element('title', product.title)}${element('description', `${product.description} ${data.terms.ru}`)}${element('link', product.link)}${element('image_link', product.image_link)}${additionalImages}${element('price', product.price)}${element('condition', 'new')}${element('availability', product.availability)}${element('identifier_exists', product.identifierExists ? 'yes' : 'no')}${element('google_product_category', data.googleProductCategory)}${element('product_type', data.productType)}${element('shipping_label', 'heavy_hydraulic_pump')}${customLabels}${highlights}${element('min_handling_time', data.handlingMinDays)}${element('max_handling_time', data.handlingMaxDays)}<g:shipping>${element('country', 'KZ')}${element('service', 'Доставка по Казахстану')}${element('price', `${data.shippingPriceKzt} KZT`)}</g:shipping></item>`;
});

fs.mkdirSync('dist/public/feeds', { recursive: true });
fs.writeFileSync('dist/public/feeds/google-merchant-pumps.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>ACA Hydraulic — гидронасосы</title><link>https://acahydraulic.kz/catalog/</link><description>Согласованные насосы с отгрузкой в течение 3 суток после оплаты</description>${items.join('')}</channel></rss>`);

console.log(`Merchant feed: ${items.length} approved pumps`);

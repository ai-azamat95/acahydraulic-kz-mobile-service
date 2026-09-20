import fs from 'node:fs';
import assert from 'node:assert/strict';
import { approvedPumpPrices } from './catalog-approved-prices.mjs';

const data = JSON.parse(fs.readFileSync(new URL('../shared/merchant-pumps.json', import.meta.url), 'utf8'));
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const items = data.products.map(product => {
  assert.equal(product.price, `${approvedPumpPrices.find(item => item.handle === product.handle)?.priceKzt} KZT`, 'Merchant price must match the approved catalog price');
  assert(product.link.startsWith('https://acahydraulic.kz/catalog/'));
  return `<item><g:id>${xml(product.id)}</g:id><g:title>${xml(product.title)}</g:title><g:description>${xml(data.terms.ru)}</g:description><g:link>${xml(product.link)}</g:link><g:image_link>${xml(product.image_link)}</g:image_link><g:price>${xml(product.price)}</g:price><g:condition>new</g:condition><g:availability>${data.availability}</g:availability><g:min_handling_time>${data.handlingMinDays}</g:min_handling_time><g:max_handling_time>${data.handlingMaxDays}</g:max_handling_time><g:shipping><g:country>KZ</g:country><g:service>Доставка по Казахстану</g:service><g:price>${data.shippingPriceKzt} KZT</g:price></g:shipping></item>`;
});
fs.mkdirSync('dist/public/feeds', { recursive: true });
fs.writeFileSync('dist/public/feeds/google-merchant-pumps.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>ACA Hydraulic — гидронасосы</title><link>https://acahydraulic.kz/catalog/</link><description>Согласованные насосы с отгрузкой в течение 3 суток после оплаты</description>${items.join('')}</channel></rss>`);
console.log(`Merchant feed: ${items.length} approved pumps`);

import assert from 'node:assert/strict';
import test from 'node:test';
import sealDraftData from '../shared/catalog-hydraulic-seal-drafts.json' with { type: 'json' };
import {
  EXPECTED_PART_NUMBERS,
  publishedSealProducts,
  sealProductsFromDraftData,
  validateSealDrafts,
} from '../scripts/catalog-seal-products.mjs';
import {
  buildCatalogInquiryMessage,
  buildCatalogWhatsappUrl,
  CATALOG_WHATSAPP_NUMBER,
} from '../shared/catalog-inquiry.mjs';

test('the supplier shortlist is preserved as exactly 12 unpublished positions', () => {
  const products = validateSealDrafts();
  assert.deepEqual(products.map(product => product.partNumber), EXPECTED_PART_NUMBERS);
  assert.equal(products.length, 12);
  assert.equal(products.every(product => product.publicationStatus === 'draft'), true);
  assert.deepEqual(publishedSealProducts, []);
});

test('draft safety gate rejects unapproved brand and commercial claims', () => {
  const data = structuredClone(sealDraftData);
  data.products[0].brand = 'Supplier brand';
  assert.throws(() => validateSealDrafts(data), /forbidden draft field brand/);

  const expanded = structuredClone(sealDraftData);
  expanded.products.push(structuredClone(expanded.products[0]));
  assert.throws(() => validateSealDrafts(expanded), /exactly the confirmed 12 positions/);
});

test('only a fully resolved position can become a request-only catalogue product', () => {
  const data = structuredClone(sealDraftData);
  const product = data.products[0];
  product.publicationStatus = 'ready';
  product.blockingQuestions = [];
  product.materialStatus = 'not-provided';
  product.dimensions[0].meaning = 'Размер A';
  product.dimensions[1].meaning = 'Размер B';
  product.dimensions[2].meaning = 'Размер C';

  const [published] = sealProductsFromDraftData(data);
  assert.equal(published.sku, product.partNumber);
  assert.equal(published.available, false);
  assert.equal(published.minPriceKzt, null);
  assert.equal(published.maxPriceKzt, null);
  assert.equal(published.imageUrl, null);
  assert.equal(published.brand, undefined);
  assert.equal(published.catalogInquiry.partNumber, product.partNumber);
  assert.equal(published.catalogSpecifications.some(item => item.label === 'Материал'), false);
});

test('WhatsApp request uses the existing number and only product inquiry fields', () => {
  const inquiry = {
    kind: 'hydraulic-seal',
    partNumber: 'DLW06000750040U',
    type: 'Пылезащитное уплотнение пальца',
    dimensions: '60 × 75 × 4 мм',
  };
  const url = 'https://acahydraulic.kz/catalog/uplotnenie-dlw06000750040u/';
  const message = buildCatalogInquiryMessage({ inquiry, quantity: '  3 шт.  ', url });
  assert.equal(message, [
    'Здравствуйте! Нужен подбор гидравлического уплотнения.',
    'Артикул: DLW06000750040U',
    'Тип: Пылезащитное уплотнение пальца',
    'Размеры: 60 × 75 × 4 мм',
    'Количество: 3 шт.',
    `Ссылка: ${url}`,
    '',
    'Прошу уточнить возможность поставки, стоимость и срок. При необходимости отправлю фото старого уплотнения и шильдика техники.',
  ].join('\n'));

  const whatsappUrl = new URL(buildCatalogWhatsappUrl({ inquiry, url }));
  assert.equal(whatsappUrl.hostname, 'wa.me');
  assert.equal(whatsappUrl.pathname, `/${CATALOG_WHATSAPP_NUMBER}`);
  assert.match(whatsappUrl.searchParams.get('text'), /Количество: уточню/);
});

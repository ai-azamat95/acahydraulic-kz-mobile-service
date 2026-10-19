import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  catalogCategoryCorrections,
  deferredCatalogCategoryCorrections,
} from '../shared/catalog-category-corrections.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_INDEX = path.join(ROOT, 'client', 'public', 'catalog-data', 'search-index.json');
const DEFAULT_REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_DATE = '2026-10-17';

const PRICE_REVIEW_CATEGORIES = new Set([
  'hydraulic-pumps',
  'hydraulic-motors',
  'gear-pumps',
  'piston-pumps',
]);

// These prices have their own saved owner confirmation or an explicitly
// reviewed price record. They must not be mixed into the legacy review queue.
export const individuallyConfirmedPriceIds = new Set([
  '8660130791586',
  '8641961164962',
  '8641961132194',
  '8714977902754',
  'ACA-HANDOK-H5V80DTP-12T-YKSKR-9K00',
  'ACA-XCMG-803001730-XZ200E',
  '8730231636130',
]);

function isHydrauvisionPriceBatch(product) {
  return String(product.id).startsWith('ACA-PUMP-') || String(product.id) === '8705189118114';
}

function displayTitle(product) {
  return product.catalogTitle || product.title || product.handle;
}

function productUrl(product) {
  return `https://acahydraulic.kz/catalog/${product.handle}/`;
}

export function priceReviewRows(products) {
  return products
    // Keep the original 778-position price queue stable after the separately
    // approved taxonomy corrections. Reclassification does not verify price.
    .filter((product) => {
      const originalCategory = catalogCategoryCorrections[String(product.id)]?.previousCategory || product.category;
      return PRICE_REVIEW_CATEGORIES.has(originalCategory);
    })
    .filter((product) => Number.isFinite(product.minPriceKzt) && product.minPriceKzt > 0)
    .filter((product) => !isHydrauvisionPriceBatch(product))
    .filter((product) => !individuallyConfirmedPriceIds.has(String(product.id)))
    .map((product) => ({
      id: String(product.id),
      brand: product.brand || '',
      sku: product.mpn || product.sku || '',
      title: displayTitle(product),
      category: catalogCategoryCorrections[String(product.id)]?.previousCategory || product.category,
      currentCategory: product.category,
      currentMinPriceKzt: product.minPriceKzt,
      currentMaxPriceKzt: product.maxPriceKzt,
      url: productUrl(product),
      reviewStatus: 'Требуется индивидуальная сверка',
      reviewReason: 'В каталоге есть числовая цена, но в репозитории нет отдельной записи с её подтверждением владельцем или проверенным источником.',
    }))
    .sort((left, right) => left.category.localeCompare(right.category, 'en') || left.title.localeCompare(right.title, 'ru'));
}

export function categoryReviewRows(products) {
  const byId = new Map(products.map((product) => [String(product.id), product]));
  const corrected = Object.entries(catalogCategoryCorrections).map(([id, correction]) => {
    const product = byId.get(id);
    if (!product) throw new Error(`Reviewed category product is missing: ${id}`);
    return {
      id,
      brand: product.brand || '',
      sku: product.mpn || product.sku || '',
      title: displayTitle(product),
      previousCategory: correction.previousCategory,
      currentCategory: product.category,
      reviewedCategory: correction.category,
      status: 'Исправлено',
      evidence: correction.evidenceTitle,
      currentPriceKzt: product.minPriceKzt,
      url: productUrl(product),
      action: 'Категории исправлены по ID; название, URL, цена и остальные поля сохранены.',
    };
  });
  const deferred = Object.entries(deferredCatalogCategoryCorrections).map(([id, item]) => {
    const product = byId.get(id);
    if (!product) throw new Error(`Deferred category product is missing: ${id}`);
    return {
      id,
      brand: product.brand || '',
      sku: product.mpn || product.sku || '',
      title: displayTitle(product),
      previousCategory: product.category,
      currentCategory: product.category,
      reviewedCategory: '',
      status: 'Отложено',
      evidence: item.reason,
      currentPriceKzt: product.minPriceKzt,
      url: productUrl(product),
      action: 'Не менять до подтверждения типа редуктора и подходящей категории.',
    };
  });
  return [...corrected, ...deferred].sort(
    (left, right) => left.status.localeCompare(right.status, 'ru') || left.previousCategory.localeCompare(right.previousCategory, 'en') || left.title.localeCompare(right.title, 'ru'),
  );
}

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  return `${headers.join(',')}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')).join('\n')}\n`;
}

function categoryBreakdown(rows, key) {
  return Object.fromEntries(
    [...new Set(rows.map((row) => row[key]))]
      .sort()
      .map((category) => [category, rows.filter((row) => row[key] === category).length]),
  );
}

function summaryMarkdown(priceRows, categoryRows) {
  const categoryTable = categoryRows.map((row) =>
    `| ${row.id} | ${row.title.replaceAll('|', '\\|')} | ${row.previousCategory} | ${row.reviewedCategory || '—'} | ${row.status} |`,
  ).join('\n');
  const correctedCount = categoryRows.filter((row) => row.status === 'Исправлено').length;
  const deferredCount = categoryRows.filter((row) => row.status === 'Отложено').length;
  return `# Проверка цен и категорий каталога — ${REPORT_DATE}

Отчёт фиксирует очередь ручной проверки. Он не меняет цены и категории и не является доказательством ошибки каждой позиции.

## Цены

- ${priceRows.length} старых позиций имеют числовую цену, но не имеют отдельной сохранённой записи с подтверждением владельцем или проверенным источником.
- В выборку входят только категории гидронасосов, гидромоторов, шестерёнчатых и поршневых насосов.
- Исключены 105 насосов Hydrauvision с сохранённой формулой расчёта и семь индивидуально подтверждённых позиций ACA.
- Полный список и текущие цены: [catalog-price-review-${REPORT_DATE}.csv](./catalog-price-review-${REPORT_DATE}.csv).

Разбивка: ${JSON.stringify(categoryBreakdown(priceRows, 'category'))}.

## Категории

- ${categoryRows.length} позиций прошли отдельную проверку категории: ${correctedCount} доказанных исправлений применены, ${deferredCount} позиций отложены до уточнения типа узла.
- Исправления ограничены сохранённым списком ID и меняют только поля category/categories.
- Названия, URL, цены, изображения и коммерческие поля не менялись.
- CSV: [catalog-category-review-${REPORT_DATE}.csv](./catalog-category-review-${REPORT_DATE}.csv).

Разбивка по статусу: ${JSON.stringify(categoryBreakdown(categoryRows, 'status'))}.

| ID | Наименование | Было | Проверенная категория | Статус |
|---|---|---|---|---|
${categoryTable}

## Правило работы со списками

Перед изменением цены сверить валюту, дату курса, исходную стоимость, формулу, оригинал/аналог и источник. Перед сменой категории открыть исходную карточку и подтвердить, что продаётся полный узел, а не деталь, клапан, мотор или редуктор. До подтверждения карточки и цены остаются без автоматических изменений.
`;
}

export function buildCommercialReview(products) {
  const prices = priceReviewRows(products);
  const categories = categoryReviewRows(products);
  return { prices, categories };
}

export function writeCommercialReview({ indexFile = DEFAULT_INDEX, reportDir = DEFAULT_REPORT_DIR } = {}) {
  const products = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const review = buildCommercialReview(products);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, `catalog-price-review-${REPORT_DATE}.csv`), toCsv(review.prices));
  fs.writeFileSync(path.join(reportDir, `catalog-category-review-${REPORT_DATE}.csv`), toCsv(review.categories));
  fs.writeFileSync(path.join(reportDir, `catalog-commercial-review-${REPORT_DATE}.md`), summaryMarkdown(review.prices, review.categories));
  return { priceRows: review.prices.length, categoryRows: review.categories.length, reportDir };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const indexArgument = process.argv.find((argument) => argument.startsWith('--index='))?.slice('--index='.length);
  const reportArgument = process.argv.find((argument) => argument.startsWith('--report-dir='))?.slice('--report-dir='.length);
  console.log(JSON.stringify(writeCommercialReview({
    indexFile: indexArgument ? path.resolve(indexArgument) : DEFAULT_INDEX,
    reportDir: reportArgument ? path.resolve(reportArgument) : DEFAULT_REPORT_DIR,
  }), null, 2));
}

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import {
  HYDRAUVISION_EXCHANGE_RATE_KZT,
  HYDRAUVISION_MARKUP,
  HYDRAUVISION_PRICE_ADJUSTMENTS,
  HYDRAUVISION_ROUNDING_KZT,
  hydrauvisionPriceAdjustmentForSourceId,
  hydrauvisionRetailPriceKzt,
} from './lib/hydrauvision-pricing.mjs';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const RUN_DATE = '2026-10-17';
const SOURCE_URL = 'https://webshop.hydrauvision.com/pumps';
const SOURCE_REPORTED_COUNT = 234;
const OUTPUT_DIR = path.join(ROOT, 'data', `hydrauvision-pumps-${RUN_DATE.replaceAll('-', '')}`);
const PUBLIC_ASSET_FOLDER = `supplier-pumps-${RUN_DATE.replaceAll('-', '')}`;
const ASSET_DIR = path.join(ROOT, 'client', 'public', 'catalog-assets', PUBLIC_ASSET_FOLDER);
const PRODUCT_OUTPUT = path.join(ROOT, 'shared', 'catalog-hydrauvision-products.json');
const PRICE_NOTE = 'Ориентировочная цена для рынка Казахстана на 17.10.2026. Доставка, таможенные платежи и налоги не включены. Наличие, исполнение и итоговую стоимость подтверждаем в предложении.';
const CANONICAL_PRODUCTS_BY_SOURCE_ID = new Map([
  [1799, {
    id: '8705189118114',
    handle: 'pgh4-3x-050re11vu2-internal-gear-pump-rexroth-r901147104',
    imageUrl: `/catalog-assets/${PUBLIC_ASSET_FOLDER}/pgh4-3x-050re11vu2-internal-gear-pump-rexroth-r901147104.webp`,
    imageSourceUrl: 'https://ai-azamat95.github.io/acahydraulic-catalog-images/catalog/v2/8705189118114/01-5b0d58178c5a74cd.webp',
    reason: 'Exact existing catalogue match by Rexroth number R901147104 and execution PGH4-3X/050RE11VU2.',
  }],
]);
const SOURCE_IDS_WITH_VISIBLE_SUPPLIER_BRANDING = new Set([
  217, 1546, 1613, 1763, 1766, 1769, 1770, 1775, 1786, 1790,
  1797, 1799, 1801, 1811, 1818, 1826, 1843, 1844, 1845,
]);
const SOURCE_IDS_WITH_SERIES_ILLUSTRATIONS = new Set([1900, 1901]);

const args = Object.fromEntries(process.argv.slice(2).map(argument => {
  const [key, ...rest] = argument.replace(/^--/, '').split('=');
  return [key, rest.length ? rest.join('=') : true];
}));
const rawPath = path.resolve(String(args.source || path.join(OUTPUT_DIR, 'source-snapshot.json')));
const downloadImages = args['no-download'] !== true;

function normalizeSpace(value) {
  return String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function slug(value) {
  return normalizeSpace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function originalImageUrl(images = []) {
  const url = images[0]?.url || '';
  return url.replace(/\/cache\/[0-9a-f]+\//, '/');
}

function sourcePrice(item, key) {
  const value = item.price_info?.extension_attributes?.tax_adjustments?.[key];
  return Number.isFinite(value) ? Number(value) : null;
}

function decisionFor(name) {
  const value = normalizeSpace(name);
  if (/\b83095379\b/.test(value)) return { decision: 'held', reason: 'Source title says pump, but the H1B code belongs to the Danfoss bent-axis motor family; do not publish as a pump without clarification.' };
  if (/\bpump configurator\b/i.test(value)) return { decision: 'excluded', reason: 'Configurator, not a stocked pump execution.' };
  if (/\b(?:mounting|conversion|connector|control|seal|bearing|piston) kit\b/i.test(value)) return { decision: 'excluded', reason: 'Pump component or repair kit, not a complete pump.' };
  if (/\bpump housing\b|\bshaft pump\b|\bgasket charge pump\b|\bdrive shaft charge pump\b/i.test(value)) return { decision: 'excluded', reason: 'Pump component, not a complete pump.' };
  if (/\bpump\b/i.test(value)) return { decision: 'published', reason: /motor\s*\/\s*pump/i.test(value) ? 'Dual-purpose hydraulic motor/pump explicitly listed by the source.' : /charge pump/i.test(value) ? 'Complete charge pump.' : 'Complete pump listing.' };
  return { decision: 'excluded', reason: 'Pump component or unrelated item in the source category.' };
}

function brandFor(name) {
  const value = normalizeSpace(name);
  if (/Bosch Rexroth/i.test(value)) return 'Bosch Rexroth';
  if (/Sauer Danfoss|Danfoss/i.test(value)) return 'Danfoss';
  if (/Parker/i.test(value)) return 'Parker';
  if (/Eaton/i.test(value)) return 'Eaton';
  if (/Daikin/i.test(value)) return 'Daikin';
  if (/Denison/i.test(value)) return 'Denison';
  if (/Von Roll/i.test(value)) return 'Von Roll';
  throw new Error(`Cannot determine manufacturer from source title: ${name}`);
}

function mpnFor(item) {
  const name = normalizeSpace(item.name);
  const leading = name.match(/^([A-Z0-9][A-Z0-9.-]*)\s+(?:Sauer\s+)?Danfoss\b/i)?.[1];
  if (leading) return leading;
  const rexroth = item.url.match(/-(r\d{6,})$/i)?.[1];
  if (rexroth) return rexroth.toUpperCase();
  const patterns = [
    /Bosch Rexroth .*? Pump\s+-?\s*(?:\d+(?:\.\d+)?\s*cc\/rev\s+-\s+)?([A-Z0-9][A-Z0-9/-]+)$/i,
    /Parker Gear Pump\s+([^\s]+)\b/i,
    /Parker Piston Pump(?:\s+-\s+\d+(?:\.\d+)?\s*cc\/rev\s+-|\s+)\s*([A-Z0-9][A-Z0-9/-]+)\s*$/i,
    /Parker Vane Pump\s+(.+)$/i,
    /Eaton Piston Pump.*\s-\s([A-Z0-9][A-Z0-9/-]+)$/i,
    /Daikin Piston Pump\s+(.+?)\s+-\s+\d+(?:\.\d+)?\s*cc\/rev$/i,
    /Denison Vane Pump\s+(.+)$/i,
    /Von Roll Motor\s*\/\s*Pump\s+(.+?)\s+-\s+\d+(?:\.\d+)?\s*cc\/rev$/i,
  ];
  for (const pattern of patterns) {
    const match = name.match(pattern)?.[1];
    if (match) return normalizeSpace(match);
  }
  throw new Error(`Cannot determine exact pump reference from source title: ${name}`);
}

function kindFor(name, sourceId) {
  const value = normalizeSpace(name);
  if (Number(sourceId) === 1978) return { key: 'piston', type: 'Поршневой насос', category: 'piston-pumps' };
  if (/Motor\s*\/\s*Pump/i.test(value)) return { key: 'motor-pump', type: 'Гидроагрегат мотор/насос', category: 'hydraulic-pumps' };
  if (/Charge Pump/i.test(value)) return { key: 'charge', type: 'Подпиточный насос', category: 'hydraulic-pumps' };
  if (/Internal Gear Pump/i.test(value)) return { key: 'gear', type: 'Шестерёнчатый насос внутреннего зацепления', category: 'gear-pumps' };
  if (/Gear Pump/i.test(value)) return { key: 'gear', type: 'Шестерёнчатый насос', category: 'gear-pumps' };
  if (/Axial Piston Pump/i.test(value)) return { key: 'piston', type: 'Аксиально-поршневой насос', category: 'piston-pumps' };
  if (/Radial Piston Pump/i.test(value)) return { key: 'piston', type: 'Радиально-поршневой насос', category: 'piston-pumps' };
  if (/Piston Pump/i.test(value)) return { key: 'piston', type: 'Поршневой насос', category: 'piston-pumps' };
  if (/Vane Pump/i.test(value)) return { key: 'vane', type: 'Пластинчатый насос', category: 'hydraulic-pumps' };
  throw new Error(`Cannot classify published pump: ${name}`);
}

function imageExclusionReason(item, audit) {
  if (/\/placeholder\//.test(audit.sourceImageUrl || '')) return 'Source listing has only a supplier placeholder, not a product image.';
  if (Number(item.id) === 1845) return 'Source image label identifies TF40-P161 while the listing identifies TF40-P162.';
  if (Number(item.id) === 1968) return 'Source A4VG90 listing reuses an A11VLO-series image; it is not safe as an exact product image.';
  if (SOURCE_IDS_WITH_VISIBLE_SUPPLIER_BRANDING.has(Number(item.id))) return 'Source image visibly contains supplier branding; omitted from the ACA catalogue.';
  return null;
}

function detailsFor(name, mpn) {
  const value = normalizeSpace(name);
  const rexrothSeries = /^R\d+$/i.test(mpn)
    ? value.match(/^Bosch Rexroth\s+([A-Z0-9][A-Z0-9/-]*(?:\s+\d+)?)\s+Piston Pump\b/i)?.[1]
    : '';
  const danfossSeriesCandidate = value.match(
    /^(?:[A-Z0-9.-]+\s+)?(?:Sauer\s+)?Danfoss\s+([A-Z][A-Z0-9/-]*(?:\s+\d+)?)\s+(?:Axial Piston|Radial Piston|Piston|Charge) Pump\b/i,
  )?.[1];
  const danfossSeries = /\d/.test(danfossSeriesCandidate || '') ? danfossSeriesCandidate : '';
  const series = normalizeSpace(rexrothSeries || danfossSeries);
  const displacementSource = value.match(/(\d+(?:\.\d+)?(?:\s*\+\s*\d+(?:\.\d+)?)?\s*(?:cc|cm³)\/rev)/i)?.[1] || '';
  const displacement = displacementSource.replace(/\s*(?:cc|cm³)\/rev/i, ' см³/об').replaceAll('.', ',');
  let configuration = value
    .replace(/^.*?\b(?:Axial Piston|Radial Piston|Internal Gear|Piston|Gear|Vane) Pump\b\s*/i, '')
    .replace(/^.*?Motor\s*\/\s*Pump\s*/i, '')
    .replace(/^.*?Charge Pump\s*/i, '')
    .replace(/\bPUMP OVERHAULED\b/ig, '')
    .trim();
  if (displacementSource) {
    configuration = configuration
      .replace(new RegExp(`\\s*[-–]?\\s*${escapeRegExp(displacementSource)}\\s*[-–]?\\s*`, 'i'), ' - ')
      .replace(/^(?:\s*[-–]\s*)+|(?:\s*[-–]\s*)+$/g, '')
      .replace(/\s*[-–]\s*[-–]\s*/g, ' - ')
      .trim();
  } else {
    configuration = configuration.replace(/^[-–]\s*/, '').trim();
  }
  configuration = configuration
    .replace(new RegExp(escapeRegExp(mpn), 'ig'), ' ')
    .replace(/^(?:\s*[-–,]\s*)+|(?:\s*[-–,]\s*)+$/g, '')
    .replace(/\s*[-–]\s*[-–]\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
  const pieces = [mpn, series];
  if (displacement) pieces.push(displacement);
  if (configuration) pieces.push(configuration.replace(/^CW$/i, 'вращение по часовой стрелке (CW)'));
  return [...new Set(pieces.map(normalizeSpace).filter(Boolean))].join(', ');
}

function publicProduct(item, audit) {
  const brand = brandFor(item.name);
  const mpn = mpnFor(item);
  const kind = kindFor(item.name, item.id);
  const canonical = CANONICAL_PRODUCTS_BY_SOURCE_ID.get(Number(item.id));
  const itemHandle = canonical?.handle || `pump-${slug(brand)}-${slug(mpn)}`;
  const id = canonical?.id || `ACA-PUMP-${item.id}`;
  const calculatedPriceKzt = hydrauvisionRetailPriceKzt(audit.sourcePriceExclTaxEur, audit.sourceId);
  assert(calculatedPriceKzt, `${item.name}: published pump needs a positive source price`);
  const originalName = normalizeSpace(item.name);
  const condition = /PUMP OVERHAULED/i.test(originalName) ? 'Восстановленный' : /used equipment/i.test(audit.imageLabel) ? 'Бывший в эксплуатации' : null;
  const details = detailsFor(originalName, mpn);
  const localizedType = condition ? `${kind.type.charAt(0).toLowerCase()}${kind.type.slice(1)}` : kind.type;
  const catalogTitle = `${condition ? `${condition} ` : ''}${localizedType} ${brand} ${details}`;
  const selection = kind.category === 'gear-pumps'
    ? 'Для подбора пришлите фото шильдика и насоса со всех сторон. Сверим полный номер, рабочий объём, направление вращения, вал, фланец, расположение и размеры портов. Совпадение серии или объёма без проверки присоединения не подтверждает взаимозаменяемость.'
    : kind.category === 'piston-pumps'
      ? 'Для подбора пришлите фото шильдика и насоса со всех сторон. Сверим полный индекс исполнения, рабочий объём, направление вращения, регулятор, вал, фланец, порты, датчики и разъёмы. Совпадение серии без полного кода не подтверждает взаимозаменяемость.'
      : 'Для подбора пришлите фото шильдика и агрегата со всех сторон. Сверим полный номер, назначение, рабочий объём, направление вращения, вал, фланец, порты и исполнение управления. Возможность работы в требуемом режиме подтверждаем до заказа.';
  const imagePath = canonical?.imageUrl || (imageExclusionReason(item, audit) ? null : `/catalog-assets/${PUBLIC_ASSET_FOLDER}/${itemHandle}.webp`);
  const imageIsIllustration = /picture similar|exploded view/i.test(audit.imageLabel)
    || SOURCE_IDS_WITH_SERIES_ILLUSTRATIONS.has(Number(item.id));
  const catalogImageLabel = imageIsIllustration ? (/exploded view/i.test(audit.imageLabel) ? 'Схема серии' : 'Иллюстрация серии') : 'Фото насоса';
  const catalogImageCaption = imagePath
    ? imageIsIllustration
      ? `Изображение показывает серию ${brand}; внешний вид исполнения ${mpn} может отличаться. Маркировку и конфигурацию подтверждаем до заказа.`
      : `Изображение позиции ${brand} ${mpn}. Состояние, маркировку, комплектацию и соответствие конкретному исполнению подтверждаем до заказа.`
    : undefined;
  const categories = kind.category === 'hydraulic-pumps' ? ['hydraulic-pumps'] : ['hydraulic-pumps', kind.category];
  const statusSentence = condition ? `Состояние по данным исходной карточки: ${condition.toLowerCase()}; фактическое состояние подтверждаем перед заказом.` : '';
  return {
    id,
    handle: itemHandle,
    title: catalogTitle,
    catalogTitle,
    fitment: `Применяемость к конкретной технике не заявлена. ${selection}`,
    sku: mpn,
    mpn,
    brand,
    category: kind.category,
    categories,
    productType: kind.type,
    tags: [...new Set([brand, mpn, kind.type, catalogTitle, ...(brand === 'Danfoss' && /Sauer Danfoss/i.test(originalName) ? ['Sauer Danfoss'] : [])])],
    catalogDescription: `${catalogTitle}. ${statusSentence} ${PRICE_NOTE}`.replace(/\s+/g, ' ').trim(),
    catalogSelection: selection,
    catalogPriceNote: PRICE_NOTE,
    ...(catalogImageCaption ? { catalogImageLabel, catalogImageCaption } : {}),
    available: false,
    minPriceKzt: calculatedPriceKzt,
    maxPriceKzt: calculatedPriceKzt,
    imageUrl: imagePath,
    gallery: imagePath ? [imagePath] : [],
    variants: [{
      id: `${id}-1`,
      title: mpn,
      sku: mpn,
      available: false,
      priceKzt: calculatedPriceKzt,
      options: ['Расчётная цена; наличие подтверждается по запросу', 'Точное исполнение сверяется до заказа'],
    }],
  };
}

function auditRecord(item) {
  const name = normalizeSpace(item.name);
  const decision = decisionFor(name);
  const sourceImageUrl = originalImageUrl(item.images);
  const imageLabel = normalizeSpace(item.images?.[0]?.label);
  const sourcePriceExclTaxEur = sourcePrice(item, 'final_price');
  const sourcePriceInclVatEur = Number.isFinite(item.price_info?.final_price) ? Number(item.price_info.final_price) : null;
  const canonical = CANONICAL_PRODUCTS_BY_SOURCE_ID.get(Number(item.id));
  const selectedImageSourceUrl = canonical?.imageSourceUrl || sourceImageUrl;
  const imageReason = canonical?.imageSourceUrl ? null : imageExclusionReason(item, { sourceImageUrl, imageLabel });
  return {
    sourceId: Number(item.id),
    sourceName: name,
    sourceUrl: item.url,
    sourceType: item.type,
    sourcePriceExclTaxEur,
    sourcePriceInclVatEur,
    sourceImageUrl: sourceImageUrl || null,
    selectedImageSourceUrl: selectedImageSourceUrl || null,
    imageLabel: imageLabel || null,
    imagePublicationDecision: decision.decision === 'published' ? (imageReason ? 'excluded' : canonical?.imageSourceUrl ? 'published-existing-aca' : 'published') : 'not-applicable',
    imagePublicationReason: decision.decision === 'published' ? (canonical?.imageSourceUrl ? 'Existing ACA-managed product image mirrored to the local catalogue domain.' : imageReason) : null,
    decision: decision.decision,
    reason: decision.reason,
    ...(decision.decision === 'held' && /\b83095379\b/.test(name) ? {
      reviewEvidence: [
        'https://www.danfoss.com/en/products/dps/motors/mobile-motors/mobile-piston-motors/variable-displacement-axial-piston-motors/h1b-bent-axis-variable-motors/',
        'https://assets.danfoss.com/documents/latest/534145/BC152886483576en-001303.pdf',
      ],
    } : {}),
    ...(canonical ? { canonicalExistingProduct: canonical } : {}),
    publicId: decision.decision === 'published' ? (canonical?.id || `ACA-PUMP-${item.id}`) : null,
    calculatedPriceKzt: decision.decision === 'published' ? hydrauvisionRetailPriceKzt(sourcePriceExclTaxEur, item.id) : null,
  };
}

async function downloadProductImage(product, audit) {
  if (!product.imageUrl) return null;
  const destination = path.join(ROOT, 'client', 'public', product.imageUrl);
  const selectedImageSourceUrl = audit.selectedImageSourceUrl || audit.sourceImageUrl;
  if (!downloadImages && fs.existsSync(destination)) return imageManifestRow(product, selectedImageSourceUrl, destination);
  const response = await fetch(selectedImageSourceUrl, { headers: { 'user-agent': 'ACA Hydraulic catalog image import (authorized use; contact acahydraulic.kz)' } });
  assert(response.ok, `${selectedImageSourceUrl}: image download returned ${response.status}`);
  const body = Buffer.from(await response.arrayBuffer());
  assert(body.length > 1_000, `${selectedImageSourceUrl}: downloaded image is unexpectedly small`);
  const extension = path.extname(new URL(selectedImageSourceUrl).pathname) || '.img';
  const temporary = path.join(os.tmpdir(), `aca-hydrauvision-${audit.sourceId}${extension}`);
  fs.writeFileSync(temporary, body);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  execFileSync('cwebp', ['-quiet', '-q', '82', '-m', '6', '-metadata', 'none', temporary, '-o', destination]);
  fs.rmSync(temporary, { force: true });
  return imageManifestRow(product, selectedImageSourceUrl, destination);
}

function imageManifestRow(product, sourceUrl, destination) {
  const body = fs.readFileSync(destination);
  return {
    publicId: product.id,
    localPath: product.imageUrl,
    sourceUrl,
    sha256: createHash('sha256').update(body).digest('hex'),
    bytes: body.length,
  };
}

async function mapLimit(values, limit, mapper) {
  const output = new Array(values.length);
  let cursor = 0;
  async function worker() {
    while (cursor < values.length) {
      const index = cursor++;
      output[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker));
  return output;
}

const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
assert(Array.isArray(raw.items), 'Expected Magento products-render-info response with an items array');
assert.equal(raw.items.length, 233, 'Unexpected enumerated source count; review category changes before importing');

const missingListingOnlyItem = {
  id: 1914,
  type: 'simple',
  name: '1700956 Danfoss Shaft Pump',
  url: 'https://webshop.hydrauvision.com/1700956-danfoss-shaft-pump',
  price_info: { final_price: 258.976301, extension_attributes: { tax_adjustments: { final_price: 214.03 } } },
  images: [{ url: 'https://webshop.hydrauvision.com/media/catalog/product/placeholder/default/logo-hydrauvision-transparant-500px_1.png', label: '1700956 Danfoss Shaft Pump' }],
};
assert(!raw.items.some(item => Number(item.id) === missingListingOnlyItem.id), 'Listing-only item now exists in the API; remove the manual reconciliation record');
const sourceItems = [...raw.items, missingListingOnlyItem];
const auditProducts = sourceItems.map(auditRecord);
const publishedAudit = auditProducts.filter(item => item.decision === 'published');
const adjustedPublishedAuditByBand = HYDRAUVISION_PRICE_ADJUSTMENTS.map(adjustment => ({
  adjustment,
  products: publishedAudit.filter(item => hydrauvisionPriceAdjustmentForSourceId(item.sourceId) === adjustment),
}));
assert.equal(sourceItems.length, SOURCE_REPORTED_COUNT);
assert.equal(publishedAudit.length, 105, 'Expected 105 reviewed pump listings');
for (const { adjustment, products: adjustedProducts } of adjustedPublishedAuditByBand) {
  assert.equal(
    adjustedProducts.length,
    adjustment.expectedAffectedPublishedProducts,
    `Unexpected retail price adjustment set for original positions ${adjustment.positionFrom}-${adjustment.positionThrough}`,
  );
  assert.deepEqual(
    adjustedProducts.map(item => item.sourceId).sort((a, b) => a - b),
    [...adjustment.sourceIds].sort((a, b) => a - b),
    `Published source IDs changed for original positions ${adjustment.positionFrom}-${adjustment.positionThrough}`,
  );
}
assert.equal(auditProducts.filter(item => item.decision === 'held').length, 1, 'Expected one held source classification conflict');

const sourceById = new Map(sourceItems.map(item => [Number(item.id), item]));
const products = publishedAudit.map(audit => publicProduct(sourceById.get(audit.sourceId), audit));
assert.equal(new Set(products.map(product => product.id)).size, products.length, 'Duplicate public IDs');
assert.equal(new Set(products.map(product => product.handle)).size, products.length, 'Duplicate public handles');
assert.equal(new Set(products.map(product => product.sku)).size, products.length, 'Duplicate reviewed pump references');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(ASSET_DIR, { recursive: true });
const sourceSnapshot = {
  source: SOURCE_URL,
  capturedOn: RUN_DATE,
  description: 'Reduced snapshot of the public storefront render response used for the reviewed import.',
  items: raw.items.map(item => ({
    id: item.id,
    type: item.type,
    name: item.name,
    url: item.url,
    price_info: {
      final_price: item.price_info?.final_price ?? null,
      extension_attributes: {
        tax_adjustments: {
          final_price: item.price_info?.extension_attributes?.tax_adjustments?.final_price ?? null,
        },
      },
    },
    images: (item.images || []).slice(0, 1).map(image => ({ url: image.url, label: image.label })),
  })),
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'source-snapshot.json'), `${JSON.stringify(sourceSnapshot, null, 2)}\n`);
const productPairs = products.map(product => ({ product, audit: publishedAudit.find(item => item.publicId === product.id) }));
const localImagePairs = productPairs.filter(({ product }) => product.imageUrl?.startsWith('/catalog-assets/'));
const imageRows = (await mapLimit(localImagePairs, 4, ({ product, audit }) => downloadProductImage(product, audit))).filter(Boolean);
const expectedAssets = new Set(localImagePairs.map(({ product }) => path.basename(product.imageUrl)));
for (const file of fs.readdirSync(ASSET_DIR)) if (!expectedAssets.has(file)) fs.rmSync(path.join(ASSET_DIR, file));

const inventory = {
  source: SOURCE_URL,
  capturedOn: RUN_DATE,
  sourceReportedCount: SOURCE_REPORTED_COUNT,
  enumeratedApiCount: raw.items.length,
  listingPages: [30, 30, 30, 30, 30, 30, 30, 24].map((rows, index) => ({ page: index + 1, rows })),
  reconciliation: 'The storefront page count was 234. The public render API returned 233. Page 8 contained the missing item 1700956, a shaft rather than a complete pump, so the pump publication set is unaffected.',
  pricing: {
    currency: 'EUR',
    sourcePriceField: 'price excluding VAT',
    exchangeRateKzt: HYDRAUVISION_EXCHANGE_RATE_KZT,
    exchangeRateDate: RUN_DATE,
    exchangeRateSource: 'https://nationalbank.kz/ru/exchangerates/ezhednevnye-oficialnye-rynochnye-kursy-valyut',
    markup: HYDRAUVISION_MARKUP,
    roundingKzt: HYDRAUVISION_ROUNDING_KZT,
    priceAdjustments: adjustedPublishedAuditByBand.map(({ adjustment, products: adjustedProducts }) => ({
      method: `fixed uplift for exact source IDs at original positions ${adjustment.positionFrom}-${adjustment.positionThrough}`,
      positionFrom: adjustment.positionFrom,
      positionThrough: adjustment.positionThrough,
      sourceIds: adjustment.sourceIds,
      upliftKzt: adjustment.upliftKzt,
      ...('fromBrand' in adjustment ? { fromBrand: adjustment.fromBrand, fromSku: adjustment.fromSku } : {}),
      throughBrand: adjustment.throughBrand,
      throughSku: adjustment.throughSku,
      affectedPublishedProducts: adjustedProducts.length,
      ...('expectedMinimumRetailPriceKzt' in adjustment ? { minimumRetailPriceKzt: adjustment.expectedMinimumRetailPriceKzt } : {}),
    })),
    formula: 'round((sourcePriceExclTaxEur * exchangeRateKzt * markup) / roundingKzt) * roundingKzt + the uplift assigned to the exact source ID price band',
  },
  counts: Object.fromEntries(['published', 'held', 'excluded'].map(decision => [decision, auditProducts.filter(item => item.decision === decision).length])),
  products: auditProducts,
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'source-products.json'), `${JSON.stringify(inventory, null, 2)}\n`);
fs.writeFileSync(path.join(OUTPUT_DIR, 'image-manifest.json'), `${JSON.stringify({ capturedOn: RUN_DATE, count: imageRows.length, images: imageRows }, null, 2)}\n`);
fs.writeFileSync(PRODUCT_OUTPUT, `${JSON.stringify(products, null, 2)}\n`);

console.log(JSON.stringify({ source: sourceItems.length, published: products.length, held: inventory.counts.held, excluded: inventory.counts.excluded, images: imageRows.length }, null, 2));

import assert from 'node:assert/strict';
import sealDraftData from '../shared/catalog-hydraulic-seal-drafts.json' with { type: 'json' };

const EXPECTED_PART_NUMBERS = [
  'DLW06000750040U',
  'DLW07000850050U',
  'DLW08000950080U',
  'DLW09001050060U',
  'DKBW06000740080U',
  'DKBW07000840080U',
  'DKBW09001040080U',
  'DKBW10001140080U',
  'IUW207000830100H',
  'IUW208000950100H',
  'IUW209001050100H',
  'IUW210001150100H',
];

const SAFE_HANDLE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN_PUBLIC_FIELDS = [
  'brand',
  'manufacturer',
  'countryOfOrigin',
  'price',
  'priceKzt',
  'availability',
  'leadTime',
  'deliveryTime',
  'imageUrl',
  'gallery',
];

function validateSourceSummary(value) {
  assert(value && typeof value === 'object', 'Seal source summary is required');
  const serialized = JSON.stringify(value);
  assert(!serialized.includes('@'), 'Supplier email addresses must not enter the public repository');
  assert(!/https?:\/\//i.test(serialized), 'Private correspondence and attachment URLs are not allowed');
}

function validateDimension(dimension, product) {
  assert.equal(dimension.unit, 'mm', `${product.partNumber}: dimensions must use millimetres`);
  assert(Number.isInteger(dimension.position) && dimension.position > 0, `${product.partNumber}: invalid dimension position`);
  const values = Object.hasOwn(dimension, 'values') ? dimension.values : [dimension.value];
  assert(Array.isArray(values) && values.length > 0, `${product.partNumber}: dimension value is required`);
  assert(values.every(value => Number.isFinite(value) && value > 0), `${product.partNumber}: invalid dimension value`);
  assert(dimension.meaning === null || (typeof dimension.meaning === 'string' && dimension.meaning.trim()), `${product.partNumber}: invalid dimension meaning`);
}

export function validateSealDrafts(data = sealDraftData) {
  assert.equal(data.schemaVersion, 1, 'Unsupported hydraulic-seal draft schema');
  assert.equal(data.category, 'seals-filters', 'Hydraulic seals must use the existing seals-filters category');
  assert.equal(data.publicBrand, null, 'Supplier brand must not be published without permission');
  validateSourceSummary(data.sourceSummary);
  assert(Array.isArray(data.products), 'Hydraulic-seal products must be an array');
  assert.deepEqual(data.products.map(product => product.partNumber), EXPECTED_PART_NUMBERS, 'Seal shortlist must contain exactly the confirmed 12 positions in source order');

  const ids = new Set();
  const handles = new Set();
  for (const product of data.products) {
    assert(typeof product.id === 'string' && product.id, 'Seal draft id is required');
    assert(!ids.has(product.id), `Duplicate seal draft id: ${product.id}`);
    ids.add(product.id);
    assert(SAFE_HANDLE.test(product.handle), `${product.partNumber}: invalid handle`);
    assert(!handles.has(product.handle), `Duplicate seal handle: ${product.handle}`);
    handles.add(product.handle);
    assert(typeof product.sourceDesignation === 'string' && product.sourceDesignation.trim(), `${product.partNumber}: source designation is required`);
    assert(typeof product.confirmedType === 'string' && product.confirmedType.trim(), `${product.partNumber}: confirmed type is required`);
    assert(typeof product.dimensionString === 'string' && product.dimensionString.endsWith('мм'), `${product.partNumber}: source dimension string is required`);
    assert(Array.isArray(product.dimensions) && product.dimensions.length === 3, `${product.partNumber}: three source dimension positions are required`);
    product.dimensions.forEach(dimension => validateDimension(dimension, product));
    assert(['draft', 'ready'].includes(product.publicationStatus), `${product.partNumber}: invalid publication status`);
    assert(['unconfirmed-for-sku', 'confirmed', 'not-provided'].includes(product.materialStatus), `${product.partNumber}: invalid material status`);
    assert(Array.isArray(product.sources) && product.sources.length >= 2, `${product.partNumber}: source locators are required`);
    validateSourceSummary(product.sources);
    assert(product.proposed && typeof product.proposed === 'object', `${product.partNumber}: proposed public copy is required`);
    for (const field of ['title', 'description', 'seoTitle', 'seoDescription']) {
      assert(typeof product.proposed[field] === 'string' && product.proposed[field].includes(product.partNumber), `${product.partNumber}: ${field} must be unique and include the exact article`);
    }
    for (const field of FORBIDDEN_PUBLIC_FIELDS) {
      assert(!Object.hasOwn(product, field), `${product.partNumber}: forbidden draft field ${field}`);
    }

    if (product.publicationStatus === 'draft') {
      assert(Array.isArray(product.blockingQuestions) && product.blockingQuestions.length > 0, `${product.partNumber}: draft blockers are required`);
      assert(product.dimensions.some(dimension => dimension.meaning === null), `${product.partNumber}: unresolved dimension order must remain explicit`);
    } else {
      assert(product.dimensions.every(dimension => typeof dimension.meaning === 'string' && dimension.meaning.trim()), `${product.partNumber}: dimension meanings must be confirmed before publication`);
      assert.notEqual(product.materialStatus, 'unconfirmed-for-sku', `${product.partNumber}: material status must be resolved before publication`);
      if (product.materialStatus === 'confirmed') {
        assert(typeof product.material === 'string' && product.material.trim(), `${product.partNumber}: confirmed material is required`);
      } else {
        assert.equal(product.material, null, `${product.partNumber}: material must stay omitted when the supplier did not provide it`);
      }
      assert.deepEqual(product.blockingQuestions, [], `${product.partNumber}: ready product cannot retain blockers`);
    }
  }

  return data.products;
}

function displayDimensionValue(dimension) {
  return Object.hasOwn(dimension, 'values') ? dimension.values.join('/') : String(dimension.value);
}

function toPublishedSealProduct(product) {
  const specifications = [
    { label: 'Артикул', value: product.partNumber },
    { label: 'Тип', value: product.confirmedType },
    ...product.dimensions.map(dimension => ({
      label: dimension.meaning,
      value: `${displayDimensionValue(dimension)} мм`,
    })),
    ...(product.materialStatus === 'confirmed' ? [{ label: 'Материал', value: product.material }] : []),
  ];

  return {
    id: product.id,
    handle: product.handle,
    title: product.proposed.title,
    catalogTitle: product.proposed.title,
    catalogDescription: product.proposed.description,
    catalogSelection: 'Для проверки запроса укажите нужное количество. При необходимости приложите фото старого уплотнения, посадочного места и шильдика техники. Совместимость подтверждаем отдельно.',
    catalogPriceNote: 'Стоимость и срок поставки уточняются после проверки запроса.',
    catalogImageLabel: 'Изображение уточняется',
    fitment: null,
    sku: product.partNumber,
    category: 'seals-filters',
    categories: ['seals-filters'],
    tags: ['гидравлическое уплотнение', product.confirmedType.toLocaleLowerCase('ru'), product.partNumber],
    available: false,
    minPriceKzt: null,
    maxPriceKzt: null,
    imageUrl: null,
    productType: 'Гидравлическое уплотнение',
    variants: [{
      id: `${product.id}-request`,
      title: product.proposed.title,
      sku: product.partNumber,
      available: false,
      priceKzt: null,
      options: [],
    }],
    gallery: [],
    catalogSpecifications: specifications,
    catalogInquiry: {
      kind: 'hydraulic-seal',
      partNumber: product.partNumber,
      type: product.confirmedType,
      dimensions: product.dimensionString,
    },
  };
}

export function sealProductsFromDraftData(data = sealDraftData) {
  return validateSealDrafts(data)
    .filter(product => product.publicationStatus === 'ready')
    .map(toPublishedSealProduct);
}

export const sealDrafts = validateSealDrafts();
export const publishedSealProducts = sealProductsFromDraftData();

export { EXPECTED_PART_NUMBERS };

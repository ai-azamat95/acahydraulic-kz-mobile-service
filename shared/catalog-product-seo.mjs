import reviewedProductCopy from './catalog-product-copy.json' with { type: 'json' };
import merchantProductCopy from './catalog-product-merchant-copy.json' with { type: 'json' };
import pilotProductCopy from './catalog-product-pilot-copy.json' with { type: 'json' };
import phase2ProductCopy from './catalog-product-phase2-copy.json' with { type: 'json' };
import phase3ProductCopy from './catalog-product-phase3-copy.json' with { type: 'json' };
import priorityProductCopy from './catalog-product-priority-copy.json' with { type: 'json' };
import landings from './catalog-landings.json' with { type: 'json' };
import selectionCopy from './catalog-seo-content.json' with { type: 'json' };
import { catalogCategoryCorrection } from './catalog-category-corrections.mjs';
import { compactSeoDescription, compactSeoTitleBase } from './seo-meta.mjs';

const productCopy = { ...reviewedProductCopy, ...pilotProductCopy, ...phase2ProductCopy, ...phase3ProductCopy, ...priorityProductCopy, ...merchantProductCopy };

const russianProductTypeByCategory = {
  'construction-machinery': 'Спецтехника',
  'attachments': 'Навесное оборудование',
  'hydraulic-pumps': 'Гидронасос',
  'gear-pumps': 'Шестерённый насос',
  'piston-pumps': 'Поршневой гидронасос',
  'pump-parts': 'Запчасти гидронасоса',
  'hydraulic-motors': 'Гидромотор',
  'final-drives': 'Бортовой редуктор',
  'control-valves': 'Гидравлический клапан',
  'main-control-valves': 'Основной гидрораспределитель',
  'electrical': 'Электрическая запчасть',
  'wiring-harnesses': 'Жгут проводки',
  'controllers': 'Контроллер',
  'monitors': 'Монитор',
  'seals-filters': 'Уплотнение или фильтр',
  'engine-fuel': 'Запчасть двигателя и топливной системы',
  'engine-rebuild-kits': 'Ремкомплект двигателя',
  'fuel-injectors': 'Топливная форсунка',
  'fuel-pumps': 'Топливный насос',
  'fuel-common-rails': 'Топливная рампа Common Rail',
  'air-conditioning': 'Запчасть кондиционера',
  'diagnostic-tools': 'Диагностический инструмент',
  'other-parts': 'Запчасть для спецтехники',
};

const russianProductCategoryPriority = [
  'construction-machinery',
  'attachments',
  'gear-pumps',
  'piston-pumps',
  'pump-parts',
  'hydraulic-pumps',
  'hydraulic-motors',
  'final-drives',
  'main-control-valves',
  'control-valves',
  'wiring-harnesses',
  'controllers',
  'monitors',
  'engine-rebuild-kits',
  'fuel-injectors',
  'fuel-pumps',
  'fuel-common-rails',
  'air-conditioning',
  'diagnostic-tools',
  'seals-filters',
  'engine-fuel',
  'electrical',
  'other-parts',
];

function russianProductFallbackName(product) {
  const categories = product.categories?.length ? product.categories : [product.category];
  const reviewedCorrection = product.id ? catalogCategoryCorrection(product.id) : undefined;
  const category = reviewedCorrection?.category && russianProductTypeByCategory[reviewedCorrection.category]
    ? reviewedCorrection.category
    : russianProductCategoryPriority.find(id => categories.includes(id));
  const sourceName = product.catalogTitle || product.title;
  if (!category || !sourceName || /[а-яё]/i.test(sourceName)) return sourceName;
  const equipmentListing = category === 'other-parts' && (
    product.tags?.some(tag => /^(?:equipment|mini excavators)$/i.test(tag))
    || /^\d+(?:\.\d+)?\s+Ton\s+\w+\s+Mini Excavator\b/i.test(sourceName)
  );
  const russianType = equipmentListing ? 'Спецтехника' : russianProductTypeByCategory[category];
  return `${russianType} ${sourceName}`;
}

function sourcePartReferences(sourceName) {
  const references = [];
  for (const match of String(sourceName || '').matchAll(/[A-Za-z0-9]+(?:[./-][A-Za-z0-9]+)*/g)) {
    const value = match[0];
    if (!/\d/.test(value) || value.length < 4) continue;
    if (/^\d{1,4}(?:[./-]\d{1,4})?$/.test(value) && /^\s*(?:hour|hours|ton|tons|kw|v)\b/i.test(sourceName.slice((match.index || 0) + value.length))) continue;
    if (!references.some(reference => reference.toLocaleLowerCase('en') === value.toLocaleLowerCase('en'))) references.push(value);
    if (references.length === 12) break;
  }
  return references.length <= 3 ? references : [references[0], references[1], references.at(-1)];
}

function compactProductTitle(prefix, references, qualifier, uniqueReference, maxLength = 59) {
  const prefixSearch = prefix.toLocaleLowerCase('en');
  const allSignalsPresent = references.every(reference => prefixSearch.includes(reference.toLocaleLowerCase('en')))
    && (!qualifier || prefixSearch.includes(qualifier.toLocaleLowerCase('en')))
    && (!uniqueReference || prefixSearch.includes(uniqueReference.toLocaleLowerCase('en')));
  if (prefix.length <= maxLength && allSignalsPresent) return prefix;

  const missingReferences = references.filter(reference => !prefixSearch.includes(reference.toLocaleLowerCase('en')) || prefix.length > maxLength);
  const suffixParts = [];
  if (qualifier && !(prefix.length <= maxLength && prefixSearch.includes(qualifier.toLocaleLowerCase('en')))) suffixParts.push(qualifier);
  if (uniqueReference && !missingReferences.some(reference => reference.toLocaleLowerCase('en').includes(uniqueReference.toLocaleLowerCase('en'))) && !prefixSearch.includes(uniqueReference.toLocaleLowerCase('en')) && !suffixParts.some(value => value.toLocaleLowerCase('en') === uniqueReference.toLocaleLowerCase('en'))) suffixParts.push(uniqueReference);
  const suffix = suffixParts.length ? ` — ${suffixParts.join(' / ')}` : '';
  const referenceCandidates = suffix && missingReferences.length > 2
    ? [missingReferences[0], missingReferences.at(-1)]
    : missingReferences;
  const preferredPrefixBudget = Math.min(prefix.length, 24);
  const referenceBudget = Math.max(8, maxLength - suffix.length - preferredPrefixBudget - 1);
  const referenceLabel = compactSeoTitleBase(referenceCandidates.join(' / '), referenceBudget);
  const reserved = `${referenceLabel ? ` ${referenceLabel}` : ''}${suffix}`;
  const compactPrefix = compactSeoTitleBase(prefix, Math.max(8, maxLength - reserved.length));
  return compactSeoTitleBase(`${compactPrefix}${reserved}`.trim(), maxLength);
}

function catalogProductMetaTitle(product, name, copy) {
  if (copy?.title) return compactProductTitle(copy.title, [], product.brand, '', 59);
  const sourceName = product.catalogTitle || product.title || name;
  const prefix = name.endsWith(sourceName) ? name.slice(0, -sourceName.length).trim() : '';
  const references = sourcePartReferences(sourceName);
  const uniqueReference = product.mpn || product.sku || product.id;
  return compactProductTitle(prefix || name, references, product.brand, uniqueReference);
}

// Keep exact OEM numbers in public product data. Supplier-language source titles
// belong only in private audit snapshots; reviewed catalogue imports may store a
// Russian title directly. Handle-specific reviewed copy still takes precedence.
export function catalogProductName(product, language = 'ru') {
  if (language !== 'ru') return product.title;
  return productCopy[product.handle]?.name || russianProductFallbackName(product) || product.title;
}

export function catalogProductSeo(product, language = 'ru') {
  const copy = language === 'ru' ? productCopy[product.handle] : undefined;
  const name = catalogProductName(product, language);
  const fixedOwnerOffer = product.approvedSale || product.ownerSale || product.ownerProduct;
  const price = Number.isFinite(product.minPriceKzt)
    ? `Цена ${fixedOwnerOffer ? '' : 'от '}${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(product.minPriceKzt)} ₸.`
    : 'Цена по запросу.';
  const fitment = (product.fitment || 'уточняется по номеру детали, модели и шильдику техники').replace(/[.!?]+$/, '');
  const description = copy?.description || (product.catalogSupplement && product.catalogDescription) || `${name}. Применяемость: ${fitment}. ${price} Комплектацию и срок поставки подтвердим до оплаты.`;
  const title = language === 'ru'
    ? catalogProductMetaTitle(product, name, copy)
    : compactSeoTitleBase(copy?.title || name, 59);
  return {
    name,
    title,
    description,
    metaDescription: compactSeoDescription(`${title}. ${price} Подбор по OEM-номеру, модели и шильдику; комплектацию и срок подтверждаем до оплаты.`),
  };
}

export function catalogProductHasReviewedCopy(product, language = 'ru') {
  return language === 'ru' && Boolean(productCopy[product.handle]);
}

export function catalogProductImageIsPlaceholder(product) {
  return typeof product.imageUrl === 'string' && product.imageUrl.startsWith('/catalog-assets/category-');
}

export function catalogOfferHasConfirmedSupply(merchantOffer) {
  return merchantOffer?.availability === 'in_stock';
}

export function catalogProductCategories(product) {
  const ids = product.categories?.length ? product.categories : [product.category];
  return landings.categories.filter(category => ids.includes(category.id));
}

export function catalogProductIsHydraulicPump(product) {
  const ids = product.categories?.length ? product.categories : [product.category];
  return ids.includes('hydraulic-pumps');
}

function escapeBrandPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const hydraulicComponentBrandSlugs = new Set([
  'rexroth',
  'danfoss',
  'kawasaki',
  'parker',
  'eaton',
  'daikin',
  'denison',
  'von-roll',
  'husco',
  'handok',
]);

export function catalogProductBrandLanding(product) {
  const manufacturer = String(product.brand || '').trim().toLocaleLowerCase('en');
  if (manufacturer) {
    const brand = landings.brands.find(brand =>
      brand.name.toLocaleLowerCase('en') === manufacturer
      || brand.aliases.some(alias => alias.toLocaleLowerCase('en') === manufacturer)
    );
    return brand ? { ...brand, matchSource: 'manufacturer' } : undefined;
  }

  const title = String(product.catalogTitle || product.title || '');
  const manufacturerText = title.split(
    /\b(?:for|fits?|compatible\s+with)\b|(?:^|\s)для(?:\s|$)/i,
  )[0];
  const inferred = landings.brands.filter(brand =>
    hydraulicComponentBrandSlugs.has(brand.slug)
    &&
    brand.aliases.some(alias =>
      new RegExp(`(^|[^a-z0-9])${escapeBrandPattern(alias)}([^a-z0-9]|$)`, 'i').test(manufacturerText)
    )
  );

  // Text after fitment prepositions usually names the machine, not the pump
  // manufacturer. Ambiguous or unsupported matches must not become brand links.
  return inferred.length === 1
    ? { ...inferred[0], matchSource: 'title-manufacturer' }
    : undefined;
}

export function catalogProductSelection(product) {
  if (product.catalogSupplement && product.catalogSelection) return product.catalogSelection;
  if (product.ownerEvidence?.selection) return product.ownerEvidence.selection;
  // Imported categories can be broad; use technical instructions only for reviewed products.
  const category = productCopy[product.handle]?.selectionCategory || ((product.approvedSale || product.ownerSale || product.ownerProduct) ? 'hydraulic-pumps' : 'other-parts');
  return productCopy[product.handle]?.selection || selectionCopy[category].selection;
}

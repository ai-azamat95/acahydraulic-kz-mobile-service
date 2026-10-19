import reviewedProductCopy from './catalog-product-copy.json' with { type: 'json' };
import merchantProductCopy from './catalog-product-merchant-copy.json' with { type: 'json' };
import pilotProductCopy from './catalog-product-pilot-copy.json' with { type: 'json' };
import phase2ProductCopy from './catalog-product-phase2-copy.json' with { type: 'json' };
import phase3ProductCopy from './catalog-product-phase3-copy.json' with { type: 'json' };
import priorityProductCopy from './catalog-product-priority-copy.json' with { type: 'json' };
import landings from './catalog-landings.json' with { type: 'json' };
import selectionCopy from './catalog-seo-content.json' with { type: 'json' };
import { catalogCategoryCorrection } from './catalog-category-corrections.mjs';

const productCopy = { ...reviewedProductCopy, ...pilotProductCopy, ...phase2ProductCopy, ...phase3ProductCopy, ...priorityProductCopy, ...merchantProductCopy };

const russianPumpTypeByCategory = {
  'hydraulic-pumps': 'Гидронасос',
  'gear-pumps': 'Шестерённый насос',
  'piston-pumps': 'Поршневой гидронасос',
  'pump-parts': 'Запчасти гидронасоса',
  'hydraulic-motors': 'Гидромотор',
  'control-valves': 'Гидравлический клапан',
  'main-control-valves': 'Основной гидрораспределитель',
  'fuel-pumps': 'Топливный насос',
  'other-parts': 'Запчасть для спецтехники',
};

function russianPumpFallbackName(product) {
  const categories = product.categories?.length ? product.categories : [product.category];
  const reviewedCorrection = product.id ? catalogCategoryCorrection(product.id) : undefined;
  const category = reviewedCorrection?.category || categories.find(id => ['hydraulic-pumps', 'gear-pumps', 'piston-pumps'].includes(id));
  const sourceName = product.catalogTitle || product.title;
  if (!category || !sourceName || /[а-яё]/i.test(sourceName)) return sourceName;
  return `${russianPumpTypeByCategory[category]} ${sourceName}`;
}

// Keep exact OEM numbers in public product data. Supplier-language source titles
// belong only in private audit snapshots; reviewed catalogue imports may store a
// Russian title directly. Handle-specific reviewed copy still takes precedence.
export function catalogProductName(product, language = 'ru') {
  if (language !== 'ru') return product.title;
  return productCopy[product.handle]?.name || russianPumpFallbackName(product) || product.title;
}

export function catalogProductSeo(product, language = 'ru') {
  const copy = language === 'ru' ? productCopy[product.handle] : undefined;
  const name = catalogProductName(product, language);
  const fixedOwnerOffer = product.approvedSale || product.ownerSale || product.ownerProduct;
  const price = Number.isFinite(product.minPriceKzt)
    ? `Цена ${fixedOwnerOffer ? '' : 'от '}${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(product.minPriceKzt)} ₸.`
    : 'Цена по запросу.';
  const fitment = (product.fitment || 'уточняется по номеру детали, модели и шильдику техники').replace(/[.!?]+$/, '');
  return {
    name,
    title: copy?.title || (name.length > 110 ? name.slice(0, 110).replace(/\s+\S*$/, '') + '…' : name),
    description: copy?.description || (product.catalogSupplement && product.catalogDescription) || `${name}. Применяемость: ${fitment}. ${price} Комплектацию и срок поставки подтвердим до оплаты.`,
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

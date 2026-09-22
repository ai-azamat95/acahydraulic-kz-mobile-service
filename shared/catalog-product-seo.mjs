import productCopy from './catalog-product-copy.json' with { type: 'json' };
import landings from './catalog-landings.json' with { type: 'json' };
import selectionCopy from './catalog-seo-content.json' with { type: 'json' };

// Keep OEM numbers and the supplier's original title in the product data.
// Only reviewed, handle-specific translations replace the public Russian name.
export function catalogProductName(product, language = 'ru') {
  return (language === 'ru' && productCopy[product.handle]?.name) || product.title;
}

export function catalogProductSeo(product, language = 'ru') {
  const copy = language === 'ru' ? productCopy[product.handle] : undefined;
  const name = catalogProductName(product, language);
  const price = Number.isFinite(product.minPriceKzt)
    ? `Цена ${product.approvedSale ? '' : 'от '}${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(product.minPriceKzt)} ₸.`
    : 'Цена по запросу.';
  const fitment = product.fitment || 'уточняется по номеру детали, модели и шильдику техники';
  return {
    name,
    title: copy?.title || (name.length > 110 ? name.slice(0, 110).replace(/\s+\S*$/, '') + '…' : name),
    description: copy?.description || `${name}. Применяемость: ${fitment}. ${price} Комплектацию и срок поставки подтвердим до оплаты.`,
  };
}

export function catalogProductCategories(product) {
  const ids = product.categories?.length ? product.categories : [product.category];
  return landings.categories.filter(category => ids.includes(category.id));
}

export function catalogProductSelection(product) {
  // Imported categories can be broad; use technical instructions only for reviewed products.
  const category = productCopy[product.handle]?.selectionCategory || (product.approvedSale ? 'hydraulic-pumps' : 'other-parts');
  return productCopy[product.handle]?.selection || selectionCopy[category].selection;
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sale from '../shared/cat-432e-sale.json' with { type: 'json' };

// This completed owner-confirmed sale has its own terms. It does not inherit
// shipping, stock, prepayment or warranty promises from the other pump offers.
export function applyOwnerSale(product) {
  if (String(product.id) !== sale.id) return product;
  assert.equal(product.handle, sale.handle, 'Owner sale product changed identity');
  assert.equal(product.category, 'hydraulic-pumps', 'Owner sale product changed category');
  if (product.variants) assert.equal(product.variants.length, 1, 'Review owner sale variants');
  return { ...product, title: sale.name, fitment: 'CAT 432E. Исполнение для вашей машины проверяется по серийному номеру, шильдику и подключениям.',
    minPriceKzt: sale.priceKzt, maxPriceKzt: sale.priceKzt,
    imageUrl: sale.image, ownerSale: { condition: sale.condition, confirmedOn: sale.confirmedOn, casePath: sale.casePath },
    ...(product.gallery ? { gallery: [sale.image] } : {}),
    ...(product.variants ? { variants: product.variants.map(variant => ({ ...variant, priceKzt: sale.priceKzt })) } : {}),
  };
}
export function applyOwnerCatalogSales(catalogDir) {
  const files = fs.readdirSync(catalogDir).filter(file => /^(products-\d+|search-index(?:-\d+)?)\.json$/.test(file));
  const documents = files.map(file => ({ file, rows: JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')).map(applyOwnerSale) }));
  for (const prefix of ['products-', 'search-index-', 'search-index.json']) {
    const rows = documents.filter(({ file }) => file.startsWith(prefix)).flatMap(({ rows }) => rows);
    assert.equal(rows.filter(row => String(row.id) === sale.id).length, 1, `Expected one owner sale in ${prefix}`);
  }
  for (const { file, rows } of documents) fs.writeFileSync(path.join(catalogDir, file), JSON.stringify(rows));
}

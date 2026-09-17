import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Owner-confirmed new complete assemblies, 2026-09-17. Keep a reviewed ID/handle
// allowlist: model names also occur on repair kits and unapproved executions.
export const approvedPumpPrices = [
  { id: '8660130791586', handle: 'k3v112dt-hydraulic-pump-for-volvo-excavator-ec210b', model: 'K3V112DT', priceKzt: 1600000 },
  { id: '8641961164962', handle: '215111278-excavator-hydraulic-pump-k3v112dtp-9c32-14t-for-js220-js200', model: 'K3V112DTP', priceKzt: 1600000 },
  { id: '8641961132194', handle: '14632316-excavator-hydraulic-pump-k5v160dt-for-ec300d-ec350d', model: 'K5V160DT', priceKzt: 1600000 },
  { id: '8714977902754', handle: 'hydraulic-pump-assembly-yf10v00006f1-yf10v00006f3-yn10v00043f1-fits-for-kobelco-sk235srlc-k5v80dtp', model: 'K5V80DTP', priceKzt: 1700000 },
];

export function applyApprovedPrice(product) {
  const offer = approvedPumpPrices.find(({ id }) => id === String(product.id));
  if (!offer) return product;
  assert.equal(product.handle, offer.handle, `Approved pump ${offer.id} changed identity`);
  assert.equal(product.category, 'hydraulic-pumps', `Approved pump ${offer.id} changed category`);
  if (product.variants) {
    assert.equal(product.variants.length, 1, `Review new variants for approved pump ${offer.id}`);
  }
  return {
    ...product,
    minPriceKzt: offer.priceKzt,
    maxPriceKzt: offer.priceKzt,
    approvedSale: { model: offer.model, condition: 'new', assembly: 'complete', confirmedOn: '2026-09-17', deliveryMinDays: 3, prepaymentPercent: 100 },
    ...(product.variants ? { variants: product.variants.map(variant => ({ ...variant, priceKzt: offer.priceKzt })) } : {}),
  };
}

export function applyApprovedCatalogPrices(catalogDir) {
  const files = fs.readdirSync(catalogDir).filter(file => /^(products-\d+|search-index(?:-\d+)?)\.json$/.test(file));
  const documents = files.map(file => ({ file, rows: JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')).map(applyApprovedPrice) }));
  // Validate every representation before writing any file, including on imports.
  for (const prefix of ['products-', 'search-index-', 'search-index.json']) {
    const rows = documents.filter(({ file }) => file.startsWith(prefix)).flatMap(({ rows }) => rows);
    for (const offer of approvedPumpPrices) {
      assert.equal(rows.filter(row => String(row.id) === offer.id).length, 1, `Expected one ${offer.model} in ${prefix}`);
    }
  }
  for (const { file, rows } of documents) fs.writeFileSync(path.join(catalogDir, file), JSON.stringify(rows));
  return { approvedProducts: approvedPumpPrices.length, representations: documents.length };
}

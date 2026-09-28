import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const catalogPage = fs.readFileSync('client/src/pages/Catalog.tsx', 'utf8');
const catalogHook = fs.readFileSync('client/src/hooks/useCatalogProducts.ts', 'utf8');
const supplyOffers = fs.readFileSync('client/src/components/catalog/PumpSupplyOffers.tsx', 'utf8');

test('catalog navigation opens dedicated category pages without mixing the home product feed', () => {
  assert.match(catalogPage, /const showResults = isLandingPage \|\| Boolean\(urlQuery\);/);
  assert.match(catalogPage, /href=\{catalogSearchHref\(partQuery, item\.id\)\}/);
  assert.match(catalogPage, /!isLandingPage && <div className="aca-category-grid">/);
  assert.doesNotMatch(catalogPage, /chooseCategory/);
  assert(catalogPage.indexOf('id="catalog-results"') < catalogPage.indexOf('className="aca-landing-intro'), 'products must appear before long SEO copy on category pages');
});

test('catalog category counts use the complete published summary immediately', () => {
  assert.match(catalogHook, /categorySummaryFile\?: string/);
  assert.match(catalogHook, /manifest\.categorySummaryFile \|\| "category-summary\.json"/);
  assert.match(catalogHook, /setCategorySummary\(summary\)/);
  assert.match(catalogHook, /Complete catalog index unavailable; loading chunks/);
  assert.match(catalogPage, /Object\.keys\(categorySummary\)\.length > 0/);
  assert.match(catalogPage, /const ELECTRONICS_VISIBLE_PRODUCTS = 48/);
});

test('featured product links use a client-routable product URL', () => {
  assert.match(supplyOffers, /href: "\/catalog\/handok-h5v80dtp-12t-ykskr-9k00-korean-hydraulic-pump"/);
  assert.doesNotMatch(supplyOffers, /handok-h5v80dtp-12t-ykskr-9k00-korean-hydraulic-pump\/"/);
});

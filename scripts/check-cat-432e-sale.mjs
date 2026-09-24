import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import sale from '../shared/cat-432e-sale.json' with { type: 'json' };

test('published product and case expose exact price, self canonicals and reciprocal links', () => {
  const productHtml = fs.readFileSync(`dist/public/catalog/${sale.handle}/index.html`, 'utf8');
  const caseHtml = fs.readFileSync(`dist/public${sale.casePath}/index.html`, 'utf8');
  const productMap = JSON.parse(fs.readFileSync('dist/public/catalog-data/product-map.json', 'utf8'));
  const productChunk = String(productMap[sale.handle]).padStart(3, '0');
  const catalogProduct = JSON.parse(fs.readFileSync(`dist/public/catalog-data/products-${productChunk}.json`, 'utf8'))
    .find(product => product.id === sale.id);
  assert.deepEqual(catalogProduct.gallery, sale.gallery);
  assert.equal(catalogProduct.imageUrl, sale.gallery[0]);
  for (const image of sale.gallery) {
    assert(fs.existsSync(`dist/public${image}`), `${image} must be published`);
  }
  const schema = JSON.parse(productHtml.match(/<script type="application\/ld\+json" data-static-product-schema[^>]*>(.*?)<\/script>/s)[1]);
  assert.equal(schema.offers['@type'], 'Offer');
  assert.equal(schema.offers.price, 1230000);
  assert.equal(schema.offers.priceCurrency, 'KZT');
  assert.equal(schema.itemCondition, 'https://schema.org/NewCondition');
  assert.equal(schema.offers.shippingDetails, undefined);
  assert.equal(schema.offers.availability, undefined);
  assert.equal(schema.aggregateRating, undefined);
  assert.equal(schema.review, undefined);
  for (const [html, route] of [[productHtml, `/catalog/${sale.handle}`], [caseHtml, sale.casePath]]) {
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert(html.includes(`href="https://acahydraulic.kz${route}/"`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert(!/name="robots"[^>]+noindex/.test(html));
    assert(html.includes(sale.video));
  }
  assert(productHtml.includes(`${sale.casePath}/`));
  assert(caseHtml.includes(`/catalog/${sale.handle}/`));
  assert(caseHtml.includes('клиента'));
  assert(fs.readFileSync('dist/public/cases/index.html', 'utf8').includes(sale.casePath));
  assert(fs.readFileSync('dist/public/sitemap-cases.xml', 'utf8').includes(sale.casePath));
});

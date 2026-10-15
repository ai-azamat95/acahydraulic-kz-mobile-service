import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const readJson = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
const products = readJson('shared/catalog-supplier-products.json');
const sources = readJson('docs/jcb-rocker-seal-photos-20261015/source-manifest.json').sources;
const publication = readJson('docs/jcb-rocker-seal-photos-20261015/publication-manifest.json').assets;
const evidence = readJson('docs/jcb-rocker-seal-photos-20261015/primary-evidence.json');
const photoReview = readJson('docs/jcb-rocker-seal-photos-20261015/photo-review.json');
const imageBase = '/catalog-assets/jcb-rocker-seal-photos-20261015/';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const seal = products.find(product => product.id === 'ACA-JCB-PART-320-07580');
const airFilter = products.find(product => product.id === 'ACA-JCB-PART-32-917804');
const reused = {
  1: '/catalog-assets/jcb-brakes-airfilters-20261015/32-917804-label.jpg',
  3: '/catalog-assets/jcb-service-parts-batch2/jcb-transmission-fluid-sae30-20l.jpg',
  4: '/catalog-assets/jcb-product-media-20261015/581-r5206-boxes.jpg',
  5: '/catalog-assets/jcb-product-media-20261015/320-a7227-shipping-label.jpg',
  7: '/catalog-assets/jcb-product-media-20261015/320-b4420-packaging.jpg',
  8: '/catalog-assets/jcb-product-media-20261015/32-925682-filter.jpg',
};
const copyFor = product => [product.title, product.catalogTitle, product.productType, product.fitment,
  product.catalogDescription, product.catalogSelection, product.catalogImageCaption,
  ...product.variants.flatMap(variant => [variant.title, ...(variant.options || [])])].filter(Boolean).join(' ');

test('ten original photos resolve to two new assets, six exact published reuses and two internal holds', () => {
  assert.equal(sources.length, 10);
  assert.deepEqual(sources.map(source => source.sourceNumber), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(sources.filter(source => source.status === 'reused-published-exact').length, 6);
  assert.equal(sources.filter(source => source.status === 'published-new-photo').length, 2);
  assert.equal(publication.length, 2);
  assert.equal(photoReview.summary.exactPublicDuplicates, 6);
  assert.deepEqual(publication.map(asset => asset.sourceNumber).sort((a, b) => a - b), [2, 10]);
  for (const source of sources) {
    assert.match(source.sha256, /^[a-f0-9]{64}$/u);
    assert(source.byteLength > 0);
    const primary = evidence.photos.find(photo => photo.photoNumber === source.sourceNumber);
    assert.equal(source.sha256, primary.sha256);
    assert.equal(source.byteLength, primary.bytes);
    const reviewed = photoReview.photos.find(photo => photo.sourceFile === source.sourceFile);
    assert.equal(source.sha256, reviewed.sha256);
    assert.equal(source.byteLength, reviewed.byteLength);
  }
  for (const [number, publicPath] of Object.entries(reused)) {
    const source = sources.find(item => item.sourceNumber === Number(number));
    assert.equal(source.reusedPublicPath, publicPath);
    assert.deepEqual(source.publicPaths, [publicPath]);
    const bytes = fs.readFileSync(new URL(`client/public${publicPath}`, root));
    assert.equal(bytes.length, source.byteLength);
    assert.equal(digest(bytes), source.sha256);
    const linked = products.filter(product => product.gallery.includes(publicPath));
    assert(linked.length > 0, publicPath);
    for (const product of linked) assert.equal(product.gallery.filter(image => image === publicPath).length, 1, 'Reused photos are not duplicated in galleries');
  }
});

test('previously excluded photo six is referenced without another copy and uncertain photo nine remains internal', () => {
  const six = sources.find(source => source.sourceNumber === 6);
  const nine = sources.find(source => source.sourceNumber === 9);
  assert.equal(six.status, 'reused-internal-unidentified');
  assert.equal(six.internalPath, 'docs/jcb-product-media-20261015/excluded/photo-3-unidentified-packaging.jpg');
  assert.equal(nine.status, 'held-unidentified-overview');
  assert(nine.internalPath.startsWith('docs/jcb-rocker-seal-photos-20261015/excluded/'));
  for (const source of [six, nine]) {
    assert.deepEqual(source.publicPaths, []);
    const bytes = fs.readFileSync(new URL(source.internalPath, root));
    assert.equal(bytes.length, source.byteLength);
    assert.equal(digest(bytes), source.sha256);
    assert(!publication.some(asset => asset.sha256 === source.sha256));
  }
  assert.deepEqual(fs.readdirSync(new URL('docs/jcb-rocker-seal-photos-20261015/excluded/', root)), ['photo-9-unidentified-overview.jpg']);
  assert.equal(evidence.photo6ExactExcludedDuplicate, true);
  assert.deepEqual(evidence.photos.find(photo => photo.photoNumber === 9).partNumbersConfirmed, []);
  assert.equal(photoReview.photos.find(photo => photo.sourceFile === nine.sourceFile).exactArticleAssociationConfirmed, false);
});

test('the two new public JPEGs preserve original bytes and exact card associations without recopying previous photos', () => {
  const existingHashes = new Set(sources.filter(source => source.status === 'reused-published-exact').map(source => source.sha256));
  assert.deepEqual(fs.readdirSync(new URL(`client/public${imageBase}`, root)).sort(),
    ['32-917804-packaging.jpg', '320-07580-rocker-cover-seal.jpg']);
  for (const asset of publication) {
    assert(asset.publicPath.startsWith(imageBase));
    assert.equal(asset.role, 'original-photo');
    const source = sources.find(item => item.sourceNumber === asset.sourceNumber);
    const bytes = fs.readFileSync(new URL(`client/public${asset.publicPath}`, root));
    assert.equal(bytes.length, asset.byteLength);
    assert.equal(asset.byteLength, source.byteLength);
    assert.equal(digest(bytes), asset.sha256);
    assert.equal(asset.sha256, source.sha256);
    assert(!existingHashes.has(asset.sha256));
    assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff');
    assert.deepEqual(asset.productIds, products.filter(product => product.gallery.includes(asset.publicPath)).map(product => product.id).sort());
  }
});

test('new 320/07580 is a rocker-cover seal with exact identity and only PIN-based inquiry terms', () => {
  assert.equal(products.filter(product => product.id === 'ACA-JCB-PART-320-07580').length, 1);
  assert.equal(seal.handle, 'jcb-320-07580-rocker-cover-seal');
  assert.equal(seal.sku, '320/07580');
  assert.equal(seal.mpn, '320/07580');
  assert.equal(seal.brand, 'JCB');
  assert.equal(seal.category, 'seals-filters');
  assert.deepEqual(seal.categories, ['seals-filters']);
  assert.match(seal.title, /уплотнение клапанной крышки.*320\/07580/iu);
  assert.doesNotMatch([seal.title, seal.productType].join(' '), /ГБЦ|комплект.*прокладок.*двигател/iu);
  assert.equal(seal.imageUrl, imageBase + '320-07580-rocker-cover-seal.jpg');
  assert.deepEqual(seal.gallery, [seal.imageUrl]);
  assert.equal(seal.catalogImageLabel, 'Фото детали в упаковке');
  assert.equal(evidence.newPart.partNumber, seal.mpn);
  assert.equal(evidence.newPart.photoNumber, 10);
  assert(evidence.newPart.primarySources.some(source => source.url === 'https://parts.jcb.com/uk/product/320-07580'));
  assert.deepEqual(evidence.newPart.fitmentModels, []);
  assert(!seal.catalogVideos?.length);
  for (const product of [seal, airFilter]) {
    assert.equal(product.available, false);
    assert.equal(product.minPriceKzt, null);
    assert.equal(product.maxPriceKzt, null);
    assert(!product.ownerProduct && !product.ownerSale && !product.ownerCase && !product.ownerEvidence && !product.approvedSale);
    assert.match([product.fitment, product.catalogSelection].join(' '), /PIN/iu);
    assert.match([product.fitment, product.catalogSelection].join(' '), /серийн/iu);
    for (const variant of product.variants) {
      assert.equal(variant.sku, product.sku);
      assert.equal(variant.available, false);
      assert.equal(variant.priceKzt, null);
    }
    assert.doesNotMatch(copyFor(product), /официальн\S*\s+дилер|(?:есть|имеется|имеются)\s+в\s+наличии|в\s+наличии\s+на\s+складе|подходит\s+(?:для\s+)?всех|гарантированн\S*\s+(?:оригинальн|совместим)|(?:^|\s)1\s*шт/iu);
  }
  assert.doesNotMatch(copyFor(seal), /Dieselmax|Ecomax|3CX|4CX|\bмм\b|\bShore\b/iu);
});

test('32/917804 keeps its existing identity, primary image and old gallery order with one appended general view', () => {
  assert.equal(airFilter.handle, 'jcb-32-917804-air-filter');
  assert.equal(airFilter.sku, '32/917804');
  assert.equal(airFilter.mpn, '32/917804');
  assert.equal(airFilter.imageUrl, reused[1]);
  assert.deepEqual(airFilter.gallery, [reused[1], '/catalog-assets/jcb-brakes-airfilters-20261015/jcb-filter-packaging-overview.jpg', imageBase + '32-917804-packaging.jpg']);
  assert.equal(new Set(airFilter.gallery).size, 3);
  assert.equal(products.filter(product => product.id === airFilter.id).length, 1);
  assert(!(airFilter.legacyHandles || []).includes('jcb-32-925682-outer-air-filter'));
});

test('SSR preserves the exact product URL, primary image and inquiry link without a priced offer', () => {
  for (const product of [seal, airFilter]) {
    const html = fs.readFileSync(new URL(`dist/public/catalog/${product.handle}/index.html`, root), 'utf8');
    const canonical = `https://acahydraulic.kz/catalog/${product.handle}/`;
    assert(html.includes(`rel="canonical" href="${canonical}"`));
    assert(html.includes(`<h1>${product.title}</h1>`));
    assert(html.includes(product.imageUrl));
    const newImage = publication.find(asset => asset.productIds.includes(product.id));
    assert(html.includes(newImage.publicPath));
    assert.match(html, /Цена по запросу/u);
    assert.doesNotMatch(html, /data-static-product-schema/u);
    const inquiry = html.match(/href="(https:\/\/wa\.me\/77714177925\?text=[^"]+)"/)?.[1];
    assert(inquiry);
    const message = new URL(inquiry).searchParams.get('text');
    assert(message.includes(canonical));
    assert(message.includes(product.title));
  }
});

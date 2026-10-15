import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const readJson = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
const products = readJson('shared/catalog-supplier-products.json');
const evidence = readJson('docs/jcb-service-parts-photos-20261015/parts-evidence.json');
const photoManifest = readJson('docs/jcb-service-parts-photos-20261015/photo-manifest.json');
const imageBase = '/catalog-assets/jcb-service-parts/';
const expectedParts = [
  { number: '32/925346', photo: '32-925346-packaging.jpg', purpose: /гидравлическ.*фильтр/iu },
  { number: '32/925682', photo: '32-925682-packaging.jpg', purpose: /воздушн.*фильтр/iu, detail: /(?:основн|наружн)/iu },
  { number: '32/925683', photo: '32-925683-packaging.jpg', purpose: /воздушн.*фильтр/iu, detail: /(?:внутренн|страховочн)/iu },
  { number: '320/A7170', photo: '320-a7170-packaging.jpg', purpose: /топливн.*фильтр/iu },
  { number: '320/B4420', photo: '320-b4420-packaging.jpg', purpose: /масляный.*фильтр.*двигател/iu },
  { number: '320/A7124', photo: '320-a7124-packaging.jpg', purpose: /топливн.*фильтр/iu, detail: /предварительн/iu },
  { number: '581/R5206', photo: '581-r5206-packaging.jpg', purpose: /трансмиссионн.*фильтр/iu },
  { number: '813/50012', photo: '813-50012-packaging.jpg', purpose: /уплотнени.*тормоз/iu },
];
const productId = number => `ACA-JCB-PART-${number.replace('/', '-')}`;
const addedProducts = products.filter(product => String(product.id).startsWith('ACA-JCB-PART-'));

test('eight JCB service parts retain exact article identities, purpose, and matching packaging photos', () => {
  assert.equal(addedProducts.length, 8);
  assert.deepEqual(addedProducts.map(product => product.id).sort(), expectedParts.map(part => productId(part.number)).sort());
  assert.deepEqual(evidence.parts.map(part => part.partNumber).sort(), expectedParts.map(part => part.number).sort());

  for (const expected of expectedParts) {
    const matches = addedProducts.filter(product => product.id === productId(expected.number));
    assert.equal(matches.length, 1, `${expected.number}: one product per exact article`);
    const [product] = matches;
    assert.equal(product.sku, expected.number);
    assert.equal(product.mpn, expected.number);
    assert.equal(product.brand, 'JCB');
    assert.equal(product.category, 'seals-filters');
    assert(product.categories.includes('seals-filters'));
    assert.equal(product.imageUrl, imageBase + expected.photo);
    assert.match(product.catalogTitle || product.title, expected.purpose, `${expected.number}: correct part purpose`);
    if (expected.detail) assert.match(product.catalogTitle || product.title, expected.detail);
    assert((product.catalogTitle || product.title).includes(expected.number));
    const expectedGallery = [imageBase + expected.photo];
    if (expected.number === '581/R5206') expectedGallery.push(imageBase + 'jcb-packages-overview-1.jpg', imageBase + 'jcb-packages-overview-2.jpg');
    assert.deepEqual(product.gallery, expectedGallery, `${expected.number}: correct photo association and gallery order`);
    if (product.catalogImageLabel) assert.equal(product.catalogImageLabel, 'Фото упаковки');
    assert(product.variants.length > 0);
    assert(product.variants.every(variant => variant.sku === expected.number));
  }
  assert(!addedProducts.some(product => [product.sku, product.mpn, product.title, product.catalogTitle].join(' ').includes('813/50011')),
    'The unreadable secondary package must not become a separate article or interchange reference');
});

test('packaging photos support inquiry and PIN selection without unverified commercial or fitment claims', () => {
  const unsupportedClaims = /(?:оригинальн(?:ый|ая|ые|ое|ого|ых)\s+(?:фильтр|уплотнен|запчаст|товар)|гарантированн\S*\s+(?:оригинальн|совместим|подход)|официальн\S*\s+дилер|(?:есть|имеется|имеются)\s+в\s+наличии|в\s+наличии\s+на\s+складе|подходит\s+(?:для\s+)?всех|универсальн\S*\s+совместим)/iu;
  for (const product of addedProducts) {
    assert.equal(product.available, false, `${product.sku}: availability remains unconfirmed`);
    assert.equal(product.minPriceKzt, null);
    assert.equal(product.maxPriceKzt, null);
    assert(product.catalogSupplement, `${product.sku}: supplier inquiry cohort`);
    assert(!product.ownerProduct && !product.ownerSale && !product.ownerCase && !product.ownerEvidence && !product.approvedSale,
      `${product.sku}: packaging is not sale or repair evidence`);
    for (const variant of product.variants) {
      assert.equal(variant.available, false);
      assert.equal(variant.priceKzt, null);
    }
    const fitment = [product.fitment, product.catalogSelection].filter(Boolean).join(' ');
    assert.match(fitment, /\bPIN\b/iu, `${product.sku}: selection requires a machine PIN`);
    assert.match(fitment, /серийн/iu);
    assert.match(fitment, /(?:провер|подтверд|свер)/iu);
    const publicCopy = [product.title, product.catalogTitle, product.fitment, product.catalogDescription, product.catalogSelection, product.catalogImageCaption,
      ...product.variants.flatMap(variant => [variant.title, ...(variant.options || [])])].filter(Boolean).join(' ');
    assert.doesNotMatch(publicCopy, unsupportedClaims, `${product.sku}: no unverified commercial or universal fitment claim`);
    assert.doesNotMatch(publicCopy, /(?:микрон|мкм|тонкой очистки|грубой очистки)/iu,
      `${product.sku}: no unsupported filtration specification`);
  }
  const brakeSeal = addedProducts.find(product => product.sku === '813/50012');
  assert.doesNotMatch([brakeSeal.title, brakeSeal.catalogTitle, brakeSeal.catalogDescription,
    ...brakeSeal.variants.flatMap(variant => [variant.title, ...(variant.options || [])])].filter(Boolean).join(' '),
  /(?:комплект\S*\s+(?:из\s+)?(?:двух|2)|(?:^|\s)2\s*(?:шт|уплотнен))/iu,
  'QTY 2 on a package does not establish the supplied unit or a two-seal kit');
});

test('all ten public JPEGs are byte-identical copies of the user originals recorded in the internal manifest', () => {
  assert.equal(photoManifest.hashAlgorithm, 'sha256');
  assert.equal(photoManifest.images.length, 10);
  assert.equal(new Set(photoManifest.images.map(photo => photo.publicPath)).size, 10);
  const expectedPrimaryPaths = expectedParts.map(part => imageBase + part.photo).sort();
  assert.deepEqual(photoManifest.images.filter(photo => photo.role === 'primary-packaging').map(photo => photo.publicPath).sort(), expectedPrimaryPaths);
  assert.deepEqual(photoManifest.images.filter(photo => photo.role === 'overview-gallery').map(photo => photo.publicPath).sort(),
    [imageBase + 'jcb-packages-overview-1.jpg', imageBase + 'jcb-packages-overview-2.jpg']);
  for (const photo of photoManifest.images) {
    assert(photo.publicPath.startsWith(imageBase) && !photo.publicPath.includes('..'));
    assert.match(photo.sha256, /^[a-f0-9]{64}$/u);
    const bytes = fs.readFileSync(new URL(`client/public${photo.publicPath}`, root));
    assert.equal(bytes.length, photo.byteLength, `${photo.sourceFile}: original byte length`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), photo.sha256, `${photo.sourceFile}: original SHA256`);
    assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff', `${photo.sourceFile}: JPEG header`);
  }
  for (const part of evidence.parts) {
    const manifestPhoto = photoManifest.images.find(photo => photo.partNumbers.includes(part.partNumber) && photo.role === 'primary-packaging');
    assert.equal(manifestPhoto.sourceFile, part.photo, `${part.partNumber}: provenance maps to the correct source photo`);
    assert.equal(manifestPhoto.publicPath, addedProducts.find(product => product.sku === part.partNumber).imageUrl);
  }
  assert.equal(fs.existsSync(new URL('client/public/jcb-service-parts-photos-20261015/parts-evidence.json', root)), false,
    'Internal supplier research does not belong in public assets');
});

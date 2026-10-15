import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const readJson = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
const products = readJson('shared/catalog-supplier-products.json');
const manifest = readJson('docs/jcb-seals-oils-photos-20261015/photo-manifest.json');
const filterOilEvidence = readJson('docs/jcb-seals-oils-photos-20261015/filters-oils.json');
const sealBrakeEvidence = readJson('docs/jcb-seals-oils-photos-20261015/seals-brakes.json');
const imageBase = '/catalog-assets/jcb-service-parts-batch2/';
const partId = number => `ACA-JCB-PART-${number.replace('/', '-')}`;
const expectedParts = [
  { number: '813/50026', photo: '813-50026-packaging.jpg', purpose: /уплотнени.*тормоз/iu, category: 'seals-filters' },
  { number: '991/00158P', photo: '991-00158p-packaging.jpg', purpose: /(?:комплект|ремкомплект).*уплотнен/iu, category: 'seals-filters' },
  { number: '458/20285', photo: '458-20285-packaging.jpg', purpose: /тормозн.*(?:пластин|диск)|(?:пластин|диск).*тормоз/iu, category: 'other-parts' },
  { number: '320/A7351', photo: '320-a7351-packaging.jpg', purpose: /топливн.*фильтр/iu, category: 'seals-filters' },
  { number: '320/A7227', photo: '320-a7227-packaging.jpg', purpose: /топливн.*фильтр/iu, category: 'seals-filters' },
];
const expectedOils = [
  { id: 'ACA-JCB-OIL-ADVANCED-15W40-20L', photo: 'jcb-advanced-engine-oil-15w40-20l.jpg', purpose: /моторн.*масл/iu, viscosity: /15W\s*[-–]?\s*40/iu },
  { id: 'ACA-JCB-OIL-TRANSMISSION-SAE30-20L', photo: 'jcb-transmission-fluid-sae30-20l.jpg', purpose: /трансмиссионн.*(?:масл|жидкост)/iu, viscosity: /SAE\s*30/iu },
];
const batch = products.filter(product => String(product.imageUrl || '').startsWith(imageBase));
const copyFor = product => [product.title, product.catalogTitle, product.productType, product.fitment,
  product.catalogDescription, product.catalogSelection, product.catalogImageCaption,
  ...product.variants.flatMap(variant => [variant.title, ...(variant.options || [])])].filter(Boolean).join(' ');

test('five new JCB articles retain exact identities, purpose and their own readable-label photos', () => {
  assert.equal(batch.length, 7, 'Five numbered parts and two oils, without either unidentified seal set');
  for (const expected of expectedParts) {
    const matches = batch.filter(product => product.id === partId(expected.number));
    assert.equal(matches.length, 1, `${expected.number}: one card per article`);
    const [product] = matches;
    assert.equal(product.sku, expected.number);
    assert.equal(product.mpn, expected.number);
    assert.equal(product.brand, 'JCB');
    assert.equal(product.category, expected.category);
    assert(product.categories.includes(expected.category));
    assert.equal(product.imageUrl, imageBase + expected.photo);
    assert.deepEqual(product.gallery, [imageBase + expected.photo]);
    assert.match(product.catalogTitle || product.title, expected.purpose);
    assert((product.catalogTitle || product.title).includes(expected.number));
    assert(product.variants.length > 0);
    assert(product.variants.every(variant => variant.sku === expected.number));
    const selection = [product.fitment, product.catalogSelection].filter(Boolean).join(' ');
    assert.match(selection, /\bPIN\b/iu, `${expected.number}: machine identity is required`);
    assert.match(selection, /серийн/iu);
    assert.match(selection, /провер|подтверд|свер/iu);
  }
});

test('two oils use their visible family, viscosity and 20 L container without an invented OEM article', () => {
  for (const expected of expectedOils) {
    const matches = batch.filter(product => product.imageUrl === imageBase + expected.photo);
    assert.equal(matches.length, 1, expected.photo);
    const [product] = matches;
    assert.equal(product.id, expected.id);
    assert.equal(product.brand, 'JCB');
    assert.equal(product.category, 'other-parts');
    assert(product.categories.includes('other-parts'));
    assert.equal(typeof product.sku, 'string');
    assert(product.sku.trim().length > 0);
    assert(!product.mpn, 'No OEM MPN is confirmed for the photographed oil container');
    const title = product.catalogTitle || product.title;
    assert.match(title, expected.purpose);
    assert.match(title, expected.viscosity);
    assert.match(title, /20\s*(?:л|L)(?:\s|$|[,;)])/iu);
    assert.deepEqual(product.gallery, [imageBase + expected.photo]);
    const identifiers = [product.sku, product.mpn, ...(product.tags || []),
      ...product.variants.flatMap(variant => [variant.sku, variant.mpn])].filter(Boolean).join(' ');
    assert.doesNotMatch(identifiers, /5500\d{4,}/u, 'A Turkish label code is not a verified OEM SKU or MPN');
    assert.match([product.fitment, product.catalogSelection].filter(Boolean).join(' '),
      /руководств|эксплуатац|спецификац|допуск/iu, 'Oil selection requires the machine or component specification');
  }
});

test('the existing 813/50012 card keeps its primary photo and gains only the supported second view', () => {
  const matches = products.filter(product => product.id === partId('813/50012'));
  assert.equal(matches.length, 1, 'No duplicate card for the previously published brake seal');
  const [product] = matches;
  assert.equal(product.imageUrl, '/catalog-assets/jcb-service-parts/813-50012-packaging.jpg');
  assert.deepEqual(product.gallery, [
    '/catalog-assets/jcb-service-parts/813-50012-packaging.jpg',
    imageBase + '813-50026-packaging.jpg',
  ]);
  assert.equal(product.sku, '813/50012');
  assert.equal(product.mpn, '813/50012');
});

test('new packaging and container images do not become claims of stock, authenticity or universal fitment', () => {
  const unsupportedClaims = /(?:оригинальн(?:ый|ая|ые|ое|ого|ых)\s+(?:фильтр|уплотнен|запчаст|товар|масл)|гарантированн\S*\s+(?:оригинальн|совместим|подход)|официальн\S*\s+дилер|(?:есть|имеется|имеются)\s+в\s+наличии|в\s+наличии\s+на\s+складе|подходит\s+(?:для\s+)?всех|универсальн\S*\s+совместим)/iu;
  for (const product of batch) {
    assert.equal(product.available, false, `${product.sku}: stock remains unconfirmed`);
    assert.equal(product.minPriceKzt, null);
    assert.equal(product.maxPriceKzt, null);
    assert(product.catalogSupplement);
    assert(!product.ownerProduct && !product.ownerSale && !product.ownerCase && !product.ownerEvidence && !product.approvedSale,
      `${product.sku}: photos are not evidence of a sale or repair`);
    assert(product.variants.length > 0);
    for (const variant of product.variants) {
      assert.equal(variant.available, false);
      assert.equal(variant.priceKzt, null);
    }
    assert.doesNotMatch(copyFor(product), unsupportedClaims, product.sku);
  }
  for (const number of ['813/50026', '991/00158P', '458/20285']) {
    const product = batch.find(item => item.sku === number);
    assert.doesNotMatch(copyFor(product), /(?:комплект\S*\s+(?:из\s+)?(?:двух|2|двенадцати|12)|(?:^|\s)(?:2|12)\s*(?:шт|уплотнен|пластин|диск))/iu,
      `${number}: packaging quantity does not establish order quantity`);
  }
  for (const number of ['320/A7351', '320/A7227']) {
    assert.doesNotMatch(copyFor(batch.find(product => product.sku === number)), /(?:микрон|мкм|тонкой очистки|грубой очистки)/iu,
      `${number}: no unverified filtration specification`);
  }
});

test('all nine source photos retain SHA256 provenance, with both unidentified seal-set photos kept internal', () => {
  assert.equal(manifest.hashAlgorithm, 'sha256');
  assert.equal(manifest.images.length, 9);
  const published = manifest.images.filter(photo => photo.published);
  const internal = manifest.images.filter(photo => !photo.published);
  assert.equal(published.length, 7);
  assert.equal(internal.length, 2);
  assert.deepEqual(internal.map(photo => photo.sourceFile).sort(), ['2-Фото-2.jpg', '3-Фото-3.jpg']);
  for (const photo of internal) {
    assert.equal(photo.publicPath, null);
    assert.deepEqual(photo.partNumbers, []);
  }
  assert.equal(new Set(published.map(photo => photo.publicPath)).size, 7);
  assert.deepEqual(published.map(photo => photo.publicPath).sort(), batch.map(product => product.imageUrl).sort());
  for (const photo of manifest.images) {
    assert.match(photo.sha256, /^[a-f0-9]{64}$/u);
    const relativePath = photo.published ? `client/public${photo.publicPath}` : photo.internalPath;
    assert(!relativePath.includes('..'));
    if (photo.published) assert(photo.publicPath.startsWith(imageBase));
    else assert(relativePath.startsWith('docs/jcb-seals-oils-photos-20261015/'));
    const bytes = fs.readFileSync(new URL(relativePath, root));
    assert.equal(bytes.length, photo.byteLength, `${photo.sourceFile}: original byte length`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), photo.sha256, `${photo.sourceFile}: original bytes`);
    assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff', `${photo.sourceFile}: JPEG header`);
  }
  const unidentifiedHashes = new Set(internal.map(photo => photo.sha256));
  const publicFiles = fs.readdirSync(new URL(`client/public${imageBase}`, root));
  assert.equal(publicFiles.length, 7);
  for (const name of publicFiles) {
    const bytes = fs.readFileSync(new URL(`client/public${imageBase}${name}`, root));
    assert(!unidentifiedHashes.has(createHash('sha256').update(bytes).digest('hex')),
      'Neither unidentified seal set may be published under another filename');
  }
  assert(!batch.some(product => [product.sku, product.mpn, ...(product.tags || [])].includes('991/20023')),
    'The obscured label must not become a guessed exact article');
  const photoFor = number => manifest.images.find(photo => photo.partNumbers.includes(number));
  for (const expected of expectedParts) {
    assert.equal(photoFor(expected.number).publicPath, imageBase + expected.photo, `${expected.number}: source association`);
  }
  assert.equal(fs.existsSync(new URL('client/public/docs/jcb-seals-oils-photos-20261015/', root)), false);
});

test('source evidence distinguishes five confirmed articles from the held seal set and unconfirmed oil MPNs', () => {
  const confirmedSeals = sealBrakeEvidence.parts.filter(part => part.confirmedPartNumber);
  const confirmedFilters = filterOilEvidence.items.filter(item => item.kind === 'filter');
  assert.deepEqual([...confirmedSeals.map(part => part.confirmedPartNumber),
    ...confirmedFilters.map(part => part.partNumber)].sort(), expectedParts.map(part => part.number).sort());
  for (const part of confirmedSeals) {
    const photo = manifest.images.find(image => image.partNumbers.includes(part.confirmedPartNumber));
    assert.equal(photo.sourceFile, part.photo.file);
    assert.equal(photo.sha256, part.photo.sha256);
    assert(part.sources.some(source => source.url.startsWith('https://')));
  }
  for (const part of confirmedFilters) {
    const photo = manifest.images.find(image => image.partNumbers.includes(part.partNumber));
    assert.equal(photo.sourceFile, `${part.photoNumber}-Фото-${part.photoNumber}.jpg`);
    assert(part.primarySources.some(source => source.url === `https://parts.jcb.com/uk/product/${part.partNumber.replace('/', '-')}`));
  }
  const heldSealSet = sealBrakeEvidence.parts.find(part => part.partNumber === '991/20023');
  assert.equal(heldSealSet.confirmedPartNumber, null);
  assert.match(heldSealSet.publicationStatus, /hold/u);
  assert.equal(manifest.images.find(photo => photo.sourceFile === heldSealSet.photo.file).published, false);
  const oilEvidence = filterOilEvidence.items.filter(item => item.kind.endsWith('-oil'));
  assert.equal(oilEvidence.length, 2);
  for (const oil of oilEvidence) {
    assert.equal(oil.partNumber, null);
    assert.equal(oil.separatePnReadable, false);
    assert.equal(oil.packageVolumeL, 20);
  }
});

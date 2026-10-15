import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const readJson = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
const products = readJson('shared/catalog-supplier-products.json');
const aliases = readJson('shared/catalog-canonical-aliases.json');
const sources = readJson('docs/jcb-brakes-airfilters-20261015/source-manifest.json').sources;
const publication = readJson('docs/jcb-brakes-airfilters-20261015/publication-manifest.json').assets;
const evidence = readJson('docs/jcb-brakes-airfilters-20261015/primary-evidence.json');
const videoAnalysis = readJson('docs/jcb-brakes-airfilters-20261015/video-analysis.json');
const imageBase = '/catalog-assets/jcb-brakes-airfilters-20261015/';
const videoBase = '/catalog-media/jcb-brakes-airfilters-20261015/';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const partId = number => `ACA-JCB-PART-${number.replace('/', '-')}`;
const part = number => products.find(product => product.id === partId(number));
const cooler = products.find(product => product.id === 'ACA-JCB-OIL-COOLER-A4173-MARKING');
const photo = number => publication.find(asset => asset.sourceNumber === number && asset.role === 'original-photo').publicPath;
const expectedParts = [
  { number: '458/20353', handle: 'jcb-458-20353-brake-friction-disc', source: 5, category: 'other-parts', purpose: /фрикционн.*диск.*тормоз/iu },
  { number: '32/917804', handle: 'jcb-32-917804-air-filter', source: 10, category: 'seals-filters', purpose: /воздушн.*фильтр/iu },
  { number: '32/917805', handle: 'jcb-32-917805-safety-air-filter', source: 8, category: 'seals-filters', purpose: /защитн.*элемент.*воздушн.*фильтр/iu },
];
const affected = [...expectedParts.map(expected => part(expected.number)), part('458/20285'), cooler];
const fullCopy = product => [product.title, product.catalogTitle, product.productType, product.fitment,
  product.catalogDescription, product.catalogSelection, product.catalogImageCaption,
  ...product.variants.flatMap(variant => [variant.title, ...(variant.options || [])]),
  ...(product.catalogVideos || []).map(video => video.caption)].filter(Boolean).join(' ');

test('three exact new articles retain distinct identities, purposes and primary evidence without air-filter aliases', () => {
  for (const expected of expectedParts) {
    assert.equal(products.filter(product => product.id === partId(expected.number)).length, 1);
    const product = part(expected.number);
    assert.equal(product.handle, expected.handle);
    assert.equal(product.sku, expected.number);
    assert.equal(product.mpn, expected.number);
    assert.equal(product.brand, 'JCB');
    assert.equal(product.category, expected.category);
    assert(product.categories.includes(expected.category));
    assert.match(product.title, expected.purpose);
    assert.equal(product.imageUrl, photo(expected.source));
    assert(product.variants.every(variant => variant.sku === expected.number));
    const source = evidence.parts.find(item => item.partNumber === expected.number);
    assert(source.primarySources.some(item => item.url === `https://parts.jcb.com/uk/product/${expected.number.replace('/', '-')}`));
    assert.deepEqual(source.fitmentModels, []);
  }
  for (const [newNumber, oldNumber] of [['32/917804', '32/925682'], ['32/917805', '32/925683']]) {
    const current = part(newNumber);
    const previous = part(oldNumber);
    assert.notEqual(current.id, previous.id);
    assert.notEqual(current.handle, previous.handle);
    assert.equal(previous.sku, oldNumber);
    assert.equal(previous.mpn, oldNumber);
    assert(!(current.legacyHandles || []).includes(previous.handle));
    assert(!(previous.legacyHandles || []).includes(current.handle));
    assert.notEqual(aliases[current.handle], previous.handle);
    assert.notEqual(aliases[previous.handle], current.handle);
    assert(!(current.tags || []).includes(oldNumber));
  }
  const safetyEvidence = evidence.parts.find(item => item.partNumber === '32/917805');
  assert.equal(safetyEvidence.sourceConflict.present, true, 'The conflicting manufacturer title remains in internal evidence');
  assert.doesNotMatch(part('32/917805').title, /наружн|внутренн/iu);
});

test('confirmed cooler PN updates the existing product and URL while brake friction and counterplates keep separate galleries', () => {
  assert.equal(products.filter(product => product.id === 'ACA-JCB-OIL-COOLER-A4173-MARKING').length, 1);
  assert.equal(cooler.handle, 'jcb-oil-cooler-a4173-marking');
  assert.equal(cooler.sku, '320/A4173');
  assert.equal(cooler.mpn, '320/A4173');
  assert.equal(products.filter(product => product.mpn === '320/A4173').length, 1, 'Full PN confirmation updates rather than duplicates the earlier card');
  assert.equal(cooler.imageUrl, photo(2));
  assert.deepEqual(cooler.gallery, [photo(2), '/catalog-assets/jcb-product-media-20261015/oil-cooler-a4173-label-16s.jpg']);
  assert.deepEqual(cooler.catalogVideos.map(video => video.src), [
    '/catalog-media/jcb-20261015/oil-cooler-housing-inspection.mp4', videoBase + '320-a4173-unboxing.mp4',
  ]);
  assert.match(cooler.title, /320\/A4173/u);
  assert.doesNotMatch(fullCopy(cooler), /полный (?:OEM-|каталожный )?номер не (?:подтвержд|установлен)/iu);
  assert.deepEqual(part('458/20353').gallery, [photo(5), photo(3)]);
  const counterplate = part('458/20285');
  assert.equal(counterplate.imageUrl, '/catalog-assets/jcb-service-parts-batch2/458-20285-packaging.jpg');
  assert.deepEqual(counterplate.gallery, [counterplate.imageUrl, photo(4), photo(3)]);
  assert.match(counterplate.title, /ответн.*пластин.*тормоз/iu);
  assert.doesNotMatch(counterplate.title, /фрикционн/iu);
  assert.deepEqual(part('32/917804').gallery, [photo(10), photo(7)]);
  assert.deepEqual(part('32/917805').gallery, [photo(8), photo(9), photo(7)]);
});

test('all ten original sources are recorded and photo six remains an internal near duplicate with a different hash', () => {
  assert.equal(sources.length, 10);
  assert.deepEqual(sources.map(source => source.sourceNumber), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(sources.filter(source => source.mediaType === 'image/jpeg').length, 9);
  assert.equal(sources.filter(source => source.mediaType === 'video/quicktime').length, 1);
  const excluded = sources.find(source => source.sourceNumber === 6);
  const kept = sources.find(source => source.sourceNumber === 5);
  assert.equal(excluded.status, 'excluded-near-duplicate');
  assert.equal(excluded.nearDuplicateOfSourceNumber, 5);
  assert.notEqual(excluded.sha256, kept.sha256);
  assert.equal(excluded.similarity.all, 0.982705);
  assert.deepEqual(excluded.publicPaths, []);
  assert(excluded.internalPath.startsWith('docs/jcb-brakes-airfilters-20261015/excluded/'));
  const bytes = fs.readFileSync(new URL(excluded.internalPath, root));
  assert.equal(bytes.length, excluded.byteLength);
  assert.equal(digest(bytes), excluded.sha256);
  for (const source of sources) {
    assert.match(source.sha256, /^[a-f0-9]{64}$/u);
    assert(source.byteLength > 0);
    assert.deepEqual(source.publicPaths.sort(), publication.filter(asset => asset.sourceNumber === source.sourceNumber).map(asset => asset.publicPath).sort());
  }
});

test('eight original JPEGs, the chosen real poster and the verified MP4 retain exact hashes and source associations', () => {
  assert.equal(publication.length, 10);
  assert.equal(publication.filter(asset => asset.role === 'original-photo').length, 8);
  assert.equal(publication.filter(asset => asset.role === 'video-poster').length, 1);
  assert.equal(publication.filter(asset => asset.role === 'video-export').length, 1);
  const excludedHash = sources.find(source => source.sourceNumber === 6).sha256;
  for (const asset of publication) {
    assert(asset.publicPath.startsWith(imageBase) || asset.publicPath.startsWith(videoBase));
    assert(!asset.publicPath.includes('..'));
    const bytes = fs.readFileSync(new URL(`client/public${asset.publicPath}`, root));
    assert.equal(bytes.length, asset.byteLength, asset.publicPath);
    assert.equal(digest(bytes), asset.sha256, asset.publicPath);
    assert.notEqual(asset.sha256, excludedHash);
    const source = sources.find(item => item.sourceNumber === asset.sourceNumber);
    if (asset.role === 'original-photo') {
      assert.equal(asset.sha256, source.sha256);
      assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff');
    } else if (asset.role === 'video-export') {
      assert.equal(asset.sha256, videoAnalysis.export.sha256);
      assert.equal(source.sha256, videoAnalysis.source.sha256);
      assert.equal(bytes.toString('ascii', 4, 8), 'ftyp');
      assert.equal(asset.audioStreams, 0);
      assert.equal(asset.codec, 'h264');
      assert.equal(asset.pixelFormat, 'yuv420p');
      assert.equal(asset.faststartConfirmed, true);
      assert.deepEqual(asset.fullDecodeErrors, []);
    } else {
      assert.equal(asset.sourceFrameSeconds, 38);
      assert(videoAnalysis.stills.some(still => still.sha256 === asset.sha256 && still.actualSourceFrameSeconds === 38));
    }
    const ids = products.filter(product => product.gallery.includes(asset.publicPath)
      || product.catalogVideos?.some(video => video.src === asset.publicPath || video.poster === asset.publicPath)).map(product => product.id).sort();
    assert.deepEqual(asset.productIds, ids, asset.publicPath);
  }
  const actualPaths = [...fs.readdirSync(new URL(`client/public${imageBase}`, root)).map(file => imageBase + file),
    ...fs.readdirSync(new URL(`client/public${videoBase}`, root)).map(file => videoBase + file)];
  assert.deepEqual(actualPaths.sort(), publication.map(asset => asset.publicPath).sort());
  for (const source of evidence.parts.flatMap(item => item.photos)) {
    const manifestSource = sources.find(item => item.sourceNumber === source.sourceNumber);
    assert.equal(manifestSource.sha256, source.sha256);
    assert.equal(manifestSource.byteLength, source.byteLength);
  }
});

test('new numbers and expanded media do not become priced offers, stock quantities, fixed kits or guaranteed fitment', () => {
  for (const product of affected) {
    assert.equal(product.available, false);
    assert.equal(product.minPriceKzt, null);
    assert.equal(product.maxPriceKzt, null);
    assert(!product.ownerProduct && !product.ownerSale && !product.ownerCase && !product.ownerEvidence && !product.approvedSale);
    assert.match([product.fitment, product.catalogSelection].join(' '), /PIN/iu);
    for (const variant of product.variants) {
      assert.equal(variant.available, false);
      assert.equal(variant.priceKzt, null);
    }
    assert.doesNotMatch(fullCopy(product), /официальн\S*\s+дилер|(?:есть|имеется|имеются)\s+в\s+наличии|в\s+наличии\s+на\s+складе|подходит\s+(?:для\s+)?всех|гарантированн\S*\s+(?:оригинальн|совместим)|комплект\S*\s+из\s+(?:двух|десяти|двенадцати|2|10|12)|(?:^|\s)(?:10|12)\s*(?:шт|диск|пластин)/iu);
  }
});

test('the preserved cooler route renders both local native videos with controls and no preload or autoplay', () => {
  const html = fs.readFileSync(new URL(`dist/public/catalog/${cooler.handle}/index.html`, root), 'utf8');
  assert(html.includes('rel="canonical" href="https://acahydraulic.kz/catalog/jcb-oil-cooler-a4173-marking/"'));
  assert(html.includes('320/A4173'));
  const videos = [...html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/giu)];
  assert.equal(videos.length, 2);
  for (const video of cooler.catalogVideos) {
    const node = videos.find(match => match[2].includes(`src="${video.src}"`));
    assert(node, video.src);
    assert.match(node[1], /\bcontrols(?:\s|=|$)/iu);
    assert.match(node[1], /\bplaysinline(?:\s|=|$)/iu);
    assert.match(node[1], /\bpreload="none"/iu);
    assert.doesNotMatch(node[1], /\bautoplay(?:\s|=|$)/iu);
    assert(node[1].includes(`poster="${video.poster}"`));
    assert.match(node[2], /type="video\/mp4"/iu);
  }
  const component = fs.readFileSync(new URL('client/src/pages/CatalogProduct.tsx', root), 'utf8');
  const nativeVideo = component.match(/product\.catalogVideos\?\.map[\s\S]*?<video([\s\S]*?)>/u)?.[1];
  assert(nativeVideo, 'React product media uses a native video element');
  assert.match(nativeVideo, /\bcontrols\b/u);
  assert.match(nativeVideo, /\bplaysInline\b/u);
  assert.match(nativeVideo, /preload="none"/u);
  assert.doesNotMatch(nativeVideo, /autoPlay/u);
  for (const product of affected) {
    const page = fs.readFileSync(new URL(`dist/public/catalog/${product.handle}/index.html`, root), 'utf8');
    assert.match(page, /Цена по запросу/u);
    assert.doesNotMatch(page, /data-static-product-schema/u);
  }
});

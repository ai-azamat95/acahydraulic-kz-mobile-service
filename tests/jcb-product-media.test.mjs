import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { applySupplierCatalogProducts } from '../scripts/catalog-supplier-products.mjs';

const root = new URL('../', import.meta.url);
const readJson = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
const readText = file => fs.readFileSync(new URL(file, root), 'utf8');
const products = readJson('shared/catalog-supplier-products.json');
const sources = readJson('docs/jcb-product-media-20261015/source-manifest.json').sources;
const publication = readJson('docs/jcb-product-media-20261015/publication-manifest.json').assets;
const videoAnalysis = readJson('docs/jcb-product-media-20261015/video-analysis.json');
const imageBase = '/catalog-assets/jcb-product-media-20261015/';
const videoBase = '/catalog-media/jcb-20261015/';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const part = number => products.find(product => product.id === `ACA-JCB-PART-${number.replace('/', '-')}`);
const reducer = products.find(product => product.id === 'ACA-REDUCER-MARKING-SELECTION');
const cooler = products.find(product => product.id === 'ACA-JCB-OIL-COOLER-A4173-MARKING');
const relevant = products.filter(product => product.gallery.some(image => image.startsWith(imageBase)) || product.catalogVideos?.some(video => video.src.startsWith(videoBase)));
const batchVideos = product => (product.catalogVideos || []).filter(video => publication.some(asset => asset.publicPath === video.src));
const fullCopy = product => [product.title, product.catalogTitle, product.productType, product.fitment, product.catalogDescription,
  product.catalogSelection, product.catalogImageCaption, ...(product.tags || []),
  ...product.variants.flatMap(variant => [variant.title, variant.sku, ...(variant.options || [])]),
  ...(product.catalogVideos || []).map(video => video.caption)].filter(Boolean).join(' ');

test('all ten user sources have provenance and all sixteen published assets match verified output hashes', () => {
  assert.equal(sources.length, 10);
  assert.deepEqual(sources.map(source => source.sourceNumber), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(sources.filter(source => source.mediaType === 'image/jpeg').length, 7);
  assert.equal(sources.filter(source => source.mediaType === 'video/quicktime').length, 3);
  assert.equal(publication.length, 16);
  assert.deepEqual(Object.fromEntries(['original-photo', 'video-still', 'video-poster', 'video-export'].map(role => [role, publication.filter(asset => asset.role === role).length])),
    { 'original-photo': 6, 'video-still': 4, 'video-poster': 3, 'video-export': 3 });
  const excluded = sources.find(source => source.sourceNumber === 3);
  assert.equal(excluded.status, 'excluded-unidentified');
  assert.deepEqual(excluded.publicPaths, []);
  assert(excluded.internalPath.startsWith('docs/jcb-product-media-20261015/excluded/'));
  assert.equal(digest(fs.readFileSync(new URL(excluded.internalPath, root))), excluded.sha256);

  for (const source of sources) {
    assert.match(source.sha256, /^[a-f0-9]{64}$/u);
    assert(source.byteLength > 0);
    assert.deepEqual(source.publicPaths.sort(), publication.filter(asset => asset.sourceNumber === source.sourceNumber).map(asset => asset.publicPath).sort());
  }
  for (const asset of publication) {
    assert(asset.publicPath.startsWith(imageBase) || asset.publicPath.startsWith(videoBase));
    assert(!asset.publicPath.includes('..'));
    const bytes = fs.readFileSync(new URL(`client/public${asset.publicPath}`, root));
    assert.equal(bytes.length, asset.byteLength, asset.publicPath);
    assert.equal(digest(bytes), asset.sha256, asset.publicPath);
    assert.notEqual(asset.sha256, excluded.sha256, 'The unidentified photo cannot be published under another name');
    const source = sources.find(item => item.sourceNumber === asset.sourceNumber);
    assert(source, asset.publicPath);
    if (asset.role === 'original-photo') assert.equal(asset.sha256, source.sha256);
    else if (asset.role === 'video-export' || asset.role === 'video-poster') {
      const clip = videoAnalysis.clips.find(item => item.videoNumber === asset.sourceNumber);
      assert.equal(asset.sha256, asset.role === 'video-export' ? clip.export.sha256 : clip.poster.sha256);
      assert.equal(source.sha256, clip.source.sha256);
    } else assert.equal(asset.sha256, videoAnalysis.additionalStills.find(still => still.path === path.basename(asset.publicPath)).sha256);
    const productIds = products.filter(product => product.gallery.includes(asset.publicPath)
      || product.catalogVideos?.some(video => video.src === asset.publicPath || video.poster === asset.publicPath)).map(product => product.id).sort();
    assert.deepEqual(asset.productIds, productIds, asset.publicPath);
  }
});

test('existing filters retain exact identities and only gain photo and video associations evidenced for their numbers', () => {
  const photo = number => publication.find(asset => asset.sourceNumber === number && asset.role === 'original-photo').publicPath;
  for (const [number, photoNumbers] of [['581/R5206', [1, 2]], ['320/A7227', [2]], ['320/B4420', [4]]]) {
    const product = part(number);
    assert.equal(product.sku, number);
    assert.equal(product.mpn, number);
    for (const photoNumber of photoNumbers) assert(product.gallery.includes(photo(photoNumber)), number);
    assert(!product.imageUrl.startsWith(imageBase), 'Mixed packaging views remain supplementary');
  }
  assert.equal(part('32/925682').imageUrl, photo(5));
  assert.deepEqual(part('32/925682').gallery, [photo(5), '/catalog-assets/jcb-service-parts/32-925682-packaging.jpg']);
  assert.equal(part('32/925682').catalogImageLabel, 'Фото детали и упаковки');
  assert.equal(part('32/925683').imageUrl, '/catalog-assets/jcb-service-parts/32-925683-packaging.jpg');
  const links = [
    ['32/925682', 'jcb-air-filter-inspection.mp4'], ['32/925683', 'jcb-air-filter-inspection.mp4'],
    ['991/20021', 'jcb-seal-kits-inspection.mp4'], ['991/20023', 'jcb-seal-kits-inspection.mp4'], ['991/20038', 'jcb-seal-kits-inspection.mp4'],
  ];
  for (const [number, file] of links) assert.deepEqual(part(number).catalogVideos.map(video => video.src), [videoBase + file]);
  assert.deepEqual(cooler.catalogVideos.map(video => video.src), [videoBase + 'oil-cooler-housing-inspection.mp4',
    '/catalog-media/jcb-brakes-airfilters-20261015/320-a4173-unboxing.mp4']);
  assert.equal(products.filter(product => product.catalogVideos?.length).length, 6);
});

test('media inquiry cards retain proven identities while the unidentified reducer remains generic', () => {
  assert.equal(relevant.length, 11, 'Six new cards and five existing filters');
  for (const number of ['400/G6382', '991/20021', '991/20023', '991/20038']) {
    const product = part(number);
    assert(product, number);
    assert.equal(product.sku, number);
    assert.equal(product.mpn, number);
    assert.equal(product.brand, 'JCB');
    assert.equal(product.imageUrl, product.gallery[0]);
    assert.match(product.title, number === '400/G6382' ? /опорно-поворотн.*подшипник/iu : /комплект.*уплотнен/iu);
  }
  assert.equal(reducer.category, 'other-parts');
  assert(!reducer.brand && !reducer.applicationBrand && !reducer.mpn);
  assert.match(reducer.title, /редуктор.*подбор.*маркировк/iu);
  assert.doesNotMatch(fullCopy(reducer), /JCB|Bonfiglioli|final\s*drive|swing\s*drive|бортов|поворотн/iu);
  assert.equal(cooler.mpn, '320/A4173', 'A later readable box label and continuous unboxing confirmed the full number');
  assert.equal(cooler.sku, '320/A4173');
  assert.equal(cooler.handle, 'jcb-oil-cooler-a4173-marking', 'The previously published product URL is preserved');
  assert.match(cooler.title, /масляный.*теплообменник.*320\/A4173/iu);
  for (const product of relevant) {
    assert.equal(product.available, false, product.handle);
    assert.equal(product.minPriceKzt, null);
    assert.equal(product.maxPriceKzt, null);
    assert(!product.ownerProduct && !product.ownerSale && !product.ownerCase && !product.ownerEvidence && !product.approvedSale);
    assert.match([product.fitment, product.catalogSelection].join(' '), /PIN/iu);
    for (const variant of product.variants) {
      assert.equal(variant.available, false);
      assert.equal(variant.priceKzt, null);
    }
    assert.doesNotMatch(fullCopy(product), /400[/-]G6582|официальн\S*\s+дилер|(?:есть|имеется|имеются)\s+в\s+наличии|в\s+наличии\s+на\s+складе|подходит\s+(?:для\s+)?всех|гарантированн\S*\s+(?:оригинальн|совместим)/iu);
  }
});

test('published MP4 files are silent faststart videos with local posters and fixed portrait dimensions', () => {
  for (const asset of publication.filter(item => item.role === 'video-export')) {
    const bytes = fs.readFileSync(new URL(`client/public${asset.publicPath}`, root));
    assert.equal(bytes.toString('ascii', 4, 8), 'ftyp', 'Actual output is an MP4 container');
    assert.equal(asset.audioStreams, 0);
    assert.equal(asset.codec, 'h264');
    assert.equal(asset.pixelFormat, 'yuv420p');
    assert.equal(asset.width, 576);
    assert.equal(asset.height, 1024);
    assert.equal(asset.faststartConfirmed, true);
    assert.deepEqual(asset.fullDecodeErrors, []);
  }
  for (const product of relevant) for (const video of batchVideos(product)) {
    assert(video.src.startsWith(videoBase));
    assert(video.poster.startsWith(imageBase));
    assert(publication.some(asset => asset.publicPath === video.src));
    assert(publication.some(asset => asset.publicPath === video.poster));
    assert.equal(video.width, 576);
    assert.equal(video.height, 1024);
    assert(video.caption.trim().length > 30);
  }
});

test('supplier video validation rejects unsafe URLs and dimensions before modifying the snapshot', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aca-product-video-validation-'));
  try {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ productCount: 0, chunkCount: 1, pageSize: 250 }));
    fs.writeFileSync(path.join(dir, 'products-001.json'), '[]');
    const before = Object.fromEntries(fs.readdirSync(dir).map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')]));
    const video = part('32/925682').catalogVideos[0];
    const invalid = [
      { src: 'https://example.com/video.mp4' },
      { src: '/catalog-media/jcb-20261015/../private.mp4' },
      { width: '576' },
    ];
    for (const patch of invalid) {
      const product = { ...part('32/925682'), catalogVideos: [{ ...video, ...patch }] };
      assert.throws(() => applySupplierCatalogProducts(dir, { products: [product], updateCategorySummary: false }));
      assert.deepEqual(Object.fromEntries(fs.readdirSync(dir).map(file => [file, fs.readFileSync(path.join(dir, file), 'utf8')])), before);
    }
    const valid = structuredClone(part('32/925682'));
    applySupplierCatalogProducts(dir, { products: [valid], updateCategorySummary: false });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'products-001.json'), 'utf8'))[0].catalogVideos, valid.catalogVideos);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('static product pages expose user-controlled video with inline playback and no preload or autoplay', () => {
  for (const product of relevant.filter(item => batchVideos(item).length)) {
    const html = readText(`dist/public/catalog/${product.handle}/index.html`);
    const nodes = [...html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/giu)];
    assert(nodes.length >= batchVideos(product).length, product.handle);
    for (const video of batchVideos(product)) {
      const match = nodes.find(node => node[2].includes(`src="${video.src}"`));
      assert(match, `${product.handle}: exact local video source`);
      assert.match(match[1], /\bcontrols(?:\s|=|$)/iu);
      assert.match(match[1], /\bplaysinline(?:\s|=|$)/iu);
      assert.match(match[1], /\bpreload="none"/iu);
      assert.doesNotMatch(match[1], /\bautoplay(?:\s|=|$)/iu);
      assert(match[1].includes(`poster="${video.poster}"`));
      assert.match(match[2], /type="video\/mp4"/iu);
    }
    assert.doesNotMatch(html, /data-static-product-schema/iu, 'Inquiry media does not create a priced offer');
  }
});

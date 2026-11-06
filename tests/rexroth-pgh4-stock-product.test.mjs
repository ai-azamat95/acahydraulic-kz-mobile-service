import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

import ownerProducts from '../shared/catalog-owner-products.json' with { type: 'json' };
import { catalogProductSeo } from '../shared/catalog-product-seo.mjs';

const root = new URL('../', import.meta.url);
const handle = 'pgh4-3x-032re11vu2-internal-gear-pump-rexroth-r901147102';
const discardedBranchHandle = 'bosch-rexroth-r901147102-pgh4-31-032re11vu2';
const assetPrefix = '/catalog-assets/rexroth-r901147102-pgh4-032/';
const mediaPrefix = '/catalog-media/rexroth-r901147102-pgh4-032/';

function product() {
  const match = ownerProducts.find(item => item.handle === handle);
  assert(match, `Missing ACA stock product: ${handle}`);
  return match;
}

function publicFile(publicPath) {
  return new URL(`client/public${publicPath}`, root);
}

function digest(file) {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

test('Rexroth stock card preserves the exact nameplate identity', () => {
  const item = product();

  assert.equal(item.id, '8705188397218');
  assert.deepEqual(item.legacyHandles, [discardedBranchHandle]);
  assert.equal(item.sku, 'R901147102');
  assert.equal(item.mpn, 'R901147102');
  assert.equal(item.brand, 'Bosch Rexroth');
  assert.equal(item.model, 'PGH4-31/032RE11VU2');
  assert.equal(item.category, 'gear-pumps');
  assert.deepEqual(item.categories, ['hydraulic-pumps', 'gear-pumps']);
  assert.match(item.catalogTitle, /R901147102/);
  assert.match(item.catalogTitle, /PGH4-31\/032RE11VU2/);
  assert(item.tags.includes('PGH4-3X/032RE11VU2'));
  assert.doesNotMatch(JSON.stringify(item), /R901147104|PGH4-3X\/050/);
});

test('Rexroth stock card targets the existing canonical search intent without a duplicate URL', () => {
  const item = product();
  const seo = catalogProductSeo(item);

  assert.equal(seo.title, 'Насос Bosch Rexroth R901147102 PGH4-31/032RE11VU2');
  assert.match(seo.name, /R901147102/);
  assert.match(seo.name, /PGH4-31\/032RE11VU2/);
  assert.match(seo.description, /PGH4-3X\/032RE11VU2/);
  assert.match(seo.metaDescription, /в наличии в Казахстане/i);
  assert.match(seo.metaDescription, /5 реальных фото и видео/i);
  assert(seo.title.length <= 59);
  assert(seo.metaDescription.length <= 160);
});

test('Rexroth stock card is in stock with price on request and no case page claim', () => {
  const item = product();

  assert.equal(item.available, true);
  assert.equal(item.minPriceKzt, null);
  assert.equal(item.maxPriceKzt, null);
  assert.deepEqual(item.ownerInventory, {
    availability: 'in_stock',
    confirmedOn: '2026-11-06',
  });
  assert.equal(item.variants.length, 1);
  assert.equal(item.variants[0].id, '45636706959522');
  assert.equal(item.variants[0].available, true);
  assert.equal(item.variants[0].priceKzt, null);
  assert(item.variants[0].options.includes('В наличии'));
  assert(item.variants[0].options.includes('Цена по запросу'));
  assert.equal(item.ownerCase, undefined);
  assert.equal(item.ownerSale, undefined);
  assert.equal(item.ownerProduct, undefined);
  assert.equal(item.approvedSale, undefined);
});

test('Rexroth stock card uses a unique local real-photo gallery and local inspection video', () => {
  const item = product();

  assert.equal(item.gallery.length, 5);
  assert.equal(item.imageUrl, item.gallery[0]);
  assert(item.gallery.every(path => path.startsWith(assetPrefix)));
  assert(item.gallery.every(path => path.endsWith('.webp')));
  assert(!item.gallery.some(path => path.endsWith('/02-nameplate.webp')));
  assert(!item.gallery.some(path => path.endsWith('/06-side-nameplate.webp')));
  assert(!item.gallery.some(path => path.endsWith('/08-overview.webp')));
  for (const removed of ['02-nameplate.webp', '06-side-nameplate.webp', '08-overview.webp', 'video-poster.webp']) {
    assert.equal(fs.existsSync(publicFile(`${assetPrefix}${removed}`)), false, `Sensitive public image must be absent: ${removed}`);
  }

  const galleryFiles = item.gallery.map(publicFile);
  for (const file of galleryFiles) {
    assert(fs.existsSync(file), `Missing gallery image: ${file.pathname}`);
    assert(fs.statSync(file).size > 10_000, `Gallery image is unexpectedly small: ${file.pathname}`);
  }
  assert.equal(new Set(galleryFiles.map(digest)).size, galleryFiles.length, 'Gallery must not contain duplicate files');
  const imageManifest = JSON.parse(fs.readFileSync(new URL('client/public/catalog-data/catalog-image-manifest.json', root), 'utf8'));
  assert.equal(imageManifest.entries.some(entry => String(entry.productId) === item.id), false, 'Replaced internet photo must not remain in the public image manifest');

  assert.equal(item.catalogVideos.length, 1);
  const video = item.catalogVideos[0];
  assert(video.src.startsWith(mediaPrefix));
  assert.equal(video.poster, `${assetPrefix}01-main.webp`);
  assert.equal(video.width, 720);
  assert.equal(video.height, 1280);
  assert.match(video.caption, /R901147102/);
  assert.match(video.caption, /фактическ|реальн/iu);

  const videoFile = publicFile(video.src);
  const posterFile = publicFile(video.poster);
  assert(fs.existsSync(videoFile), `Missing product video: ${videoFile.pathname}`);
  assert(fs.existsSync(posterFile), `Missing product video poster: ${posterFile.pathname}`);
  const videoBytes = fs.readFileSync(videoFile);
  assert.equal(videoBytes.toString('ascii', 4, 8), 'ftyp');
  assert(videoBytes.includes(Buffer.from('avc1')), 'Product video must be H.264');
  assert(videoBytes.indexOf(Buffer.from('moov')) < videoBytes.indexOf(Buffer.from('mdat')), 'Product video must use faststart');
  const productPageSource = fs.readFileSync(new URL('client/src/pages/CatalogProduct.tsx', root), 'utf8');
  assert.match(productPageSource, /aspectRatio:\s*`\$\{video\.width\} \/ \$\{video\.height\}`/);
  assert.match(productPageSource, /maxWidth:\s*`min\(100%, \$\{\(70 \* video\.width\) \/ video\.height\}vh\)`/);
});

const publishedPath = new URL(`dist/public/catalog/${handle}/index.html`, root);
const discardedBranchPath = new URL(`dist/public/catalog/${discardedBranchHandle}/index.html`, root);
const productSitemapPath = new URL('dist/public/sitemap-products.xml', root);

test('published Rexroth card says in stock and price on request without a supplied-case section', { skip: !fs.existsSync(publishedPath) }, () => {
  const html = fs.readFileSync(publishedPath, 'utf8');

  assert.match(html, /R901147102/);
  assert.match(html, /PGH4-31\/032RE11VU2/);
  assert.match(html, /Фактический товар на складе ACA Hydraulic/);
  assert.match(html, /Совпадение только серии PGH4 не подтверждает взаимозаменяемость/);
  assert.match(html, />В наличии</);
  assert.match(html, />Цена по запросу</);
  assert.match(html, /data-product-gallery/);
  assert.match(html, /data-product-videos/);
  assert.match(html, /catalog-media\/rexroth-r901147102-pgh4-032\/inspection\.mp4/);
  assert.match(html, /<video[^>]+style="[^"]*aspect-ratio:720 \/ 1280;[^"]*max-width:min\(100%,39\.375vh\)/);
  assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="https://acahydraulic\\.kz/catalog/${handle}/"`));
  assert.match(html, /data-static-breadcrumb-schema/);
  assert.equal(html.match(/"@type":"BreadcrumbList"/g)?.length, 1);
  assert.match(html, /catalog\/category\/gear-pumps\//);
  assert.doesNotMatch(html, /Этот насос поставили|Реальная поставка|data-owner-case/);
  assert.doesNotMatch(html, /data-static-product-schema/iu, 'A price-on-request card must not publish a priced Product offer');
  assert.equal(fs.existsSync(discardedBranchPath), false, 'The branch-only duplicate product route must not be published');

  const sitemap = fs.readFileSync(productSitemapPath, 'utf8');
  const canonicalUrl = `https://acahydraulic.kz/catalog/${handle}/`;
  assert.equal(sitemap.split(canonicalUrl).length - 1, 1, 'Canonical product must occur once in the product sitemap');
  assert.match(sitemap, new RegExp(`<loc>${canonicalUrl}</loc>\\s*<lastmod>2026-11-06</lastmod>`));
  assert.doesNotMatch(sitemap, new RegExp(discardedBranchHandle));
});

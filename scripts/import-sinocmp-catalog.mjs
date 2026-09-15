import fs from 'node:fs';
import path from 'node:path';
import { categoryRules, detectCategory } from './catalog-classification.mjs';

const SOURCE_ORIGIN = 'https://sinocmp.com';
const PUBLISHED_DIR = path.resolve('client/public/catalog-data');
const OUTPUT_DIR = path.resolve('client/public/catalog-data-staging');
const PAGE_SIZE = 250;
const MARKUP = 1.5;
const CONCURRENCY = 2;
const MAX_RETRIES = 5;
const MAX_GALLERY_IMAGES = 8;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(45000),
    headers: {
      accept: 'application/json',
      'user-agent': 'ACA-Hydraulic-Catalog-Sync/1.3 (+https://acahydraulic.kz/catalog/)',
    },
  });
  if (response.ok) return response.json();
  if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
    const retryAfter = Number(response.headers.get('retry-after')) || attempt * 2;
    await sleep(retryAfter * 1000);
    return fetchJson(url, attempt + 1);
  }
  throw new Error(`Catalog request failed: ${response.status} ${url}`);
}

function markedUpPrice(price) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric) || numeric <= 0 || numeric >= 10_000_000) return null;
  return Math.round(numeric * MARKUP * 100) / 100;
}

function rawImageUrl(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.src || value.url || null;
}

function normalizeImageUrl(value) {
  const raw = rawImageUrl(value);
  if (!raw || typeof raw !== 'string') return null;
  if (raw.startsWith('//')) return `https:${raw}`;
  if (raw.startsWith('/')) return `${SOURCE_ORIGIN}${raw}`;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && (url.hostname === 'sinocmp.com' || url.hostname === 'cdn.shopify.com' || url.hostname.endsWith('.shopify.com')) ? url.href : null;
  } catch { return null; }
}

function imageBelongsToProduct(product, value, productCategory) {
  if (!value) return false;

  if (typeof value === 'object' && value.product_id != null) {
    if (String(value.product_id) !== String(product.id)) return false;
  }

  const raw = rawImageUrl(value);
  if (!raw) return false;

  // Shopify product ownership is authoritative. Category keywords in a filename
  // are not: a pump sensor image legitimately contains both "pump" and "sensor".
  return true;
}

function productGallery(product) {
  const productCategory = detectCategory(product);
  const variantImages = Array.isArray(product.variants)
    ? product.variants.map((variant) => variant.featured_image).filter(Boolean)
    : [];

  const candidates = [
    product.image,
    product.featured_image,
    ...variantImages,
    ...(Array.isArray(product.images) ? product.images : []),
  ];

  return [...new Set(
    candidates
      .filter((value) => imageBelongsToProduct(product, value, productCategory))
      .map(normalizeImageUrl)
      .filter(Boolean),
  )].slice(0, MAX_GALLERY_IMAGES);
}

function productSpecifications(html = '') {
  // Publish factual attributes only; never execute or inject supplier HTML.
  const decode = (value) => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ').trim();
  const allowed = /^(?:part (?:name|number|no\.?|type)|model|application|applicable (?:model|machine)|voltage|power|displacement|rotation|shaft|port size|adjustable flow rate|flow rate|pressure|material|weight|product weight|packaging dimensions|dimensions|size|condition|engine model|machine model|oem (?:number|no\.?))$/i;
  const specifications = [];
  for (const match of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
    const text = decode(match[1]);
    const separator = text.indexOf(':');
    if (separator < 1) continue;
    const name = text.slice(0, separator).trim();
    const value = text.slice(separator + 1).trim();
    if (allowed.test(name) && value && value.length <= 250 && !specifications.some(item => item.name === name)) specifications.push({ name, value });
  }
  return specifications.slice(0, 16);
}

function normalizeProduct(product, page) {
  const variants = (product.variants || []).map((variant) => ({
    id: String(variant.id),
    title: variant.title === 'Default Title' ? '' : variant.title,
    sku: variant.sku || '',
    available: Boolean(variant.available),
    sourcePriceKzt: Number(variant.price),
    priceKzt: markedUpPrice(variant.price),
    options: [variant.option1, variant.option2, variant.option3].filter((value) => value && value !== 'Default Title'),
  }));
  const salePrices = variants.map((variant) => variant.priceKzt).filter(Number.isFinite);
  const gallery = productGallery(product);
  return {
    id: String(product.id),
    handle: product.handle,
    title: product.title,
    category: detectCategory(product),
    specifications: productSpecifications(product.body_html),
    productType: product.product_type || '',
    tags: product.tags || [],
    skus: variants.map((variant) => variant.sku).filter(Boolean),
    available: variants.some((variant) => variant.available),
    minPriceKzt: salePrices.length ? Math.min(...salePrices) : null,
    maxPriceKzt: salePrices.length ? Math.max(...salePrices) : null,
    imageUrl: gallery[0] || null,
    gallery,
    variants,
    sourceUrl: `${SOURCE_ORIGIN}/products/${product.handle}`,
    sourceUpdatedAt: product.updated_at,
    chunk: page,
  };
}

function writeJson(fileName, data) {
  fs.writeFileSync(path.join(OUTPUT_DIR, fileName), JSON.stringify(data));
}

async function fetchPage(page) {
  const url = `${SOURCE_ORIGIN}/collections/all/products.json?limit=${PAGE_SIZE}&page=${page}&currency=KZT`;
  const payload = await fetchJson(url);
  return payload.products || [];
}

async function run() {
  const cart = await fetchJson(`${SOURCE_ORIGIN}/cart.js?currency=KZT`);
  if (cart.currency !== 'KZT') throw new Error(`Source market currency is ${cart.currency}, expected KZT; keeping published prices unchanged.`);
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const searchIndex = [];
  const productMap = {};
  let nextPage = 1;
  let reachedEnd = false;
  let importedCount = 0;

  async function worker() {
    while (!reachedEnd) {
      const page = nextPage++;
      const products = await fetchPage(page);
      if (products.length === 0) {
        reachedEnd = true;
        return;
      }

      const normalized = products.map((product) => normalizeProduct(product, page));
      writeJson(`products-${String(page).padStart(3, '0')}.json`, normalized);
      const pageIndex = [];
      for (const product of normalized) {
        productMap[product.handle] = page;
        const indexProduct = {
          id: product.id,
          handle: product.handle,
          title: product.title,
          category: product.category,
          tags: product.tags,
          skus: product.skus,
          available: product.available,
          minPriceKzt: product.minPriceKzt,
          maxPriceKzt: product.maxPriceKzt,
          imageUrl: product.imageUrl,
          chunk: page,
        };
        searchIndex.push(indexProduct);
        pageIndex.push(indexProduct);
      }
      writeJson(`search-index-${String(page).padStart(3, '0')}.json`, pageIndex);
      importedCount += normalized.length;
      console.log(`Imported page ${page}: ${normalized.length} products, total ${importedCount}`);
      await sleep(500);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  searchIndex.sort((a, b) => a.title.localeCompare(b.title, 'en'));

  const categorySummary = {};
  for (const [category] of categoryRules) {
    categorySummary[category] = { count: 0, imageUrl: null };
  }
  for (const product of searchIndex) {
    const summary = categorySummary[product.category] || (categorySummary[product.category] = { count: 0, imageUrl: null });
    summary.count += 1;
    if (!summary.imageUrl && product.imageUrl) summary.imageUrl = product.imageUrl;
  }

  const importedAt = new Date().toISOString();
  writeJson('search-index.json', searchIndex);
  writeJson('category-summary.json', categorySummary);
  writeJson('product-map.json', productMap);
  writeJson('manifest.json', {
    source: SOURCE_ORIGIN,
    importedAt,
    productCount: searchIndex.length,
    pageSize: PAGE_SIZE,
    chunkCount: Math.max(...Object.values(productMap)),
    markup: MARKUP,
    currency: 'KZT',
    indexFile: 'search-index.json',
    categorySummaryFile: 'category-summary.json',
    imagePolicy: 'Only product-bound supplier images are published. Foreign product/category images are rejected.',
  });
  if (!searchIndex.length || new Set(searchIndex.map(p => p.handle)).size !== searchIndex.length) throw new Error('Empty or duplicate catalogue; keeping previous data.');
  const previousCount = fs.existsSync(path.join(PUBLISHED_DIR, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(PUBLISHED_DIR, 'manifest.json'), 'utf8')).productCount : 0;
  if (previousCount && searchIndex.length < previousCount * 0.95) throw new Error('Incomplete supplier catalogue; keeping previous data.');
  fs.rmSync(PUBLISHED_DIR, { recursive: true, force: true });
  fs.renameSync(OUTPUT_DIR, PUBLISHED_DIR);
  console.log(`Catalog import complete: ${searchIndex.length} products at ${importedAt}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

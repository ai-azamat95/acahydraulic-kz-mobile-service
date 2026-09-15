import fs from 'node:fs';
import path from 'node:path';

const SOURCE_ORIGIN = 'https://sinocmp.com';
const OUTPUT_DIR = path.resolve('client/public/catalog-data');
const PAGE_SIZE = 250;
const MARKUP = 1.5;
const CONCURRENCY = 2;
const MAX_RETRIES = 5;
const PUMP_COLLECTIONS = [
  'hydraulic-pump-assembly',
  'piston-pump',
  'gear-pump',
];

const categoryRules = [
  // Hydraulic pumps are assigned from the supplier collections, not keywords.
  ['hydraulic-pumps', []],
  ['pump-parts', ['pump spare', 'pump parts', 'valve plate', 'cylinder block', 'piston shoe', 'swash plate']],
  ['hydraulic-motors', ['hydraulic motor', 'swing motor', 'travel motor', 'orbit motor']],
  ['final-drives', ['final drive', 'travel device', 'reduction gearbox']],
  ['control-valves', ['control valve', 'main valve', 'relief valve', 'pilot valve', 'valves']],
  ['electrical', ['sensor', 'solenoid', 'relay', 'wiring harness', 'alternator', 'starter motor']],
  ['controllers-monitors', ['controller', 'monitor', 'display', 'ecu', 'ecm']],
  ['seals-filters', ['seal kit', 'gasket kit', 'filter']],
  ['engine-fuel', ['fuel injector', 'fuel pump', 'common rail', 'turbocharger', 'water pump', 'oil pump', 'engine']],
  ['air-conditioning', ['compressor', 'air conditioning', 'a/c ', 'blower motor', 'radiator']],
  ['diagnostic-tools', ['diagnostic tool', 'pressure test', 'gauge kit', 'adapter']],
  ['other-parts', []],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
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

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\/\//g, ' ')
    .replace(/[-_./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectCategoryFromText(value) {
  const haystack = normalizeSearchText(value);
  if (!haystack) return null;
  for (const [category, terms] of categoryRules) {
    if (terms.length && terms.some((term) => haystack.includes(term))) return category;
  }
  return null;
}

function detectCategory(product, pumpProductIds = new Set()) {
  if (pumpProductIds.has(String(product.id))) return 'hydraulic-pumps';
  const haystack = [product.title, product.product_type, ...(product.tags || [])].join(' ');
  return detectCategoryFromText(haystack) || 'other-parts';
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
  return raw;
}

function imageBelongsToProduct(product, value, productCategory) {
  if (!value) return false;

  if (typeof value === 'object' && value.product_id != null) {
    if (String(value.product_id) !== String(product.id)) return false;
  }

  const normalized = normalizeImageUrl(value);
  if (!normalized) return false;
  try {
    const hostname = new URL(normalized).hostname;
    if (hostname !== 'sinocmp.com' && hostname !== 'cdn.shopify.com' && !hostname.endsWith('.shopify.com')) return false;
  } catch {
    return false;
  }

  // Pumps must reproduce the supplier gallery exactly. Keep the existing
  // category-safety filter for product groups that are not part of this task.
  if (productCategory !== 'hydraulic-pumps') {
    const raw = rawImageUrl(value);
    const imageCategory = detectCategoryFromText(`${raw} ${typeof value === 'object' ? value.alt || '' : ''}`);
    if (imageCategory && productCategory !== 'other-parts' && imageCategory !== productCategory) return false;
  }

  return true;
}

function productGallery(product, productCategory) {
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
  )];
}

function normalizeProduct(product, page, pumpProductIds) {
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
  const category = detectCategory(product, pumpProductIds);
  const gallery = productGallery(product, category);
  return {
    id: String(product.id),
    handle: product.handle,
    title: product.title,
    category,
    productType: product.product_type || '',
    tags: product.tags || [],
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
  const url = `${SOURCE_ORIGIN}/collections/all/products.json?limit=${PAGE_SIZE}&page=${page}`;
  const payload = await fetchJson(url);
  return payload.products || [];
}

async function fetchCollection(handle) {
  const products = [];
  for (let page = 1; ; page += 1) {
    const url = `${SOURCE_ORIGIN}/collections/${handle}/products.json?limit=${PAGE_SIZE}&page=${page}`;
    const payload = await fetchJson(url);
    const batch = payload.products || [];
    products.push(...batch);
    if (batch.length < PAGE_SIZE) return products;
    await sleep(250);
  }
}

function exactList(values) {
  return JSON.stringify(values);
}

function pumpSourceSnapshot(product) {
  return {
    id: String(product.id),
    handle: product.handle,
    title: product.title,
    skus: (product.variants || []).map((variant) => variant.sku || ''),
    gallery: productGallery(product, 'hydraulic-pumps'),
  };
}

function verifyPumpImport(sourceProducts, importedProducts, collectionCounts) {
  const failures = [];
  let exactTitleMatches = 0;
  let exactSkuMatches = 0;
  let exactGalleryMatches = 0;
  const productsWithoutSourceImages = [];

  for (const [id, source] of sourceProducts) {
    const imported = importedProducts.get(id);
    if (!imported) {
      failures.push({ id, reason: 'missing-product', title: source.title });
      continue;
    }
    if (imported.title === source.title && imported.handle === source.handle) exactTitleMatches += 1;
    else failures.push({ id, reason: 'title-or-handle-mismatch', source: source.title, imported: imported.title });

    const importedSkus = imported.variants.map((variant) => variant.sku || '');
    if (exactList(importedSkus) === exactList(source.skus)) exactSkuMatches += 1;
    else failures.push({ id, reason: 'sku-mismatch', source: source.skus, imported: importedSkus });

    if (source.gallery.length === 0) {
      productsWithoutSourceImages.push({ id, handle: source.handle, title: source.title, skus: source.skus });
    }
    if (exactList(imported.gallery) === exactList(source.gallery)) exactGalleryMatches += 1;
    else failures.push({ id, reason: 'gallery-mismatch', source: source.gallery, imported: imported.gallery });
  }

  const unexpectedProductIds = [...importedProducts.keys()].filter((id) => !sourceProducts.has(id));
  if (unexpectedProductIds.length) {
    failures.push({ reason: 'unexpected-products', ids: unexpectedProductIds.slice(0, 20), count: unexpectedProductIds.length });
  }

  const report = {
    checkedAt: new Date().toISOString(),
    source: SOURCE_ORIGIN,
    collections: collectionCounts,
    uniqueSourceProducts: sourceProducts.size,
    importedProducts: importedProducts.size,
    exactTitleAndHandleMatches: exactTitleMatches,
    exactSkuMatches,
    exactGalleryMatches,
    productsWithoutSourceImages: productsWithoutSourceImages.length,
    productsWithoutSourceImagesList: productsWithoutSourceImages,
    unexpectedProducts: unexpectedProductIds.length,
    failures: failures.slice(0, 50),
    passed: failures.length === 0,
  };

  if (failures.length) {
    throw new Error(`Hydraulic pump import verification failed: ${JSON.stringify(report)}`);
  }
  return report;
}

async function run() {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const pumpCollections = await Promise.all(
    PUMP_COLLECTIONS.map(async (handle) => [handle, await fetchCollection(handle)]),
  );
  const collectionCounts = Object.fromEntries(
    pumpCollections.map(([handle, products]) => [handle, products.length]),
  );
  const sourcePumpProducts = new Map();
  for (const [, products] of pumpCollections) {
    for (const product of products) {
      sourcePumpProducts.set(String(product.id), pumpSourceSnapshot(product));
    }
  }
  const pumpProductIds = new Set(sourcePumpProducts.keys());
  console.log(`Supplier pump collections: ${pumpProductIds.size} unique products`);

  const searchIndex = [];
  const productMap = {};
  const importedPumpProducts = new Map();
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

      const normalized = products.map((product) => normalizeProduct(product, page, pumpProductIds));
      writeJson(`products-${String(page).padStart(3, '0')}.json`, normalized);
      const pageIndex = [];
      for (const product of normalized) {
        if (product.category === 'hydraulic-pumps') importedPumpProducts.set(product.id, product);
        productMap[product.handle] = page;
        const indexProduct = {
          id: product.id,
          handle: product.handle,
          title: product.title,
          category: product.category,
          tags: product.tags,
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
  const pumpAudit = verifyPumpImport(sourcePumpProducts, importedPumpProducts, collectionCounts);
  writeJson('pump-import-audit.json', pumpAudit);
  writeJson('manifest.json', {
    source: SOURCE_ORIGIN,
    importedAt,
    productCount: searchIndex.length,
    pageSize: PAGE_SIZE,
    chunkCount: Math.ceil(searchIndex.length / PAGE_SIZE),
    markup: MARKUP,
    currency: 'KZT',
    indexFile: 'search-index.json',
    categorySummaryFile: 'category-summary.json',
    pumpAuditFile: 'pump-import-audit.json',
    imagePolicy: 'Supplier-authorized, product-bound SinoCMP images are published unchanged. Foreign images are rejected.',
  });
  console.log(`Catalog import complete: ${searchIndex.length} products at ${importedAt}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

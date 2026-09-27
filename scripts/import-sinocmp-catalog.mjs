import fs from 'node:fs';
import path from 'node:path';

import { extractFitment } from './lib/catalog-fitment.mjs';

const SOURCE_ORIGIN = 'https://sinocmp.com';
const KAZAKHSTAN_MARKET_COOKIE = 'localization=KZ; _shopify_country=KZ; cart_currency=KZT';
const OUTPUT_DIR = path.resolve('client/public/catalog-data');
const WIRING_HARNESS_ASSET_DIR = path.resolve('client/public/catalog-assets/wiring-harnesses');
const PAGE_SIZE = 250;
const MARKUP = 1.5;
const CONTROLLER_MARKUP = 1.8;
const CONTROLLER_COLLECTION = 'controller';
const MONITOR_MARKUP = 1.5;
const MONITOR_COLLECTION = 'monitor';
const WIRING_HARNESS_COLLECTION = 'wiring-harness';
const PRICE_ON_REQUEST_THRESHOLD_KZT = 10_000_000;
const CONCURRENCY = 2;
const COLLECTION_CONCURRENCY = 3;
const MAX_RETRIES = 12;
const CATEGORY_COLLECTIONS = [
  // Gear pumps are a distinct sales category. Keep this entry before the
  // broader hydraulic pump collections so cross-listed products land here.
  ['gear-pumps', ['gear-pump']],
  // Piston pumps are also a distinct sales category and do not overlap the
  // supplier's hydraulic-pump-assembly or gear-pump collections.
  ['piston-pumps', ['piston-pump']],
  // Preserve the audited pump scope: every product in these supplier
  // collections remains a hydraulic pump even if it is cross-listed elsewhere.
  ['hydraulic-pumps', ['hydraulic-pump-assembly']],
  ['main-control-valves', ['main-control-valve']],
  ['pump-parts', ['hydraulic-pump-spare-parts']],
  ['final-drives', ['final-drive-assembly']],
  ['control-valves', ['valves']],
  ['hydraulic-motors', ['hydraulic-motor']],
  ['diagnostic-tools', ['diagnostic-tool', 'pressure-test-kit']],
  ['air-conditioning', ['air-conditioning']],
  ['controllers', ['controller', 'joystick-controller']],
  ['monitors', ['monitor']],
  ['seals-filters', ['filters', 'seal-kits', 'engine-gasket-kit', 'consumable-parts']],
  ['engine-fuel', ['fuel-parts', 'engine-parts']],
  ['electrical', ['electrical-parts']],
  // Keep wiring harnesses in the broader electrical category while also
  // exposing the supplier's exact collection as a dedicated sales category.
  ['wiring-harnesses', ['wiring-harness']],
  // Fuel injectors remain part of the broader engine and fuel catalogue while
  // the supplier's exact collection is also available as a dedicated filter.
  ['fuel-injectors', ['fuel-injector']],
  // Fuel pumps remain part of the broader engine and fuel catalogue while the
  // supplier's exact collection is also available as a dedicated filter.
  ['fuel-pumps', ['fuel-pump']],
  // Engine rebuild kits remain in the broader engine and fuel catalogue while
  // this exact supplier collection is exposed as a dedicated category.
  ['engine-rebuild-kits', ['engine-overhaul-rebuild-kit']],
];
const PUMP_COLLECTIONS = ['hydraulic-pump-assembly', 'piston-pump', 'gear-pump'];
const STRICT_CATEGORY_COLLECTIONS = [
  ['hydraulic-motors', 'hydraulic-motor'],
  ['main-control-valves', 'main-control-valve'],
  ['monitors', 'monitor'],
  ['wiring-harnesses', 'wiring-harness'],
  ['fuel-injectors', 'fuel-injector'],
  ['fuel-pumps', 'fuel-pump'],
  ['engine-rebuild-kits', 'engine-overhaul-rebuild-kit'],
];
const PUMP_PARTS_PLACEHOLDER = '/catalog-assets/category-pump-parts.jpg';
const FUEL_INJECTOR_PLACEHOLDER = '/catalog-assets/category-fuel-injector.jpg';
const FUEL_PUMP_PLACEHOLDER = '/catalog-assets/category-fuel-pump.jpg';
const ENGINE_REBUILD_KIT_PLACEHOLDER = '/catalog-assets/category-engine-rebuild-kit.jpg';
const wiringHarnessMirroredImages = new Map();

const categoryRules = [
  ['pump-parts', ['pump spare', 'pump parts', 'valve plate', 'piston shoe', 'swash plate']],
  ['final-drives', ['final drive', 'travel device', 'reduction gearbox']],
  ['control-valves', ['control valve', 'main valve', 'relief valve', 'pilot valve', 'flow valve']],
  ['diagnostic-tools', ['diagnostic tool', 'pressure test', 'gauge kit']],
  ['hydraulic-motors', ['hydraulic motor', 'swing motor', 'travel motor', 'orbit motor']],
  ['monitors', ['monitor', 'display']],
  ['controllers', ['controller', 'ecu', 'ecm']],
  ['seals-filters', ['seal kit', 'gasket kit', 'filter']],
  ['air-conditioning', ['compressor', 'air conditioning', 'a/c ', 'blower motor', 'radiator']],
  ['engine-fuel', ['fuel injector', 'fuel pump', 'common rail', 'turbocharger', 'water pump', 'oil pump', 'engine']],
  ['electrical', ['sensor', 'solenoid', 'relay', 'wiring harness', 'alternator', 'starter motor']],
  ['other-parts', []],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      cookie: KAZAKHSTAN_MARKET_COOKIE,
      'user-agent': 'ACA-Hydraulic-Catalog-Sync/1.4 (+https://acahydraulic.kz/catalog/)',
    },
  });
  if (response.ok) return response.json();
  if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
    const retryAfter = Number(response.headers.get('retry-after')) || Math.min(30, 2 ** attempt);
    await sleep(retryAfter * 1000 + Math.floor(Math.random() * 750));
    return fetchJson(url, attempt + 1);
  }
  throw new Error(`Catalog request failed: ${response.status} ${url}`);
}

async function fetchBinary(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'user-agent': 'ACA-Hydraulic-Catalog-Sync/1.4 (+https://acahydraulic.kz/catalog/)',
    },
  });
  if (response.ok) {
    return {
      contents: Buffer.from(await response.arrayBuffer()),
      contentType: response.headers.get('content-type') || '',
    };
  }
  if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
    const retryAfter = Number(response.headers.get('retry-after')) || Math.min(30, 2 ** attempt);
    await sleep(retryAfter * 1000 + Math.floor(Math.random() * 750));
    return fetchBinary(url, attempt + 1);
  }
  throw new Error(`Catalog image request failed: ${response.status} ${url}`);
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\/\//g, ' ')
    .replace(/[-_./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsSupplierBrand(value) {
  return /sinocmp/i.test(String(value || ''));
}

function publicText(value) {
  return String(value || '')
    .replace(/\bfor\s+sinocmp[®™]?\b/gi, '')
    .replace(/sinocmp[®™]?/gi, '')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/[\s|:–—-]+$/g, '')
    .trim();
}

function publicHandle(value, productId) {
  const handle = String(value || '')
    .toLowerCase()
    .replace(/sinocmp/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
  return handle || `part-${productId}`;
}

function publicSku(value, variantId) {
  const sku = String(value || '').trim();
  if (!sku) return '';
  const sanitized = sku.replace(/sinocmp[®™]?/gi, 'ACA').replace(/\s+/g, ' ').trim();
  return sanitized || `ACA-${variantId}`;
}

function detectCategoryFromText(value) {
  const haystack = normalizeSearchText(value);
  if (!haystack) return null;
  for (const [category, terms] of categoryRules) {
    if (terms.length && terms.some((term) => haystack.includes(term))) return category;
  }
  return null;
}

function detectCategory(product, collectionCategoryByProductId = new Map()) {
  const haystack = [product.title, product.product_type, ...(product.tags || [])].join(' ');
  const textCategory = detectCategoryFromText(haystack);
  const collectionCategory = collectionCategoryByProductId.get(String(product.id));

  if (
    ['hydraulic-pumps', 'gear-pumps', 'piston-pumps', 'hydraulic-motors', 'main-control-valves', 'controllers', 'monitors'].includes(
      collectionCategory,
    )
  )
    return collectionCategory;

  // A small set of precise product phrases is more reliable than collection
  // membership when a supplier assigns a valve to the Hydraulic Motor collection.
  if (['pump-parts', 'final-drives', 'control-valves', 'diagnostic-tools'].includes(textCategory)) {
    return textCategory;
  }

  // Keep exact supplier collection categories free of products that only
  // happen to contain the category phrase in their title or tags.
  if (textCategory === 'hydraulic-motors') return collectionCategory || 'other-parts';
  if (textCategory === 'monitors') return collectionCategory || 'other-parts';

  return collectionCategory || textCategory || 'other-parts';
}

function markedUpPrice(price, markup = MARKUP) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric) || numeric <= 0 || numeric >= PRICE_ON_REQUEST_THRESHOLD_KZT) return null;
  return Math.round(numeric * markup * 100) / 100;
}

function productMarkup(productId, controllerProductIds, monitorProductIds) {
  const id = String(productId);
  if (controllerProductIds.has(id)) return CONTROLLER_MARKUP;
  if (monitorProductIds.has(id)) return MONITOR_MARKUP;
  return MARKUP;
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

function imageBelongsToProduct(product, value) {
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

  return true;
}

function productGallery(product) {
  const variantImages = Array.isArray(product.variants) ? product.variants.map((variant) => variant.featured_image).filter(Boolean) : [];

  const candidates = [product.image, product.featured_image, ...variantImages, ...(Array.isArray(product.images) ? product.images : [])];

  return [
    ...new Set(
      candidates
        .filter((value) => imageBelongsToProduct(product, value))
        .map(normalizeImageUrl)
        .filter(Boolean),
    ),
  ];
}

function sourceOrderedProductGallery(product) {
  const variantImages = Array.isArray(product.variants) ? product.variants.map((variant) => variant.featured_image).filter(Boolean) : [];
  const sourceImages = Array.isArray(product.images) ? product.images : [];
  const candidates = [...sourceImages, product.image, product.featured_image, ...variantImages];

  return [
    ...new Set(
      candidates
        .filter((value) => imageBelongsToProduct(product, value))
        .map(normalizeImageUrl)
        .filter(Boolean),
    ),
  ];
}

function mirroredWiringHarnessImageKey(productId, imageUrl) {
  return `${productId}:${imageUrl}`;
}

function imageFileExtension(imageUrl, contentType = '') {
  const contentTypeExtensions = {
    'image/avif': '.avif',
    'image/gif': '.gif',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/svg+xml': '.svg',
    'image/webp': '.webp',
  };
  const normalizedContentType = contentType.split(';')[0].trim().toLowerCase();
  if (contentTypeExtensions[normalizedContentType]) return contentTypeExtensions[normalizedContentType];
  try {
    const extension = path.extname(new URL(imageUrl).pathname).toLowerCase();
    if (['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'].includes(extension)) return extension;
  } catch {
    // The source URL has already been validated. Use a safe fallback extension.
  }
  return '.jpg';
}

async function mirrorSupplierNamedWiringHarnessImages(collectionProducts) {
  const stagingAssetDir = `${WIRING_HARNESS_ASSET_DIR}.tmp`;
  fs.rmSync(stagingAssetDir, { recursive: true, force: true });
  fs.mkdirSync(stagingAssetDir, { recursive: true });
  wiringHarnessMirroredImages.clear();
  const downloads = [];

  for (const product of collectionProducts) {
    const productId = String(product.id);
    const gallery = sourceOrderedProductGallery(product);
    gallery.forEach((imageUrl, index) => {
      if (!containsSupplierBrand(imageUrl)) return;
      downloads.push({ productId, imageUrl, index });
    });
  }

  let nextDownload = 0;
  async function worker() {
    while (nextDownload < downloads.length) {
      const { productId, imageUrl, index } = downloads[nextDownload++];
      const { contents, contentType } = await fetchBinary(imageUrl);
      if (contents.length === 0) throw new Error(`Downloaded an empty wiring harness image: ${imageUrl}`);
      const extension = imageFileExtension(imageUrl, contentType);
      const fileName = `${productId}-${String(index + 1).padStart(2, '0')}${extension}`;
      const publicPath = `/catalog-assets/wiring-harnesses/${fileName}`;
      wiringHarnessMirroredImages.set(mirroredWiringHarnessImageKey(productId, imageUrl), publicPath);
      fs.writeFileSync(path.join(stagingAssetDir, fileName), contents);
    }
  }

  try {
    await Promise.all(Array.from({ length: Math.min(4, downloads.length || 1) }, () => worker()));
    fs.rmSync(WIRING_HARNESS_ASSET_DIR, { recursive: true, force: true });
    fs.renameSync(stagingAssetDir, WIRING_HARNESS_ASSET_DIR);
    return downloads.length;
  } catch (error) {
    fs.rmSync(stagingAssetDir, { recursive: true, force: true });
    wiringHarnessMirroredImages.clear();
    throw error;
  }
}

function publicProductGallery(product, categories) {
  const categoryList = Array.isArray(categories) ? categories : [categories];
  if (categoryList.includes('pump-parts')) return [PUMP_PARTS_PLACEHOLDER];
  if (categoryList.includes('wiring-harnesses')) {
    return sourceOrderedProductGallery(product)
      .map((imageUrl) => {
        if (!containsSupplierBrand(imageUrl)) return imageUrl;
        return wiringHarnessMirroredImages.get(mirroredWiringHarnessImageKey(String(product.id), imageUrl)) || null;
      })
      .filter(Boolean);
  }
  if (categoryList.includes('fuel-injectors')) return [FUEL_INJECTOR_PLACEHOLDER];
  if (categoryList.includes('fuel-pumps')) return [FUEL_PUMP_PLACEHOLDER];
  if (categoryList.includes('engine-rebuild-kits')) return [ENGINE_REBUILD_KIT_PLACEHOLDER];
  return productGallery(product).filter((imageUrl) => !containsSupplierBrand(imageUrl));
}

function normalizeProduct(
  product,
  page,
  collectionCategoryByProductId,
  strictCategoryMembershipsByProductId,
  controllerProductIds,
  monitorProductIds,
) {
  const category = detectCategory(product, collectionCategoryByProductId);
  const title = publicText(product.title);
  const markup = productMarkup(product.id, controllerProductIds, monitorProductIds);
  const variants = (product.variants || []).map((variant) => ({
    id: String(variant.id),
    title: variant.title === 'Default Title' ? '' : publicText(variant.title),
    sku: publicSku(variant.sku, variant.id),
    available: Boolean(variant.available),
    priceKzt: markedUpPrice(variant.price, markup),
    options: [variant.option1, variant.option2, variant.option3]
      .filter((value) => value && value !== 'Default Title')
      .map(publicText),
  }));
  const salePrices = variants.map((variant) => variant.priceKzt).filter(Number.isFinite);
  const categories = [...new Set([category, ...(strictCategoryMembershipsByProductId.get(String(product.id)) || [])])];
  const gallery = publicProductGallery(product, categories);
  return {
    id: String(product.id),
    handle: publicHandle(product.handle, product.id),
    title,
    fitment: extractFitment(title),
    sku: variants.find((variant) => variant.sku)?.sku || String(product.id),
    category,
    categories,
    productType: publicText(product.product_type),
    tags: (product.tags || []).map(publicText).filter(Boolean),
    available: variants.some((variant) => variant.available),
    minPriceKzt: salePrices.length ? Math.min(...salePrices) : null,
    maxPriceKzt: salePrices.length ? Math.max(...salePrices) : null,
    imageUrl: gallery[0] || null,
    gallery,
    variants,
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

function pumpSourceSnapshot(product, collectionCategoryByProductId, strictCategoryMembershipsByProductId) {
  const category = detectCategory(product, collectionCategoryByProductId);
  const categories = [...new Set([category, ...(strictCategoryMembershipsByProductId.get(String(product.id)) || [])])];
  return {
    id: String(product.id),
    handle: publicHandle(product.handle, product.id),
    title: publicText(product.title),
    skus: (product.variants || []).map((variant) => publicSku(variant.sku, variant.id)),
    gallery: publicProductGallery(product, categories),
  };
}

function catalogSourceSnapshot(
  product,
  collectionCategoryByProductId,
  strictCategoryMembershipsByProductId,
  controllerProductIds,
  monitorProductIds,
) {
  const category = detectCategory(product, collectionCategoryByProductId);
  const categories = [...new Set([category, ...(strictCategoryMembershipsByProductId.get(String(product.id)) || [])])];
  return {
    id: String(product.id),
    handle: publicHandle(product.handle, product.id),
    title: publicText(product.title),
    skus: (product.variants || []).map((variant) => publicSku(variant.sku, variant.id)),
    sourcePricesKzt: (product.variants || []).map((variant) => Number(variant.price)),
    markup: productMarkup(product.id, controllerProductIds, monitorProductIds),
    gallery: publicProductGallery(product, categories),
  };
}

function verifyCatalogImport(sourceProducts, importedProducts, marketCurrency, expectedPublishedProducts) {
  const failures = [];
  let exactTitleMatches = 0;
  let exactSkuMatches = 0;
  let exactGalleryMatches = 0;
  let exactMarkupPrices = 0;
  let exactControllerMarkupPrices = 0;
  let priceOnRequestVariants = 0;
  let controllerPriceOnRequestVariants = 0;
  let sourceVariantCount = 0;
  let controllerSourceVariantCount = 0;
  const productsWithoutSourceImages = [];

  for (const [id, source] of sourceProducts) {
    const imported = importedProducts.get(id);
    if (!imported) {
      failures.push({ id, reason: 'missing-product', title: source.title });
      continue;
    }

    if (imported.title === source.title && imported.handle === source.handle) exactTitleMatches += 1;
    else
      failures.push({
        id,
        reason: 'title-or-handle-mismatch',
        source: source.title,
        imported: imported.title,
      });

    const importedSkus = imported.variants.map((variant) => variant.sku || '');
    if (exactList(importedSkus) === exactList(source.skus)) exactSkuMatches += 1;
    else
      failures.push({
        id,
        reason: 'sku-mismatch',
        source: source.skus,
        imported: importedSkus,
      });

    if (source.gallery.length === 0) {
      productsWithoutSourceImages.push({
        id,
        handle: source.handle,
        title: source.title,
        skus: source.skus,
      });
    }
    if (exactList(imported.gallery) === exactList(source.gallery)) exactGalleryMatches += 1;
    else
      failures.push({
        id,
        reason: 'gallery-mismatch',
        source: source.gallery,
        imported: imported.gallery,
      });

    if (imported.variants.length !== source.sourcePricesKzt.length) {
      failures.push({
        id,
        reason: 'variant-count-mismatch',
        source: source.sourcePricesKzt.length,
        imported: imported.variants.length,
      });
      continue;
    }

    sourceVariantCount += source.sourcePricesKzt.length;
    if (source.markup === CONTROLLER_MARKUP) controllerSourceVariantCount += source.sourcePricesKzt.length;
    source.sourcePricesKzt.forEach((sourcePriceKzt, index) => {
      const importedVariant = imported.variants[index];
      const expectedPriceKzt = markedUpPrice(sourcePriceKzt, source.markup);
      if (importedVariant.priceKzt !== expectedPriceKzt) {
        failures.push({
          id,
          reason: 'price-markup-mismatch',
          sku: importedVariant.sku,
          sourcePriceKzt,
          expectedPriceKzt,
          importedPriceKzt: importedVariant.priceKzt,
        });
      } else if (expectedPriceKzt === null) {
        priceOnRequestVariants += 1;
        if (source.markup === CONTROLLER_MARKUP) controllerPriceOnRequestVariants += 1;
      } else {
        exactMarkupPrices += 1;
        if (source.markup === CONTROLLER_MARKUP) exactControllerMarkupPrices += 1;
      }
    });
  }

  const unexpectedProductIds = [...importedProducts.keys()].filter((id) => !sourceProducts.has(id));
  if (unexpectedProductIds.length) {
    failures.push({
      reason: 'unexpected-products',
      ids: unexpectedProductIds.slice(0, 20),
      count: unexpectedProductIds.length,
    });
  }

  const report = {
    checkedAt: new Date().toISOString(),
    marketCurrency,
    markup: MARKUP,
    controllerMarkup: CONTROLLER_MARKUP,
    controllerCollection: CONTROLLER_COLLECTION,
    expectedPublishedProducts,
    uniqueSourceProducts: sourceProducts.size,
    importedProducts: importedProducts.size,
    sourceVariantCount,
    controllerSourceVariantCount,
    exactTitleAndHandleMatches: exactTitleMatches,
    exactSkuMatches,
    exactGalleryMatches,
    exactMarkupPrices,
    exactControllerMarkupPrices,
    priceOnRequestThresholdKzt: PRICE_ON_REQUEST_THRESHOLD_KZT,
    priceOnRequestVariants,
    controllerPriceOnRequestVariants,
    productsWithoutSourceImages: productsWithoutSourceImages.length,
    productsWithoutSourceImagesList: productsWithoutSourceImages,
    unexpectedProducts: unexpectedProductIds.length,
    failures: failures.slice(0, 50),
    passed:
      failures.length === 0 &&
      marketCurrency === 'KZT' &&
      sourceProducts.size === expectedPublishedProducts &&
      importedProducts.size === expectedPublishedProducts,
  };

  if (!report.passed) {
    throw new Error(`Full catalog import verification failed: ${JSON.stringify(report)}`);
  }
  return report;
}

async function fetchCategoryCollections() {
  const queue = CATEGORY_COLLECTIONS.flatMap(([category, handles]) => handles.map((handle) => ({ category, handle })));
  const results = [];
  let next = 0;

  async function worker() {
    while (next < queue.length) {
      const item = queue[next++];
      results.push({ ...item, products: await fetchCollection(item.handle) });
    }
  }

  await Promise.all(Array.from({ length: COLLECTION_CONCURRENCY }, () => worker()));
  return results;
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
    else
      failures.push({
        id,
        reason: 'title-or-handle-mismatch',
        source: source.title,
        imported: imported.title,
      });

    const importedSkus = imported.variants.map((variant) => variant.sku || '');
    if (exactList(importedSkus) === exactList(source.skus)) exactSkuMatches += 1;
    else
      failures.push({
        id,
        reason: 'sku-mismatch',
        source: source.skus,
        imported: importedSkus,
      });

    if (source.gallery.length === 0) {
      productsWithoutSourceImages.push({
        id,
        handle: source.handle,
        title: source.title,
        skus: source.skus,
      });
    }
    if (exactList(imported.gallery) === exactList(source.gallery)) exactGalleryMatches += 1;
    else
      failures.push({
        id,
        reason: 'gallery-mismatch',
        source: source.gallery,
        imported: imported.gallery,
      });
  }

  const unexpectedProductIds = [...importedProducts.keys()].filter((id) => !sourceProducts.has(id));
  if (unexpectedProductIds.length) {
    failures.push({
      reason: 'unexpected-products',
      ids: unexpectedProductIds.slice(0, 20),
      count: unexpectedProductIds.length,
    });
  }

  const report = {
    checkedAt: new Date().toISOString(),
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

function verifyStrictCategoryImports(categoryCollections, importedProducts) {
  const categories = {};
  const failures = [];

  for (const [category, collectionHandle] of STRICT_CATEGORY_COLLECTIONS) {
    const collection = categoryCollections.find((item) => item.handle === collectionHandle);
    if (!collection) {
      failures.push({ category, collection: collectionHandle, reason: 'missing-source-collection' });
      continue;
    }

    const sourceIds = new Set(collection.products.map((product) => String(product.id)));
    const categoryProducts = [...importedProducts.values()].filter((product) => (product.categories || [product.category]).includes(category));
    const importedIds = new Set(categoryProducts.map((product) => String(product.id)));
    const missingProductIds = [...sourceIds].filter((id) => !importedIds.has(id));
    const unexpectedProductIds = [...importedIds].filter((id) => !sourceIds.has(id));

    categories[category] = {
      collection: collectionHandle,
      sourceProducts: sourceIds.size,
      importedProducts: importedIds.size,
      missingProductIds,
      unexpectedProductIds,
      passed: missingProductIds.length === 0 && unexpectedProductIds.length === 0,
    };

    if (missingProductIds.length || unexpectedProductIds.length) {
      failures.push({ category, collection: collectionHandle, missingProductIds, unexpectedProductIds });
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    categories,
    failures,
    passed: failures.length === 0,
  };

  if (failures.length) {
    throw new Error(`Strict category import verification failed: ${JSON.stringify(report)}`);
  }
  return report;
}

function verifyPricedCollectionImport(collectionProducts, importedProducts, { collection, markup, category }) {
  const failures = [];
  let sourceVariantCount = 0;
  let exactMarkupPrices = 0;
  let priceOnRequestVariants = 0;

  for (const product of collectionProducts) {
    const id = String(product.id);
    const imported = importedProducts.get(id);
    if (!imported) {
      failures.push({ id, reason: 'missing-product', title: publicText(product.title) });
      continue;
    }
    if (!(imported.categories || [imported.category]).includes(category)) {
      failures.push({ id, reason: 'missing-collection-category', category, importedCategory: imported.category });
    }
    if (imported.variants.length !== (product.variants || []).length) {
      failures.push({
        id,
        reason: 'variant-count-mismatch',
        source: (product.variants || []).length,
        imported: imported.variants.length,
      });
      continue;
    }

    sourceVariantCount += product.variants.length;
    product.variants.forEach((variant, index) => {
      const expectedPriceKzt = markedUpPrice(variant.price, markup);
      const importedVariant = imported.variants[index];
      if (importedVariant.priceKzt !== expectedPriceKzt) {
        failures.push({
          id,
          reason: 'collection-price-markup-mismatch',
          sku: importedVariant.sku,
          sourcePriceKzt: Number(variant.price),
          expectedPriceKzt,
          importedPriceKzt: importedVariant.priceKzt,
        });
      } else if (expectedPriceKzt === null) priceOnRequestVariants += 1;
      else exactMarkupPrices += 1;
    });
  }

  const report = {
    checkedAt: new Date().toISOString(),
    collection,
    category,
    markup,
    sourceProducts: collectionProducts.length,
    importedProducts: collectionProducts.length - failures.filter((failure) => failure.reason === 'missing-product').length,
    sourceVariantCount,
    exactMarkupPrices,
    priceOnRequestVariants,
    sourceProductIds: collectionProducts.map((product) => String(product.id)),
    failures: failures.slice(0, 50),
    passed: failures.length === 0,
  };

  if (!report.passed) {
    throw new Error(`${collection} import verification failed: ${JSON.stringify(report)}`);
  }
  return report;
}

function verifyWiringHarnessImport(collectionProducts, importedProducts) {
  const failures = [];
  const sourceIds = new Set(collectionProducts.map((product) => String(product.id)));
  const importedHarnesses = [...importedProducts.values()].filter((product) =>
    (product.categories || [product.category]).includes('wiring-harnesses'),
  );
  let rawSourceImages = 0;
  let publishedImages = 0;
  let exactGalleryMatches = 0;
  let exactSkuMatches = 0;
  let mirroredImages = 0;
  let productsWithoutSourceImages = 0;
  const productsWithoutSourceImagesList = [];

  for (const product of collectionProducts) {
    const id = String(product.id);
    const imported = importedProducts.get(id);
    const rawGallery = sourceOrderedProductGallery(product);
    const expectedGallery = publicProductGallery(product, ['wiring-harnesses']);
    const expectedSkus = (product.variants || []).map((variant) => publicSku(variant.sku, variant.id));
    rawSourceImages += rawGallery.length;
    mirroredImages += expectedGallery.filter((imageUrl) => imageUrl.startsWith('/catalog-assets/wiring-harnesses/')).length;
    if (rawGallery.length === 0) {
      productsWithoutSourceImages += 1;
      productsWithoutSourceImagesList.push({
        id,
        handle: publicHandle(product.handle, product.id),
        title: publicText(product.title),
        skus: expectedSkus,
      });
    }

    if (!imported) {
      failures.push({ id, reason: 'missing-product', handle: publicHandle(product.handle, product.id) });
      continue;
    }

    publishedImages += imported.gallery.length;
    const importedSkus = imported.variants.map((variant) => variant.sku || '');
    if (exactList(importedSkus) === exactList(expectedSkus)) exactSkuMatches += 1;
    else failures.push({ id, reason: 'sku-mismatch', expected: expectedSkus, imported: importedSkus });

    if (exactList(imported.gallery) === exactList(expectedGallery)) exactGalleryMatches += 1;
    else failures.push({ id, reason: 'gallery-mismatch', expected: expectedGallery, imported: imported.gallery });

    if (imported.imageUrl !== (expectedGallery[0] || null)) {
      failures.push({ id, reason: 'primary-image-mismatch', expected: expectedGallery[0] || null, imported: imported.imageUrl });
    }
  }

  const unexpectedProductIds = importedHarnesses.map((product) => product.id).filter((id) => !sourceIds.has(id));
  if (unexpectedProductIds.length) {
    failures.push({ reason: 'unexpected-products', ids: unexpectedProductIds.slice(0, 20), count: unexpectedProductIds.length });
  }

  const report = {
    checkedAt: new Date().toISOString(),
    collection: WIRING_HARNESS_COLLECTION,
    category: 'wiring-harnesses',
    sourceProducts: collectionProducts.length,
    importedProducts: importedHarnesses.length,
    rawSourceImages,
    publishedImages,
    mirroredImages,
    exactGalleryMatches,
    exactSkuMatches,
    productsWithoutSourceImages,
    productsWithoutSourceImagesList,
    unexpectedProducts: unexpectedProductIds.length,
    failures: failures.slice(0, 50),
    passed: failures.length === 0 && publishedImages === rawSourceImages,
  };

  if (!report.passed) {
    throw new Error(`Wiring harness import verification failed: ${JSON.stringify(report)}`);
  }
  return report;
}

async function run() {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const cart = await fetchJson(`${SOURCE_ORIGIN}/cart.js`);
  const shopMetadata = await fetchJson(`${SOURCE_ORIGIN}/meta.json`);
  const marketCurrency = cart.currency;
  if (marketCurrency !== 'KZT') {
    throw new Error(`Expected SinoCMP Kazakhstan market prices in KZT, received ${marketCurrency || 'unknown currency'}`);
  }
  const expectedPublishedProducts = Number(shopMetadata.published_products_count);
  if (!Number.isInteger(expectedPublishedProducts) || expectedPublishedProducts <= 0) {
    throw new Error('SinoCMP did not return a valid published product count');
  }

  const categoryCollections = await fetchCategoryCollections();
  const controllerCollection = categoryCollections.find((item) => item.handle === CONTROLLER_COLLECTION);
  if (!controllerCollection) throw new Error('Controller collection was not fetched');
  const controllerProductIds = new Set(controllerCollection.products.map((product) => String(product.id)));
  const monitorCollection = categoryCollections.find((item) => item.handle === MONITOR_COLLECTION);
  if (!monitorCollection) throw new Error('Monitor collection was not fetched');
  const monitorProductIds = new Set(monitorCollection.products.map((product) => String(product.id)));
  const wiringHarnessCollection = categoryCollections.find((item) => item.handle === WIRING_HARNESS_COLLECTION);
  if (!wiringHarnessCollection) throw new Error('Wiring harness collection was not fetched');
  const mirroredWiringHarnessImages = await mirrorSupplierNamedWiringHarnessImages(wiringHarnessCollection.products);
  console.log(`Mirrored ${mirroredWiringHarnessImages} supplier-named wiring harness images`);
  const collectionCategoryByProductId = new Map();
  for (const [category, handles] of CATEGORY_COLLECTIONS) {
    for (const handle of handles) {
      const collection = categoryCollections.find((item) => item.handle === handle);
      for (const product of collection?.products || []) {
        if (!collectionCategoryByProductId.has(String(product.id))) {
          collectionCategoryByProductId.set(String(product.id), category);
        }
      }
    }
  }
  const strictCategoryMembershipsByProductId = new Map();
  for (const [category, collectionHandle] of STRICT_CATEGORY_COLLECTIONS) {
    const collection = categoryCollections.find((item) => item.handle === collectionHandle);
    for (const product of collection?.products || []) {
      const id = String(product.id);
      const memberships = strictCategoryMembershipsByProductId.get(id) || [];
      memberships.push(category);
      strictCategoryMembershipsByProductId.set(id, memberships);
    }
  }
  for (const productId of controllerProductIds) {
    const memberships = strictCategoryMembershipsByProductId.get(productId) || [];
    memberships.push('controllers');
    strictCategoryMembershipsByProductId.set(productId, memberships);
  }
  for (const productId of monitorProductIds) {
    const memberships = strictCategoryMembershipsByProductId.get(productId) || [];
    memberships.push('monitors');
    strictCategoryMembershipsByProductId.set(productId, memberships);
  }

  const pumpCollections = categoryCollections.filter(({ handle }) => PUMP_COLLECTIONS.includes(handle)).map(({ handle, products }) => [handle, products]);
  const collectionCounts = Object.fromEntries(pumpCollections.map(([handle, products]) => [handle, products.length]));
  const sourcePumpProducts = new Map();
  for (const [, products] of pumpCollections) {
    for (const product of products) {
      sourcePumpProducts.set(
        String(product.id),
        pumpSourceSnapshot(product, collectionCategoryByProductId, strictCategoryMembershipsByProductId),
      );
    }
  }
  const pumpProductIds = new Set(sourcePumpProducts.keys());
  console.log(`Supplier pump collections: ${pumpProductIds.size} unique products`);

  const searchIndex = [];
  const productMap = {};
  const sourceCatalogProducts = new Map();
  const importedCatalogProducts = new Map();
  const importedPumpProducts = new Map();
  const expectedPageCount = Math.ceil(expectedPublishedProducts / PAGE_SIZE);
  let nextPage = 1;
  let importedCount = 0;

  async function worker() {
    while (nextPage <= expectedPageCount) {
      const page = nextPage++;
      const products = await fetchPage(page);
      if (products.length === 0) {
        return;
      }

      for (const product of products) {
        sourceCatalogProducts.set(
          String(product.id),
          catalogSourceSnapshot(
            product,
            collectionCategoryByProductId,
            strictCategoryMembershipsByProductId,
            controllerProductIds,
            monitorProductIds,
          ),
        );
      }
      const normalized = products.map((product) =>
        normalizeProduct(
          product,
          page,
          collectionCategoryByProductId,
          strictCategoryMembershipsByProductId,
          controllerProductIds,
          monitorProductIds,
        ),
      );
      writeJson(`products-${String(page).padStart(3, '0')}.json`, normalized);
      const pageIndex = [];
      for (const product of normalized) {
        importedCatalogProducts.set(product.id, product);
        if (['hydraulic-pumps', 'gear-pumps', 'piston-pumps'].includes(product.category)) importedPumpProducts.set(product.id, product);
        productMap[product.handle] = page;
        const indexProduct = {
          id: product.id,
          handle: product.handle,
          title: product.title,
          fitment: product.fitment,
          sku: product.sku,
          category: product.category,
          categories: product.categories,
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
    for (const category of product.categories || [product.category]) {
      const summary = categorySummary[category] || (categorySummary[category] = { count: 0, imageUrl: null });
      summary.count += 1;
      if (!summary.imageUrl && product.imageUrl) summary.imageUrl = product.imageUrl;
    }
  }

  const importedAt = new Date().toISOString();
  writeJson('search-index.json', searchIndex);
  writeJson('category-summary.json', categorySummary);
  writeJson('product-map.json', productMap);
  const catalogAudit = verifyCatalogImport(sourceCatalogProducts, importedCatalogProducts, marketCurrency, expectedPublishedProducts);
  writeJson('catalog-import-audit.json', catalogAudit);
  const pumpAudit = verifyPumpImport(sourcePumpProducts, importedPumpProducts, collectionCounts);
  writeJson('pump-import-audit.json', pumpAudit);
  const strictCategoryAudit = verifyStrictCategoryImports(categoryCollections, importedCatalogProducts);
  writeJson('strict-category-import-audit.json', strictCategoryAudit);
  const controllerAudit = verifyPricedCollectionImport(controllerCollection.products, importedCatalogProducts, {
    collection: CONTROLLER_COLLECTION,
    markup: CONTROLLER_MARKUP,
    category: 'controllers',
  });
  writeJson('controller-import-audit.json', controllerAudit);
  const monitorAudit = verifyPricedCollectionImport(monitorCollection.products, importedCatalogProducts, {
    collection: MONITOR_COLLECTION,
    markup: MONITOR_MARKUP,
    category: 'monitors',
  });
  writeJson('monitor-import-audit.json', monitorAudit);
  const wiringHarnessAudit = verifyWiringHarnessImport(wiringHarnessCollection.products, importedCatalogProducts);
  writeJson('wiring-harness-import-audit.json', wiringHarnessAudit);
  writeJson('manifest.json', {
    importedAt,
    productCount: searchIndex.length,
    pageSize: PAGE_SIZE,
    chunkCount: Math.ceil(searchIndex.length / PAGE_SIZE),
    markup: MARKUP,
    controllerMarkup: CONTROLLER_MARKUP,
    monitorMarkup: MONITOR_MARKUP,
    priceOnRequestThresholdKzt: PRICE_ON_REQUEST_THRESHOLD_KZT,
    currency: 'KZT',
    indexFile: 'search-index.json',
    categorySummaryFile: 'category-summary.json',
    catalogAuditFile: 'catalog-import-audit.json',
    pumpAuditFile: 'pump-import-audit.json',
    strictCategoryAuditFile: 'strict-category-import-audit.json',
    controllerAuditFile: 'controller-import-audit.json',
    monitorAuditFile: 'monitor-import-audit.json',
    wiringHarnessAuditFile: 'wiring-harness-import-audit.json',
    imagePolicy: 'Product images are published without visible supplier identity in customer-facing catalogue data. Wiring harness galleries preserve the source product association and source image order.',
  });
  console.log(`Catalog import complete: ${searchIndex.length} products at ${importedAt}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

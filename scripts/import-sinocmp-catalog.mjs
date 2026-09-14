import fs from 'node:fs';
import path from 'node:path';

const SOURCE_ORIGIN = 'https://sinocmp.com';
const OUTPUT_DIR = path.resolve('client/public/catalog-data');
const PAGE_SIZE = 250;
const MARKUP = 1.5;
const CONCURRENCY = 2;
const MAX_RETRIES = 5;

const categoryRules = [
  ['hydraulic-pumps', ['hydraulic pump', 'piston pump', 'gear pump']],
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
      'user-agent': 'ACA-Hydraulic-Catalog-Sync/1.0 (+https://acahydraulic.kz/catalog/)',
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

function detectCategory(product) {
  const haystack = [product.title, product.product_type, ...(product.tags || [])].join(' ').toLowerCase();
  for (const [category, terms] of categoryRules) {
    if (terms.some((term) => haystack.includes(term))) return category;
  }
  return 'other-parts';
}

function markedUpPrice(price) {
  const numeric = Number(price);
  // Sinocmp uses extremely large sentinel values for quote-only items. Keep
  // legitimate pumps/engines priced below KZT 10m, but hide those sentinels.
  if (!Number.isFinite(numeric) || numeric <= 0 || numeric >= 10_000_000) return null;
  return Math.round(numeric * MARKUP * 100) / 100;
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
  return {
    id: String(product.id),
    handle: product.handle,
    title: product.title,
    category: detectCategory(product),
    productType: product.product_type || '',
    tags: product.tags || [],
    available: variants.some((variant) => variant.available),
    minPriceKzt: salePrices.length ? Math.min(...salePrices) : null,
    maxPriceKzt: salePrices.length ? Math.max(...salePrices) : null,
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

async function run() {
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
          available: product.available,
          minPriceKzt: product.minPriceKzt,
          maxPriceKzt: product.maxPriceKzt,
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
  const importedAt = new Date().toISOString();
  writeJson('product-map.json', productMap);
  writeJson('manifest.json', {
    source: SOURCE_ORIGIN,
    importedAt,
    productCount: searchIndex.length,
    pageSize: PAGE_SIZE,
    chunkCount: Math.ceil(searchIndex.length / PAGE_SIZE),
    markup: MARKUP,
    currency: 'KZT',
    imagePolicy: 'Supplier images are not republished without permission.',
  });
  console.log(`Catalog import complete: ${searchIndex.length} products at ${importedAt}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

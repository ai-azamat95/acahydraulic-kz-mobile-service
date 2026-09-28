import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const TRANSFORM = { size: 1000, quality: 70 };

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function atomicWriteJson(filePath, value) {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, JSON.stringify(value));
  fs.renameSync(temporaryPath, filePath);
}

function imageKey(productId, index, sourceUrl) {
  const sourceHash = sha256(`${sourceUrl}|webp-${TRANSFORM.size}-q${TRANSFORM.quality}`);
  return `catalog/v2/${productId}/${String(index + 1).padStart(2, '0')}-${sourceHash.slice(0, 16)}.webp`;
}

function approvedSourceImage(value) {
  const url = new URL(value, 'https://cdn.shopify.com');
  const host = url.hostname.toLowerCase();
  if (!(host === 'cdn.shopify.com' || host.endsWith('.shopify.com') || host === 'sinocmp.com' || host.endsWith('.sinocmp.com'))) {
    throw new Error(`unapproved source image host: ${host}`);
  }
  return url.href;
}

async function fetchWithRetry(url, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'ACA-Hydraulic-Catalog-Recovery/1.0 (+https://acahydraulic.kz/catalog/)' },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) {
        const error = new Error(`${response.status} ${response.statusText}`);
        error.nonRetryable = response.status !== 429 && response.status < 500;
        throw error;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (error.nonRetryable) throw error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
    }
  }
  throw lastError;
}

async function fetchProductByHandle(sourceBaseUrl, handle) {
  const productUrl = new URL(`/products/${encodeURIComponent(handle)}.js`, sourceBaseUrl).href;
  const response = await fetchWithRetry(productUrl);
  return response.json();
}

async function findCurrentSourceProduct(sourceBaseUrl, product) {
  try {
    const direct = await fetchProductByHandle(sourceBaseUrl, product.handle);
    if (String(direct.id) === String(product.id)) return direct;
  } catch {
    // A source handle may have changed. The exact numeric product ID remains the identity gate below.
  }

  const searchUrl = new URL('/search/suggest.json', sourceBaseUrl);
  searchUrl.searchParams.set('q', product.title);
  searchUrl.searchParams.set('resources[type]', 'product');
  searchUrl.searchParams.set('resources[limit]', '10');
  const search = await (await fetchWithRetry(searchUrl.href)).json();
  const candidates = search.resources?.results?.products || [];
  for (const candidate of candidates) {
    const match = new URL(candidate.url, sourceBaseUrl).pathname.match(/^\/products\/([^/]+)$/);
    if (!match) continue;
    const source = await fetchProductByHandle(sourceBaseUrl, decodeURIComponent(match[1]));
    if (String(source.id) === String(product.id)) return source;
  }
  throw new Error('exact source product ID was not found');
}

async function convertToWebp(sourceUrl, outputPath) {
  const response = await fetchWithRetry(sourceUrl);
  const body = Buffer.from(await response.arrayBuffer());
  const token = crypto.randomUUID();
  const inputPath = path.join(os.tmpdir(), `aca-recover-${token}.input`);
  const temporaryOutput = path.join(os.tmpdir(), `aca-recover-${token}.webp`);
  fs.writeFileSync(inputPath, body);
  try {
    await execFileAsync(process.env.CWEBP_BIN || 'cwebp', [
      '-quiet', '-mt', '-metadata', 'none',
      '-resize', String(TRANSFORM.size), String(TRANSFORM.size),
      '-q', String(TRANSFORM.quality), inputPath, '-o', temporaryOutput,
    ], { timeout: 60_000 });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.copyFileSync(temporaryOutput, outputPath);
  } finally {
    fs.rmSync(inputPath, { force: true });
    fs.rmSync(temporaryOutput, { force: true });
  }
}

function readCatalog(catalogDir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(catalogDir, 'manifest.json'), 'utf8'));
  const chunks = [];
  for (let page = 1; page <= manifest.chunkCount; page += 1) {
    const fileName = `products-${String(page).padStart(3, '0')}.json`;
    chunks.push({ fileName, products: JSON.parse(fs.readFileSync(path.join(catalogDir, fileName), 'utf8')) });
  }
  return { manifest, chunks, products: chunks.flatMap(chunk => chunk.products) };
}

export async function recoverMissingCatalogImages({ catalogDir, imageDir, sourceBaseUrl = 'https://sinocmp.com', concurrency = 6 }) {
  catalogDir = path.resolve(catalogDir);
  imageDir = path.resolve(imageDir);
  const { manifest, chunks, products } = readCatalog(catalogDir);
  const targets = products.filter(product => !product.imageUrl || !Array.isArray(product.gallery) || product.gallery.length === 0);
  const recovered = [];
  const unavailable = [];
  let cursor = 0;

  async function worker() {
    while (cursor < targets.length) {
      const product = targets[cursor];
      cursor += 1;
      try {
        const source = await findCurrentSourceProduct(sourceBaseUrl, product);
        const imageCandidates = source.images?.length
          ? source.images
          : (source.media || []).map(media => media.preview_image?.src).filter(Boolean);
        const images = [...new Set(imageCandidates.map(approvedSourceImage))];
        if (!images.length) {
          unavailable.push({ id: String(product.id), handle: product.handle, reason: 'source has no images' });
          continue;
        }
        const gallery = [];
        const entries = [];
        for (let index = 0; index < images.length; index += 1) {
          const sourceUrl = images[index];
          const key = imageKey(product.id, index, sourceUrl);
          const outputPath = path.join(imageDir, key);
          await convertToWebp(sourceUrl, outputPath);
          const body = fs.readFileSync(outputPath);
          entries.push({
            productId: String(product.id),
            index,
            key,
            sourceHash: sha256(sourceUrl),
            contentHash: sha256(body),
            bytes: body.length,
            contentType: 'image/webp',
          });
          gallery.push(`${manifest.imageBaseUrl.replace(/\/+$/, '')}/${key}`);
        }
        recovered.push({ id: String(product.id), handle: product.handle, gallery, entries });
      } catch (error) {
        unavailable.push({ id: String(product.id), handle: product.handle, reason: String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, targets.length || 1) }, () => worker()));

  const recoveredById = new Map(recovered.map(item => [item.id, item]));
  for (const chunk of chunks) {
    let changed = false;
    for (const product of chunk.products) {
      const item = recoveredById.get(String(product.id));
      if (!item) continue;
      product.gallery = item.gallery;
      product.imageUrl = item.gallery[0];
      changed = true;
    }
    if (changed) atomicWriteJson(path.join(catalogDir, chunk.fileName), chunk.products);
  }

  const imageManifestPath = path.join(catalogDir, manifest.imageManifestFile);
  const imageManifest = JSON.parse(fs.readFileSync(imageManifestPath, 'utf8'));
  const entriesByKey = new Map(imageManifest.entries.map(entry => [entry.key, entry]));
  for (const item of recovered) for (const entry of item.entries) entriesByKey.set(entry.key, entry);
  imageManifest.entries = [...entriesByKey.values()];
  imageManifest.generatedAt = new Date().toISOString();
  imageManifest.imageCount = imageManifest.entries.length;
  imageManifest.productCount = new Set(imageManifest.entries.map(entry => String(entry.productId))).size;
  imageManifest.totalBytes = imageManifest.entries.reduce((total, entry) => total + entry.bytes, 0);
  atomicWriteJson(imageManifestPath, imageManifest);

  manifest.mirroredImageCount = imageManifest.imageCount;
  manifest.mirroredProductCount = imageManifest.productCount;
  atomicWriteJson(path.join(catalogDir, 'manifest.json'), manifest);

  return {
    targetedProducts: targets.length,
    recoveredProducts: recovered.length,
    recoveredImages: recovered.reduce((total, item) => total + item.gallery.length, 0),
    unavailable,
  };
}

function parseArguments(argv) {
  const options = { catalogDir: 'client/public/catalog-data', concurrency: 6 };
  for (let index = 0; index < argv.length; index += 2) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${argument}`);
    if (argument === '--catalog-dir') options.catalogDir = value;
    else if (argument === '--image-dir') options.imageDir = value;
    else if (argument === '--source-base-url') options.sourceBaseUrl = value;
    else if (argument === '--concurrency') options.concurrency = Number(value);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (!options.imageDir) throw new Error('--image-dir is required');
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await recoverMissingCatalogImages(parseArguments(process.argv.slice(2)));
  console.log(JSON.stringify(result, null, 2));
  if (result.unavailable.length) process.exitCode = 1;
}

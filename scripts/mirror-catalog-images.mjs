import crypto from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const CONTENT_TYPE_BY_EXTENSION = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};
const execFileAsync = promisify(execFile);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sanitizeSegment(value) {
  const segment = String(value || "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!segment)
    throw new Error(`Unsafe empty catalog image path segment: ${value}`);
  return segment;
}

export function isSupplierImageUrl(value, extraHosts = []) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === "sinocmp.com" ||
      hostname.endsWith(".sinocmp.com") ||
      hostname === "shopify.com" ||
      hostname.endsWith(".shopify.com") ||
      extraHosts.some(
        host => hostname === host || hostname.endsWith(`.${host}`)
      )
    );
  } catch {
    return false;
  }
}

export function catalogImageKey(productId, index, sourceUrl, transform = null) {
  const transformKey = transform
    ? `webp-${transform.size}-q${transform.quality}`
    : "original";
  const sourceHash = sha256(`${sourceUrl}|${transformKey}`);
  let extension = "img";
  if (transform) extension = "webp";
  else {
    try {
      const candidate = path
        .extname(new URL(sourceUrl).pathname)
        .slice(1)
        .toLowerCase();
      if (CONTENT_TYPE_BY_EXTENSION[candidate]) {
        extension = candidate === "jpeg" ? "jpg" : candidate;
      }
    } catch {
      // Source URLs are validated by the caller. Keep a neutral fallback.
    }
  }
  return `catalog/v2/${sanitizeSegment(productId)}/${String(index + 1).padStart(2, "0")}-${sourceHash.slice(0, 16)}.${extension}`;
}

function publicImageUrl(baseUrl, key) {
  return `${baseUrl.replace(/\/+$/, "")}/${key}`;
}

function contentTypeForUrl(url) {
  try {
    const extension = path
      .extname(new URL(url).pathname)
      .slice(1)
      .toLowerCase();
    return CONTENT_TYPE_BY_EXTENSION[extension] || "application/octet-stream";
  } catch {
    return "application/octet-stream";
  }
}

async function fetchImage(url, fetchImpl, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetchImpl(url, {
        signal: controller.signal,
        headers: {
          accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "user-agent":
            "ACA-Hydraulic-Catalog-Mirror/1.0 (+https://acahydraulic.kz/catalog/)",
        },
      });
      if (response.ok) {
        const body = Buffer.from(await response.arrayBuffer());
        if (!body.length) throw new Error(`Image response is empty: ${url}`);
        const contentType = (
          response.headers.get("content-type") || contentTypeForUrl(url)
        )
          .split(";")[0]
          .trim()
          .toLowerCase();
        if (!contentType.startsWith("image/"))
          throw new Error(
            `Unexpected image content type ${contentType}: ${url}`
          );
        return { body, contentType };
      }
      if (response.status !== 429 && response.status < 500) {
        throw new Error(`Image request failed: ${response.status} ${url}`);
      }
    } catch (error) {
      if (attempt === retries) throw error;
    } finally {
      clearTimeout(timer);
    }
    await new Promise(resolve =>
      setTimeout(resolve, Math.min(10_000, 500 * 2 ** attempt))
    );
  }
  throw new Error(`Image request failed after ${retries} attempts: ${url}`);
}

async function transformToWebp(image, transform) {
  if (!transform) return image;
  const token = crypto.randomUUID();
  const inputPath = path.join(os.tmpdir(), `aca-catalog-${token}.input`);
  const outputPath = path.join(os.tmpdir(), `aca-catalog-${token}.webp`);
  fs.writeFileSync(inputPath, image.body);
  try {
    await execFileAsync(
      process.env.CWEBP_BIN || "cwebp",
      [
        "-quiet",
        "-mt",
        "-metadata",
        "none",
        "-resize",
        String(transform.size),
        String(transform.size),
        "-q",
        String(transform.quality),
        inputPath,
        "-o",
        outputPath,
      ],
      { timeout: 60_000 }
    );
    const body = fs.readFileSync(outputPath);
    if (!body.length) throw new Error("cwebp produced an empty image");
    return { body, contentType: "image/webp" };
  } finally {
    fs.rmSync(inputPath, { force: true });
    fs.rmSync(outputPath, { force: true });
  }
}

export function createFilesystemStore(rootDir) {
  const root = path.resolve(rootDir);
  return {
    async probe(key, sourceHash) {
      const filePath = path.join(root, key);
      if (!fs.existsSync(filePath)) return null;
      const body = fs.readFileSync(filePath);
      return {
        sourceHash,
        contentHash: sha256(body),
        bytes: body.length,
        contentType:
          CONTENT_TYPE_BY_EXTENSION[path.extname(filePath).slice(1)] ||
          "application/octet-stream",
      };
    },
    async put(key, body, metadata) {
      const filePath = path.join(root, key);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, body);
    },
  };
}

export function createS3Store({
  endpoint,
  region,
  bucket,
  accessKeyId,
  secretAccessKey,
}) {
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 image storage requires CATALOG_S3_ENDPOINT, CATALOG_S3_BUCKET, CATALOG_S3_ACCESS_KEY_ID and CATALOG_S3_SECRET_ACCESS_KEY"
    );
  }
  const client = new S3Client({
    endpoint,
    region: region || "auto",
    forcePathStyle: false,
    credentials: { accessKeyId, secretAccessKey },
  });
  return {
    async probe(key, sourceHash) {
      try {
        const result = await client.send(
          new HeadObjectCommand({ Bucket: bucket, Key: key })
        );
        if (result.Metadata?.["source-sha256"] !== sourceHash) return null;
        return {
          sourceHash,
          contentHash: result.Metadata?.["content-sha256"] || "",
          bytes: Number(result.ContentLength || 0),
          contentType: result.ContentType || "application/octet-stream",
        };
      } catch (error) {
        if (
          error?.$metadata?.httpStatusCode === 404 ||
          error?.name === "NotFound" ||
          error?.name === "NoSuchKey"
        )
          return null;
        throw error;
      }
    },
    async put(key, body, metadata) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: metadata.contentType,
          CacheControl: "public, max-age=31536000, immutable",
          Metadata: {
            "source-sha256": metadata.sourceHash,
            "content-sha256": metadata.contentHash,
          },
        })
      );
    },
    async readObject(key) {
      const result = await client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );
      return Buffer.from(await result.Body.transformToByteArray());
    },
  };
}

function atomicWriteJson(filePath, value) {
  const temporaryPath = `${filePath}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(value));
  fs.renameSync(temporaryPath, filePath);
}

function validateBaseUrl(imageBaseUrl, allowNonAcaHost) {
  const url = new URL(imageBaseUrl);
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" && !allowNonAcaHost)
    throw new Error("CATALOG_IMAGE_BASE_URL must use HTTPS");
  if (isSupplierImageUrl(url.href))
    throw new Error("CATALOG_IMAGE_BASE_URL cannot use a supplier domain");
  if (
    !allowNonAcaHost &&
    host !== "acahydraulic.kz" &&
    !host.endsWith(".acahydraulic.kz")
  ) {
    throw new Error("CATALOG_IMAGE_BASE_URL must be hosted on acahydraulic.kz");
  }
  return url.href.replace(/\/+$/, "");
}

export async function mirrorCatalogImages({
  catalogDir,
  imageBaseUrl,
  store,
  concurrency = 8,
  limit = 0,
  allowPartial = false,
  allowNonAcaHost = false,
  extraSourceHosts = [],
  fetchImpl = fetch,
  dryRun = false,
  transform = null,
}) {
  const directory = path.resolve(catalogDir);
  const manifestPath = path.join(directory, "manifest.json");
  if (!fs.existsSync(manifestPath))
    throw new Error(`Catalog manifest is missing: ${manifestPath}`);
  const baseUrl = validateBaseUrl(imageBaseUrl, allowNonAcaHost);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const chunks = [];
  const tasks = [];

  for (let page = 1; page <= manifest.chunkCount; page += 1) {
    const fileName = `products-${String(page).padStart(3, "0")}.json`;
    const products = JSON.parse(
      fs.readFileSync(path.join(directory, fileName), "utf8")
    );
    chunks.push({ fileName, products });
    for (const product of products) {
      const gallery = Array.isArray(product.gallery) ? product.gallery : [];
      if (
        product.imageUrl &&
        gallery.length &&
        product.imageUrl !== gallery[0]
      ) {
        throw new Error(
          `${product.id}: primary image must equal the first gallery image before mirroring`
        );
      }
      gallery.forEach((sourceUrl, index) => {
        if (!isSupplierImageUrl(sourceUrl, extraSourceHosts)) return;
        const sourceHash = sha256(sourceUrl);
        const identity = `${product.id}:${index}:${sourceHash}`;
        const task = {
          identity,
          productId: String(product.id),
          index,
          sourceUrl,
          sourceHash,
          key: catalogImageKey(product.id, index, sourceUrl, transform),
        };
        tasks.push(task);
      });
    }
  }

  if (tasks.length === 0) {
    if (dryRun) {
      return {
        dryRun: true,
        alreadyMirrored: manifest.imageOwnership === "aca-managed",
        products: manifest.productCount,
        supplierImages: 0,
        selectedImages: 0,
        imageBaseUrl: manifest.imageBaseUrl || baseUrl,
      };
    }
    const existingImageManifest =
      manifest.imageManifestFile &&
      path.join(directory, manifest.imageManifestFile);
    if (
      manifest.imageOwnership !== "aca-managed" ||
      !existingImageManifest ||
      !fs.existsSync(existingImageManifest)
    ) {
      throw new Error(
        "No supplier images were found, but this snapshot is not marked as ACA-managed"
      );
    }
    return {
      dryRun,
      alreadyMirrored: true,
      products: manifest.productCount,
      supplierImages: 0,
      selectedImages: 0,
      uploaded: 0,
      reused: manifest.mirroredImageCount || 0,
      imageBaseUrl: manifest.imageBaseUrl,
      imageManifestFile: manifest.imageManifestFile,
    };
  }

  if (limit > 0 && limit < tasks.length && !allowPartial && !dryRun) {
    throw new Error(
      `Refusing a partial catalogue rewrite: ${limit} of ${tasks.length} images requested`
    );
  }
  const selectedTasks = limit > 0 ? tasks.slice(0, limit) : tasks;
  if (dryRun) {
    return {
      dryRun: true,
      products: manifest.productCount,
      supplierImages: tasks.length,
      selectedImages: selectedTasks.length,
      imageBaseUrl: baseUrl,
    };
  }
  if (!store) throw new Error("A catalog image store is required");

  let next = 0;
  let uploaded = 0;
  let reused = 0;
  let totalBytes = 0;
  const results = new Map();
  async function worker() {
    while (next < selectedTasks.length) {
      const task = selectedTasks[next++];
      let metadata = await store.probe(task.key, task.sourceHash);
      if (metadata) {
        reused += 1;
      } else {
        const sourceImage = await fetchImage(task.sourceUrl, fetchImpl);
        const image = await transformToWebp(sourceImage, transform);
        metadata = {
          sourceHash: task.sourceHash,
          contentHash: sha256(image.body),
          bytes: image.body.length,
          contentType: image.contentType,
        };
        await store.put(task.key, image.body, metadata);
        uploaded += 1;
      }
      totalBytes += metadata.bytes;
      results.set(task.identity, {
        ...task,
        ...metadata,
        publicUrl: publicImageUrl(baseUrl, task.key),
      });
    }
  }
  await Promise.all(
    Array.from(
      { length: Math.max(1, Math.min(concurrency, selectedTasks.length || 1)) },
      () => worker()
    )
  );

  const imageEntries = [];
  const primaryByProductId = new Map();
  for (const { fileName, products } of chunks) {
    for (const product of products) {
      product.gallery = (product.gallery || []).map((value, index) => {
        if (!isSupplierImageUrl(value, extraSourceHosts)) return value;
        const identity = `${product.id}:${index}:${sha256(value)}`;
        const mirrored = results.get(identity);
        if (!mirrored) {
          if (allowPartial) return value;
          throw new Error(
            `${product.id}: missing mirrored image result for gallery position ${index + 1}`
          );
        }
        imageEntries.push({
          productId: String(product.id),
          index,
          key: mirrored.key,
          sourceHash: mirrored.sourceHash,
          contentHash: mirrored.contentHash,
          bytes: mirrored.bytes,
          contentType: mirrored.contentType,
        });
        return mirrored.publicUrl;
      });
      product.imageUrl = product.gallery[0] || product.imageUrl || null;
      if (product.imageUrl)
        primaryByProductId.set(String(product.id), product.imageUrl);
    }
    atomicWriteJson(path.join(directory, fileName), products);
  }

  for (const fileName of fs
    .readdirSync(directory)
    .filter(name => /^search-index(?:-\d{3})?\.json$/.test(name))) {
    const products = JSON.parse(
      fs.readFileSync(path.join(directory, fileName), "utf8")
    );
    for (const product of products) {
      if (primaryByProductId.has(String(product.id)))
        product.imageUrl = primaryByProductId.get(String(product.id));
    }
    atomicWriteJson(path.join(directory, fileName), products);
  }

  const categorySummary = {};
  for (const { products } of chunks) {
    for (const product of products) {
      for (const category of product.categories || [product.category]) {
        const summary =
          categorySummary[category] ||
          (categorySummary[category] = { count: 0, imageUrl: null });
        summary.count += 1;
        if (!summary.imageUrl && product.imageUrl)
          summary.imageUrl = product.imageUrl;
      }
    }
  }
  atomicWriteJson(
    path.join(
      directory,
      manifest.categorySummaryFile || "category-summary.json"
    ),
    categorySummary
  );

  const imageManifestFile = "catalog-image-manifest.json";
  const imageManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    imageBaseUrl: baseUrl,
    productCount: new Set(imageEntries.map(entry => entry.productId)).size,
    imageCount: imageEntries.length,
    totalBytes,
    transform,
    entries: imageEntries,
  };
  atomicWriteJson(path.join(directory, imageManifestFile), imageManifest);
  atomicWriteJson(manifestPath, {
    ...manifest,
    imageBaseUrl: baseUrl,
    imageManifestFile,
    imageOwnership: "aca-managed",
    mirroredImageCount: imageEntries.length,
    mirroredProductCount: imageManifest.productCount,
    imagePolicy:
      "Catalog images are stored in ACA-managed object storage. Product IDs and gallery order are preserved during mirroring.",
  });

  return {
    dryRun: false,
    products: manifest.productCount,
    supplierImages: tasks.length,
    selectedImages: selectedTasks.length,
    uploaded,
    reused,
    totalBytes,
    imageBaseUrl: baseUrl,
    imageManifestFile,
  };
}

async function main() {
  const backend = process.env.CATALOG_IMAGE_BACKEND || "s3";
  const dryRun = process.env.CATALOG_IMAGE_DRY_RUN === "1";
  const imageBaseUrl =
    process.env.CATALOG_IMAGE_BASE_URL || "https://images.acahydraulic.kz";
  const common = {
    catalogDir: process.env.CATALOG_DIR || "client/public/catalog-data",
    imageBaseUrl,
    concurrency: Number(process.env.CATALOG_IMAGE_CONCURRENCY || 8),
    limit: Number(process.env.CATALOG_IMAGE_LIMIT || 0),
    allowPartial: process.env.CATALOG_IMAGE_ALLOW_PARTIAL === "1",
    allowNonAcaHost: process.env.CATALOG_IMAGE_ALLOW_NON_ACA_HOST === "1",
    extraSourceHosts: (process.env.CATALOG_IMAGE_SOURCE_HOSTS || "")
      .split(",")
      .map(value => value.trim().toLowerCase())
      .filter(Boolean),
    transform:
      Number(process.env.CATALOG_IMAGE_WEBP_SIZE || 0) > 0
        ? {
            size: Number(process.env.CATALOG_IMAGE_WEBP_SIZE),
            quality: Number(process.env.CATALOG_IMAGE_WEBP_QUALITY || 70),
          }
        : null,
    dryRun,
  };
  let store = null;
  if (!dryRun && backend === "filesystem") {
    store = createFilesystemStore(
      process.env.CATALOG_IMAGE_LOCAL_DIR || ".catalog-cache/images"
    );
  } else if (!dryRun && backend === "s3") {
    store = createS3Store({
      endpoint: process.env.CATALOG_S3_ENDPOINT,
      region: process.env.CATALOG_S3_REGION,
      bucket: process.env.CATALOG_S3_BUCKET,
      accessKeyId: process.env.CATALOG_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.CATALOG_S3_SECRET_ACCESS_KEY,
    });
  } else if (!dryRun) {
    throw new Error(`Unsupported CATALOG_IMAGE_BACKEND: ${backend}`);
  }
  console.log(
    JSON.stringify(await mirrorCatalogImages({ ...common, store }), null, 2)
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

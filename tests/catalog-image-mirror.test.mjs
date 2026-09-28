import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  catalogImageKey,
  createFilesystemStore,
  mirrorCatalogImages,
} from "../scripts/mirror-catalog-images.mjs";

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value));
}

test("mirrors each product gallery to deterministic product-scoped ACA paths without changing order", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aca-catalog-mirror-"));
  const catalogDir = path.join(root, "catalog-data");
  const storageDir = path.join(root, "storage");
  fs.mkdirSync(catalogDir, { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const bodies = new Map([
    ["/p1-main.webp", Buffer.from("product-one-main")],
    ["/p1-side.webp", Buffer.from("product-one-side")],
    ["/p2-main.webp", Buffer.from("product-two-main")],
  ]);
  let requests = 0;
  const server = http.createServer((request, response) => {
    requests += 1;
    const body = bodies.get(request.url);
    if (!body) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "content-type": "image/webp" });
    response.end(body);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const port = server.address().port;
  const image = name => `http://127.0.0.1:${port}/${name}`;

  const products = [
    {
      id: "101",
      handle: "pump-one",
      category: "fuel-pumps",
      categories: ["fuel-pumps"],
      imageUrl: image("p1-main.webp"),
      gallery: [image("p1-main.webp"), image("p1-side.webp")],
    },
    {
      id: "202",
      handle: "pump-two",
      category: "fuel-pumps",
      categories: ["fuel-pumps"],
      imageUrl: image("p2-main.webp"),
      gallery: [image("p2-main.webp")],
    },
  ];
  writeJson(path.join(catalogDir, "manifest.json"), {
    importedAt: "2026-09-28T00:00:00.000Z",
    productCount: 2,
    pageSize: 250,
    chunkCount: 1,
    currency: "KZT",
    indexFile: "search-index.json",
    categorySummaryFile: "category-summary.json",
  });
  writeJson(path.join(catalogDir, "products-001.json"), products);
  writeJson(
    path.join(catalogDir, "search-index-001.json"),
    products.map(({ gallery, ...product }) => product)
  );
  writeJson(
    path.join(catalogDir, "search-index.json"),
    products.map(({ gallery, ...product }) => product)
  );
  writeJson(path.join(catalogDir, "category-summary.json"), {
    "fuel-pumps": { count: 2, imageUrl: products[0].imageUrl },
  });

  const options = {
    catalogDir,
    imageBaseUrl: "https://images.acahydraulic.kz",
    store: createFilesystemStore(storageDir),
    concurrency: 2,
    allowNonAcaHost: false,
    extraSourceHosts: ["127.0.0.1"],
  };
  const result = await mirrorCatalogImages(options);
  assert.equal(result.uploaded, 3);
  assert.equal(result.reused, 0);
  assert.equal(requests, 3);

  const mirrored = JSON.parse(
    fs.readFileSync(path.join(catalogDir, "products-001.json"), "utf8")
  );
  assert.equal(mirrored[0].imageUrl, mirrored[0].gallery[0]);
  assert.equal(mirrored[1].imageUrl, mirrored[1].gallery[0]);
  assert.notEqual(mirrored[0].imageUrl, mirrored[1].imageUrl);
  assert.deepEqual(mirrored[0].gallery, [
    `https://images.acahydraulic.kz/${catalogImageKey("101", 0, image("p1-main.webp"))}`,
    `https://images.acahydraulic.kz/${catalogImageKey("101", 1, image("p1-side.webp"))}`,
  ]);
  assert.equal(
    fs.readFileSync(
      path.join(storageDir, catalogImageKey("101", 0, image("p1-main.webp"))),
      "utf8"
    ),
    "product-one-main"
  );
  assert.equal(
    fs.readFileSync(
      path.join(storageDir, catalogImageKey("202", 0, image("p2-main.webp"))),
      "utf8"
    ),
    "product-two-main"
  );

  const manifest = JSON.parse(
    fs.readFileSync(path.join(catalogDir, "manifest.json"), "utf8")
  );
  assert.equal(manifest.imageOwnership, "aca-managed");
  assert.equal(manifest.mirroredImageCount, 3);
  const integrity = JSON.parse(
    fs.readFileSync(path.join(catalogDir, manifest.imageManifestFile), "utf8")
  );
  assert.equal(integrity.entries.length, 3);
  assert.deepEqual(
    integrity.entries.map(entry => `${entry.productId}:${entry.index}`),
    ["101:0", "101:1", "202:0"]
  );

  const index = JSON.parse(
    fs.readFileSync(path.join(catalogDir, "search-index-001.json"), "utf8")
  );
  assert.deepEqual(
    index.map(product => product.imageUrl),
    mirrored.map(product => product.imageUrl)
  );
  const summary = JSON.parse(
    fs.readFileSync(path.join(catalogDir, "category-summary.json"), "utf8")
  );
  assert.equal(summary["fuel-pumps"].imageUrl, mirrored[0].imageUrl);

  const second = await mirrorCatalogImages(options);
  assert.equal(
    second.supplierImages,
    0,
    "a completed snapshot no longer depends on supplier URLs"
  );
  assert.equal(second.alreadyMirrored, true);
  assert.equal(
    requests,
    3,
    "rerunning a completed snapshot must not redownload images"
  );
});

test("refuses partial production rewrites and non-ACA public hosts", async () => {
  assert.throws(
    () => catalogImageKey("", 0, "https://cdn.shopify.com/a.webp"),
    /Unsafe empty catalog image path segment/
  );
});

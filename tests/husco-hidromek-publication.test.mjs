import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ownerProducts from "../shared/catalog-owner-products.json" with { type: "json" };
import repairCase from "../shared/husco-hidromek-102b-case.json" with { type: "json" };

const root = "dist/public";
const productPath = path.join(root, "catalog", repairCase.handle, "index.html");
const casePath = path.join(root, repairCase.casePath.replace(/^\//, ""), "index.html");

function readPublished(file) {
  assert.ok(fs.existsSync(file), `Missing published page: ${file}`);
  return fs.readFileSync(file, "utf8");
}

function schemaNodes(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .flatMap((match) => {
      const schema = JSON.parse(match[1]);
      return Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
    });
}

test("owner catalog entry keeps the identifiers visible on the HUSCO nameplate", () => {
  const product = ownerProducts.find((item) => item.handle === repairCase.handle);
  assert.ok(product);
  assert.equal(product.id, "ACA-HUSCO-C16E303-HIDROMEK-102B");
  assert.equal(product.category, "main-control-valves");
  assert.deepEqual(product.categories, ["main-control-valves", "control-valves"]);
  assert.equal(product.brand, "HUSCO");
  assert.equal(product.model, "C16E303");
  assert.equal(product.mpn, "C16E303");
  assert.equal(product.minPriceKzt, null);
  assert.equal(product.available, false);
  assert.equal(product.ownerCase.casePath, repairCase.casePath);
  assert.match(product.fitment, /F18\/22233/);
  assert.match(product.fitment, /6600-E163 A00/);
});

test("HIDROMEK case publishes one H1, exact markings and three non-autoplay videos", () => {
  const html = readPublished(casePath);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /HIDROMEK HMK 102B: замена заднего гидрораспределителя HUSCO C16E303/);
  assert.match(html, /F18\/22233/);
  assert.match(html, /6600-E163 A00/);
  assert.match(html, /Цена и наличие — по запросу/);
  assert.doesNotMatch(html, /давление \d|бар|гарантия \d/i);
  assert.match(html, new RegExp(`href="https://acahydraulic\\.kz${repairCase.casePath}/"`));

  const videos = [...html.matchAll(/<video\b[^>]*>/g)].map((match) => match[0]);
  assert.equal(videos.length, 3);
  assert.ok(videos.every((video) => /preload="none"/.test(video)));
  assert.ok(videos.every((video) => !/autoplay/i.test(video)));
  for (const video of repairCase.videos) {
    assert.match(html, new RegExp(video.src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(video.poster.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  const schemas = schemaNodes(html);
  assert.equal(schemas.filter((schema) => schema["@type"] === "Article").length, 1);
  const videoSchemas = schemas.filter((schema) => schema["@type"] === "VideoObject");
  assert.equal(videoSchemas.length, 3);
  assert.ok(videoSchemas.every((schema) => schema.contentUrl?.startsWith("https://acahydraulic.kz/media/hidromek-102b-husco-c16e303/")));
});

test("HUSCO product page publishes a price-on-request card, Product schema and case link", () => {
  const html = readPublished(productPath);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /Гидрораспределитель HUSCO C16E303 для HIDROMEK HMK 102B/);
  assert.match(html, /Цена по запросу/i);
  assert.match(html, new RegExp(`href="${repairCase.casePath}/"`));
  assert.match(html, new RegExp(`href="https://acahydraulic\\.kz/catalog/${repairCase.handle}/"`));
  for (const image of repairCase.gallery) assert.match(html, new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  const product = schemaNodes(html).find((schema) => schema["@type"] === "Product");
  assert.ok(product);
  assert.equal(product.brand.name, "HUSCO");
  assert.equal(product.mpn, "C16E303");
  assert.equal(product.offers, undefined);
  assert.equal(product.image.length, 3);
});

test("HUSCO case and media are discoverable and non-empty", () => {
  const caseSitemap = fs.readFileSync(path.join(root, "sitemap-cases.xml"), "utf8");
  const videoSitemap = fs.readFileSync(path.join(root, "sitemap-videos.xml"), "utf8");
  assert.match(caseSitemap, new RegExp(`https://acahydraulic\\.kz${repairCase.casePath}/`));
  assert.match(videoSitemap, new RegExp(`https://acahydraulic\\.kz${repairCase.casePath}/`));
  assert.match(videoSitemap, /functional-test\.mp4/);

  const publicFiles = [
    ...repairCase.gallery,
    repairCase.ogImage,
    ...repairCase.videos.flatMap((video) => [video.src, video.poster]),
  ];
  for (const file of publicFiles) {
    const localPath = path.join("client/public", file.replace(/^\//, ""));
    assert.ok(fs.statSync(localPath).size > 1_000, `${localPath} is unexpectedly small`);
  }
});

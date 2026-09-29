import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import ownerProducts from "../shared/catalog-owner-products.json" with { type: "json" };
import sale from "../shared/xcmg-xz200-pump-sale.json" with { type: "json" };

const root = "dist/public";
const productPath = path.join(root, "catalog", sale.handle, "index.html");
const caseRoute = sale.casePath.replace(/^\//, "");
const casePath = path.join(root, caseRoute, "index.html");

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

test("owner catalog entry keeps confirmed XCMG identifiers and sale terms", () => {
  const product = ownerProducts.find((item) => item.handle === sale.handle);

  assert.ok(product);
  assert.equal(product.id, "ACA-XCMG-803001730-XZ200E");
  assert.equal(product.category, "hydraulic-pumps");
  assert.equal(product.brand, "XCMG");
  assert.equal(product.mpn, "803001730");
  assert.equal(product.minPriceKzt, 1_350_000);
  assert.equal(product.maxPriceKzt, 1_350_000);
  assert.equal(product.available, false);
  assert.equal(product.ownerSale.casePath, sale.casePath);
  assert.equal(product.gallery.length, 3);
});

test("XCMG case publishes one H1, honest fitment wording, canonical and three real videos", () => {
  const html = readPublished(casePath);

  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /XCMG XZ200: продажа и установка гидронасоса 803001730/);
  assert.match(html, /1 350 000 ₸/);
  assert.match(html, /шильдик машины показывает модель XZ200/i);
  assert.match(html, /Насос указан для буровой установки XCMG XZ200E/i);
  assert.match(html, /rel="canonical"/);
  assert.match(html, new RegExp(`href="https://acahydraulic\\.kz${sale.casePath}/"`));

  const videos = [...html.matchAll(/<video\b[^>]*>/g)].map((match) => match[0]);
  assert.equal(videos.length, 3);
  assert.ok(videos.every((video) => /preload="none"/.test(video)));
  assert.ok(videos.every((video) => !/autoplay/i.test(video)));
  for (const video of sale.videos) {
    assert.match(html, new RegExp(video.src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(video.poster.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  const schemas = schemaNodes(html);
  assert.equal(schemas.filter((schema) => schema["@type"] === "Article").length, 1);
  const videoSchemas = schemas.filter((schema) => schema["@type"] === "VideoObject");
  assert.equal(videoSchemas.length, 3);
  assert.ok(videoSchemas.every((schema) => schema.contentUrl?.startsWith("https://acahydraulic.kz/media/xcmg-xz200-pump/")));
});

test("XCMG product page publishes Product schema, real gallery and case link", { skip: !fs.existsSync(productPath) }, () => {
  const html = readPublished(productPath);

  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /Гидравлический насос XCMG 803001730/);
  assert.match(html, /1[\s\u00a0]350[\s\u00a0]000 ₸/);
  assert.match(html, new RegExp(`href="${sale.casePath}/"`));
  assert.match(html, /rel="canonical"/);
  assert.match(html, new RegExp(`href="https://acahydraulic\\.kz/catalog/${sale.handle}/"`));
  for (const image of sale.gallery) {
    assert.match(html, new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  const product = schemaNodes(html).find((schema) => schema["@type"] === "Product");
  assert.ok(product);
  assert.equal(product.brand.name, "XCMG");
  assert.equal(product.mpn, "803001730");
  assert.equal(Number(product.offers.price), 1_350_000);
  assert.equal(product.offers.priceCurrency, "KZT");
  assert.equal(product.offers.availability, undefined);
  assert.equal(product.image.length, 3);
});

test("XCMG case and videos are discoverable and all media files are non-empty", () => {
  const caseSitemap = fs.readFileSync(path.join(root, "sitemap-cases.xml"), "utf8");
  const videoSitemap = fs.readFileSync(path.join(root, "sitemap-videos.xml"), "utf8");

  assert.match(caseSitemap, new RegExp(`https://acahydraulic\\.kz${sale.casePath}/`));
  assert.match(videoSitemap, new RegExp(`https://acahydraulic\\.kz${sale.casePath}/`));
  assert.match(videoSitemap, /installation\.mp4/);

  const publicFiles = [
    ...sale.gallery,
    sale.ogImage,
    ...sale.videos.flatMap((video) => [video.src, video.poster]),
  ];
  for (const file of publicFiles) {
    const localPath = path.join("client/public", file.replace(/^\//, ""));
    assert.ok(fs.statSync(localPath).size > 1_000, `${localPath} is unexpectedly small`);
  }
});

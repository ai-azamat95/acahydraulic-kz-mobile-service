import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "dist/public";
const landingRoute = "parts/engines-complete";
const productRoute = "parts/engines-complete/shantui-sd32-cummins-nta855-c360s10";
const familyRoute = "parts/engines-complete/cummins/n855-nt855-nta855";
const landingHtml = fs.readFileSync(path.join(root, landingRoute, "index.html"), "utf8");
const productHtml = fs.readFileSync(path.join(root, productRoute, "index.html"), "utf8");

test("complete-engine landing exposes the N855 family inside the 25-product catalogue", () => {
  assert.equal((landingHtml.match(/data-engine-product-card/g) || []).length, 25);
  assert.match(landingHtml, /N855 \/ NT855 \/ NTA855/);
  assert.match(landingHtml, new RegExp(`href="/${familyRoute}"`));
  assert.match(landingHtml, /Цена и срок:<\/strong> по запросу/);
  assert.doesNotMatch(landingHtml, /В наличии|есть на складе/i);
});

test("engine product route has safe product metadata and no invented offer", () => {
  assert.equal((productHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(productHtml, /Shantui SD32/);
  assert.match(productHtml, /NTA855-C360S10/);
  assert.match(productHtml, /По запросу/);
  assert.match(productHtml, /проверяем двигатель и технику по шильдикам/i);
  assert.doesNotMatch(productHtml, /В наличии|есть на складе/i);

  const schemas = [...productHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
  const product = schemas.find((schema) => schema["@type"] === "Product");
  assert.equal(product?.model, "NTA855-C360S10");
  assert.equal(product?.sku, "NTA855-C360S10");
  assert.equal(product?.offers, undefined);
});

test("engine product is published in the primary sitemap", () => {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(sitemap, new RegExp(`https://acahydraulic\\.kz/${productRoute}/`));
});

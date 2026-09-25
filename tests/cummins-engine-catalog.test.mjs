import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "dist/public";
const landingRoute = "parts/engines-complete";
const catalogRoute = "parts/engines-complete/cummins";
const landingHtml = fs.readFileSync(path.join(root, landingRoute, "index.html"), "utf8");
const catalogHtml = fs.readFileSync(path.join(root, catalogRoute, "index.html"), "utf8");

test("complete-engine landing links to the Cummins family catalogue", () => {
  assert.equal((landingHtml.match(/data-cummins-range-card/g) || []).length, 1);
  assert.match(landingHtml, new RegExp(`href="/${catalogRoute}"`));
  assert.match(landingHtml, /25 семейств/);
  assert.match(landingHtml, /cummins-engine-range\.webp/);
});

test("Cummins catalogue publishes 25 verified family cards in Russian", () => {
  assert.equal((catalogHtml.match(/data-cummins-engine-card/g) || []).length, 25);
  assert.equal((catalogHtml.match(/<h1[\s>]/g) || []).length, 1);
  for (const model of ["QSB6.7", "QSL8.9 / QSL9", "M11 / QSM11", "N855 / NT855 / NTA855", "QSK23", "QSK38", "QSK50", "X15"]) {
    assert.match(catalogHtml, new RegExp(model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(catalogHtml, /Цена и срок:<\/strong> по запросу/);
  assert.match(catalogHtml, /Точный индекс, производителя, комплектацию и применяемость подтверждаем до оплаты/);
  assert.doesNotMatch(catalogHtml, /В наличии|есть на складе|оригинал Cummins/i);
});

test("Cummins catalogue publishes local supplier photos for every family card", () => {
  assert.match(catalogHtml, /\/catalog-assets\/cummins-engine-range\.webp/);
  assert.equal((catalogHtml.match(/data-cummins-engine-image/g) || []).length, 25);
  assert.match(catalogHtml, /Фото серии\. Точное исполнение и комплектность подтверждаем до оплаты\./);
  assert.doesNotMatch(catalogHtml, /antaiospower|leadongcdn/i);
  assert.equal(fs.existsSync(path.join(root, "catalog-assets", "cummins-engine-range.webp")), true);

  const cardImages = [...catalogHtml.matchAll(/src="(\/catalog-assets\/cummins-series\/[^"]+\.webp)"/g)]
    .map((match) => match[1]);
  assert.equal(cardImages.length, 25);
  assert.equal(new Set(cardImages).size, 20);
  for (const image of new Set(cardImages)) {
    assert.equal(fs.existsSync(path.join(root, image)), true, `${image} must be copied to the build output`);
  }
});

test("Cummins catalogue has crawlable metadata and ItemList schema", () => {
  assert.match(catalogHtml, /https:\/\/acahydraulic\.kz\/parts\/engines-complete\/cummins\//);
  const schemas = [...catalogHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
  const graph = schemas.find((schema) => Array.isArray(schema["@graph"]));
  const itemList = graph?.["@graph"].find((item) => item["@type"] === "ItemList");
  assert.equal(itemList?.numberOfItems, 25);
  assert.equal(itemList?.itemListElement?.length, 25);

  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(sitemap, new RegExp(`https://acahydraulic\\.kz/${catalogRoute}/`));
});

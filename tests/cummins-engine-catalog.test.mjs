import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "dist/public";
const landingRoute = "parts/engines-complete";
const catalogRoute = "parts/engines-complete/cummins";
const landingHtml = fs.readFileSync(path.join(root, landingRoute, "index.html"), "utf8");
const catalogHtml = fs.readFileSync(path.join(root, catalogRoute, "index.html"), "utf8");

function productLinks(html) {
  return [...html.matchAll(/data-engine-product-link[^>]*href="([^"]+)"|href="([^"]+)"[^>]*data-engine-product-link/g)]
    .map((match) => match[1] ?? match[2]);
}

test("complete-engine landing is a 10-item first page with a directory of 25 engine families", () => {
  assert.equal((landingHtml.match(/data-engine-product-card/g) || []).length, 9);
  assert.equal((landingHtml.match(/data-cummins-engine-card/g) || []).length, 9);
  assert.equal((landingHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal(new Set(productLinks(landingHtml)).size, 9);
  assert.match(landingHtml, /N855 \/ NT855 \/ NTA855/);
  assert.match(landingHtml, /Реальный кейс показан только у серии N855/);
  assert.doesNotMatch(landingHtml, /В наличии|есть на складе|оригинал Cummins/i);
});

test("Cummins brand catalogue publishes a paginated catalogue with all 25 family links", () => {
  assert.equal((catalogHtml.match(/data-cummins-engine-card/g) || []).length, 9);
  assert.equal((catalogHtml.match(/data-engine-product-card/g) || []).length, 9);
  assert.equal(new Set(productLinks(catalogHtml)).size, 9);
  assert.equal((catalogHtml.match(/<h1[\s>]/g) || []).length, 1);
  for (const model of ["QSB6.7", "QSL8.9 / QSL9", "M11 / QSM11", "N855 / NT855 / NTA855", "QSK23", "QSK38", "QSK50", "X15"]) {
    assert.match(catalogHtml, new RegExp(model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const directory = catalogHtml.match(/<nav[^>]*data-engine-directory[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.equal((directory?.match(/<a /g) || []).length, 25);
  assert.equal(new Set([...directory.matchAll(/href="([^"]+)"/g)].map(match => match[1])).size, 25);
  assert.match(catalogHtml, /Цена и срок:<\/strong> по запросу/);
  assert.match(catalogHtml, /Точный индекс, производителя, комплектацию и применяемость подтверждаем до оплаты/);
  assert.doesNotMatch(catalogHtml, /В наличии|есть на складе|оригинал Cummins/i);
});

test("both catalogues publish local supplier photos for the visible family cards", () => {
  for (const html of [landingHtml, catalogHtml]) {
    assert.equal((html.match(/data-cummins-engine-image/g) || []).length, 9);
    assert.match(html, /Фото серии\. Точное исполнение и комплектность подтверждаем до оплаты\./);
    assert.doesNotMatch(html, /antaiospower|leadongcdn/i);
  }

  const cardImages = [...catalogHtml.matchAll(/src="(\/catalog-assets\/cummins-series\/[^"]+\.webp)"/g)]
    .map((match) => match[1]);
  assert.equal(cardImages.length, 9);
  for (const image of new Set(cardImages)) {
    assert.equal(fs.existsSync(path.join(root, image)), true, `${image} must be copied to the build output`);
  }
});

test("Cummins catalogue ItemList includes the priced engine and 25 family pages", () => {
  const schemas = [...catalogHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
  const graph = schemas.find((schema) => Array.isArray(schema["@graph"]));
  const itemList = graph?.["@graph"].find((item) => item["@type"] === "ItemList");
  assert.equal(itemList?.numberOfItems, 26);
  assert.equal(itemList?.itemListElement?.length, 26);
  assert.equal(new Set(itemList?.itemListElement?.map((item) => item.url)).size, 26);
  assert.equal(itemList?.itemListElement?.[0].url, "https://acahydraulic.kz/parts/engines-complete/shantui-sd32-cummins-nta855-c360s10/");
  assert(itemList?.itemListElement?.slice(1).every((item) => item.url.includes("/parts/engines-complete/cummins/")));
  assert.deepEqual(itemList?.itemListElement?.map((item) => item.position), Array.from({ length: 26 }, (_, index) => index + 1));
});

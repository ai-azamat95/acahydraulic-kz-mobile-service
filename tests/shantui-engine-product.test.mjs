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
  assert.equal((landingHtml.match(/data-engine-product-card/g) || []).length, 9);
  assert.match(landingHtml, /N855 \/ NT855 \/ NTA855/);
  assert.match(landingHtml, new RegExp(`href="/${familyRoute}"`));
  assert.match(landingHtml, /Цена и срок:<\/strong> по запросу/);
  assert.doesNotMatch(landingHtml, /В наличии|есть на складе/i);
});

test("engine product route publishes confirmed price, backorder and included delivery", () => {
  assert.equal((productHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(productHtml, /Shantui SD32/);
  assert.match(productHtml, /NTA855-C360S10/);
  assert.match(productHtml, /12 860 000 ₸/);
  assert.match(productHtml, /без монтажа и запуска/i);
  assert.match(productHtml, /Гидротрансформатор не входит/);
  assert.match(productHtml, /проверяем двигатель и технику по шильдикам/i);
  assert.doesNotMatch(productHtml, /В наличии|есть на складе/i);

  const schemas = [...productHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
  const product = schemas.find((schema) => schema["@type"] === "Product");
  assert.equal(product?.model, "NTA855-C360S10");
  assert.equal(product?.sku, "NTA855-C360S10");
  assert.equal(product?.offers?.["@type"], "Offer");
  assert.equal(product?.offers?.price, 12860000);
  assert.equal(product?.offers?.priceCurrency, "KZT");
  assert.equal(product?.offers?.url, `https://acahydraulic.kz/${productRoute}/`);
  assert.equal(product?.offers?.itemCondition, "https://schema.org/NewCondition");
  assert.equal(product?.offers?.availability, "https://schema.org/BackOrder");
  assert.equal(product?.offers?.shippingDetails?.shippingRate?.value, 0);
  assert.equal(product?.offers?.shippingDetails?.shippingRate?.currency, "KZT");
  assert.equal(product?.offers?.shippingDetails?.shippingDestination?.addressCountry, "KZ");
  assert.equal(product?.offers?.shippingDetails?.deliveryTime, undefined);
  assert.equal(product?.offers?.availabilityStarts, undefined);
  assert.match(productHtml, /Под заказ — на складе нет/);
  assert.match(productHtml, /Ориентировочное ожидание: 3–14 дней/);
  assert.match(productHtml, /Доставка по Казахстану включена в цену/);
  assert.equal(product?.offers?.priceValidUntil, undefined);
});

test("both engine catalogues expose one exact engine with price", () => {
  const brandHtml = fs.readFileSync(path.join(root, "parts/engines-complete/cummins/index.html"), "utf8");
  for (const html of [landingHtml, brandHtml]) {
    assert.equal((html.match(/data-complete-engine-offer-card/g) || []).length, 1);
    assert.match(html, new RegExp(`href="/${productRoute}"`));
    assert.match(html, /new-engine\.webp/);
    assert.match(html, /12 860 000 ₸/);
    assert.match(html, /Под заказ — на складе нет/);
    assert.match(html, /Ориентировочное ожидание: 3–14 дней/);
    assert.match(html, /Доставка по Казахстану включена в цену/);
    assert.equal((html.match(/data-engine-product-card/g) || []).length, 9);
  }
});

test("engine product is published in the primary sitemap", () => {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(sitemap, new RegExp(`https://acahydraulic\\.kz/${productRoute}/`));
});

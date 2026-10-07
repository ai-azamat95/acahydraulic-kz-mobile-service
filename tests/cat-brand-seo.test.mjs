import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync("dist/public/brands/cat/index.html", "utf8");
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
const text = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
const productMap = JSON.parse(fs.readFileSync("client/public/catalog-data/product-map.json", "utf8"));

test("CAT service route publishes the real React page, not a generic fallback", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<title[^>]*>Ремонт гидравлики CAT Caterpillar в Казахстане \| ACA Hydraulic<\/title>/);
  assert.equal((html.match(/<link[^>]*rel="canonical"/g) || []).length, 1);
  assert.match(html, /<link[^>]*rel="canonical"[^>]*href="https:\/\/acahydraulic\.kz\/brands\/cat\/"/);
  assert.match(text, /Диагностика и ремонт гидравлики Caterpillar \(CAT\) в Казахстане/);
  assert.match(text, /Ремонтная база ACA Hydraulic находится в Астане/);
  assert.match(text, /Стоимость согласуем до выезда/);
  assert.doesNotMatch(html, /noindex/);
  const service = schemas.find((schema) => schema["@type"] === "Service");
  assert.equal(service.url, "https://acahydraulic.kz/brands/cat/");
  assert.deepEqual(service.areaServed.map((area) => area.name), ["Астана", "Казахстан"]);
  const breadcrumbs = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
  assert.equal(breadcrumbs.itemListElement[1].name, "Услуги");
});

test("CAT repair links to three distinct verified cases and the parts catalog without JavaScript", () => {
  assert.equal((body.match(/data-cat-case/g) || []).length, 3);
  for (const route of [
    "/cases/cat-325c-glokhnet-pod-nagruzkoy/",
    "/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu/",
    "/cases/cat-432e-postavka-gidronasosa-267-2755/",
    "/catalog/brand/caterpillar/",
    "/catalog/hydraulic-pump-267-2755-10r-8708-fits-for-caterpillar-cat-420e-430e-432e-434e-442e-444e/",
    "/services/mobile-repair/",
    "/services/hydraulic-pumps/",
    "/services/hydraulic-motors/",
    "/blog/remont-gidronasosa-cat/",
  ]) {
    assert.ok(body.includes(`href="${route}"`), route);
    if (route.startsWith("/catalog/hydraulic-pump-")) {
      // PR validation builds catalogue landings, while production also creates
      // every product HTML route. Check the shared routing input in both paths.
      assert.ok(Object.hasOwn(productMap, route.split("/")[2]), `catalogue target: ${route}`);
    } else {
      assert.ok(fs.existsSync(`dist/public${route}index.html`), `published target: ${route}`);
    }
  }
  assert.match(text, /Этот кейс подтверждает продажу, а не установку или испытание насоса/);
  assert.match(text, /Наличие, цену, исполнение и срок поставки подтверждаем по конкретной позиции/);
  assert.match(body, /<a[^>]*href="https:\/\/wa\.me\/77714177925\?text=/);
  // The existing global contact listener tracks anchors; do not double-count
  // the same click through the old button conversion helper.
  assert.doesNotMatch(fs.readFileSync("client/src/pages/brands/BrandCat.tsx", "utf8"), /gtag_whatsapp_conversion|window\.open/);
});

test("CAT FAQ structured data exactly matches visible questions and answers", () => {
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 4);
  const visibleFaq = body.match(/<div[^>]*data-cat-faq[^>]*>([\s\S]*?)<\/section>/)[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  for (const question of faq.mainEntity) {
    assert.ok(visibleFaq.includes(question.name), question.name);
    assert.ok(visibleFaq.includes(question.acceptedAnswer.text), question.name);
  }
  assert.match(text, /Один симптом не подтверждает необходимость замены насоса/);
  assert.match(text, /серийный номер техники, каталожный номер детали и фото шильдика/);
});

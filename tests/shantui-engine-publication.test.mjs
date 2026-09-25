import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "dist/public";
const caseRoute = "cases/shantui-sd32-postavka-dvigatelya-cummins-nta855";
const landingRoute = "parts/engines-complete";
const caseHtml = fs.readFileSync(path.join(root, caseRoute, "index.html"), "utf8");
const landingHtml = fs.readFileSync(path.join(root, landingRoute, "index.html"), "utf8");

test("Shantui case separates the historical engine price from installation", () => {
  assert.equal((caseHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(caseHtml, /12 860 000 ₸/);
  assert.match(caseHtml, /Монтаж не входил в указанную цену/);
  assert.match(caseHtml, /гидротрансформатор/i);
  assert.match(caseHtml, /бульдозер запустили/);
  assert.match(caseHtml, /полное исполнение.*сверяем по шильдику/i);
  assert.match(caseHtml, /условия гарантии.*договор/i);
});

test("complete-engine landing qualifies a B2B request without claiming stock or a universal price", () => {
  assert.equal((landingHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(landingHtml, /Новые двигатели в сборе/);
  assert.match(landingHtml, /гарантийные условия фиксируем в договоре/);
  assert.match(landingHtml, /модель техники, полный индекс двигателя, фото шильдика/i);
  assert.match(landingHtml, /Историческая цена конкретной поставки/);
  assert.doesNotMatch(landingHtml, /в наличии/i);
});

test("engine pages have canonical URLs, sitemap entries and real media", () => {
  assert.match(caseHtml, new RegExp(`https://acahydraulic\\.kz/${caseRoute}/`));
  assert.match(landingHtml, new RegExp(`https://acahydraulic\\.kz/${landingRoute}/`));
  assert.ok(fs.readFileSync(path.join(root, "sitemap-cases.xml"), "utf8").includes(`/${caseRoute}/`));
  assert.ok(fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").includes(`/${landingRoute}/`));

  const media = path.join(root, "media/shantui-sd32-engine");
  for (const file of ["new-engine.webp", "old-engine.webp", "torque-converter.webp", "installation.webp", "og.webp", "walkaround.mp4", "installation.mp4"]) {
    assert.ok(fs.statSync(path.join(media, file)).size > 10_000, file);
  }
  const videos = [...caseHtml.matchAll(/<video\b[^>]*>/g)].map(match => match[0]);
  assert.equal(videos.length, 2);
  assert.ok(videos.every(video => /preload="none"/.test(video) && !/autoplay/.test(video)));
});

test("case publishes one Article plus a separate VideoObject", () => {
  const schemas = [...caseHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  assert.equal(schemas.filter(schema => schema["@type"] === "Article").length, 1);
  assert.equal(schemas.filter(schema => schema["@type"] === "VideoObject").length, 1);
});

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "dist/public";
const caseRoute = "cases/shantui-sd32-postavka-dvigatelya-cummins-nta855";
const landingRoute = "parts/engines-complete";
const productRoute = "parts/engines-complete/shantui-sd32-cummins-nta855-c360s10";
const caseHtml = fs.readFileSync(path.join(root, caseRoute, "index.html"), "utf8");
const landingHtml = fs.readFileSync(path.join(root, landingRoute, "index.html"), "utf8");

test("Shantui case separates the historical engine price from installation", () => {
  assert.equal((caseHtml.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(caseHtml, /<title[^>]*>Двигатель Shantui SD32 Cummins NTA855: поставка и установка/);
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
  assert.match(landingHtml, /Историческая стоимость выполненной поставки без монтажа/);
  assert.match(landingHtml, /Текущая цена NTA855-C360S10/);
  assert.doesNotMatch(landingHtml, /в наличии/i);
});

test("engine pages have canonical URLs, sitemap entries and real media", () => {
  assert.match(caseHtml, new RegExp(`https://acahydraulic\\.kz/${caseRoute}/`));
  assert.match(landingHtml, new RegExp(`https://acahydraulic\\.kz/${landingRoute}/`));
  assert.ok(fs.readFileSync(path.join(root, "sitemap-cases.xml"), "utf8").includes(`/${caseRoute}/`));
  assert.ok(fs.readFileSync(path.join(root, "sitemap.xml"), "utf8").includes(`/${landingRoute}/`));
  assert.match(caseHtml, new RegExp(`href="/${productRoute}/?"`));

  const media = path.join(root, "media/shantui-sd32-engine");
  for (const file of ["new-engine.webp", "old-engine.webp", "torque-converter.webp", "installation.webp", "og.webp", "shantui-sd32-hero.webp", "walkaround.mp4", "installation.mp4"]) {
    assert.ok(fs.statSync(path.join(media, file)).size > 10_000, file);
  }
  assert.match(caseHtml, /alt="Реальная установка двигателя Cummins NTA855 на бульдозер Shantui SD32"/);
  assert.doesNotMatch(caseHtml, /Иллюстративный фон Shantui SD32/);
  const videos = [...caseHtml.matchAll(/<video\b[^>]*>/g)].map(match => match[0]);
  assert.equal(videos.length, 2);
  assert.ok(videos.every(video => /preload="none"/.test(video) && !/autoplay/.test(video)));
});

test("case publishes one Article plus a separate VideoObject", () => {
  const schemas = [...caseHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  assert.equal(schemas.filter(schema => schema["@type"] === "Article").length, 1);
  assert.equal(schemas.filter(schema => schema["@type"] === "VideoObject").length, 1);
  const article = schemas.find(schema => schema["@type"] === "Article");
  const video = schemas.find(schema => schema["@type"] === "VideoObject");
  assert.equal(article.datePublished, "2026-09-25");
  assert.equal(article.dateModified, "2026-10-03");
  assert.equal(video.isPartOf["@id"], article["@id"]);
});

test("case highlights the delivered result and keeps proof directly accessible", () => {
  assert.match(caseHtml, /Новый двигатель установлен — бульдозер Shantui SD32 запущен/);
  assert.match(caseHtml, /ACA Hydraulic выполнила продажу и поставку двигателя Cummins NTA855/);
  assert.match(caseHtml, /href="#case-installation-video"/);
  assert.match(caseHtml, /id="case-installation-video"/);
  assert.match(caseHtml, /актуальная цена и условия заказа/);
  assert.match(caseHtml, /<h1[^>]*font-extrabold[^>]*>/);
  assert.doesNotMatch(caseHtml, /<h1[^>]*font-bebas/);
});

test("priced engine cards link directly to the real sale and installation case", () => {
  for (const route of [landingRoute, "parts/engines-complete/cummins"]) {
    const html = fs.readFileSync(path.join(root, route, "index.html"), "utf8");
    assert.equal((html.match(/data-engine-case-link/g) || []).length, 1);
    assert.match(html, new RegExp(`href="/${caseRoute}"[^>]*data-engine-case-link|data-engine-case-link[^>]*href="/${caseRoute}"`));
    assert.match(html, /Продали и установили на Shantui SD32 — фото и видео/);
  }
});

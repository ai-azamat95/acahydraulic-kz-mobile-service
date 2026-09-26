import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const articlePath = new URL("../client/src/pages/blog/KapitalnyiRemonShantuiSD32.tsx", import.meta.url);
const blogPath = new URL("../client/src/pages/Blog.tsx", import.meta.url);
const routeCopiesPath = new URL("../scripts/create-spa-route-copies.mjs", import.meta.url);

test("Shantui article connects repair traffic to the verified engine offer", () => {
  const article = readFileSync(articlePath, "utf8");

  assert.match(article, /Ремонт SHANTUI SD32: диагностика гидравлики/);
  assert.match(article, /\/cases\/shantui-sd32-postavka-dvigatelya-cummins-nta855/);
  assert.match(article, /\/parts\/engines-complete\/shantui-sd32-cummins-nta855-c360s10/);
  assert.match(article, /одного названия серии недостаточно, чтобы подтвердить совместимость/);
});

test("Blog card does not advertise unverified repair duration or warranty", () => {
  const blog = readFileSync(blogPath, "utf8");
  const shantuiEntry = blog.match(/id: 6,[\s\S]*?readTime: "7 мин"/u)?.[0] ?? "";

  assert.match(shantuiEntry, /Ремонт SHANTUI SD32: диагностика гидравлики/);
  assert.doesNotMatch(shantuiEntry, /18 рабочих дней/);
  assert.doesNotMatch(shantuiEntry, /гарантия 6 месяцев/);
});

test("Static route metadata stays aligned with the Shantui article", () => {
  const routeCopies = readFileSync(routeCopiesPath, "utf8");
  const shantuiStaticEntry = routeCopies.match(/'blog\/kapitalnyy-remont-shantui-sd32': \{[\s\S]*?\n  \},/u)?.[0] ?? "";

  assert.match(routeCopies, /'kapitalnyy-remont-shantui-sd32': 'Ремонт SHANTUI SD32: диагностика гидравлики'/);
  assert.match(shantuiStaticEntry, /headline: 'Ремонт SHANTUI SD32: диагностика гидравлики/);
  assert.match(shantuiStaticEntry, /datePublished: '2026-03-18'/);
  assert.match(shantuiStaticEntry, /dateModified: '2026-09-26'/);
  assert.match(shantuiStaticEntry, /schemaType: 'BlogPosting'/);
  assert.match(routeCopies, /'@type': article\.schemaType \?\? 'Article'/);
  assert.match(routeCopies, /const staticBlogArticle = staticBlogArticles\[route\];[\s\S]*?description: staticBlogArticle\.description/);
  assert.match(routeCopies, /function replaceRootContent\(html, content\)/);
  assert.match(routeCopies, /return replaceRootContent\(out, renderedArticle\.body\)/);
});

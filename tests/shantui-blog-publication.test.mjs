import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(
  "dist/public/blog/kapitalnyy-remont-shantui-sd32/index.html",
  "utf8",
);

test("published Shantui article has one aligned SEO head", () => {
  assert.equal((html.match(/<title\b/g) || []).length, 1);
  assert.equal((html.match(/<meta[^>]+name=["']description["']/g) || []).length, 1);
  assert.equal((html.match(/<link[^>]+rel=["']canonical["']/g) || []).length, 1);
  assert.match(html, /<title[^>]*>Ремонт SHANTUI SD32: диагностика гидравлики \| ACA Hydraulic<\/title>/);
  assert.match(html, /name="description" content="Ремонт SHANTUI SD32: что проверить до заказа деталей/);
  assert.match(html, /"@type":"BlogPosting"/);
});

test("published Shantui article body links repair traffic to the engine offer", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /Ремонт SHANTUI SD32:/);
  assert.match(html, /\/cases\/shantui-sd32-postavka-dvigatelya-cummins-nta855/);
  assert.match(html, /\/parts\/engines-complete\/shantui-sd32-cummins-nta855-c360s10/);
});

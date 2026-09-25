import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = "dist/public";
const baseRoute = "parts/engines-complete/cummins";
const products = [
  ["4bta3-9", "4BTA3.9"], ["qsb3-9", "QSB3.9"], ["6bt-bta5-9", "6BT / BTA5.9"],
  ["qsb5-9", "QSB5.9"], ["qsb6-7", "QSB6.7"], ["c8-3", "C8.3"],
  ["qsc8-3", "QSC8.3"], ["qsl8-9-qsl9", "QSL8.9 / QSL9"], ["m11-qsm11", "M11 / QSM11"],
  ["n855-nt855-nta855", "N855 / NT855 / NTA855"], ["qsnt-n14", "QSNT / N14"], ["k19", "K19"],
  ["qsk19", "QSK19"], ["qsk23", "QSK23"], ["k38", "K38"], ["qsk38", "QSK38"],
  ["k50", "K50"], ["qsk50", "QSK50"], ["qsx15", "QSX15"], ["x15", "X15"],
  ["4bta3-9-g2", "4BTA3.9-G2"], ["6ltaa8-9-g2", "6LTAA8.9-G2"],
  ["qsb6-7-marine", "QSB6.7 Marine"], ["marine-power-generation", "Marine Power Generation"],
  ["marine-main-propulsion", "Marine Main Propulsion"],
];

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

function schemas(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
    .flatMap((match) => {
      const value = JSON.parse(match[1]);
      return Array.isArray(value?.["@graph"]) ? value["@graph"] : [value];
    });
}

test("all 25 Cummins family pages are statically rendered and indexable", () => {
  assert.equal(products.length, 25);
  for (const [slug, model] of products) {
    const route = `${baseRoute}/${slug}`;
    const html = fs.readFileSync(path.join(root, route, "index.html"), "utf8");
    const canonical = `https://acahydraulic.kz/${route}/`;
    const product = schemas(html).find((item) => item?.["@type"] === "Product");

    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${slug} must have one h1`);
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"|<link[^>]+href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]+rel="canonical"`));
    assert.equal(product?.model, model, `${slug} Product model`);
    assert.equal(product?.offers, undefined, `${slug} must not claim price or stock`);
    assert.match(product?.image ?? "", /^https:\/\/acahydraulic\.kz\/catalog-assets\/cummins-series\//);
    assert.match(html, /wa\.me\/77714177925/);
    assert.match(html, /href="\/parts\/engines-complete\/"/);
    assert.match(html, /href="\/parts\/engines-complete\/cummins\/"/);
    assert((html.match(/\/parts\/engines-complete\/cummins\//g) || []).length >= 5, `${slug} must link related products`);
    assert.match(sitemap, new RegExp(`${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\/loc>`));
  }
});

test("the verified Shantui case appears only on the N855 family page", () => {
  for (const [slug] of products) {
    const html = fs.readFileSync(path.join(root, baseRoute, slug, "index.html"), "utf8");
    if (slug === "n855-nt855-nta855") {
      assert.equal((html.match(/data-engine-case/g) || []).length, 1);
      assert.match(html, /href="\/cases\/shantui-sd32-postavka-dvigatelya-cummins-nta855\/"/);
      assert.match(html, /12 860 000 ₸/);
    } else {
      assert.equal((html.match(/data-engine-case/g) || []).length, 0, `${slug} must not show an invented case`);
      assert.doesNotMatch(html, /12 860 000 ₸/);
    }
  }
});

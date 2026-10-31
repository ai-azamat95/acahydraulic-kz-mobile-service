import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  catalogProductBrandLanding,
  catalogProductIsHydraulicPump,
  catalogProductSeo,
} from "../shared/catalog-product-seo.mjs";
import pumps from "../shared/catalog-hydrauvision-products.json" with { type: "json" };
import categoryCorrectionLedger from "../shared/catalog-category-corrections.json" with { type: "json" };
import catalogContentRevisions from "../shared/catalog-content-revisions.json" with { type: "json" };
import publicIndex from "../client/public/catalog-data/search-index.json" with { type: "json" };

const resources = [
  "/blog/zapchasti-po-nomeru-i-shildiku/",
  "/blog/remont-ili-zamena-gidronasosa/",
  "/cases/sany-sy365h-zamena-gidronasosa-video/",
];

const promotedPumps = [
  { sku: "R901147104", brandSlug: "rexroth" },
  { sku: "83073386", brandSlug: "danfoss" },
];
const generatedPagesReady = promotedPumps.every((expected) => {
  const product = pumps.find((item) => item.sku === expected.sku);
  return product && fs.existsSync(`dist/public/catalog/${product.handle}/index.html`);
});

test("pump identity uses all categories and resolves the manufacturer landing", () => {
  for (const expected of promotedPumps) {
    const product = pumps.find((item) => item.sku === expected.sku);
    assert.ok(product, expected.sku);
    assert.notEqual(product.category, "hydraulic-pumps", expected.sku);
    assert.ok(product.categories.includes("hydraulic-pumps"), expected.sku);
    assert.equal(catalogProductIsHydraulicPump(product), true, expected.sku);
    assert.equal(catalogProductBrandLanding(product)?.slug, expected.brandSlug, expected.sku);
    const seo = catalogProductSeo(product);
    assert.ok(seo.name.includes(product.brand), `${expected.sku}: visible brand`);
    assert.ok(seo.name.includes(expected.sku), `${expected.sku}: visible full article`);
    assert.ok(seo.description.includes(product.brand), `${expected.sku}: description brand`);
    assert.ok(seo.description.includes(expected.sku), `${expected.sku}: description article`);
  }

  assert.equal(
    catalogProductIsHydraulicPump({
      category: "hydraulic-motors",
      categories: ["hydraulic-motors"],
    }),
    false,
  );
});

test("brandless pump cards link only when the catalogue brand is unambiguous", () => {
  const inferred = catalogProductBrandLanding({
    brand: null,
    title: "Danfoss 90L075 Hydraulic Pump",
    fitment: "Excavator hydraulic system",
    tags: ["Hydraulic Pump Assembly"],
  });
  assert.equal(inferred?.slug, "danfoss");
  assert.equal(inferred?.matchSource, "title-manufacturer");

  const confirmed = catalogProductBrandLanding({
    brand: "Danfoss",
    title: "Danfoss 90L075 Hydraulic Pump",
    fitment: "Excavator hydraulic system",
    tags: [],
  });
  assert.equal(confirmed?.slug, "danfoss");
  assert.equal(confirmed?.matchSource, "manufacturer");

  const rexroth = catalogProductBrandLanding({
    brand: null,
    title: "Bosch Rexroth A10VO74 Hydraulic Pump for Volvo BL71",
    fitment: "Volvo BL71",
    tags: [],
  });
  assert.equal(rexroth?.slug, "rexroth");
  assert.equal(rexroth?.matchSource, "title-manufacturer");

  const kawasaki = catalogProductBrandLanding({
    brand: null,
    title: "Kawasaki K3V112DT Hydraulic Pump for Doosan DX225",
    fitment: "Doosan DX225",
    tags: [],
  });
  assert.equal(kawasaki?.slug, "kawasaki");

  for (const title of [
    "Hydraulic Pump 07430-72203 for Komatsu D65",
    "Kayaba Hydraulic Pump Fits Komatsu PC200",
    "Nachi Hydraulic Pump Fits Kobelco SK200",
  ]) {
    assert.equal(
      catalogProductBrandLanding({ brand: null, title, fitment: "", tags: [] }),
      undefined,
      title,
    );
  }
});

test("SPA and static product renderers use the same pump and brand helpers", () => {
  const ui = fs.readFileSync("client/src/pages/CatalogProduct.tsx", "utf8");
  const renderer = fs.readFileSync("scripts/create-catalog-route-copies.mjs", "utf8");

  for (const source of [ui, renderer]) {
    assert.match(source, /catalogProductIsHydraulicPump\(product\)/);
    assert.match(source, /catalogProductBrandLanding\(product\)/);
    assert.match(source, /Отправить шильдик для подбора/);
  }
  assert.match(ui, /<PumpCaseTeaser \/>/);
  for (const href of resources) assert.ok(renderer.includes(href), href);
});

test("pump recommendations keep only the confirmed selection and repair resources", () => {
  const teaser = fs.readFileSync("client/src/components/PumpCaseTeaser.tsx", "utf8");
  for (const href of resources) assert.ok(teaser.includes(href), href);
  assert.doesNotMatch(teaser, /k3v112dt-kak-podobrat-gidronasos/);
  assert.doesNotMatch(teaser, /k5v80dtp-handok-hitachi-zx160w/);
});

test("generated pump pages expose their own brand, selection CTA and confirmed resources", { skip: !generatedPagesReady }, () => {
  for (const expected of promotedPumps) {
    const product = pumps.find((item) => item.sku === expected.sku);
    assert.ok(product, expected.sku);
    const html = fs.readFileSync(`dist/public/catalog/${product.handle}/index.html`, "utf8");
    assert.ok(html.includes(`<h1>${product.catalogTitle}</h1>`), `${expected.sku}: h1 identity`);
    assert.ok(html.includes(`href="/catalog/brand/${expected.brandSlug}/"`), expected.sku);
    assert.match(html, />Отправить шильдик для подбора<\/a>/);
    for (const href of resources) assert.ok(html.includes(`href="${href}"`), `${expected.sku}: ${href}`);
  }
});

test("changed pump product pages publish their navigation revision date", { skip: !generatedPagesReady }, () => {
  const sitemap = fs.readFileSync("dist/public/sitemap-products.xml", "utf8");
  for (const expected of promotedPumps) {
    const product = pumps.find((item) => item.sku === expected.sku);
    assert.ok(product, expected.sku);
    assert.ok(
      sitemap.includes(
        `<loc>https://acahydraulic.kz/catalog/${product.handle}/</loc>\n    <lastmod>${catalogContentRevisions.sitewideSeo.modifiedDate}</lastmod>`,
      ),
      expected.sku,
    );
  }
});

test("catalog publication revisions cover Hydrauvision and corrected product cards", { skip: !generatedPagesReady }, () => {
  const sitemap = fs.readFileSync("dist/public/sitemap-products.xml", "utf8");
  const byId = new Map(publicIndex.map((product) => [String(product.id), product]));
  const expected = [
    ...pumps.map((product) => ({
      ...product,
      modifiedDate: [catalogContentRevisions.hydrauvisionProducts.modifiedDate, catalogContentRevisions.sitewideSeo.modifiedDate].sort().at(-1),
    })),
    ...Object.keys(categoryCorrectionLedger.corrections).map((id) => ({
      ...byId.get(String(id)),
      modifiedDate: [catalogContentRevisions.categoryCorrections.modifiedDate, catalogContentRevisions.sitewideSeo.modifiedDate].sort().at(-1),
    })),
  ];

  assert.equal(pumps.length, 105);
  assert.equal(Object.keys(categoryCorrectionLedger.corrections).length, 41);
  for (const product of expected) {
    assert.ok(product?.handle, product?.id);
    assert.ok(
      sitemap.includes(
        `<loc>https://acahydraulic.kz/catalog/${product.handle}/</loc>\n    <lastmod>${product.modifiedDate}</lastmod>`,
      ),
      product.handle,
    );
  }
});

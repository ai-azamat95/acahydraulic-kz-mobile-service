import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import categoryGuides from "../shared/catalog-selection-guides.json" with { type: "json" };
import brandGuides from "../shared/catalog-brand-selection-guides.json" with { type: "json" };
import pumps from "../shared/catalog-hydrauvision-products.json" with { type: "json" };
import catSale from "../shared/cat-432e-sale.json" with { type: "json" };
import xcmgSale from "../shared/xcmg-xz200-pump-sale.json" with { type: "json" };

const readPage = route =>
  fs.readFileSync(`dist/public${route}index.html`, "utf8");
const resources = [
  "/blog/zapchasti-po-nomeru-i-shildiku/",
  "/blog/remont-ili-zamena-gidronasosa/",
  "/cases/sany-sy365h-zamena-gidronasosa-video/",
];
const promotedPumps = {
  rexroth: {
    sku: "R901147104",
    brand: "Bosch Rexroth",
    category: "gear-pumps",
  },
  danfoss: { sku: "83073386", brand: "Danfoss", category: "piston-pumps" },
};

test("home, pump category and existing brand pages link the selection resources in initial HTML", () => {
  const routes = [
    "/",
    "/catalog/category/hydraulic-pumps/",
    "/catalog/brand/rexroth/",
    "/catalog/brand/danfoss/",
  ];
  for (const route of routes) {
    const html = readPage(route);
    for (const href of resources)
      assert.ok(html.includes(`href="${href}"`), `${route} -> ${href}`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
    const canonicals = [
      ...html.matchAll(/<link\b(?=[^>]*rel="canonical")[^>]*>/g),
    ];
    assert.equal(canonicals.length, 1, route);
    assert.ok(
      canonicals[0][0].includes(`href="https://acahydraulic.kz${route}"`),
      route
    );
    assert.doesNotMatch(
      html,
      /<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*noindex)[^>]*>/i,
      route
    );
  }
  for (const href of resources)
    assert.ok(fs.existsSync(`dist/public${href}index.html`), href);
});

test("prominent examples are existing pumps with exact identities, not hydraulic motors", () => {
  assert.deepEqual(Object.keys(brandGuides).sort(), ["danfoss", "rexroth"]);
  const pumpHtml = readPage("/catalog/category/hydraulic-pumps/");
  const pumpGuide = pumpHtml.match(
    /<section data-catalog-selection-guide>[\s\S]*?<\/section>/
  )?.[0];
  assert.ok(pumpGuide);
  for (const [slug, expected] of Object.entries(promotedPumps)) {
    const product = pumps.find(item => item.sku === expected.sku);
    assert.ok(product, expected.sku);
    assert.equal(product.brand, expected.brand);
    assert.equal(product.category, expected.category);
    assert.ok(product.categories.includes("hydraulic-pumps"));
    assert.ok(!product.categories.includes("hydraulic-motors"));
    const href = `/catalog/${product.handle}/`;
    assert.ok(
      categoryGuides["hydraulic-pumps"].links.some(link => link.href === href)
    );
    assert.ok(brandGuides[slug].links.some(link => link.href === href));
    assert.ok(pumpGuide.includes(`href="${href}"`));
    const brandHtml = readPage(`/catalog/brand/${slug}/`);
    const guide = brandHtml.match(
      /<section data-catalog-selection-guide>[\s\S]*?<\/section>/
    )?.[0];
    assert.ok(guide?.includes(`href="${href}"`), slug);
    assert.ok(
      brandHtml.indexOf("data-catalog-selection-guide") <
        brandHtml.indexOf("<h2>Товары раздела</h2>"),
      slug
    );
    assert.ok(fs.existsSync(`dist/public${href}index.html`), href);
  }
});

test("brand context distinguishes the ACA process case and adds no commercial promises", () => {
  for (const guide of Object.values(brandGuides)) {
    assert.match(guide.text, /SANY SY365H.*ACA Hydraulic.*K5V160DT/);
    assert.match(guide.text, /не подтверждает установку или совместимость/);
    assert.doesNotMatch(
      JSON.stringify(guide),
      /₸|priceKzt|в наличии|гарантия \d|доставка за \d/i
    );
    for (const href of resources)
      assert.ok(guide.links.some(link => link.href === href));
    assert.equal(
      new Set(guide.links.map(link => link.href)).size,
      guide.links.length
    );
  }
  const lib = fs.readFileSync("client/src/lib/catalogLandings.ts", "utf8");
  const ui = fs.readFileSync("client/src/pages/Catalog.tsx", "utf8");
  const staticRenderer = fs.readFileSync(
    "scripts/create-catalog-landing-routes.mjs",
    "utf8"
  );
  assert.ok(lib.includes("@shared/catalog-brand-selection-guides.json"));
  assert.ok(ui.includes("brandSelectionGuide(routeBrand?.slug)"));
  assert.ok(
    staticRenderer.includes("shared/catalog-brand-selection-guides.json")
  );
});

test("existing case-product links and product WhatsApp context remain intact", () => {
  for (const sale of [catSale, xcmgSale]) {
    const caseHtml = readPage(`${sale.casePath}/`);
    const productHtml = readPage(`/catalog/${sale.handle}/`);
    assert.ok(caseHtml.includes(`/catalog/${sale.handle}/`), sale.handle);
    assert.ok(productHtml.includes(sale.casePath), sale.casePath);
  }
  assert.match(
    readPage(`${catSale.casePath}/`),
    /установка и замеры после замены в этот кейс не включены/
  );
  const productUi = fs.readFileSync(
    "client/src/pages/CatalogProduct.tsx",
    "utf8"
  );
  assert.ok(productUi.includes("product.catalogTitle || product.title"));
  assert.ok(productUi.includes("Ссылка: ${window.location.href}"));
  assert.ok(productUi.includes("encodeURIComponent(message)"));
});

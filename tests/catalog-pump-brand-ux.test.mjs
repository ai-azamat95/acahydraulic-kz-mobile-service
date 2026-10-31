import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import publicIndex from "../client/public/catalog-data/search-index.json" with { type: "json" };
import landingData from "../shared/catalog-landings.json" with { type: "json" };
import highlights from "../shared/catalog-pump-brand-highlights.json" with { type: "json" };
import pumps from "../shared/catalog-hydrauvision-products.json" with { type: "json" };
import categoryCorrectionLedger from "../shared/catalog-category-corrections.json" with { type: "json" };
import catalogContentRevisions from "../shared/catalog-content-revisions.json" with { type: "json" };

const expected = {
  rexroth: [
    ["8705189118114", "R901147104", "Bosch Rexroth"],
    ["ACA-PUMP-1777", "R902257980", "Bosch Rexroth"],
    ["ACA-PUMP-1791", "R902233773", "Bosch Rexroth"],
  ],
  danfoss: [
    ["ACA-PUMP-1526", "83025677", "Danfoss"],
    ["ACA-PUMP-1530", "83067514", "Danfoss"],
    ["ACA-PUMP-1610", "83073386", "Danfoss"],
  ],
};

const readPage = route =>
  fs.readFileSync(`dist/public${route}index.html`, "utf8");

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const productBrandSlugs = product => {
  const text = `${product.title} ${product.fitment || ""} ${(product.tags || []).join(" ")}`;
  return landingData.brands
    .filter(brand =>
      brand.aliases.some(alias =>
        new RegExp(
          `(^|[^a-z0-9])${escapeRegExp(alias)}([^a-z0-9]|$)`,
          "i"
        ).test(text)
      )
    )
    .map(brand => brand.slug);
};

const routeResults = href => {
  const url = new URL(href, "https://acahydraulic.kz");
  const categoryRoute = url.pathname.match(/^\/catalog\/category\/([^/]+)\/$/);
  const brandRoute = url.pathname.match(/^\/catalog\/brand\/([^/]+)\/$/);
  let results;

  if (categoryRoute) {
    results = publicIndex.filter(product =>
      (product.categories || [product.category]).includes(categoryRoute[1])
    );
  } else if (brandRoute) {
    results = publicIndex.filter(product =>
      productBrandSlugs(product).includes(brandRoute[1])
    );
  } else {
    assert.fail(`Unsupported catalog route in brand navigation: ${href}`);
  }

  const category = url.searchParams.get("category");
  return category
    ? results.filter(product =>
        (product.categories || [product.category]).includes(category)
      )
    : results;
};

test("brand highlights use six exact pump records and keep non-pump access separate", () => {
  assert.deepEqual(Object.keys(highlights).sort(), ["danfoss", "rexroth"]);
  assert.doesNotMatch(
    JSON.stringify(highlights),
    /minPriceKzt|maxPriceKzt|priceKzt/
  );
  for (const [slug, identities] of Object.entries(expected)) {
    const highlight = highlights[slug];
    assert.equal(highlight.modifiedDate, "2026-10-17", slug);
    const pumpUrl = new URL(highlight.pumpHref, "https://acahydraulic.kz");
    const pumpResults = routeResults(highlight.pumpHref);
    assert.equal(pumpUrl.pathname, `/catalog/brand/${slug}/`);
    assert.equal(pumpUrl.searchParams.get("category"), "hydraulic-pumps");
    assert.ok(pumpResults.length > 0, highlight.pumpHref);
    assert.ok(
      pumpResults.every(product =>
        (product.categories || [product.category]).includes("hydraulic-pumps")
      ),
      `${highlight.pumpHref} must contain only hydraulic pumps`
    );
    assert.ok(
      pumpResults.every(
        product =>
          !(product.categories || [product.category]).includes(
            "hydraulic-motors"
          )
      ),
      `${highlight.pumpHref} must exclude hydraulic motors`
    );
    assert.equal(highlight.featuredPumps.length, 3, slug);
    assert.deepEqual(
      highlight.featuredPumps.map(item => [item.id, item.sku]),
      identities.map(([id, sku]) => [id, sku])
    );
    for (const [id, sku, brand] of identities) {
      const source = pumps.find(product => product.id === id);
      const featured = highlight.featuredPumps.find(
        product => product.id === id
      );
      assert.ok(source, id);
      assert.ok(featured, id);
      assert.equal(source.sku, sku);
      assert.equal(source.brand, brand);
      assert.ok(source.categories.includes("hydraulic-pumps"), id);
      assert.ok(!source.categories.includes("hydraulic-motors"), id);
      assert.equal(featured.href, `/catalog/${source.handle}/`);
      assert.equal(featured.imageUrl, source.imageUrl);
      assert.match(featured.title, new RegExp(sku.replaceAll(".", "\\.")));
    }
    for (const item of highlight.relatedCatalog) {
      assert.ok(routeResults(item.href).length > 0, item.href);
    }
  }
  assert.deepEqual(highlights.rexroth.relatedCatalog, [
    { href: "/catalog/category/hydraulic-motors/", label: "Все гидромоторы" },
    {
      href: "/catalog/category/pump-parts/",
      label: "Комплектующие гидронасосов",
    },
  ]);
  assert.equal(
    highlights.danfoss.relatedCatalog[0].href,
    "/catalog/brand/danfoss/?category=hydraulic-motors"
  );
  assert.deepEqual(highlights.danfoss.relatedCatalog[1], {
    href: "/catalog/category/pump-parts/",
    label: "Комплектующие гидронасосов",
  });
});

test("home and hydraulic-pump landing expose prominent existing brand routes", () => {
  for (const [route, source] of [
    ["/", "home"],
    ["/catalog/category/hydraulic-pumps/", "hydraulic-pumps"],
  ]) {
    const html = readPage(route);
    const navigation = html.match(
      new RegExp(
        `<section[^>]*data-pump-brand-navigation="${source}"[\\s\\S]*?</section>`
      )
    )?.[0];
    assert.ok(navigation, route);
    for (const highlight of Object.values(highlights)) {
      assert.ok(
        navigation.includes(
          `href="${highlight.pumpHref.replaceAll("&", "&amp;")}"`
        ) || navigation.includes(`href="${highlight.pumpHref}"`),
        `${route} -> ${highlight.pumpHref}`
      );
      assert.ok(
        navigation.includes(highlight.navigationTitle),
        highlight.navigationTitle
      );
    }
  }
});

test("brand landing puts three pumps and nameplate CTA before the full product list", () => {
  for (const [slug, highlight] of Object.entries(highlights)) {
    const html = readPage(`/catalog/brand/${slug}/`);
    const start = html.indexOf(`data-brand-pump-showcase="${slug}"`);
    const productList = html.indexOf("<h2>Товары раздела</h2>");
    assert.ok(start >= 0, slug);
    assert.ok(productList > start, slug);
    const showcase = html.slice(start, productList);
    assert.ok(showcase.includes("Отправить шильдик для подбора"), slug);
    assert.ok(
      showcase.includes(
        encodeURIComponent(`https://acahydraulic.kz${highlight.pumpHref}`)
      ),
      `${slug} WhatsApp message -> ${highlight.pumpHref}`
    );
    for (const pump of highlight.featuredPumps) {
      assert.ok(
        showcase.includes(`data-featured-pump-id="${pump.id}"`),
        pump.id
      );
      assert.ok(showcase.includes(`href="${pump.href}"`), pump.href);
    }
    for (const item of highlight.relatedCatalog)
      assert.ok(
        showcase.includes(`href="${item.href.replaceAll("&", "&amp;")}"`) ||
          showcase.includes(`href="${item.href}"`),
        item.href
      );
  }
});

test("changed pump landing pages publish their actual content revision date", () => {
  const sitemap = fs.readFileSync(
    "dist/public/sitemap-catalog-landings.xml",
    "utf8",
  );
  for (const [route, modifiedDate] of [
    ["/catalog/category/hydraulic-pumps/", catalogContentRevisions.sitewideSeo.modifiedDate],
    ["/catalog/brand/rexroth/", catalogContentRevisions.sitewideSeo.modifiedDate],
    ["/catalog/brand/danfoss/", catalogContentRevisions.sitewideSeo.modifiedDate],
  ]) {
    assert.match(
      sitemap,
      new RegExp(
        `<loc>https://acahydraulic\\.kz${escapeRegExp(route)}</loc><lastmod>${modifiedDate}</lastmod>`,
      ),
      route,
    );
  }
});

test("catalog publication revisions cover affected category and brand landings", () => {
  const sitemap = fs.readFileSync(
    "dist/public/sitemap-catalog-landings.xml",
    "utf8",
  );
  const hydrauvisionCategories = new Set(
    pumps.flatMap((product) => product.categories || [product.category]),
  );
  const hydrauvisionBrands = new Set(pumps.flatMap(productBrandSlugs));
  const correctedCategories = new Set(
    Object.values(categoryCorrectionLedger.corrections).flatMap((correction) => [
      correction.previousCategory,
      ...(correction.categories || [correction.category]),
    ]),
  );

  assert.deepEqual(
    [...hydrauvisionCategories].sort(),
    ["gear-pumps", "hydraulic-pumps", "piston-pumps"],
  );
  assert.deepEqual(
    [...hydrauvisionBrands].sort(),
    ["daikin", "danfoss", "denison", "eaton", "parker", "rexroth", "von-roll"],
  );
  assert.equal(correctedCategories.size, 10);

  for (const category of hydrauvisionCategories) {
    const modifiedDate = [
      catalogContentRevisions.hydrauvisionProducts.modifiedDate,
      correctedCategories.has(category) ? catalogContentRevisions.categoryCorrections.modifiedDate : undefined,
      catalogContentRevisions.sitewideSeo.modifiedDate,
    ].filter(Boolean).sort().at(-1);
    assert.match(
      sitemap,
      new RegExp(`<loc>https://acahydraulic\\.kz/catalog/category/${category}/</loc><lastmod>${modifiedDate}</lastmod>`),
      category,
    );
  }
  for (const brand of hydrauvisionBrands) {
    assert.match(
      sitemap,
      new RegExp(`<loc>https://acahydraulic\\.kz/catalog/brand/${brand}/</loc><lastmod>${catalogContentRevisions.sitewideSeo.modifiedDate}</lastmod>`),
      brand,
    );
  }
  for (const category of correctedCategories) {
    assert.match(
      sitemap,
      new RegExp(`<loc>https://acahydraulic\\.kz/catalog/category/${category}/</loc><lastmod>${catalogContentRevisions.sitewideSeo.modifiedDate}</lastmod>`),
      category,
    );
  }
});

test("React keeps query categories subordinate to the brand route", () => {
  const source = fs.readFileSync("client/src/pages/Catalog.tsx", "utf8");
  assert.match(
    source,
    /const searchCategory = categoryFromSearch\(urlSearch\);/
  );
  assert.match(source, /routeModel\?\.label, searchCategory\]\);/);
  assert.match(
    source,
    /catalogBrandFilterHref\(routeBrand\.slug, partQuery, nextCategory\)/
  );
  assert.match(
    source,
    /routeBrand \? catalogBrandFilterHref\(routeBrand\.slug, partQuery, item\.id\) : catalogSearchHref/
  );
  assert.match(
    source,
    /const landingCategoryId = routeCategory \|\| \(!routeBrand && !routeModel \? category : ""\);/
  );
  assert.match(
    source,
    /catalogCategoryLandings\.find\(\(item\) => item\.id === landingCategoryId\)/
  );
});

test("brand pump cards avoid the legacy light catalogue article override", () => {
  const showcase = fs.readFileSync(
    "client/src/components/catalog/BrandPumpShowcase.tsx",
    "utf8",
  );
  const mobileStyles = fs.readFileSync("client/src/catalog-mobile.css", "utf8");

  assert.match(mobileStyles, /article\.group\{background:#fff!important/);
  assert.match(
    mobileStyles,
    /section\[aria-labelledby="categories-title"\] \.aca-pump-brand-heading\{color:#fff!important\}/,
  );
  assert.match(showcase, /className="group\/pump /);
  assert.doesNotMatch(showcase, /className="group /);
});

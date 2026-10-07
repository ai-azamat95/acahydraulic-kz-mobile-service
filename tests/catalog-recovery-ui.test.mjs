import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main = fs.readFileSync("client/src/main.tsx", "utf8");
const boundary = fs.readFileSync(
  "client/src/components/ErrorBoundary.tsx",
  "utf8"
);
const hook = fs.readFileSync("client/src/hooks/useCatalogProducts.ts", "utf8");
const productPage = fs.readFileSync(
  "client/src/pages/CatalogProduct.tsx",
  "utf8"
);

test("stale Vite chunks have guarded reload recovery and a user-safe fallback", () => {
  assert.match(main, /installVitePreloadRecovery\(\)/);
  assert.match(boundary, /Сайт обновился, а во вкладке осталась старая версия/);
  assert.match(boundary, /Обновить страницу/);
  assert.doesNotMatch(boundary, /error\?\.stack/);
});

test("catalog product data failures can be retried without losing the route", () => {
  assert.match(hook, /"not-found" \| "load-failed" \| null/);
  assert.match(hook, /retry: \(\) => setAttempt/);
  assert.match(
    productPage,
    /error === "load-failed" \? copy\.loadError : copy\.noResults/
  );
  assert.match(productPage, /Повторить загрузку/);
});

test("catalog product routes revalidate owner data after a deployment", () => {
  assert.match(
    hook,
    /const catalogDataVersion = manifest\.dataVersion \|\| manifest\.importedAt/
  );
  assert.match(
    hook,
    /product-map\.json", catalogDataVersion\),\s*controller\.signal,\s*"no-cache"/s
  );
  assert.match(
    hook,
    /products-\$\{String\(chunk\)\.padStart\(3, "0"\)\}\.json`,\s*catalogDataVersion,\s*\),\s*controller\.signal,\s*"no-cache"/s
  );
});

test("catalog index cache is invalidated when curated data changes without a source reimport", () => {
  assert.match(hook, /dataVersion\?: string/);
  assert.match(hook, /categorySummaryFile\}`, catalogDataVersion/);
  assert.match(hook, /indexFile\}`, catalogDataVersion/);
  assert.match(main, /manifest\.dataVersion \|\| manifest\.importedAt/);
});

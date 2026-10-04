import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const draft = JSON.parse(fs.readFileSync("shared/merchant-engine-draft.json", "utf8"));

test("Merchant engine draft preserves confirmed commercial terms without fabricating a date", () => {
  assert.equal(draft.product.price, "12860000 KZT");
  assert.equal(draft.product.availability, "backorder");
  assert.equal(draft.product.availability_date, null);
  assert.equal(draft.product.shipping.country, "KZ");
  assert.equal(draft.product.shipping.price, "0 KZT");
  assert.equal(draft.product.mpn, "NTA855-C360S10");
  assert.equal(draft.product.brand, "Cummins");
  assert.equal(draft.product.gtin, undefined);
  assert.deepEqual(draft.expectedWaitDays, { min: 3, max: 14 });
  assert.equal(draft.publicationStatus, "awaiting_availability_date");
});

test("engine draft is not silently injected into the active pump feed", () => {
  const feed = JSON.parse(fs.readFileSync("shared/merchant-pumps.json", "utf8"));
  assert(!feed.products.some(product => product.id === draft.product.id));
});

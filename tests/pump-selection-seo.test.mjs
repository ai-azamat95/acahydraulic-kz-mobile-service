import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("pump category qualifies orders and links the verified sale cases", () => {
  const html = fs.readFileSync("dist/public/catalog/category/hydraulic-pumps/index.html", "utf8");
  assert.match(html, /купить гидравлический насос под заказ/);
  assert.match(html, /полный индекс исполнения/);
  assert.match(html, /направление вращения/);
  assert.match(html, /установка и запуск рассчитываются отдельно/);
  for (const slug of ["cat-432e-postavka-gidronasosa-267-2755", "xcmg-xz200-ustanovka-gidronasosa-803001730"]) {
    assert.ok(html.includes(`href="/cases/${slug}/"`));
    assert.ok(fs.existsSync(`dist/public/cases/${slug}/index.html`), `${slug} must resolve in this build`);
  }
  assert.match(html, /CAT 432E: продажа насоса 267-2755/);
  assert.match(html, /XCMG XZ200: поставка и установка насоса 803001730/);
});

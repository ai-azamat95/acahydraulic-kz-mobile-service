import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const collections = JSON.parse(
  fs.readFileSync("shared/brand-repair-videos.json", "utf8")
);
const brands = ["hitachi", "hyundai", "komatsu", "wirtgen", "cat"];
const readBrand = brand =>
  fs.readFileSync(`dist/public/brands/${brand}/index.html`, "utf8");
const escapeHtml = text =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
const watchUrl = video =>
  video.platform === "youtube"
    ? `https://www.youtube.com/watch?v=${video.id}`
    : `https://www.tiktok.com/@acaservice01/video/${video.id}`;
const gallery = (html, brand) => {
  const section = html.match(
    new RegExp(
      `<section\\b[^>]*data-brand-videos="${brand}"[^>]*>[\\s\\S]*?<\\/section>`
    )
  );
  assert.ok(section, `rendered video section for ${brand}`);
  return section[0];
};

test("five brand pages expose named repair videos and direct source links without JavaScript", () => {
  assert.deepEqual(Object.keys(collections).sort(), [...brands].sort());
  for (const brand of brands) {
    const collection = collections[brand];
    const html = gallery(readBrand(brand), brand);
    assert.ok(
      html
        .replace(/<!--[\s\S]*?-->/g, "")
        .includes(`Видео ремонта ${collection.name}`),
      `${brand}: visible gallery heading`
    );
    assert.equal(
      (html.match(/<ol\b/g) || []).length,
      1,
      `${brand}: video list`
    );
    for (const video of collection.videos) {
      assert.ok(
        html.includes(escapeHtml(video.title)),
        `${brand}: ${video.title}`
      );
      assert.ok(
        html.includes(escapeHtml(video.description)),
        `${brand}: explanatory description`
      );
      assert.ok(
        html.includes(`href="${watchUrl(video)}"`),
        `${brand}: direct source URL for ${video.id}`
      );
    }
    assert.ok(
      html.includes('href="/services/mobile-repair/"'),
      `${brand}: next step to diagnostics`
    );
  }
});

test("repair galleries keep Hitachi source and distinct Hyundai models attached to the correct videos", () => {
  const hitachi = gallery(readBrand("hitachi"), "hitachi");
  assert.ok(
    hitachi.includes(
      "https://www.tiktok.com/@acaservice01/video/7529938314011380997"
    )
  );
  assert.ok(hitachi.includes("Hitachi 330-5G"));

  const hyundaiVideos = collections.hyundai.videos;
  const hx300Ids = ["EmwYLJDrsh8", "hTdVBbP4r_s", "okwuAcykkzs", "kEzSzcbIdA8"];
  for (const id of hx300Ids) {
    const video = hyundaiVideos.find(video => video.id === id);
    assert.ok(video, `verified Hyundai HX300SL source ${id}`);
    assert.equal(video.platform, "youtube");
    assert.match(video.title, /Hyundai HX300SL/);
    assert.doesNotMatch(`${video.title} ${video.description}`, /R300LC-9S/);
  }
  const r300 = hyundaiVideos.find(video => video.id === "7548854684765687045");
  assert.ok(r300, "existing Hyundai R300LC-9S repair is preserved");
  assert.equal(r300.platform, "tiktok");
  assert.match(r300.title, /Hyundai R300LC-9S/);
  assert.doesNotMatch(`${r300.title} ${r300.description}`, /HX300SL/);
});

test("repair galleries link to existing case and blog explanations before JavaScript", () => {
  const expected = [
    ["hitachi", "/cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami/"],
    ["wirtgen", "/blog/remont-gidravliki-frezy-wirtgen-1500/"],
    ["cat", "/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu/"],
  ];
  for (const [brand, href] of expected) {
    const html = gallery(readBrand(brand), brand);
    assert.ok(
      html.includes(`href="${href}"`),
      `${brand}: useful related explanation`
    );
    assert.ok(
      fs.existsSync(path.join("dist/public", href, "index.html")),
      `generated target exists: ${href}`
    );
  }
});

test("brand video players make no iframe request until a visitor opens a player", () => {
  for (const brand of brands) {
    const html = gallery(readBrand(brand), brand);
    assert.doesNotMatch(
      html,
      /<iframe\b/i,
      `${brand}: no initial player iframe`
    );
    assert.doesNotMatch(
      html,
      /(?:src|srcset)="[^"<>]*(?:youtube(?:-nocookie)?\.com|youtu\.be|tiktok\.com)/i,
      `${brand}: no initial third-party video asset`
    );
    assert.match(
      html,
      /<button\b[^>]*aria-label="Смотреть на странице:/,
      `${brand}: visitor can open the player`
    );
  }
});

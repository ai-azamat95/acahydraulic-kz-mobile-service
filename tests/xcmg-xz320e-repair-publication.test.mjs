import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import repair from "../shared/xcmg-xz320e-repair-case.json" with { type: "json" };

const output = "dist/public";
const canonical = `https://acahydraulic.kz${repair.casePath}/`;
const read = route => fs.readFileSync(path.join(output, route, "index.html"), "utf8");
const nodes = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
  .flatMap(([, json]) => {
    const schema = JSON.parse(json);
    return Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
  });

test("XZ320E repair page renders the real case and primary video without JavaScript", () => {
  const html = read(repair.casePath);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes(repair.title));
  assert.ok(html.includes(repair.summary));
  assert.ok(html.includes(repair.scopeNote));
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`href="${canonical}"`));
  assert.doesNotMatch(html, /noindex|803001730|1 350 000/);
  assert.doesNotMatch(html, /итогового испытания под нагрузкой в кейсе нет/);
  for (const detail of ["гидробак", "подпитывающий насос", "400-й расширитель"]) {
    assert.ok(html.includes(detail), `missing confirmed repair detail: ${detail}`);
  }

  const videos = [...html.matchAll(/<video\b[^>]*>/g)];
  assert.equal(videos.length, 1);
  assert.match(videos[0][0], /controls/);
  assert.match(videos[0][0], /playsinline/i);
  assert.match(videos[0][0], /preload="none"/);
  assert.doesNotMatch(videos[0][0], /autoplay/i);
  assert.ok(videos[0][0].includes(`poster="${repair.video.poster}"`));
  assert.ok(html.includes(`src="${repair.video.src}"`));
  assert.ok(html.includes(`property="og:image" content="https://acahydraulic.kz${repair.ogImage}"`));
  assert.ok(html.includes('property="og:image:width" content="1200"'));
  assert.ok(html.includes('property="og:image:height" content="630"'));
  assert.equal(repair.video.src, "/media/xcmg-xz320e-repair/case-film-v2.mp4");
  assert.equal(repair.video.poster, "/media/xcmg-xz320e-repair/case-poster-v2.webp");
  assert.equal(repair.video.duration, "PT1M7S");
  assert.equal(repair.video.seconds, 67);
  assert.ok(!html.includes("/media/xcmg-xz320e-repair/case-film.mp4"));
  assert.ok(videos[0].index < html.indexOf("<h2"), "primary video should precede the detailed case sections");
  for (const photo of repair.gallery) {
    assert.ok(html.includes(`src="${photo.src}"`));
    assert.ok(html.includes(photo.alt));
    assert.ok(html.includes(photo.caption));
  }
});

test("XZ320E Article and VideoObject agree with the visible media and publication date", () => {
  const html = read(repair.casePath);
  const schemas = nodes(html);
  assert.equal(schemas.filter(item => item["@type"] === "Article").length, 1);
  assert.equal(schemas.filter(item => item["@type"] === "VideoObject").length, 1);
  assert.equal(schemas.filter(item => item["@type"] === "Product").length, 0);
  const video = schemas.find(item => item["@type"] === "VideoObject");
  assert.equal(video.contentUrl, `https://acahydraulic.kz${repair.video.src}`);
  assert.deepEqual(video.thumbnailUrl, [`https://acahydraulic.kz${repair.video.poster}`]);
  assert.equal(video.mainEntityOfPage, canonical);
  assert.equal(video.uploadDate, repair.video.uploadDate);
  assert.match(video.uploadDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+]05:00$/);
  if (repair.video.duration) assert.equal(video.duration, repair.video.duration);
  const article = schemas.find(item => item["@type"] === "Article");
  assert.equal(article.datePublished, repair.publishedOn);
  assert.equal(article.dateModified, repair.modifiedOn);
});

test("XZ320E repair is reachable from cases, GNB service and both sitemaps", () => {
  for (const route of ["cases", "services/gnb-repair", "sitemap"]) {
    assert.ok(read(route).includes(`href="${repair.casePath}/"`), `missing case discovery on ${route}`);
  }
  const caseMap = fs.readFileSync(path.join(output, "sitemap-cases.xml"), "utf8");
  const videoMap = fs.readFileSync(path.join(output, "sitemap-videos.xml"), "utf8");
  assert.ok(caseMap.includes(`<loc>${canonical}</loc>`));
  const entry = [...videoMap.matchAll(/<url>[\s\S]*?<\/url>/g)]
    .map(match => match[0]).find(item => item.includes(`<loc>${canonical}</loc>`));
  assert.ok(entry, "missing XZ320E video sitemap entry");
  assert.ok(entry.includes(`<video:content_loc>https://acahydraulic.kz${repair.video.src}</video:content_loc>`));
  assert.ok(entry.includes(`<video:thumbnail_loc>https://acahydraulic.kz${repair.video.poster}</video:thumbnail_loc>`));
  assert.ok(entry.includes(`<video:publication_date>${repair.video.uploadDate}</video:publication_date>`));
  if (repair.video.seconds) assert.ok(entry.includes(`<video:duration>${repair.video.seconds}</video:duration>`));
});

test("XZ320E inquiry requests useful machine details and all published media files exist", () => {
  const html = read(repair.casePath);
  for (const route of ["/services/gnb-repair/", "/catalog/category/hydraulic-pumps/", "/blog/zapchasti-po-nomeru-i-shildiku/"]) {
    assert.ok(html.includes(`href="${route}"`), `missing contextual link: ${route}`);
  }
  const contact = html.match(/href="(https:\/\/wa\.me\/77714177925\?text=[^"]+)"/);
  assert.ok(contact);
  const message = new URL(contact[1]).searchParams.get("text");
  for (const detail of ["Модель и серийный номер", "Что не работает", "местоположение техники", "фото шильдика", canonical]) {
    assert.ok(message.includes(detail), `missing inquiry detail: ${detail}`);
  }
  for (const media of [repair.video.src, repair.video.poster, repair.ogImage, ...repair.gallery.map(photo => photo.src)]) {
    assert.ok(fs.statSync(path.join(output, media)).size > 1000, `missing or empty media: ${media}`);
  }
});

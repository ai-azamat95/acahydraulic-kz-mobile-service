import fs from 'node:fs';
import path from 'node:path';
import { catalogProductName } from '../shared/catalog-product-seo.mjs';
import { groupCatalogModels } from '../shared/catalog-directory.mjs';

import {
  catalogBrandLandings,
  catalogCategoryLandings,
  extractBrandSlugs,
  extractModelLandings,
  landingSearchText,
} from './lib/catalog-landings.mjs';

const outDir = path.resolve('dist/public');
const indexPath = path.join(outDir, 'index.html');
const catalogDir = path.join(outDir, 'catalog-data');
const manifestPath = path.join(catalogDir, 'manifest.json');
const baseUrl = 'https://acahydraulic.kz';
const minimumModelProducts = 8;

if (!fs.existsSync(indexPath) || !fs.existsSync(manifestPath)) {
  throw new Error('Build output or catalog data is missing. Run the catalog sync and build first.');
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const products = Array.from({ length: manifest.chunkCount }, (_, index) => {
  const file = path.join(catalogDir, `search-index-${String(index + 1).padStart(3, '0')}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}).flat();
const lastmod = String(manifest.importedAt || new Date().toISOString()).slice(0, 10);
const categorySeoContent = JSON.parse(fs.readFileSync(path.resolve('shared/catalog-seo-content.json'), 'utf8'));
const categorySelectionGuides = JSON.parse(fs.readFileSync(path.resolve('shared/catalog-selection-guides.json'), 'utf8'));
const legacyRedirects = JSON.parse(fs.readFileSync(path.resolve('shared/legacy-redirects.json'), 'utf8'));
const catalogRedirects = Object.fromEntries(Object.entries(legacyRedirects).filter(([from]) => from.startsWith('/catalog/')));
const publishedProductPaths = new Set(products.map((product) => `/catalog/${product.handle}/`));

function escapeAttr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function setTag(html, regex, replacement) {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace('</head>', `${replacement}\n</head>`);
}

function setRootFallback(html, fallback) {
  const replacement = `<div id="root">${fallback}</div>`;
  if (html.includes('<div id="root"></div>')) return html.replace('<div id="root"></div>', replacement);
  const populatedRoot = /<div id="root">[\s\S]*?<\/main><\/div>/;
  if (populatedRoot.test(html)) return html.replace(populatedRoot, replacement);
  throw new Error('Unable to locate the application root for static catalogue landing content.');
}

function relatedLinks(current, type, matches) {
  const categories = catalogCategoryLandings
    .filter((item) => type !== 'category' || item.id !== current)
    .map((item) => ({ ...item, relatedCount: matches.filter((product) => (product.categories || [product.category]).includes(item.id)).length }))
    .filter((item) => item.relatedCount > 0)
    .sort((a, b) => b.relatedCount - a.relatedCount)
    .slice(0, 8);
  const brands = brandPages
    .filter((item) => type !== 'brand' || item.slug !== current)
    .map((item) => ({ ...item, relatedCount: matches.filter((product) => productBrandSlugs.get(product.id).includes(item.slug)).length }))
    .filter((item) => item.relatedCount > 0)
    .sort((a, b) => b.relatedCount - a.relatedCount || b.count - a.count)
    .slice(0, 8);
  const models = modelPages
    .filter((item) => type !== 'model' || item.slug !== current)
    .map((item) => ({ ...item, relatedCount: matches.filter((product) => productModels.get(product.id).some((model) => model.slug === item.slug)).length }))
    .filter((item) => item.relatedCount > 0)
    .sort((a, b) => b.relatedCount - a.relatedCount || b.count - a.count)
    .slice(0, 10);
  return `<section><h2>Другие разделы каталога</h2><p>${categories.map((item) => `<a href="/catalog/category/${item.id}/">${escapeHtml(item.title)}</a>`).join(' · ')}</p>
  <h2>Бренды и модели</h2><p>${brands.map((item) => `<a href="/catalog/brand/${item.slug}/">${escapeHtml(item.name)}</a>`).join(' · ')}</p><p>${models.map((item) => `<a href="/catalog/model/${item.slug}/">${escapeHtml(`${item.brand} ${item.label}`)}</a>`).join(' · ')}</p></section>`;
}

function landingPage({ type, slug, title, description, intro, matches }) {
  const pathName = `/catalog/${type}/${slug}/`;
  const canonical = `${baseUrl}${pathName}`;
  const itemList = matches;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonical,
    inLanguage: 'ru-KZ',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: matches.length,
      itemListElement: itemList.slice(0, 50).map((product, index) => ({
        '@type': 'ListItem', position: index + 1, name: catalogProductName(product), url: `${baseUrl}/catalog/${product.handle}/`,
      })),
    },
  });
  const seo = type === 'category' ? categorySeoContent[slug] : null;
  const guide = type === 'category' ? categorySelectionGuides[slug] : null;
  const decisionGuide = guide ? `<section data-catalog-selection-guide><h2>${escapeHtml(guide.heading)}</h2><details><summary>Проверка перед заказом и полезные ссылки</summary><p>${escapeHtml(guide.text)}</p><nav aria-label="Подбор, диагностика и связанные запчасти"><ul>${guide.links.map(link => `<li><a href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a></li>`).join('')}</ul></nav></details></section>` : '';
  const selectionGuide = seo ? `<section data-category-selection><h2>Как подобрать запчасть без ошибки</h2><p>${escapeHtml(seo.selection)}</p><p>Также ищут: ${seo.queries.map(escapeHtml).join(' · ')}.</p>
  ${slug === 'hydraulic-pumps' ? '<nav aria-label="Подтверждённые кейсы поставки насосов"><a href="/cases/cat-432e-postavka-gidronasosa-267-2755/">CAT 432E: продажа насоса 267-2755</a> · <a href="/cases/xcmg-xz200-ustanovka-gidronasosa-803001730/">XCMG XZ200: поставка и установка насоса 803001730</a></nav>' : ''}
  <h2>Частые вопросы по подбору</h2>
  <details><summary>Какие данные нужны для подбора?</summary><p>${escapeHtml(seo.selection)}</p></details>
  <details><summary>Как подтверждается совместимость?</summary><p>Сопоставляем OEM-номер, модель и серийный номер техники, исполнение и фотографии узла. Совпадение только по внешнему виду не считается подтверждением.</p></details>
  <details><summary>Когда будут известны цена и срок?</summary><p>После проверки номера и комплектации уточняем доступный вариант поставки, актуальную цену и срок. До сверки эти данные не фиксируем.</p></details></section>` : '';
  const fallback = `<main aria-label="${escapeAttr(title)}">
  <nav aria-label="Хлебные крошки"><a href="/">ACA Hydraulic</a> / <a href="/catalog/">Каталог запчастей</a> / ${escapeHtml(title)}</nav>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(intro || description)}</p>
  <p>Найдено позиций: ${matches.length}. Цена, наличие и срок подтверждаются после проверки OEM-номера, модели, серийного номера и исполнения детали.</p>
  ${selectionGuide}
  ${decisionGuide}
  <section><h2>Товары раздела</h2><ul>${itemList.map((product) => `<li><a href="/catalog/${product.handle}/">${escapeHtml(catalogProductName(product))}</a>${product.fitment ? ` — ${escapeHtml(product.fitment)}` : ''}</li>`).join('')}</ul></section>
  ${relatedLinks(slug, type, matches)}
  <p><a href="https://wa.me/77714177925">Запросить подбор в WhatsApp</a></p>
</main>`;

  let html = indexHtml.replace(/<script\b[^>]*\bdata-static-page-schema[^>]*>[\s\S]*?<\/script>/gi, '');
  html = setTag(html, /<title[^>]*>.*?<\/title>/is, `<title>${escapeHtml(title)} | ACA Hydraulic</title>`);
  html = setTag(html, /<meta(?=[^>]*\bname=["']description["'])[^>]*>/i, `<meta name="description" content="${escapeAttr(description)}">`);
  html = html.replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '');
  html = html.replace('</head>', `<link data-rh="true" rel="canonical" href="${canonical}">\n</head>`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i, `<meta property="og:title" content="${escapeAttr(title)} | ACA Hydraulic">`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i, `<meta property="og:description" content="${escapeAttr(description)}">`);
  html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:title["'])[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(`${title} | ACA Hydraulic`)}">`);
  html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:description["'])[^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(description)}">`);
  html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:url["'])[^>]*>/i, `<meta name="twitter:url" content="${escapeAttr(canonical)}">`);
  html = html.replace('</head>', `<script type="application/ld+json" data-static-collection-schema data-rh="true">${schema}</script>\n</head>`);
  html = setRootFallback(html, fallback);
  html = html.replace(/<(title|meta|link)\b([^>]*?)>/gi, (tag, name, attrs) => {
    const managed = name.toLowerCase() === 'title' || /(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["']/i.test(attrs) || /rel=["']canonical["']/i.test(attrs);
    return managed && !/\bdata-rh=/i.test(attrs) ? `<${name} data-rh="true"${attrs}>` : tag;
  });
  return { html, pathName, count: matches.length };
}

const productBrandSlugs = new Map(products.map((product) => [product.id, extractBrandSlugs(landingSearchText(product))]));
const productModels = new Map(products.map((product) => [product.id, extractModelLandings(landingSearchText(product))]));
const brandPages = catalogBrandLandings
  .map((brand) => ({ ...brand, count: products.filter((product) => productBrandSlugs.get(product.id).includes(brand.slug)).length }))
  .filter((brand) => brand.count > 0);
const modelCounts = new Map();
for (const product of products) {
  for (const model of productModels.get(product.id)) {
    const current = modelCounts.get(model.slug) || { ...model, count: 0 };
    current.count += 1;
    modelCounts.set(model.slug, current);
  }
}
const modelPages = [...modelCounts.values()].filter((model) => model.count >= minimumModelProducts).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

// All published model pages must be reachable from the catalogue, not only a top-N list.
// Use the generated set so sparse or unknown models never become broken navigation links.
const catalogHomePath = path.join(outDir, 'catalog/index.html');
const directory = `<section data-catalog-directory><h2 id="catalog-directory-title">Запчасти по брендам и моделям</h2>
<p>Выберите модель, чтобы перейти к связанным позициям. Упоминание модели в каталоге не заменяет проверку OEM-номера, шильдика и исполнения перед заказом.</p>
<nav aria-label="Бренды запчастей">${brandPages.map(brand => `<a href="/catalog/brand/${brand.slug}/">${escapeHtml(brand.name)} · ${brand.count}</a>`).join(' · ')}</nav>
${groupCatalogModels(modelPages).map(group => `<details data-model-brand="${escapeAttr(group.brand)}"><summary>${escapeHtml(group.brand)} · модели: ${group.models.length}</summary><nav aria-label="Модели ${escapeAttr(group.brand)}"><ul>${group.models.map(model => `<li><a href="/catalog/model/${model.slug}/">${escapeHtml(`${model.brand} ${model.label}`)} · ${model.count}</a></li>`).join('')}</ul></nav></details>`).join('')}
</section>`;
const catalogHomeHtml = fs.readFileSync(catalogHomePath, 'utf8').replace(/<section data-catalog-directory>[\s\S]*?<\/section>/g, '');
if (!catalogHomeHtml.includes('</main>')) throw new Error('Catalog home static content is missing. Run create-spa-route-copies first.');
fs.writeFileSync(catalogHomePath, catalogHomeHtml.replace('</main>', `${directory}</main>`));

const pages = [];
for (const category of catalogCategoryLandings) {
  const matches = products.filter((product) => (product.categories || [product.category]).includes(category.id));
  pages.push({ type: 'category', slug: category.id, title: category.title, description: category.description, intro: category.intro, matches });
}
for (const brand of brandPages) {
  pages.push({
    type: 'brand', slug: brand.slug, title: `Запчасти ${brand.name} для спецтехники`,
    description: `Каталог запчастей ${brand.name} для спецтехники. Подбор по OEM-номеру, модели и серийному номеру с проверкой совместимости до оплаты.`,
    intro: `Подбираем запчасти ${brand.name} по каталожному номеру, модели и серийному номеру техники. Сверяем исполнение и комплектацию до подтверждения заказа.`,
    matches: products.filter((product) => productBrandSlugs.get(product.id).includes(brand.slug)),
  });
}
for (const model of modelPages) {
  pages.push({
    type: 'model', slug: model.slug,
    title: `Запчасти для ${model.engine ? 'двигателя' : 'спецтехники'} ${model.brand} ${model.label}`,
    description: `Запчасти для ${model.brand} ${model.label}: поиск по OEM-номеру и узлу, проверка исполнения и совместимости, поставка по Казахстану.`,
    intro: `В каталоге собраны позиции, где прямо указана применяемость к ${model.brand} ${model.label}. Окончательную совместимость подтверждаем по OEM и серийному номеру.`,
    matches: products.filter((product) => productModels.get(product.id).some((item) => item.slug === model.slug)),
  });
}

const written = [];
for (const page of pages) {
  const rendered = landingPage(page);
  const pageDir = path.join(outDir, 'catalog', page.type, page.slug);
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'index.html'), rendered.html);
  written.push(rendered);
}

for (const [from, to] of Object.entries(catalogRedirects)) {
  const destination = path.join(outDir, to.replace(/^\/+/, ''), 'index.html');
  if (!fs.existsSync(destination) && !publishedProductPaths.has(to)) {
    throw new Error(`Catalog redirect destination missing: ${to}`);
  }
  const pageDir = path.join(outDir, from.replace(/^\/+/, ''));
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(
    path.join(pageDir, 'index.html'),
    `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Раздел каталога переехал | ACA Hydraulic</title><meta http-equiv="refresh" content="0;url=${escapeAttr(to)}"><link rel="canonical" href="${baseUrl}${escapeAttr(to)}"></head><body><p>Раздел каталога переехал: <a href="${escapeAttr(to)}">перейти на актуальную страницу</a>.</p></body></html>`,
  );
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written.map((page) => `  <url><loc>${baseUrl}${page.pathName}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${page.pathName.includes('/category/') ? '0.8' : '0.7'}</priority></url>`).join('\n')}
</urlset>\n`;
fs.writeFileSync(path.join(outDir, 'sitemap-catalog-landings.xml'), sitemap);
fs.writeFileSync(path.join(catalogDir, 'landing-pages.json'), JSON.stringify({
  generatedAt: manifest.importedAt,
  categories: catalogCategoryLandings.map((category) => ({ id: category.id, count: pages.find((page) => page.type === 'category' && page.slug === category.id).matches.length })),
  brands: brandPages,
  models: modelPages,
}));
console.log(`Created ${written.length} catalogue landing pages (${catalogCategoryLandings.length} categories, ${brandPages.length} brands, ${modelPages.length} models) and ${Object.keys(catalogRedirects).length} catalog redirects`);

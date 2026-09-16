import fs from 'node:fs';
import path from 'node:path';

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

function relatedLinks(current, type) {
  const categories = catalogCategoryLandings.filter((item) => type !== 'category' || item.id !== current).slice(0, 8);
  const brands = brandPages.filter((item) => type !== 'brand' || item.slug !== current).slice(0, 8);
  const models = modelPages.filter((item) => type !== 'model' || item.slug !== current).slice(0, 10);
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
        '@type': 'ListItem', position: index + 1, name: product.title, url: `${baseUrl}/catalog/${product.handle}/`,
      })),
    },
  });
  const fallback = `<main aria-label="${escapeAttr(title)}">
  <nav aria-label="Хлебные крошки"><a href="/">ACA Hydraulic</a> / <a href="/catalog/">Каталог запчастей</a> / ${escapeHtml(title)}</nav>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(intro || description)}</p>
  <p>Найдено позиций: ${matches.length}. Цена, наличие и срок подтверждаются после проверки OEM-номера, модели, серийного номера и исполнения детали.</p>
  <section><h2>Товары раздела</h2><ul>${itemList.map((product) => `<li><a href="/catalog/${product.handle}/">${escapeHtml(product.title)}</a>${product.fitment ? ` — ${escapeHtml(product.fitment)}` : ''}</li>`).join('')}</ul></section>
  ${relatedLinks(slug, type)}
  <p><a href="https://wa.me/77714177925">Запросить подбор в WhatsApp</a></p>
</main>`;

  let html = indexHtml;
  html = setTag(html, /<title[^>]*>.*?<\/title>/is, `<title>${escapeHtml(title)} | ACA Hydraulic</title>`);
  html = setTag(html, /<meta(?=[^>]*\bname=["']description["'])[^>]*>/i, `<meta name="description" content="${escapeAttr(description)}">`);
  html = html.replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '');
  html = html.replace('</head>', `<link data-rh="true" rel="canonical" href="${canonical}">\n</head>`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i, `<meta property="og:title" content="${escapeAttr(title)} | ACA Hydraulic">`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i, `<meta property="og:description" content="${escapeAttr(description)}">`);
  html = html.replace('</head>', `<script type="application/ld+json" data-static-collection-schema>${schema}</script>\n</head>`);
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
console.log(`Created ${written.length} catalogue landing pages (${catalogCategoryLandings.length} categories, ${brandPages.length} brands, ${modelPages.length} models)`);

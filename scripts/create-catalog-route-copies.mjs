import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist/public');
const indexPath = path.join(outDir, 'index.html');
const catalogDir = path.join(outDir, 'catalog-data');
const manifestPath = path.join(catalogDir, 'manifest.json');
const baseUrl = 'https://acahydraulic.kz';

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
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatPrice(value) {
  return Number.isFinite(value) ? `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Number(value))} ₸` : 'по запросу';
}

function setTag(html, regex, replacement) {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace('</head>', `${replacement}\n</head>`);
}

function setRootFallback(html, fallback) {
  const replacement = `<div id="root">${fallback}</div>`;
  if (html.includes('<div id="root"></div>')) {
    return html.replace('<div id="root"></div>', replacement);
  }

  const populatedRoot = /<div id="root">[\s\S]*?<\/main><\/div>/;
  if (populatedRoot.test(html)) return html.replace(populatedRoot, replacement);
  throw new Error('Unable to locate the application root for static product content.');
}

const merchantPumps = JSON.parse(fs.readFileSync(new URL('../shared/merchant-pumps.json', import.meta.url), 'utf8'));

function productPage(product) {
  const merchantOffer = merchantPumps.products.find(offer => offer.handle === product.handle);
  const canonical = `${baseUrl}/catalog/${product.handle}/`;
  const titleCore = product.title.length > 110 ? `${product.title.slice(0, 107)}...` : product.title;
  const title = `${titleCore} | ACA Hydraulic`;
  const fitment = product.fitment || 'совместимость уточняется по OEM, модели и шильдику техники';
  const fitmentLabel = product.approvedSale ? 'Применяемость этого исполнения' : 'Применяемость';
  const seriesNote = product.approvedSale ? 'Насосы этой серии применяются на технике разных марок. Здесь указано одно из исполнений. Подберём вариант по шильдику, валу, фланцу, портам и регулятору. Одного совпадения модели насоса недостаточно.' : '';
  const price = Number.isFinite(product.minPriceKzt) ? `Цена ${product.approvedSale ? "" : "от "}${formatPrice(product.minPriceKzt)}` : 'Цена по запросу';
  const saleTerms = merchantOffer ? merchantPumps.terms.ru : product.approvedSale ? 'Новый насос в сборе. Поставка под заказ по Казахстану — 3–14 дней. Доставка — от 3 долларов США за кг, оплачивается отдельно. Предоплата 100%. Итоговую стоимость доставки согласуем до оплаты. При браке — замена через сервисный центр.' : '';
  const description = `${product.title}. ${fitmentLabel}: ${fitment}. ${price}. ${saleTerms} Поставка под заказ. Цена и срок после проверки шильдика.`;
  const image = product.imageUrl ? new URL(product.imageUrl, baseUrl).href : undefined;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description,
    image: image ? [image] : undefined,
    sku: product.sku || product.id,
    category: product.category,
    itemCondition: product.approvedSale ? 'https://schema.org/NewCondition' : undefined,
    url: canonical,
    additionalProperty: product.fitment ? [{
      '@type': 'PropertyValue',
      name: fitmentLabel,
      value: product.fitment,
    }] : undefined,
    offers: Number.isFinite(product.minPriceKzt) ? {
      '@type': product.approvedSale ? 'Offer' : 'AggregateOffer',
      price: product.approvedSale ? product.minPriceKzt : undefined,
      priceCurrency: 'KZT',
      availability: merchantOffer ? 'https://schema.org/InStock' : undefined,
      lowPrice: product.approvedSale ? undefined : product.minPriceKzt,
      highPrice: product.approvedSale ? undefined : product.maxPriceKzt ?? product.minPriceKzt,
      url: canonical,
    } : undefined,
  });
  const fallback = `<main aria-label="${escapeAttr(product.title)}">
  <p><a href="/">ACA Hydraulic</a> / <a href="/catalog/">Каталог запчастей</a></p>
  <h1>${escapeHtml(product.title)}</h1>
  <p>${escapeHtml(description)}</p>
  <p><strong>Поставка под заказ. Цену и срок подтвердим после проверки шильдика.</strong></p>
  <h2>${escapeHtml(fitmentLabel)}</h2>
  <p>${escapeHtml(fitment)}</p>
  ${product.catalogTitle ? `<p>${escapeHtml(product.catalogTitle)}</p>` : ""}
  ${seriesNote ? `<p>${escapeHtml(seriesNote)}</p>` : ""}
  <p><strong>${escapeHtml(price)}</strong></p>
  <p>Перед оплатой ACA Hydraulic сверяет номер детали, модель техники, серийный номер, исполнение, разъёмы, вал, фланец и порты.</p>
  <p>Доступны оригинальные, OEM и проверенные аналоговые варианты. Конкретный вариант, наличие, срок доставки и гарантия подтверждаются после проверки.</p>
  <p><a href="https://wa.me/77714177925">Запросить подбор в WhatsApp</a></p>
  ${product.category === 'hydraulic-pumps' ? `<nav aria-label="Статьи перед покупкой насоса"><ul><li><a href="/blog/k3v112dt-kak-podobrat-gidronasos/">Подбор K3V112DT</a></li><li><a href="/blog/remont-ili-zamena-gidronasosa/">Ремонт или замена гидронасоса</a></li><li><a href="/blog/k5v80dtp-handok-hitachi-zx160w/">K5V80DTP и HANDOK</a></li></ul></nav>` : ''}
</main>`;

  let html = indexHtml;
  html = setTag(html, /<title[^>]*>.*?<\/title>/is, `<title>${escapeHtml(title)}</title>`);
  html = setTag(html, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeAttr(description)}">`);
  html = html.replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '');
  html = html.replace('</head>', `<link data-rh="true" rel="canonical" href="${canonical}">\n</head>`);
  html = setTag(html, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  html = setTag(html, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeAttr(title)}">`);
  html = setTag(html, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeAttr(description)}">`);
  if (image) {
    html = setTag(html, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${escapeAttr(image)}">`);
    html = setTag(html, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${escapeAttr(image)}">`);
  }
  html = html.replace('</head>', `<script type="application/ld+json" data-static-product-schema>${schema}</script>\n</head>`);
  html = setRootFallback(html, fallback);
  html = html.replace(/<(title|meta|link)\b([^>]*?)>/gi, (tag, name, attrs) => {
    const managed = name.toLowerCase() === 'title' || /(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["']/i.test(attrs) || /rel=["']canonical["']/i.test(attrs);
    return managed && !/\bdata-rh=/i.test(attrs) ? `<${name} data-rh="true"${attrs}>` : tag;
  });
  return html;
}

for (const product of products) {
  const productDir = path.join(outDir, 'catalog', product.handle);
  fs.mkdirSync(productDir, { recursive: true });
  fs.writeFileSync(path.join(productDir, 'index.html'), productPage(product));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${products.map((product) => `  <url>
    <loc>${baseUrl}/catalog/${product.handle}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>\n`;
fs.writeFileSync(path.join(outDir, 'sitemap-products.xml'), sitemap);
console.log(`Created ${products.length} static catalog routes and sitemap-products.xml`);

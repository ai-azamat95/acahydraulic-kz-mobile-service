import fs from 'node:fs';
import catSale from '../shared/cat-432e-sale.json' with { type: 'json' };
import path from 'node:path';
import { catalogProductSeo, catalogProductCategories, catalogProductSelection } from '../shared/catalog-product-seo.mjs';

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
  const productSeo = catalogProductSeo(product);
  const productCategories = catalogProductCategories(product);
  const title = `${productSeo.title} | ACA Hydraulic`;
  const fitment = product.fitment || 'совместимость уточняется по OEM, модели и шильдику техники';
  const fitmentLabel = product.approvedSale ? 'Применяемость этого исполнения' : 'Применяемость';
  const seriesNote = product.approvedSale ? 'Насосы этой серии применяются на технике разных марок. Здесь указано одно из исполнений. Подберём вариант по шильдику, валу, фланцу, портам и регулятору. Одного совпадения модели насоса недостаточно.' : '';
  const price = Number.isFinite(product.minPriceKzt) ? `Цена ${(product.approvedSale || product.ownerSale) ? "" : "от "}${formatPrice(product.minPriceKzt)}` : 'Цена по запросу';
  const saleTerms = merchantOffer ? merchantPumps.terms.ru : product.approvedSale ? 'Новый насос в сборе. Поставка под заказ по Казахстану — 3–14 дней. Доставка — от 3 долларов США за кг, оплачивается отдельно. Предоплата 100%. Итоговую стоимость доставки согласуем до оплаты. При браке — замена через сервисный центр.' : '';
  const description = productSeo.description;
  const gallery = product.ownerSale?.casePath === catSale.casePath ? catSale.gallery : (product.gallery ?? []);
  const images = [...new Set([product.imageUrl, ...gallery]
    .filter(Boolean)
    .map(value => new URL(value, baseUrl).href))];
  const image = images[0];
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productSeo.name,
    description,
    image: images.length ? images : undefined,
    sku: product.sku || product.id,
    itemCondition: (product.approvedSale || product.ownerSale) ? 'https://schema.org/NewCondition' : undefined,
    url: canonical,
    additionalProperty: product.fitment ? [{
      '@type': 'PropertyValue',
      name: fitmentLabel,
      value: product.fitment,
    }] : undefined,
    offers: Number.isFinite(product.minPriceKzt) ? {
      '@type': (product.approvedSale || product.ownerSale) ? 'Offer' : 'AggregateOffer',
      price: (product.approvedSale || product.ownerSale) ? product.minPriceKzt : undefined,
      priceCurrency: 'KZT',
      shippingDetails: merchantOffer ? {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: merchantPumps.shippingPriceKzt, currency: "KZT" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "KZ" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: merchantPumps.handlingMinDays, maxValue: merchantPumps.handlingMaxDays, unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: merchantPumps.transitMinDays, maxValue: merchantPumps.transitMaxDays, unitCode: "DAY" },
              },
            } : undefined,
      availability: merchantOffer ? 'https://schema.org/InStock' : undefined,
      lowPrice: (product.approvedSale || product.ownerSale) ? undefined : product.minPriceKzt,
      highPrice: (product.approvedSale || product.ownerSale) ? undefined : product.maxPriceKzt ?? product.minPriceKzt,
      url: canonical,
    } : undefined,
  });
  const fallback = `<main aria-label="${escapeAttr(productSeo.name)}">
  <p><a href="/">ACA Hydraulic</a> / <a href="/catalog/">Каталог запчастей</a></p>
  <nav aria-label="Разделы каталога">${productCategories.map(category => `<a href="/catalog/category/${category.id}/">${escapeHtml(category.title)}</a>`).join(' · ')}</nav>
  <h1>${escapeHtml(productSeo.name)}</h1>
  ${productSeo.name !== product.title ? `<p lang="en">${escapeHtml(product.title)}</p>` : ''}
  <p>${escapeHtml(description)}</p>
  <p><strong>Поставка под заказ. Цену и срок подтвердим после проверки шильдика.</strong></p>
  <h2>${escapeHtml(fitmentLabel)}</h2>
  <p>${escapeHtml(fitment)}</p>
  ${product.catalogTitle ? `<p>${escapeHtml(product.catalogTitle)}</p>` : ""}
  ${seriesNote ? `<p>${escapeHtml(seriesNote)}</p>` : ""}
  <p><strong>${escapeHtml(price)}</strong></p>
  ${product.ownerSale ? `<p>${escapeHtml(catSale.terms.ru)}</p><p><a href="${catSale.casePath}/">Кейс продажи нового насоса для CAT 432E</a></p><video controls preload="none" poster="${catSale.poster}" width="960" height="540"><source src="${catSale.video}" type="video/mp4"></video>` : ''}
  ${saleTerms ? `<p>${escapeHtml(saleTerms)}</p>` : ''}
  <section data-product-selection><h2>Что прислать для подбора этой запчасти</h2>
  <p>${escapeHtml(catalogProductSelection(product))}</p>
  <p>Укажите количество, город и нужную дату. Совпадения только модели техники недостаточно: исполнение, комплектацию, цену и срок поставки подтверждаем до оплаты.</p></section>
  <p>Доступны оригинальные, OEM и проверенные аналоговые варианты. Конкретный вариант, наличие, срок доставки и гарантия подтверждаются после проверки.</p>
  <p><a href="https://wa.me/77714177925?text=${encodeURIComponent(`Здравствуйте! Интересует: ${productSeo.name}\n${canonical}\nМодель и серийный номер: \nКоличество: \nГород: \nНужна к дате: \nПриложу фото шильдика и детали.`)}">Запросить подбор в WhatsApp</a></p>
  ${product.category === 'hydraulic-pumps' ? `<nav aria-label="Статьи перед покупкой насоса"><ul><li><a href="/blog/k3v112dt-kak-podobrat-gidronasos/">Подбор K3V112DT</a></li><li><a href="/blog/remont-ili-zamena-gidronasosa/">Ремонт или замена гидронасоса</a></li><li><a href="/blog/k5v80dtp-handok-hitachi-zx160w/">K5V80DTP и HANDOK</a></li></ul></nav>` : ''}
</main>`;

  let html = indexHtml.replace(/<script\b[^>]*\bdata-static-page-schema[^>]*>[\s\S]*?<\/script>/gi, '');
  html = setTag(html, /<title[^>]*>.*?<\/title>/is, `<title>${escapeHtml(title)}</title>`);
  html = setTag(html, /<meta(?=[^>]*\bname=["']description["'])[^>]*>/i, `<meta name="description" content="${escapeAttr(description)}">`);
  html = html.replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '');
  html = html.replace('</head>', `<link data-rh="true" rel="canonical" href="${canonical}">\n</head>`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i, `<meta property="og:title" content="${escapeAttr(title)}">`);
  html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i, `<meta property="og:description" content="${escapeAttr(description)}">`);
  if (image) {
    html = setTag(html, /<meta(?=[^>]*\bproperty=["']og:image["'])[^>]*>/i, `<meta property="og:image" content="${escapeAttr(image)}">`);
    html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:image["'])[^>]*>/i, `<meta name="twitter:image" content="${escapeAttr(image)}">`);
  }
  html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:title["'])[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(title)}">`);
  html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:description["'])[^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(description)}">`);
  html = setTag(html, /<meta(?=[^>]*\b(?:name|property)=["']twitter:url["'])[^>]*>/i, `<meta name="twitter:url" content="${escapeAttr(canonical)}">`);
  html = html.replace('</head>', `<script type="application/ld+json" data-static-product-schema data-rh="true">${schema}</script>\n</head>`);
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

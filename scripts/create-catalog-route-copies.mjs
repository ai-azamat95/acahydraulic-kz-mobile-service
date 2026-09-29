import fs from 'node:fs';
import catSale from '../shared/cat-432e-sale.json' with { type: 'json' };
import xcmgSale from '../shared/xcmg-xz200-pump-sale.json' with { type: 'json' };
import huscoCase from '../shared/husco-hidromek-102b-case.json' with { type: 'json' };
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

function schemaAvailability(value) {
  if (value === 'preorder') return 'https://schema.org/PreOrder';
  if (value === 'backorder') return 'https://schema.org/BackOrder';
  if (value === 'out_of_stock') return 'https://schema.org/OutOfStock';
  return 'https://schema.org/InStock';
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
  const fixedOffer = Boolean(product.approvedSale || product.ownerSale || product.ownerProduct);
  const merchantShippingPriceKzt = merchantOffer && Object.hasOwn(merchantOffer, 'shippingPriceKzt')
    ? merchantOffer.shippingPriceKzt
    : merchantPumps.shippingPriceKzt;
  const merchantTerms = merchantOffer?.terms?.ru || merchantPumps.terms.ru;
  const merchantDeliveryTime = merchantOffer
    && [merchantOffer.handlingMinDays, merchantOffer.handlingMaxDays, merchantOffer.transitMinDays, merchantOffer.transitMaxDays].every(Number.isFinite)
    ? {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: merchantOffer.handlingMinDays, maxValue: merchantOffer.handlingMaxDays, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: merchantOffer.transitMinDays, maxValue: merchantOffer.transitMaxDays, unitCode: 'DAY' },
      }
    : merchantOffer && !Object.hasOwn(merchantOffer, 'handlingMinDays')
      ? {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: merchantPumps.handlingMinDays, maxValue: merchantPumps.handlingMaxDays, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: merchantPumps.transitMinDays, maxValue: merchantPumps.transitMaxDays, unitCode: 'DAY' },
        }
      : undefined;
  const canonical = `${baseUrl}/catalog/${product.handle}/`;
  const productSeo = catalogProductSeo(product);
  const productCategories = catalogProductCategories(product);
  const title = `${productSeo.title} | ACA Hydraulic`;
  const fitment = product.fitment || 'совместимость уточняется по OEM, модели и шильдику техники';
  const isHuscoOwnerCase = product.ownerCase?.casePath === huscoCase.casePath;
  const fitmentLabel = product.approvedSale ? 'Применяемость этого исполнения' : 'Применяемость';
  const seriesNote = isHuscoOwnerCase
    ? 'У гидрораспределителей одной серии могут отличаться секции, порты, клапаны, электромагниты и разъёмы. Совпадение только C16E303 не подтверждает взаимозаменяемость.'
    : (product.approvedSale || product.ownerSale || product.ownerProduct) ? 'Насосы этой серии применяются на технике разных марок. Здесь указано одно из исполнений. Подберём вариант по шильдику, валу, фланцу, портам и регулятору. Одного совпадения модели насоса недостаточно.' : '';
  const price = Number.isFinite(product.minPriceKzt) ? `Цена ${fixedOffer ? "" : "от "}${formatPrice(product.minPriceKzt)}` : 'Цена по запросу';
  const isXcmgOwnerSale = product.ownerSale?.casePath === xcmgSale.casePath;
  const saleTerms = merchantOffer
    ? merchantTerms
    : isXcmgOwnerSale
      ? xcmgSale.terms.ru
      : product.approvedSale
        ? 'Новый насос в сборе. Поставка под заказ по Казахстану — 3–14 дней. Доставка — от 3 долларов США за кг, оплачивается отдельно. Предоплата 100%. Итоговую стоимость доставки согласуем до оплаты. При браке — замена через сервисный центр.'
        : '';
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
    category: merchantOffer ? merchantPumps.productType : undefined,
    brand: (merchantOffer?.brand || product.brand) ? { '@type': 'Brand', name: merchantOffer?.brand || product.brand } : undefined,
    mpn: merchantOffer?.mpn || product.mpn,
    itemCondition: fixedOffer ? 'https://schema.org/NewCondition' : undefined,
    url: canonical,
    additionalProperty: product.fitment ? [{
      '@type': 'PropertyValue',
      name: fitmentLabel,
      value: product.fitment,
    }] : undefined,
    offers: Number.isFinite(product.minPriceKzt) ? {
      '@type': fixedOffer ? 'Offer' : 'AggregateOffer',
      price: fixedOffer ? product.minPriceKzt : undefined,
      priceCurrency: 'KZT',
      shippingDetails: merchantOffer ? {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: merchantShippingPriceKzt, currency: "KZT" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "KZ" },
              deliveryTime: merchantDeliveryTime,
            } : undefined,
      availability: merchantOffer ? schemaAvailability(merchantOffer.availability) : undefined,
      lowPrice: fixedOffer ? undefined : product.minPriceKzt,
      highPrice: fixedOffer ? undefined : product.maxPriceKzt ?? product.minPriceKzt,
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
  ${product.ownerSale ? (isXcmgOwnerSale
    ? `<section><h2>Реальная поставка и установка этого насоса</h2><p>${escapeHtml(xcmgSale.terms.ru)}</p><p><a href="${xcmgSale.casePath}/">Кейс XCMG XZ200: насос 803001730</a></p>${xcmgSale.videos.map(video => `<video controls preload="none" poster="${video.poster}" width="720" height="1280"><source src="${video.src}" type="video/mp4"></video>`).join('')}</section>`
    : `<p>${escapeHtml(catSale.terms.ru)}</p><p><a href="${catSale.casePath}/">Кейс продажи нового насоса для CAT 432E</a></p><video controls preload="none" poster="${catSale.poster}" width="960" height="540"><source src="${catSale.video}" type="video/mp4"></video>`
  ) : ''}
  ${product.ownerProduct ? `<section><h2>Подтверждено по реальному товару</h2><ul><li>HANDOK HYDRAULIC, модель H5V80DTP-12T.</li><li>Номер детали YKSKR-9K00, маркировка Made in Korea.</li><li>Цена 2 530 000 ₸, доставка по Казахстану включена.</li></ul><p><a href="/cases/postavka-zamena-gidronasosa/#hitachi-order">Реальный заказ HANDOK для Hitachi ZX160W</a></p><p><a href="/blog/k5v80dtp-handok-hitachi-zx160w/">Как проверить H5V80DTP и K5V80DTP перед заказом</a></p></section>` : ''}
  ${isHuscoOwnerCase ? `<section><h2>Реальная замена HUSCO C16E303 на HIDROMEK HMK 102B</h2><p>На фото — снятый узел с читаемой маркировкой HUSCO C16E303, F18/22233 и 6600-E163 A00. Цена и наличие для нового заказа подтверждаются отдельно.</p><p><a href="${huscoCase.casePath}/">Кейс HIDROMEK 102B: замена заднего гидрораспределителя</a></p>${huscoCase.videos.map(video => `<video controls preload="none" poster="${video.poster}" width="720" height="1280"><source src="${video.src}" type="video/mp4"></video>`).join('')}</section>` : ''}
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

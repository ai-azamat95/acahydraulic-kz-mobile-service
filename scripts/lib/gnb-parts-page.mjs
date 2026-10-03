import fs from 'node:fs';
export const gnbParts = JSON.parse(fs.readFileSync(new URL('../../shared/gnb-parts.json', import.meta.url), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function renderGnbPartsPage(indexHtml) {
  const data = gnbParts;
  const canonical = 'https://acahydraulic.kz' + data.path;
  const title = data.title + ' | ACA Hydraulic';
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: data.title, description: data.description, url: canonical, inLanguage: 'ru-KZ',
    mainEntity: {'@type':'ItemList', numberOfItems:1, itemListElement:[{'@type':'ListItem',position:1,name:'Гидравлический насос 803001730 для XCMG XZ200 / XZ200E',url:'https://acahydraulic.kz'+data.productPath}]}
  };
  const body = `<main data-gnb-parts>
    <nav aria-label="Хлебные крошки"><a href="/">ACA Hydraulic</a> / <a href="/catalog/">Каталог запчастей</a> / ${escape(data.title)}</nav>
    <h1>${escape(data.title)}</h1><p>${escape(data.intro)}</p>
    <p><a href="#gnb-request">Что отправить для подбора</a></p>
    <section><h2>Какие запчасти ищем по запросу</h2>
      ${data.groups.map(group => `<article data-gnb-group="${escape(group.id)}"><h3>${escape(group.title)}</h3><p>Подбор под заказ. ${escape(group.text)}</p></article>`).join('')}
      <p>${escape(data.fitment)}</p>
    </section>
    <section><h2>${escape(data.exampleTitle)}</h2><p>${escape(data.exampleText)}</p>
      <p><a href="${escape(data.productPath)}">Карточка насоса 803001730</a> · <a href="${escape(data.casePath)}">Поставка и установка на XCMG XZ200</a></p>
    </section>
    <section id="gnb-request"><h2>Что нужно для точного подбора</h2><p>${escape(data.selection)}</p>
      <p><a data-gnb-cta href="${escape(data.whatsappUrl)}" target="_blank" rel="noopener noreferrer">${escape(data.cta)}</a></p><p>${escape(data.note)}</p>
    </section>
    <nav aria-label="Связанные разделы каталога">${data.related.map(item => `<a href="${escape(item.path)}">${escape(item.title)}</a>`).join(' · ')}</nav>
  </main>`;
  let html = indexHtml.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<title[^>]*>.*?<\/title>/is, `<title data-rh="true">${escape(title)}</title>`);
  html = html.replace(/<meta(?=[^>]*\b(?:name|property)=["'](?:description|og:(?:url|title|description)|twitter:(?:url|title|description))["'])[^>]*>\s*/gi, '');
  html = html.replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '');
  html = html.replace('</head>', `<meta data-rh="true" name="description" content="${escape(data.description)}">
    <link data-rh="true" rel="canonical" href="${canonical}">
    <meta data-rh="true" property="og:url" content="${canonical}">
    <meta data-rh="true" property="og:title" content="${escape(title)}">
    <meta data-rh="true" property="og:description" content="${escape(data.description)}">
    <meta data-rh="true" name="twitter:title" content="${escape(title)}">
    <meta data-rh="true" name="twitter:description" content="${escape(data.description)}">
    <script data-rh="true" data-static-collection-schema type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>`);
  const root = `<div id="root">${body}</div>`;
  if (html.includes('<div id="root"></div>')) html = html.replace('<div id="root"></div>', root);
  else if (/<div id="root">[\s\S]*?<\/main><\/div>/.test(html)) html = html.replace(/<div id="root">[\s\S]*?<\/main><\/div>/, root);
  else throw new Error('Application root missing for GNB landing');
  return {html, pathName:data.path};
}

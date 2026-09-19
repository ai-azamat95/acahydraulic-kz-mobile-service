import fs from 'node:fs';

export const articles = JSON.parse(fs.readFileSync(new URL('../shared/seo-articles.json', import.meta.url), 'utf8'));
const esc = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const articleForRoute = route => articles.find(article => route === `blog/${article.slug}`);
export function articleSchema(article) {
  const url = `https://acahydraulic.kz/blog/${article.slug}/`;
  return { '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`, headline: article.title,
    description: article.description, image: new URL(article.image, 'https://acahydraulic.kz').href,
    datePublished: article.publishedDate, dateModified: article.publishedDate,
    author: { '@type': 'Organization', name: 'ACA Hydraulic', url: 'https://acahydraulic.kz/about/' },
    publisher: { '@id': 'https://acahydraulic.kz/#business' }, mainEntityOfPage: url, inLanguage: 'ru-KZ' };
}
export function articleList() {
  return `<section><h2>Новые статьи о подборе и покупке гидронасосов</h2><ul>${articles.map(article => `<li><a href="/blog/${article.slug}/">${esc(article.title)}</a><p>${esc(article.description)}</p></li>`).join('')}</ul></section>`;
}
export function renderArticle(article) {
  return `<main aria-label="${esc(article.title)}"><nav aria-label="Основная навигация"><a href="/">ACA Hydraulic</a> · <a href="/blog/">Блог</a> · <a href="/catalog/">Запчасти</a> · <a href="/services/">Услуги</a></nav>
<article><h1>${esc(article.title)}</h1><p>ACA Hydraulic · <time datetime="${article.publishedDate}">19 сентября 2026</time> · ${esc(article.readTime)}</p>
<p>${esc(article.intro)}</p><figure><img src="${esc(article.image)}" alt="${esc(article.imageAlt)}" width="900" height="600" style="max-width:100%;height:auto;object-fit:contain"><figcaption>${esc(article.caption)}</figcaption></figure>
<nav aria-label="Содержание статьи"><h2>В этой статье</h2><ol>${article.sections.map(section => `<li><a href="#${section.id}">${esc(section.title)}</a></li>`).join('')}</ol></nav>
${article.sections.map(section => `<section id="${section.id}"><h2>${esc(section.title)}</h2>${section.paragraphs.map(text => `<p>${esc(text)}</p>`).join('')}${section.bullets.length ? `<ul>${section.bullets.map(text => `<li>${esc(text)}</li>`).join('')}</ul>` : ''}</section>`).join('')}
<section><h2>Каталог, услуги и реальные работы</h2><ul>${article.related.map(link => `<li><a href="${esc(link.href)}">${esc(link.label)}</a></li>`).join('')}</ul></section>
<aside><h2>Разберём вашу задачу</h2><p>Пришлите модель техники, город, симптомы или номер детали. Приложите шильдик и фото подключений — по ним проверим исполнение и согласуем следующий шаг.</p><a href="https://wa.me/77714177925?text=${encodeURIComponent(article.cta)}" target="_blank" rel="noopener noreferrer">Отправить данные в WhatsApp</a></aside><a href="/blog/">Все статьи ACA Hydraulic</a></article></main>`;
}

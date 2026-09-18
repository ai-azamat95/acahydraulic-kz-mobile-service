import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist/public');
const base = 'https://acahydraulic.kz';
const cases = JSON.parse(fs.readFileSync(new URL('../shared/video-cases.json', import.meta.url), 'utf8'));
const redirects = JSON.parse(fs.readFileSync(new URL('../shared/legacy-redirects.json', import.meta.url), 'utf8'));
const template = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function replaceRoot(html, content) {
  const opening = /<div\b[^>]*\bid=["']root["'][^>]*>/i.exec(html);
  if (!opening) throw new Error('Missing root');
  const start = opening.index + opening[0].length;
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = start;
  let depth = 1;
  for (let tag; (tag = tags.exec(html));) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (!depth) return html.slice(0, start) + content + html.slice(tag.index);
  }
  throw new Error('Unclosed root');
}
function writeRoute(route, html) {
  const dir = path.join(out, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
for (const item of cases) {
  const url = `${base}/cases/${item.slug}/`;
  const title = `${item.title} | ACA Hydraulic`;
  const schema = { '@context': 'https://schema.org', '@type': 'VideoObject', '@id': `${url}#video`, name: item.title,
    description: item.description, thumbnailUrl: [`${base}${item.poster}`], contentUrl: `${base}${item.video}`,
    url, mainEntityOfPage: url, uploadDate: item.uploadDate, duration: item.duration, inLanguage: 'ru' };
  let html = template.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '')
    .replace(/<meta(?=[^>]*\b(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+)["'])[^>]*>/gi, '')
    .replace(/<script(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '');
  const head = `<title data-rh="true">${escape(title)}</title>
<meta data-rh="true" name="description" content="${escape(item.description)}">
<meta data-rh="true" name="robots" content="index, follow, max-image-preview:large, max-video-preview:-1">
<link data-rh="true" rel="canonical" href="${url}">
<meta data-rh="true" property="og:title" content="${escape(title)}"><meta data-rh="true" property="og:description" content="${escape(item.description)}">
<meta data-rh="true" property="og:url" content="${url}"><meta data-rh="true" property="og:image" content="${base}${item.poster}">
<meta data-rh="true" property="og:type" content="website">
<script data-rh="true" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  html = html.replace('</head>', `${head}</head>`);
  const contact = `https://wa.me/77714177925?text=${encodeURIComponent(`Здравствуйте! Посмотрел видео ${item.model}. Моя техника: __. Город: __. Симптомы: __. Нужна диагностика / запчасть с заменой. Пришлю шильдик.`)}`;
  html = replaceRoot(html, `<main class="min-h-screen bg-[#111111] text-white"><div class="container mx-auto max-w-6xl px-4 py-8">
<nav aria-label="Навигация по кейсам"><a href="/">Главная</a> · <a href="/cases/">Все кейсы</a> · <a href="/catalog/">Каталог запчастей</a></nav>
<h1 class="font-bebas text-4xl">${escape(item.title)}</h1><p>${escape(item.summary)}</p>
<figure><video controls playsinline preload="none" width="360" height="640" style="max-width:100%;height:auto;max-height:72vh" poster="${item.poster}" aria-label="${escape(item.title)}"><source src="${item.video}" type="video/mp4"></video>
<figcaption>${escape(item.durationLabel)} · с титрами на русском языке</figcaption><a href="${item.video}">Открыть видео отдельно</a></figure>
<h2>Что показано в видео</h2><ol>${item.steps.map(step => `<li><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></li>`).join('')}</ol>
<p>Исполнение узлов на другой машине проверяем по шильдику, валу, фланцу, портам и регулятору. Замена дорогостоящего насоса — после подтверждения причины неисправности.</p>
<h2>Подобрать запчасть или согласовать ремонт</h2><ul>${item.links.map(link => `<li><a href="${escape(link.href)}">${escape(link.label)}</a></li>`).join('')}</ul>
<p><a href="${escape(contact)}" target="_blank" rel="noopener noreferrer">Отправить модель и симптомы в WhatsApp</a></p><p>Выезд по согласованию · Казахстан</p>
</div></main>`);
  writeRoute(`cases/${item.slug}`, html);
}

// GitHub Pages has no server redirect rules. A zero-delay meta refresh and
// matching canonical provide a static redirect; do not claim an HTTP 301.
for (const [from, to] of Object.entries(redirects)) {
  if (!fs.existsSync(path.join(out, to, 'index.html'))) throw new Error(`Redirect destination missing: ${to}`);
  writeRoute(from, `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Страница переехала | ACA Hydraulic</title><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="${base}${to}"></head><body><p>Страница переехала: <a href="${to}">перейти на актуальную страницу ACA Hydraulic</a>.</p></body></html>`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${cases.map(item => `  <url><loc>${base}/cases/${item.slug}/</loc><video:video><video:thumbnail_loc>${base}${item.poster}</video:thumbnail_loc><video:title>${escape(item.title)}</video:title><video:description>${escape(item.description)}</video:description><video:content_loc>${base}${item.video}</video:content_loc><video:duration>${item.seconds}</video:duration><video:publication_date>${item.uploadDate}</video:publication_date><video:family_friendly>yes</video:family_friendly></video:video></url>`).join('\n')}
</urlset>\n`;
fs.writeFileSync(path.join(out, 'sitemap-videos.xml'), sitemap);

// Expose the watch pages in the static HTML as well as the React UI.
for (const route of ['cases', 'projects', 'cases/postavka-zamena-gidronasosa']) {
  const file = path.join(out, route, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const links = `<nav aria-label="Видео ремонта"><ul>${cases.map(item => `<li><a href="/cases/${item.slug}/">${escape(item.title)}</a></li>`).join('')}</ul></nav>`;
  html = html.replace('</main>', `${links}</main>`);
  fs.writeFileSync(file, html);
}
console.log(`Published ${cases.length} video watch pages, video sitemap and ${Object.keys(redirects).length} legacy redirects.`);

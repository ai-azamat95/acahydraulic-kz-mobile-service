import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist/public');
const indexPath = path.join(outDir, 'index.html');
const sitemapPath = path.join(outDir, 'sitemap-cases.xml');
const baseUrl = 'https://acahydraulic.kz';

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run build first.`);
}

if (!fs.existsSync(sitemapPath)) {
  console.log('No sitemap-cases.xml found; skipping case route copies.');
  process.exit(0);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const routes = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+\/([^<]*)<\/loc>/g)]
  .map((match) => match[1].replace(/^\/+|\/+$/g, ''))
  .filter((route) => route && !/\.[a-z0-9]+$/i.test(route));

const caseMeta = {
  'cases/postavka-zamena-gidronasosa': {
    title: 'Гидронасос с доставкой и заменой: SANY и Hitachi | ACA Hydraulic',
    description: 'SANY SY365H: поставили K5V160DT, заменили насос и запустили экскаватор. Заказ HANDOK для Hitachi ожидает поставки. Фото, видео, варианты насосов и расчёт работ.',
  },
  'projects': {
    title: 'Реальные ремонты спецтехники на видео | ACA Hydraulic',
    description: 'Реальные выездные ремонты ACA Hydraulic: Caterpillar, Hitachi, SANY, XCMG и другая спецтехника. Диагностика, ремонт и результат на видео.',
  },
  'cases': {
    title: 'Реальные кейсы ремонта спецтехники | ACA Hydraulic',
    description: 'Реальные ремонты и диагностика гидравлики спецтехники с видео процесса и результата. Выездная диагностика от 200 000 ₸.',
  },
  'cases/cat-330dl-teryaet-moshchnost-na-goryachuyu': {
    title: 'CAT 330DL теряет мощность на горячую | Реальный ремонт ACA Hydraulic',
    description: 'Реальный ремонт Caterpillar 330DL: после прогрева машина теряла мощность. Диагностика гидравлики и двигателя под нагрузкой, видео результата.',
  },
  'cases/sany-sy365h-gidravlika-na-goryachuyu': {
    title: 'SANY SY365H: рывки гидравлики на горячую | ACA Hydraulic',
    description: 'Реальный ремонт SANY SY365H: потеря мощности после прогрева и рывки стрелы. Диагностика гидравлики и электрики, видео процесса.',
  },
  'cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami': {
    title: 'Hitachi 330-5G: плавает давление, стрела рывками | ACA Hydraulic',
    description: 'Реальная диагностика Hitachi 330-5G: нестабильное давление, медленная работа и рывки стрелы. Выездной ремонт и видео процесса.',
  },
};

function escapeAttr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function setMeta(html, route) {
  const meta = caseMeta[route];
  if (!meta) return html;
  const canonical = `${baseUrl}/${route}/`;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeAttr(meta.description)}">`);
  // The root document is already managed by react-helmet and can contain
  // attributes before rel="canonical". Remove every existing canonical first
  // so generated route copies always expose exactly one route-specific URL.
  html = html.replace(/<link(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '');
  html = html.replace('</head>', `<link data-rh="true" rel="canonical" href="${canonical}">\n</head>`);
  if (route === 'cases/postavka-zamena-gidronasosa') {
    const socialMeta = {
      'og:title': meta.title, 'og:description': meta.description, 'og:url': canonical,
      'og:image': `${baseUrl}/media/pump-cases/sany-sy365h.webp`,
      'twitter:title': meta.title, 'twitter:description': meta.description,
      'twitter:image': `${baseUrl}/media/pump-cases/sany-sy365h.webp`,
    };
    for (const [name, value] of Object.entries(socialMeta)) {
      const pattern = new RegExp(`<meta\\s+(?:property|name)=["']${name}["'][^>]*>`, 'i');
      html = html.replace(pattern, `<meta ${name.startsWith('og:') ? 'property' : 'name'}="${name}" content="${escapeAttr(value)}">`);
    }
    // Search crawlers and visitors without JavaScript receive the real case,
    // including the distinction between completed work and a pending order.
    html = html.replace('<div id="root"></div>', `<div id="root"><main class="container mx-auto max-w-6xl px-4 py-12 text-white">
      <a href="/cases/">Все кейсы ACA Hydraulic</a>
      <h1>Гидронасос — с подбором, доставкой и заменой</h1>
      <h2>SANY SY365H: K5V160DT, доставка, замена и запуск</h2>
      <p>Завершённый заказ: клиент заказал насос через ACA Hydraulic. Организовали поставку с доставкой, демонтировали старый насос, установили новый и запустили экскаватор.</p>
      <video controls playsinline preload="none" width="360" poster="/media/pump-cases/sany-sy365h.webp" src="/media/pump-cases/sany-pump-36s.mp4"></video>
      <p>Видео 36 секунд, без звука, этапы работ подписаны в кадре.</p>
      <h2>Hitachi: заказ HANDOK ожидает поставки</h2>
      <p>На 17 сентября 2026 года клиент выбрал корейский HANDOK, оплатил заказ и ожидает поставки. Установка и запуск ещё не выполнены.</p>
      <h2>Варианты насосов под заказ</h2>
      <ul><li>K5V80DTP, Китай — 1 700 000 ₸.</li><li>HANDOK H5V80DTP-12T, Южная Корея — 2 530 000 ₸.</li></ul>
      <p>Стоимость указанного насоса. Комплектацию, итоговую стоимость, доставку, срок и состав работ подтверждаем в расчёте до оплаты. Эти цены не являются стоимостью ремонта под ключ.</p>
      <p>Совместимость проверяем по модели техники, шильдику, валу, фланцу, портам, вращению, регулятору и комплектации.</p>
      <a href="https://wa.me/77714177925?text=${encodeURIComponent('Здравствуйте! Нужен насос с доставкой и заменой. Модель: __. Город: __. Пришлю шильдик.')}" rel="noopener noreferrer">Отправить шильдик в WhatsApp</a>
      <p><a href="tel:+77714177925">+7 771 417 79 25</a></p>
    </main></div>`);
  }
  return html;
}

for (const route of routes) {
  const routeDir = path.join(outDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  const html = setMeta(indexHtml, route);
  fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
}

console.log(`Created ${routes.length} static case route copies from sitemap-cases.xml`);

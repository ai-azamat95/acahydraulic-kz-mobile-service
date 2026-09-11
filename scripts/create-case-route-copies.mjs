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
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${canonical}">\n</head>`);
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

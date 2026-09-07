import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist/public');
const indexPath = path.join(outDir, 'index.html');
const sitemapPath = path.join(outDir, 'sitemap.xml');
const baseUrl = 'https://acahydraulic.kz';

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run build first.`);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const locs = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+\/([^<]*)<\/loc>/g)].map((m) => m[1]);
const routes = new Set(['404', 'privacy', 'terms']);

for (const raw of locs) {
  const route = raw.replace(/^\/+|\/+$/g, '');
  if (!route) continue;
  if (/\.[a-z0-9]+$/i.test(route)) continue;
  routes.add(route);
}

const explicitMeta = {
  privacy: { title: 'Политика конфиденциальности | ACA Hydraulic', description: 'Обработка обращений и аналитика сайта ACA Hydraulic.' },
  terms: { title: 'Условия использования | ACA Hydraulic', description: 'Информация об услугах, расчёте стоимости и заявках на ремонт.' },
  '': {
    title: 'Ремонт гидравлики спецтехники в Казахстане | ACA Hydraulic',
    description: 'Выездной ремонт гидравлики экскаваторов, буровых, кранов и спецтехники. Диагностика на объекте, работа 24/7 по Казахстану, гарантия по договору.',
  },
  services: {
    title: 'Услуги ремонта гидравлики спецтехники | ACA Hydraulic',
    description: 'Ремонт гидронасосов, гидромоторов, распределителей, цилиндров и выездной сервис спецтехники по Казахстану.',
  },
  about: {
    title: 'О компании ACA Hydraulic | Гидравлический сервис',
    description: 'ACA Hydraulic — сервис по ремонту гидравлики спецтехники с выездом на объект, документами для юрлиц и гарантией на работы.',
  },
  projects: {
    title: 'Проекты ремонта гидравлики спецтехники | ACA Hydraulic',
    description: 'Реальные проекты ACA Hydraulic: ремонт гидравлики фрез, бульдозеров, экскаваторов, буровых установок и промышленной техники.',
  },
  cases: {
    title: 'Кейсы ремонта спецтехники | ACA Hydraulic',
    description: 'Примеры диагностики и ремонта гидравлических систем спецтехники: причины поломок, решения, сроки и результаты.',
  },
  reviews: {
    title: 'Отзывы клиентов ACA Hydraulic | Ремонт гидравлики',
    description: 'Отзывы компаний и владельцев спецтехники о выездном ремонте гидравлики ACA Hydraulic в Казахстане.',
  },
  blog: {
    title: 'Блог о ремонте гидравлики спецтехники | ACA Hydraulic',
    description: 'Практические статьи о диагностике, ремонте и обслуживании гидравлики экскаваторов, погрузчиков, буровых и дорожной техники.',
  },
  contacts: {
    title: 'Контакты ACA Hydraulic | Вызвать ремонт гидравлики',
    description: 'Контакты ACA Hydraulic: вызов бригады для ремонта гидравлики спецтехники. Телефон и WhatsApp +7 (771) 417-79-25.',
  },
  corporate: {
    title: 'Корпоративное обслуживание спецтехники | ACA Hydraulic',
    description: 'B2B обслуживание парка спецтехники: диагностика, выездной ремонт гидравлики, договор, НДС, приоритетный сервис.',
  },
  'services/mobile-repair': {
    title: 'Выездной ремонт гидравлики спецтехники 24/7 | ACA Hydraulic',
    description: 'Мобильный ремонт гидравлики экскаваторов, буровых, кранов и спецтехники на объекте. Выезд по Казахстану, диагностика, договор с НДС.',
  },
  'services/emergency-service': {
    title: 'Срочный ремонт гидравлики 24/7 | ACA Hydraulic',
    description: 'Экстренный выезд на аварийный ремонт гидравлики спецтехники. Помогаем сократить простой экскаваторов, буровых и дорожной техники.',
  },
  'services/hydraulic-pumps': {
    title: 'Ремонт гидронасосов спецтехники | ACA Hydraulic',
    description: 'Диагностика, ремонт и восстановление гидронасосов CAT, Komatsu, Hitachi, Kawasaki, Rexroth и Sauer для спецтехники.',
  },
  'services/hydraulic-motors': {
    title: 'Ремонт гидромоторов спецтехники | ACA Hydraulic',
    description: 'Ремонт гидромоторов хода, поворота и привода для экскаваторов, погрузчиков, буровых и промышленной техники.',
  },
  'services/hydraulic-valves': {
    title: 'Ремонт гидрораспределителей и клапанов | ACA Hydraulic',
    description: 'Диагностика и ремонт гидрораспределителей, клапанов, секций управления и гидравлических блоков спецтехники.',
  },
  'services/gnb-repair': {
    title: 'Ремонт ГНБ установок и гидравлики буровых | ACA Hydraulic',
    description: 'Ремонт гидравлики ГНБ установок, буровых машин, насосов, моторов и распределителей с выездом на объект.',
  },
};

const serviceNames = {
  'b2b-maintenance': 'Обслуживание парка спецтехники',
  'industrial-service': 'Промышленный гидравлический сервис',
  'excavator-repair': 'Ремонт гидравлики экскаваторов',
  'bulldozer-repair': 'Ремонт гидравлики бульдозеров',
  'loader-repair': 'Ремонт гидравлики погрузчиков',
  'grader-repair': 'Ремонт гидравлики автогрейдеров',
  'mining-loader-repair': 'Ремонт гидравлики шахтных погрузчиков',
  'mining-truck-repair': 'Ремонт гидравлики карьерных самосвалов',
  'manipulator-repair': 'Ремонт гидравлики манипуляторов',
  'wirtgen-repair': 'Ремонт гидравлики дорожных фрез Wirtgen',
  'drilling-repair': 'Ремонт гидравлики буровых установок',
  'piledriver-repair': 'Ремонт гидравлики сваебойных установок',
  'press-repair': 'Ремонт гидравлических прессов',
  'railway-repair': 'Ремонт гидравлики железнодорожной техники',
};

const cityNames = {
  astana: 'Астана', almaty: 'Алматы', karaganda: 'Караганда', atyrau: 'Атырау', aktau: 'Актау', shymkent: 'Шымкент', petropavlovsk: 'Петропавловск', semey: 'Семей', 'pavlodar-ekibastuz': 'Павлодар — Экибастуз', 'zhezkazgan-balkhash': 'Жезказган — Балхаш', kokshetau: 'Кокшетау', kostanay: 'Костанай',
};

const brandNames = {
  cat: 'Caterpillar CAT', komatsu: 'Komatsu', hitachi: 'Hitachi', hyundai: 'Hyundai', wirtgen: 'Wirtgen', shantui: 'Shantui', liebherr: 'Liebherr', volvo: 'Volvo',
};

const blogNames = {
  'remont-gidronasosa-cat': 'Ремонт гидронасоса CAT: пошаговое руководство',
  'padaet-davlenie-gidravliki-ekskavatora': 'Падает давление гидравлики экскаватора',
  'stoimost-remonta-gidromotora-komatsu': 'Стоимость ремонта гидромотора Komatsu',
  'kak-opredelit-neispravnost-gidravliki': 'Как определить неисправность гидравлики',
  'remont-gidravliki-frezy-wirtgen-1500': 'Ремонт гидравлики фрезы Wirtgen 1500',
  'kapitalnyy-remont-shantui-sd32': 'Капитальный ремонт гидравлики Shantui SD32',
  'remont-gidravliki-liebherr-r950': 'Ремонт гидравлики Liebherr R950',
  'vosstanovlenie-gidromotora-volvo-ec380': 'Восстановление гидромотора Volvo EC380',
};

function metaForRoute(route) {
  if (explicitMeta[route]) return explicitMeta[route];
  if (route.startsWith('services/')) {
    const key = route.split('/')[1];
    const name = serviceNames[key] ?? 'Ремонт гидравлики спецтехники';
    return {
      title: `${name} | ACA Hydraulic`,
      description: `${name}: диагностика, выездной ремонт и восстановление гидравлических систем спецтехники по Казахстану. Работаем с юрлицами, НДС, гарантия.`,
    };
  }
  if (route.startsWith('regions/')) {
    const key = route.split('/')[1];
    const city = cityNames[key] ?? key;
    return {
      title: `Ремонт гидравлики ${city} | Выездной сервис ACA Hydraulic`,
      description: `Ремонт гидравлики спецтехники в регионе ${city}: выездная диагностика, ремонт насосов, моторов, распределителей и аварийный сервис.`,
    };
  }
  if (route.startsWith('brands/')) {
    const key = route.split('/')[1];
    const brand = brandNames[key] ?? key.toUpperCase();
    return {
      title: `Ремонт гидравлики ${brand} | ACA Hydraulic`,
      description: `Диагностика и ремонт гидравлики спецтехники ${brand}: насосы, гидромоторы, распределители, цилиндры. Выездной сервис по Казахстану.`,
    };
  }
  if (route.startsWith('blog/')) {
    const key = route.split('/')[1];
    const name = blogNames[key] ?? 'Статья о ремонте гидравлики';
    return {
      title: `${name} | ACA Hydraulic`,
      description: `${name}: практические рекомендации ACA Hydraulic по диагностике, ремонту и обслуживанию гидравлики спецтехники.`,
    };
  }
  return explicitMeta[''];
}

function setTag(html, regex, replacement, beforeHead = '') {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace('</head>', `${beforeHead || replacement}\n</head>`);
}

function escapeAttr(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function withRouteHead(html, route) {
  const routePath = route ? `/${route}` : '/';
  const canonical = routePath === '/' ? `${baseUrl}/` : `${baseUrl}${routePath}/`;
  const { title, description } = metaForRoute(route);
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const c = escapeAttr(canonical);

  let out = html;
  out = setTag(out, /<title[^>]*>.*?<\/title>/is, `<title>${t}</title>`);
  out = setTag(out, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${d}">`, `<meta name="description" content="${d}">`);
  out = setTag(out, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${c}">`, `<link rel="canonical" href="${c}">`);
  out = setTag(out, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${c}">`);
  out = setTag(out, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${t}">`);
  out = setTag(out, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${d}">`);
  out = setTag(out, /<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${t}">`);
  out = setTag(out, /<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${d}">`);
  out = out.replace(/<(title|meta|link)\b([^>]*?)>/gi, (tag, name, attrs) => {
    const managed = name.toLowerCase() === 'title' || /(?:name|property)=["'](?:description|keywords|robots|language|author|og:[^"']+|twitter:[^"']+)["']/i.test(attrs) || /rel=["']canonical["']/i.test(attrs);
    return managed ? `<${name} data-rh="true"${attrs}>` : tag;
  });
  return out;
}

// Root index also gets the optimized static head.
fs.writeFileSync(indexPath, withRouteHead(indexHtml, ''));

for (const route of routes) {
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), withRouteHead(indexHtml, route));
}

// GitHub Pages SPA fallback for unknown routes.
fs.writeFileSync(path.join(outDir, '404.html'), withRouteHead(indexHtml, '404'));
console.log(`Created ${routes.size} route copies from sitemap with SEO head metadata.`);

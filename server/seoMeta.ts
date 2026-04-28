/**
 * Server-side SEO meta injection
 * Injects unique title, description, canonical, og:title, og:description
 * into the HTML before sending to the client.
 * This ensures Google/Yandex crawlers see unique meta tags per page
 * even though the site is a React SPA.
 */

const SITE_NAME = "ACA Hydraulic";
const SITE_URL = "https://acahydraulic.kz";
const DEFAULT_DESCRIPTION =
  "Ремонт гидравлики спецтехники в Астане. Выездной сервис 24/7. Ремонт гидронасосов, гидромоторов, гидрораспределителей. Гарантия качества. ☎ +7 (771) 417-79-25";
const DEFAULT_TITLE = `Ремонт гидравлики спецтехники в Астане | Выездной сервис 24/7 | ${SITE_NAME}`;

interface SeoMeta {
  title: string;
  description: string;
}

const routeMeta: Record<string, SeoMeta> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/services": {
    title: `Услуги по ремонту гидравлики спецтехники | ${SITE_NAME}`,
    description:
      "Полный спектр услуг по ремонту гидравлики: экскаваторы, бульдозеры, погрузчики, буровые установки. Выездной сервис по Казахстану. Работаем 24/7.",
  },
  "/services/excavator-repair": {
    title: `Ремонт гидравлики экскаваторов в Астане | CAT, Komatsu, Hitachi | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики экскаваторов CAT, Komatsu, Hitachi, Hyundai. Выездная диагностика и ремонт на объекте. Гарантия 6 месяцев. Звоните: +7 (771) 417-79-25",
  },
  "/services/hydraulic-pumps": {
    title: `Ремонт гидронасосов спецтехники в Астане | ${SITE_NAME}`,
    description:
      "Ремонт и восстановление гидронасосов всех типов: аксиально-поршневые, шестерённые, лопастные. Диагностика, дефектовка, замена уплотнений. Гарантия.",
  },
  "/services/hydraulic-motors": {
    title: `Ремонт гидромоторов в Астане | Все марки спецтехники | ${SITE_NAME}`,
    description:
      "Ремонт гидромоторов Rexroth, Sauer-Danfoss, Parker, Kawasaki. Диагностика, восстановление, замена. Выездной сервис по Казахстану. Гарантия качества.",
  },
  "/services/hydraulic-valves": {
    title: `Ремонт гидрораспределителей и клапанов | ${SITE_NAME}`,
    description:
      "Ремонт гидрораспределителей, предохранительных и обратных клапанов. Восстановление золотников, замена уплотнений. Выездной сервис 24/7.",
  },
  "/services/mobile-repair": {
    title: `Выездной ремонт гидравлики спецтехники | ${SITE_NAME}`,
    description:
      "Выездной ремонт гидравлики прямо на объекте. Бригада выезжает в течение 2 часов. Работаем по всему Казахстану 24/7. Без простоя техники.",
  },
  "/services/gnb-repair": {
    title: `Ремонт гидравлики ГНБ установок | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики горизонтально-направленного бурения. Насосы, моторы, гидроцилиндры ГНБ. Выездной сервис по Казахстану.",
  },
  "/services/bulldozer-repair": {
    title: `Ремонт гидравлики бульдозеров | CAT, Komatsu | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики бульдозеров CAT D6, D8, Komatsu D85, D155. Гидроцилиндры, насосы, распределители. Выездной сервис 24/7.",
  },
  "/services/wirtgen-repair": {
    title: `Ремонт гидравлики фрезерных машин Wirtgen | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики дорожно-фрезерных машин Wirtgen, Hamm, Vögele. Насосы, моторы привода фрезы. Выездной сервис по Казахстану.",
  },
  "/services/emergency-service": {
    title: `Аварийный ремонт гидравлики 24/7 | ${SITE_NAME}`,
    description:
      "Аварийный выездной ремонт гидравлики спецтехники. Выезд в течение 2 часов. Работаем круглосуточно по всему Казахстану.",
  },
  "/services/b2b-maintenance": {
    title: `Техническое обслуживание гидравлики для предприятий | ${SITE_NAME}`,
    description:
      "Комплексное ТО гидравлических систем для горнодобывающих и строительных предприятий. Договор обслуживания. Работа с НДС.",
  },
  "/services/industrial-service": {
    title: `Ремонт промышленной гидравлики в Казахстане | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики промышленного оборудования: прессы, подъёмники, горнодобывающая техника. Выездной сервис по Казахстану.",
  },
  "/services/loader-repair": {
    title: `Ремонт гидравлики погрузчиков | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики фронтальных и вилочных погрузчиков. Гидроцилиндры, насосы, распределители. Выездной сервис 24/7.",
  },
  "/services/manipulator-repair": {
    title: `Ремонт гидравлики манипуляторов и кранов-манипуляторов | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики манипуляторов Fassi, Hiab, Palfinger. Гидроцилиндры, насосы, клапаны. Выездной сервис по Казахстану.",
  },
  "/services/railway-repair": {
    title: `Ремонт гидравлики железнодорожной техники | ${SITE_NAME}`,
    description:
      "Ремонт гидравлических систем железнодорожной техники и путевых машин. Диагностика и ремонт на объекте.",
  },
  "/services/press-repair": {
    title: `Ремонт гидравлики промышленных прессов | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики промышленных прессов и штамповочного оборудования. Насосные станции, гидроцилиндры, клапаны.",
  },
  "/services/drilling-repair": {
    title: `Ремонт гидравлики буровых установок | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики буровых установок для горнодобывающей отрасли. Выездной сервис по Казахстану. Работаем 24/7.",
  },
  "/services/grader-repair": {
    title: `Ремонт гидравлики грейдеров | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики автогрейдеров CAT, Komatsu, ЧЕТРА. Гидроцилиндры, насосы, распределители. Выездной сервис.",
  },
  "/services/piledriver-repair": {
    title: `Ремонт гидравлики сваебойных установок | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики сваебойных и свайных установок. Молоты, вибропогружатели, гидравлические системы. Выездной сервис.",
  },
  "/services/mining-loader-repair": {
    title: `Ремонт гидравлики горных погрузчиков | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики подземных горных погрузчиков LHD. Специализируемся на горнодобывающей технике. Выездной сервис.",
  },
  "/services/mining-truck-repair": {
    title: `Ремонт гидравлики карьерных самосвалов | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики карьерных самосвалов CAT, Komatsu, Belaz. Подъёмные цилиндры, рулевое управление. Выездной сервис.",
  },
  "/regions/astana": {
    title: `Ремонт гидравлики в Астане | Выездной сервис 24/7 | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики спецтехники в Астане. Выездная бригада, диагностика на объекте. Работаем с предприятиями и частными клиентами. ☎ +7 (771) 417-79-25",
  },
  "/regions/almaty": {
    title: `Ремонт гидравлики в Алматы | Выездной сервис | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики спецтехники в Алматы. Выездной сервис, диагностика и ремонт на объекте. Гарантия качества.",
  },
  "/regions/karaganda": {
    title: `Ремонт гидравлики в Карагандe | Горнодобывающая техника | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики спецтехники в Карагандe. Специализируемся на горнодобывающей и шахтной технике. Выездной сервис 24/7.",
  },
  "/regions/shymkent": {
    title: `Ремонт гидравлики в Шымкенте | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики спецтехники в Шымкенте. Выездной сервис, диагностика и ремонт на объекте. Работаем 24/7.",
  },
  "/regions/aktau": {
    title: `Ремонт гидравлики в Актау | Нефтесервисная техника | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики спецтехники в Актау. Специализируемся на нефтесервисном оборудовании. Выездной сервис по Мангистауской области.",
  },
  "/regions/atyrau": {
    title: `Ремонт гидравлики в Атырау | Нефтяная техника | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики спецтехники в Атырау. Нефтяная и буровая техника. Выездной сервис по Атырауской области.",
  },
  "/about": {
    title: `О компании ACA Hydraulic | Ремонт гидравлики в Казахстане`,
    description:
      "ACA Hydraulic — профессиональный сервис по ремонту гидравлики спецтехники в Казахстане. Опыт более 10 лет, сертифицированные специалисты, гарантия качества.",
  },
  "/contacts": {
    title: `Контакты | ${SITE_NAME} — Ремонт гидравлики в Астане`,
    description:
      "Контакты ACA Hydraulic. Астана, ул. Абая 24/1. Телефон: +7 (771) 417-79-25. WhatsApp, Telegram. Работаем 24/7.",
  },
  "/reviews": {
    title: `Отзывы клиентов | ${SITE_NAME}`,
    description:
      "Отзывы клиентов о ремонте гидравлики спецтехники в ACA Hydraulic. Более 500 выполненных заказов. Работаем с крупными предприятиями Казахстана.",
  },
  "/cases": {
    title: `Кейсы и выполненные работы | ${SITE_NAME}`,
    description:
      "Примеры выполненных работ по ремонту гидравлики спецтехники. Реальные кейсы с описанием проблем и решений.",
  },
  "/projects": {
    title: `Проекты | ${SITE_NAME}`,
    description:
      "Крупные проекты по обслуживанию гидравлики для горнодобывающих и строительных предприятий Казахстана.",
  },
  "/corporate": {
    title: `Корпоративное обслуживание | ${SITE_NAME}`,
    description:
      "Корпоративные договоры на обслуживание гидравлики спецтехники. Работаем с НДС. Предприятиям горнодобывающей и строительной отрасли.",
  },
  "/blog": {
    title: `Блог о ремонте гидравлики спецтехники | ${SITE_NAME}`,
    description:
      "Статьи и советы по ремонту гидравлики спецтехники. Как определить неисправность, сколько стоит ремонт, советы по обслуживанию.",
  },
  "/blog/remont-gidronasosa-cat": {
    title: `Ремонт гидронасоса CAT: признаки неисправности и стоимость | ${SITE_NAME}`,
    description:
      "Как определить неисправность гидронасоса CAT, сколько стоит ремонт и когда нужна замена. Советы от специалистов ACA Hydraulic.",
  },
  "/blog/padaet-davlenie-gidravliki-ekskavatora": {
    title: `Почему падает давление гидравлики экскаватора: причины и решения | ${SITE_NAME}`,
    description:
      "Основные причины падения давления в гидросистеме экскаватора. Диагностика, устранение неисправностей. Советы от специалистов.",
  },
  "/blog/stoimost-remonta-gidromotora-komatsu": {
    title: `Стоимость ремонта гидромотора Komatsu в Казахстане | ${SITE_NAME}`,
    description:
      "Сколько стоит ремонт гидромотора Komatsu в Астане и Казахстане. Цены, сроки, гарантии. Сравнение с заменой нового.",
  },
  "/blog/kak-opredelit-neispravnost-gidravliki": {
    title: `Как определить неисправность гидравлики спецтехники | ${SITE_NAME}`,
    description:
      "Признаки неисправности гидравлической системы спецтехники. Как самостоятельно определить проблему до обращения в сервис.",
  },
  "/brands/cat": {
    title: `Ремонт гидравлики Caterpillar (CAT) в Астане | ${SITE_NAME}`,
    description:
      "Профессиональный ремонт гидравлики Caterpillar в Астане. Экскаваторы, бульдозеры, грейдеры CAT. Оригинальные запчасти, гарантия 6 месяцев.",
  },
  "/brands/komatsu": {
    title: `Ремонт гидравлики Komatsu в Астане | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики Komatsu в Астане и Казахстане. Экскаваторы PC, бульдозеры D, погрузчики WA. Выездной сервис 24/7.",
  },
  "/brands/hitachi": {
    title: `Ремонт гидравлики Hitachi в Астане | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики экскаваторов и спецтехники Hitachi в Астане. Насосы, моторы, гидроцилиндры. Выездной сервис по Казахстану.",
  },
  "/brands/hyundai": {
    title: `Ремонт гидравлики Hyundai в Астане | ${SITE_NAME}`,
    description:
      "Ремонт гидравлики экскаваторов Hyundai Robex в Астане. Гидронасосы, гидромоторы, распределители. Выездной сервис 24/7.",
  },
};

/**
 * Get SEO meta for a given URL path.
 * Handles dynamic routes like /regions/:slug
 */
export function getSeoMeta(urlPath: string): SeoMeta {
  // Strip query string and trailing slash
  const cleanPath = urlPath.split("?")[0].replace(/\/$/, "") || "/";

  // Direct match
  if (routeMeta[cleanPath]) {
    return routeMeta[cleanPath];
  }

  // Dynamic region routes: /regions/aktobe, /regions/pavlodar, etc.
  const regionMatch = cleanPath.match(/^\/regions\/([a-z-]+)$/);
  if (regionMatch) {
    const slug = regionMatch[1];
    const cityName = slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
      title: `Ремонт гидравлики в ${cityName} | Выездной сервис | ${SITE_NAME}`,
      description: `Ремонт гидравлики спецтехники в ${cityName}. Выездной сервис, диагностика и ремонт на объекте. Работаем 24/7 по Казахстану.`,
    };
  }

  // Default fallback
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

/**
 * Inject SEO meta tags into the HTML string.
 * Replaces the static title and meta description with route-specific values.
 */
export function injectSeoMeta(html: string, urlPath: string): string {
  const meta = getSeoMeta(urlPath);
  const canonical = `${SITE_URL}${urlPath === "/" ? "" : urlPath}`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );

  // Replace og:title
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`
  );

  // Replace og:description
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
  );

  // Replace twitter:title if present
  html = html.replace(
    /<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="twitter:title" content="${escapeHtml(meta.title)}" />`
  );

  // Replace twitter:description if present
  html = html.replace(
    /<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="twitter:description" content="${escapeHtml(meta.description)}" />`
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`
  );

  // Replace og:url if present
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`
  );

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

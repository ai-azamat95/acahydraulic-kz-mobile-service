import React from 'react';
import { useRoute } from 'wouter';
import RegionalPageTemplate from '@/components/RegionalPageTemplate';
import NotFound from '@/pages/NotFound';

// Configuration for all supported regions
const regionsConfig: Record<string, {
  city: string;
  regionSpec: string;
  seoTitle: string;
  seoDescription: string;
  heroImage: string;
  industries: string[];
}> = {
  'astana': {
    city: "Астана",
    regionSpec: "строительного сектора и коммунальных служб",
    seoTitle: "Ремонт гидравлики Астана | Выездной сервис спецтехники",
    seoDescription: "Ремонт гидравлики в Астане с выездом. Диагностика экскаваторов, кранов, погрузчиков. Ремонт насосов и распределителей. Работаем с НДС.",
    heroImage: "/images/astana-hydraulic.jpg",
    industries: [
      "Строительство жилых комплексов и дорог",
      "Коммунальная уборочная техника",
      "Свайные и буровые установки",
      "Подъемная техника и автокраны"
    ]
  },
  'karaganda': {
    city: "Караганда",
    regionSpec: "угольной промышленности и горнодобывающего сектора",
    seoTitle: "Ремонт гидравлики Караганда | Сервис карьерной техники",
    seoDescription: "Ремонт гидравлики в Караганде. Обслуживание карьерных экскаваторов, буровых станков, шахтного оборудования. Выезд на разрезы.",
    heroImage: "/images/karaganda-mining.jpg",
    industries: [
      "Угольные разрезы и добыча",
      "Карьерные экскаваторы (Hitachi, Komatsu)",
      "Шахтное гидравлическое оборудование",
      "Тяжелая бульдозерная техника"
    ]
  },
  'petropavlovsk': {
    city: "Петропавловск",
    regionSpec: "агропромышленного комплекса и машиностроения",
    seoTitle: "Ремонт гидравлики Петропавловск | Сервис сельхозтехники",
    seoDescription: "Ремонт гидравлики в Петропавловске. Диагностика тракторов, комбайнов, посевных комплексов. Выезд в поля СКО.",
    heroImage: "/images/petropavlovsk-agro.jpg",
    industries: [
      "Сельскохозяйственная техника (John Deere, Claas)",
      "Дорожно-строительные работы",
      "Коммунальное хозяйство",
      "Производственные линии"
    ]
  },
  'semey': {
    city: "Семей",
    regionSpec: "горнорудной промышленности и логистики",
    seoTitle: "Ремонт гидравлики Семей | Выездной сервис спецтехники",
    seoDescription: "Ремонт гидравлики в Семее и области Абай. Обслуживание горной техники, погрузчиков, кранов. Оперативный выезд.",
    heroImage: "/images/semey-industrial.jpg",
    industries: [
      "Горнорудные предприятия",
      "Логистические центры",
      "Строительство инфраструктуры",
      "Карьерная техника"
    ]
  },
  'pavlodar-ekibastuz': {
    city: "Павлодар — Экибастуз",
    regionSpec: "энергетического сектора и угольной промышленности",
    seoTitle: "Ремонт гидравлики Павлодар Экибастуз | Сервис спецтехники",
    seoDescription: "Ремонт гидравлики в Павлодаре и Экибастузе. Обслуживание техники на угольных разрезах и ГРЭС. Ремонт насосов и распределителей.",
    heroImage: "/images/pavlodar-energy.jpg",
    industries: [
      "Угольные разрезы Экибастуза",
      "Энергетические предприятия",
      "Металлургическая промышленность",
      "Железнодорожная спецтехника"
    ]
  },
  'zhezkazgan-balkhash': {
    city: "Жезказган — Балхаш",
    regionSpec: "цветной металлургии и горного дела",
    seoTitle: "Ремонт гидравлики Жезказган Балхаш | Сервис горной техники",
    seoDescription: "Ремонт гидравлики в Жезказгане и Балхаше. Обслуживание техники на медных рудниках и обогатительных фабриках. Выездной сервис.",
    heroImage: "/images/zhezkazgan-copper.jpg",
    industries: [
      "Медные рудники и карьеры",
      "Обогатительные фабрики",
      "Подземная горная техника",
      "Тяжелые самосвалы и погрузчики"
    ]
  },
  'kokshetau': {
    city: "Кокшетау",
    regionSpec: "золотодобывающей промышленности и агросектора",
    seoTitle: "Ремонт гидравлики Кокшетау | Сервис спецтехники Акмолинская область",
    seoDescription: "Ремонт гидравлики в Кокшетау и Акмолинской области. Обслуживание техники на золотых приисках и полях. Выездной сервис.",
    heroImage: "/images/kokshetau-gold.jpg",
    industries: [
      "Золотодобывающие предприятия",
      "Зерновое хозяйство",
      "Дорожное строительство",
      "Карьерная техника"
    ]
  },
  'kostanay': {
    city: "Костанай",
    regionSpec: "железорудной промышленности и сельского хозяйства",
    seoTitle: "Ремонт гидравлики Костанай | Сервис спецтехники",
    seoDescription: "Ремонт гидравлики в Костанае и области. Обслуживание техники на железорудных карьерах и в агросекторе. Ремонт гидронасосов.",
    heroImage: "/images/kostanay-iron.jpg",
    industries: [
      "Железорудные карьеры (ССГПО)",
      "Крупные агрохолдинги",
      "Машиностроение",
      "Строительство дорог"
    ]
  },
  // Keep existing major cities for backward compatibility if needed, 
  // though we can route them all through here
  'almaty': {
    city: "Алматы",
    regionSpec: "строительства, логистики и промышленности",
    seoTitle: "Ремонт гидравлики Алматы | Выездной сервис спецтехники",
    seoDescription: "Ремонт гидравлики в Алматы и области. Диагностика и ремонт спецтехники с выездом. Ремонт гидронасосов, моторов, цилиндров.",
    heroImage: "/images/almaty-construction.jpg",
    industries: [
      "Строительство БАКАД и развязок",
      "Логистические терминалы",
      "Карьеры щебня и песка",
      "Бетонные заводы"
    ]
  },
  'atyrau': {
    city: "Атырау",
    regionSpec: "нефтегазового сектора и шельфовых проектов",
    seoTitle: "Ремонт гидравлики Атырау | Сервис нефтегазовой техники",
    seoDescription: "Ремонт гидравлики в Атырау. Обслуживание техники на месторождениях Тенгиз, Кашаган. Взрывозащищенное оборудование.",
    heroImage: "/images/atyrau-oil.jpg",
    industries: [
      "Нефтегазовые месторождения (Тенгиз, Кашаган)",
      "Строительство трубопроводов",
      "Портовая инфраструктура",
      "Буровые установки"
    ]
  },
  'aktau': {
    city: "Актау",
    regionSpec: "морской логистики и нефтесервиса",
    seoTitle: "Ремонт гидравлики Актау | Сервис портовой техники",
    seoDescription: "Ремонт гидравлики в Актау. Обслуживание портовых кранов, погрузчиков, техники на месторождениях Мангистау.",
    heroImage: "/images/aktau-port.jpg",
    industries: [
      "Морской порт Актау",
      "Месторождения Мангистау",
      "Карьеры ракушечника",
      "Транспортная логистика"
    ]
  },
  'shymkent': {
    city: "Шымкент",
    regionSpec: "промышленности и сельского хозяйства",
    seoTitle: "Ремонт гидравлики Шымкент | Выездной сервис ЮКО",
    seoDescription: "Ремонт гидравлики в Шымкенте и Туркестанской области. Обслуживание спецтехники, цементных заводов, агротехники.",
    heroImage: "/images/shymkent-industry.jpg",
    industries: [
      "Цементные и кирпичные заводы",
      "Сельское хозяйство ЮКО",
      "Строительство дорог",
      "Нефтепереработка"
    ]
  }
};

export default function RegionPage() {
  const [match, params] = useRoute("/regions/:slug");
  
  if (!match || !params?.slug) {
    return <NotFound />;
  }

  const regionData = regionsConfig[params.slug];

  if (!regionData) {
    return <NotFound />;
  }

  return (
    <RegionalPageTemplate
      city={regionData.city}
      regionSpec={regionData.regionSpec}
      seoTitle={regionData.seoTitle}
      seoDescription={regionData.seoDescription}
      canonical={`/regions/${params.slug}`}
      heroImage={regionData.heroImage}
      industries={regionData.industries}
    />
  );
}

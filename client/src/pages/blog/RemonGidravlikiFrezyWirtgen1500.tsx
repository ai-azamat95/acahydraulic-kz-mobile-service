import React from "react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle } from "lucide-react";

import { publicAsset } from "@/lib/assets";
declare global {
  interface Window {
    gtag_whatsapp_conversion?: () => void;
  }
}

const WIRTGEN_PHOTOS = [
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-1.webp"),
    alt: "Специалисты ACA Hydraulic диагностируют гидравлику дорожной фрезы Wirtgen 1500",
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-2.webp"),
    alt: "Диагностика гидравлического блока Wirtgen 1500 с манометрами давления",
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-6.webp"),
    alt: "Инженер ACA Hydraulic диагностирует гидромотор ходовой части Wirtgen 1500",
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-7.webp"),
    alt: "Фреза Wirtgen 1500 на площадке перед выездной диагностикой ACA Hydraulic",
  },
];

export default function RemonGidravlikiFrezyWirtgen1500() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Ремонт гидравлики дорожной фрезы Wirtgen 1500: потеря хода при нагреве",
    description:
      "Реальный кейс ACA Hydraulic: дорожная фреза Wirtgen 1500 теряла ход при нагреве гидравлики. Диагностика, причина, ремонт за 2 дня. Фото с объекта.",
    datePublished: "2026-03-18",
    dateModified: "2026-03-18",
    author: {
      "@type": "Person",
      name: "Инженер ACA Hydraulic",
      jobTitle: "Главный инженер-гидравлик",
    },
    publisher: {
      "@id": "https://acahydraulic.kz/#business",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://acahydraulic.kz/blog/remont-gidravliki-frezy-wirtgen-1500",
    },
    image: publicAsset("webdev-static-assets/wirtgen-1500-1.webp"),
    articleSection: "Ремонт Wirtgen",
    keywords:
      "ремонт гидравлики Wirtgen 1500, дорожная фреза теряет ход при нагреве, ремонт гидромотора Wirtgen, ремонт дорожной фрезы Казахстан, Wirtgen потеря хода",
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Ремонт гидравлики Wirtgen 1500: потеря хода при нагреве | ACA Hydraulic"
        description="Реальный кейс: дорожная фреза Wirtgen 1500 теряла ход при нагреве гидравлики. Диагностика выявила износ уплотнений гидромоторов. Ремонт за 2 дня. Фото с объекта."
        keywords="ремонт гидравлики Wirtgen 1500, дорожная фреза теряет ход при нагреве, ремонт гидромотора Wirtgen, ремонт дорожной фрезы Казахстан, Wirtgen потеря хода при нагреве"
        canonical="/blog/remont-gidravliki-frezy-wirtgen-1500"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Ремонт Wirtgen 1500", url: "/blog/remont-gidravliki-frezy-wirtgen-1500" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему дорожная фреза Wirtgen теряет ход при нагреве?",
            answer:
              "Потеря хода при нагреве — признак износа уплотнений в гидромоторах ходовой части. При нагреве масла вязкость снижается, изношенные уплотнения начинают пропускать масло, давление падает ниже рабочего — машина останавливается.",
          },
          {
            question: "Сколько стоит ремонт гидромотора хода Wirtgen 1500?",
            answer:
              "Ремонт гидромотора ходовой части Wirtgen 1500 стоит от 80 000 до 150 000 тенге в зависимости от степени износа. Диагностика бесплатна при последующем ремонте.",
          },
          {
            question: "Сколько времени занимает ремонт гидравлики Wirtgen?",
            answer:
              "В данном кейсе ремонт занял 2 дня: 1 день — выездная диагностика и дефектовка, 1 день — замена уплотнений и регулировка давления. Сроки зависят от наличия запчастей.",
          },
        ]}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex gap-[3px] h-[28px]">
                <div className="w-[10px] h-full bg-[#FFC000]"></div>
                <div className="flex flex-col justify-between h-full">
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]"></div>
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-sans font-bold text-[18px] text-white leading-none tracking-wide">ACA</span>
                <span className="font-sans font-medium text-[11px] text-white leading-none tracking-wider mt-[2px]">HYDRAULIC</span>
              </div>
            </div>
          </Link>
          <a
            href="tel:+77714177925"
            className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#FFC000]" />
            <span className="text-[#FFC000] font-bold font-bebas text-lg">+7 (771) 417-79-25</span>
          </a>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] transition-colors mb-8 cursor-pointer text-sm">
            <ArrowLeft size={16} />
            Назад в блог
          </span>
        </Link>

        {/* Category & meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="bg-[#FFC000]/10 border border-[#FFC000]/20 text-[#FFC000] px-3 py-1 rounded font-bold uppercase tracking-wider">
            Ремонт Wirtgen
          </span>
          <span className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded font-bold uppercase tracking-wider">
            Реальный кейс
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            18.03.2026
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            6 мин чтения
          </span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Ремонт гидравлики дорожной фрезы Wirtgen 1500: потеря хода при нагреве
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Дорожная фреза Wirtgen 1500 встала прямо на объекте в разгар работ по фрезерованию асфальта. Машина нормально работала в холодном состоянии, но после прогрева гидравлического масла полностью теряла ход. Рассказываем, как мы нашли причину и восстановили технику за 2 дня.
        </p>

        {/* Hero photo */}
        <img
          src={WIRTGEN_PHOTOS[0].url}
          alt={WIRTGEN_PHOTOS[0].alt}
          className="w-full rounded-lg mb-10 object-cover h-72"
          loading="lazy"
        />

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Ситуация: машина встала на объекте</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          К нам обратилась дорожно-строительная компания с проблемой: фреза Wirtgen 1500 переставала двигаться после 30–60 минут работы. В холодном состоянии машина ехала нормально, но как только гидравлическое масло прогревалось до рабочей температуры — ход пропадал полностью. Техника стояла на дороге, срывая сроки контракта.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Стандартные сервисы не смогли оперативно решить проблему. Заказчик обратился в ACA Hydraulic — мы выехали на объект в день обращения.
        </p>

        {/* Warning block */}
        <div className="bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-lg p-5 mb-8 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-[#FFC000] shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-bold mb-1">Важно: не игнорируйте этот симптом</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Потеря хода при нагреве — прогрессирующая неисправность. Если не устранить её вовремя, износ уплотнений приведёт к повреждению самих гидромоторов, что увеличит стоимость ремонта в 3–5 раз.
            </p>
          </div>
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Диагностика: ищем причину</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Первым делом провели замер давления в гидросистеме в холодном и горячем режиме. Результат подтвердил предположение: в холодном состоянии давление в норме — 350 бар, после прогрева падает до 180–200 бар. Этого недостаточно для нормальной работы гидромоторов хода.
        </p>

        {/* Diagnostic photo */}
        <img
          src={WIRTGEN_PHOTOS[1].url}
          alt={WIRTGEN_PHOTOS[1].alt}
          className="w-full rounded-lg mb-6 object-cover h-64"
          loading="lazy"
        />

        <p className="text-gray-300 mb-8 leading-relaxed">
          Параллельно проверили электронный блок управления и гидравлические клапаны — они работали корректно. Это подтвердило: проблема именно в гидромоторах ходовой части, а не в управляющей электронике.
        </p>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Причина: износ уплотнений гидромоторов</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          После демонтажа гидромоторов ходовой части картина стала ясной. Уплотнительные манжеты имели значительный износ. В холодном состоянии густое масло ещё «держало» давление, но при нагреве вязкость масла снижалась — и через изношенные уплотнения начинались внутренние перетечки. Давление падало, гидромоторы не развивали нужного крутящего момента.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "Давление в норме (холодный)", value: "350 бар", color: "text-green-400" },
            { title: "Давление при нагреве (до ремонта)", value: "180–200 бар", color: "text-red-400" },
            { title: "Давление после ремонта", value: "340–350 бар", color: "text-green-400" },
          ].map((item, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center">
              <p className="text-white/50 text-xs mb-2">{item.title}</p>
              <p className={`font-bebas text-2xl ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Ремонт: что сделали</h2>
        <div className="space-y-4 mb-8">
          {[
            { step: "01", title: "Демонтаж гидромоторов", desc: "Сняли гидромоторы ходовой части с обеих сторон фрезы для полной дефектовки" },
            { step: "02", title: "Замена уплотнительных комплектов", desc: "Заменили все уплотнительные манжеты и кольца на новые — использовали качественные аналоги с подтверждёнными характеристиками" },
            { step: "03", title: "Регулировка давления", desc: "Отрегулировали предохранительные клапаны и настроили рабочее давление в системе по спецификации Wirtgen" },
            { step: "04", title: "Проверка в горячем режиме", desc: "После сборки прогрели систему до рабочей температуры и проверили давление и работу хода — всё в норме" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 bg-[#1a1a1a] border border-white/10 rounded-lg p-5">
              <span className="font-bebas text-3xl text-[#FFC000] flex-shrink-0">{item.step}</span>
              <div>
                <h3 className="font-bebas text-xl mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Field photos */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <img
            src={WIRTGEN_PHOTOS[2].url}
            alt={WIRTGEN_PHOTOS[2].alt}
            className="w-full rounded-lg object-cover h-48"
            loading="lazy"
          />
          <img
            src={WIRTGEN_PHOTOS[3].url}
            alt={WIRTGEN_PHOTOS[3].alt}
            className="w-full rounded-lg object-cover h-48"
            loading="lazy"
          />
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Результат</h2>
        <ul className="space-y-3 mb-8">
          {[
            "Ремонт выполнен за 2 дня — фреза вернулась на объект в срок",
            "Ход работает стабильно при любой температуре гидравлического масла",
            "Давление в системе восстановлено до 340–350 бар",
            "Заказчик продолжил работы по графику без простоя",
            "Гарантия на выполненный ремонт — 6 месяцев",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Типичные симптомы проблем с гидравликой Wirtgen</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Если ваша дорожная фреза Wirtgen демонстрирует один из следующих симптомов — не откладывайте диагностику:
        </p>
        <ul className="space-y-3 mb-8">
          {[
            "Потеря хода или тяги после прогрева — классический признак износа уплотнений гидромоторов",
            "Медленная работа в жаркую погоду — перегрев гидравлического масла из-за засорения радиатора или неисправности термостата",
            "Рывки при движении — воздух в гидросистеме или неисправность гидронасоса",
            "Утечка масла из-под гидромоторов или насосов — износ наружных уплотнений",
            "Шум при работе гидравлики — кавитация или износ качающего узла насоса",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Internal links */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные материалы</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/brands/wirtgen">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидравлики Wirtgen
              </span>
            </Link>
            <Link href="/blog/kapitalnyy-remont-shantui-sd32">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Кейс: Капремонт SHANTUI SD32
              </span>
            </Link>
            <Link href="/brands/shantui">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт SHANTUI
              </span>
            </Link>
            <Link href="/services/mobile-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Выездной ремонт
              </span>
            </Link>
            <Link href="/projects">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Все проекты ACA Hydraulic
              </span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1a1a1a] border border-[#FFC000]/30 rounded-xl p-8 text-center">
          <h3 className="font-bebas text-3xl mb-3">
            Та же проблема с <span className="text-[#FFC000]">Wirtgen?</span>
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Выездная диагностика. Ремонт на объекте. Гарантия 6 месяцев.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/77714177925?text=Здравствуйте!%20Нужен%20ремонт%20гидравлики%20Wirtgen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bebas text-lg px-6 py-3 rounded transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href="tel:+77714177925"
              className="flex items-center justify-center gap-2 bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas text-lg px-6 py-3 rounded transition-colors"
            >
              <Phone className="w-5 h-5" />
              +7 (771) 417-79-25
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

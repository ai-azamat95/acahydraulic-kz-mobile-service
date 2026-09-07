import React from "react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, CheckCircle } from "lucide-react";

import { publicAsset } from "@/lib/assets";
declare global {
  interface Window {
    gtag_whatsapp_conversion?: () => void;
  }
}

const SHANTUI_PHOTOS = [
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-6.webp"),
    alt: "Демонтаж двигателя бульдозера SHANTUI SD32 автокраном — подготовка к капитальному ремонту",
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-1.webp"),
    alt: "Капитальный ремонт двигателя бульдозера SHANTUI SD32 — разборка и дефектовка",
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-2.webp"),
    alt: "Ремонт гидравлической системы бульдозера SHANTUI SD32",
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-3.webp"),
    alt: "Специалист ACA Hydraulic проверяет гидравлику SHANTUI SD32 после ремонта",
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-4.webp"),
    alt: "Бульдозер SHANTUI SD32 после капитального ремонта — вид сбоку",
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-5.webp"),
    alt: "Гидравлические узлы SHANTUI SD32 после восстановления",
  },
];

export default function KapitalnyiRemonShantuiSD32() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Капитальный ремонт бульдозера SHANTUI SD32: ДВС и гидравлика — реальный кейс",
    description:
      "Реальный кейс ACA Hydraulic: капитальный ремонт бульдозера SHANTUI SD32 — полное восстановление двигателя и гидравлической системы. 18 рабочих дней, фото с объекта.",
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
      "@id": "https://acahydraulic.kz/blog/kapitalnyy-remont-shantui-sd32",
    },
    image: publicAsset("webdev-static-assets/shantui-sd32-6.webp"),
    articleSection: "Ремонт бульдозеров",
    keywords:
      "капитальный ремонт SHANTUI SD32, ремонт бульдозера SHANTUI, ремонт ДВС SHANTUI SD32, ремонт гидравлики SHANTUI, SHANTUI SD32 Казахстан",
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Капитальный ремонт SHANTUI SD32: ДВС и гидравлика | ACA Hydraulic"
        description="Реальный кейс: капитальный ремонт бульдозера SHANTUI SD32 — полное восстановление двигателя и гидравлики за 18 рабочих дней. Фото с объекта. ACA Hydraulic, Казахстан."
        keywords="капитальный ремонт SHANTUI SD32, ремонт бульдозера SHANTUI, ремонт ДВС SHANTUI SD32, ремонт гидравлики SHANTUI, SHANTUI SD32 Казахстан, капремонт бульдозера Казахстан"
        canonical="/blog/kapitalnyy-remont-shantui-sd32"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Капремонт SHANTUI SD32", url: "/blog/kapitalnyy-remont-shantui-sd32" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Сколько стоит капитальный ремонт бульдозера SHANTUI SD32?",
            answer:
              "Капитальный ремонт SHANTUI SD32 (ДВС + гидравлика) стоит от 1 500 000 тенге в зависимости от объёма работ и состояния узлов. Точную стоимость определяем после дефектовки. Диагностика бесплатна при последующем ремонте.",
          },
          {
            question: "Сколько времени занимает капремонт SHANTUI SD32?",
            answer:
              "В данном кейсе полный капитальный ремонт ДВС и гидравлики занял 18 рабочих дней. Сроки зависят от наличия запчастей и объёма восстановительных работ.",
          },
          {
            question: "Используете ли вы оригинальные запчасти SHANTUI?",
            answer:
              "Используем как оригинальные запчасти SHANTUI, так и качественные аналоги от проверенных производителей. Всегда согласовываем выбор запчастей с клиентом до начала работ.",
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
            Ремонт бульдозеров
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
            7 мин чтения
          </span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Капитальный ремонт бульдозера SHANTUI SD32: ДВС и гидравлика — реальный кейс
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          SHANTUI SD32 — мощный бульдозер 32 тонны с двигателем 320 л.с. Техника работала на горнодобывающем предприятии и выработала ресурс. Заказчик обратился в ACA Hydraulic для проведения полного капитального ремонта: восстановления двигателя и гидравлической системы. Рассказываем, что мы сделали и какой результат получили.
        </p>

        {/* Hero photo */}
        <img
          src={SHANTUI_PHOTOS[0].url}
          alt={SHANTUI_PHOTOS[0].alt}
          className="w-full rounded-lg mb-10 object-cover h-72"
          loading="lazy"
        />

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Техника и исходное состояние</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Модель", value: "SHANTUI SD32" },
            { label: "Мощность", value: "320 л.с." },
            { label: "Масса", value: "32 тонны" },
            { label: "Срок ремонта", value: "18 дней" },
          ].map((item, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-center">
              <p className="text-white/40 text-xs mb-1">{item.label}</p>
              <p className="text-[#FFC000] font-bold">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Бульдозер поступил с выработанным ресурсом двигателя и гидравлики: падение мощности, повышенный расход масла, нестабильная работа гидравлических систем. Машина требовала полного капитального восстановления.
        </p>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Капитальный ремонт двигателя ДВС</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Двигатель бульдозера SHANTUI SD32 был полностью демонтирован с применением автокрана. После разборки провели тщательную дефектовку всех деталей.
        </p>
        <div className="space-y-3 mb-8">
          {[
            "Полная разборка и дефектовка двигателя",
            "Расточка и хонингование цилиндров под ремонтный размер",
            "Замена поршневых колец, вкладышей коленвала и распредвала",
            "Шлифовка головки блока цилиндров, замена прокладок",
            "Замена масляного насоса и водяного насоса",
            "Регулировка клапанов и топливной аппаратуры",
            "Обкатка двигателя на стенде после сборки",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-3">
              <CheckCircle className="w-4 h-4 text-[#FFC000] shrink-0" />
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Ремонт гидравлической системы</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Параллельно с ремонтом двигателя проводили восстановление гидравлической системы. Гидравлика бульдозера SHANTUI SD32 включает насосы, гидромоторы хода и поворота, гидроцилиндры отвала и рыхлителя, распределители и клапаны.
        </p>
        <div className="space-y-3 mb-8">
          {[
            "Диагностика и ремонт главного гидронасоса",
            "Замена уплотнений гидромоторов ходовой части",
            "Ремонт гидроцилиндров отвала и рыхлителя",
            "Замена гидравлических рукавов и фитингов",
            "Промывка гидросистемы и замена масла",
            "Регулировка предохранительных клапанов",
            "Проверка работы всех гидравлических функций",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-3">
              <CheckCircle className="w-4 h-4 text-[#FFC000] shrink-0" />
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* Photo gallery */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {SHANTUI_PHOTOS.slice(2, 6).map((photo, i) => (
            <img
              key={i}
              src={photo.url}
              alt={photo.alt}
              className="w-full rounded-lg object-cover h-48"
              loading="lazy"
            />
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Результат капитального ремонта</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Через 18 рабочих дней бульдозер SHANTUI SD32 был полностью восстановлен и передан заказчику. Все системы работают в штатном режиме.
        </p>
        <ul className="space-y-3 mb-8">
          {[
            "Двигатель восстановлен до заводских характеристик — мощность 320 л.с.",
            "Гидравлика работает без утечек, давление в норме по всем контурам",
            "Расход масла в норме — нет признаков износа",
            "Бульдозер вернулся на объект и работает в штатном режиме",
            "Гарантия на капитальный ремонт — 6 месяцев",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Когда нужен капитальный ремонт бульдозера</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Капитальный ремонт бульдозера SHANTUI SD32 необходим при следующих признаках:
        </p>
        <ul className="space-y-3 mb-8">
          {[
            "Падение мощности двигателя более чем на 20% от номинала",
            "Повышенный расход масла — более 0,5 л на 100 моточасов",
            "Синий или белый дым из выхлопной трубы",
            "Нестабильная работа гидравлики: медленный ход, слабый отвал",
            "Наработка более 10 000–12 000 моточасов без капремонта",
            "Металлическая стружка в масле при анализе",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Internal links */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные материалы</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/brands/shantui">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидравлики SHANTUI
              </span>
            </Link>
            <Link href="/blog/remont-gidravliki-frezy-wirtgen-1500">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Кейс: Ремонт Wirtgen 1500
              </span>
            </Link>
            <Link href="/brands/wirtgen">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт Wirtgen
              </span>
            </Link>
            <Link href="/services/bulldozer-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт бульдозеров
              </span>
            </Link>
            <Link href="/services/hydraulic-pumps">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидронасосов
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
            Нужен капремонт <span className="text-[#FFC000]">SHANTUI?</span>
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Бесплатная диагностика. Полное восстановление. Гарантия 6 месяцев.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/77714177925?text=Здравствуйте!%20Нужен%20капитальный%20ремонт%20SHANTUI%20SD32"
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

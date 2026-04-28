import React from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    gtag_whatsapp_conversion?: () => void;
  }
}

export default function RemonGidronasosaCat() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Ремонт гидронасоса CAT: пошаговое руководство и стоимость",
    description:
      "Разбираем ремонт гидронасоса экскаватора Caterpillar (CAT 320, 330, 336). Признаки неисправности, диагностика, стоимость ремонта в Казахстане.",
    datePublished: "2026-02-10",
    dateModified: "2026-02-10",
    author: {
      "@type": "Person",
      name: "Александр Иванов",
      jobTitle: "Главный инженер",
    },
    publisher: {
      "@id": "https://acahydraulic.kz/#business",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://acahydraulic.kz/blog/remont-gidronasosa-cat",
    },
    image: "https://acahydraulic.kz/images/hydraulic-pump-repair.webp",
    articleSection: "Ремонт CAT",
    keywords:
      "ремонт гидронасоса CAT, ремонт гидронасоса Caterpillar, CAT 320 гидронасос, ремонт гидравлики CAT Астана",
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Ремонт гидронасоса CAT: пошаговое руководство и стоимость | ACA Hydraulic"
        description="Ремонт гидронасоса экскаватора Caterpillar CAT 320, 330, 336 в Астане. Признаки неисправности, диагностика, стоимость от 80 000 тг. Гарантия 12 месяцев."
        keywords="ремонт гидронасоса CAT, ремонт гидронасоса Caterpillar, CAT 320 гидронасос ремонт, ремонт гидравлики CAT Астана, стоимость ремонта гидронасоса CAT"
        canonical="/blog/remont-gidronasosa-cat"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Ремонт гидронасоса CAT", url: "/blog/remont-gidronasosa-cat" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Сколько стоит ремонт гидронасоса CAT 320?",
            answer:
              "Ремонт гидронасоса CAT 320 в Астане стоит от 80 000 тг. Точная стоимость зависит от степени износа и необходимых запчастей. Диагностика бесплатна при последующем ремонте.",
          },
          {
            question: "Сколько времени занимает ремонт гидронасоса CAT?",
            answer:
              "Ремонт гидронасоса CAT занимает 3-7 рабочих дней. При наличии запчастей на складе срок сокращается до 3-5 дней.",
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
            Ремонт CAT
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            10.02.2026
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            8 мин чтения
          </span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Ремонт гидронасоса CAT: пошаговое руководство и стоимость
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Гидронасос — сердце гидравлической системы экскаватора Caterpillar. Когда он выходит из строя, машина встаёт. В этой статье разбираем признаки неисправности, процесс диагностики и реальную стоимость ремонта гидронасоса CAT в Казахстане.
        </p>

        <img
          src="/images/hydraulic-pump-repair.webp"
          alt="Ремонт гидронасоса CAT в Астане"
          className="w-full rounded-lg mb-10 object-cover h-64"
          loading="lazy"
        />

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Признаки неисправности гидронасоса CAT</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Гидронасосы экскаваторов CAT (Caterpillar) работают в тяжёлых условиях: высокое давление до 350 бар, постоянные нагрузки, загрязнённая среда. Вот основные симптомы, что насос требует ремонта:
        </p>
        <ul className="space-y-3 mb-8">
          {[
            "Медленная работа стрелы, рукояти или ковша — снизилась скорость операций",
            "Посторонний шум (вой, скрежет) при работе гидравлики",
            "Перегрев гидравлического масла выше 80°C",
            "Потеря давления — манометр показывает ниже нормы",
            "Утечка масла из корпуса насоса",
            "Вибрация при работе под нагрузкой",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Какие модели CAT мы ремонтируем</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Мы специализируемся на ремонте гидронасосов для всей линейки экскаваторов Caterpillar:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {["CAT 320 / 320D / 320GC", "CAT 323 / 323D", "CAT 330 / 330D / 330GC", "CAT 336 / 336E", "CAT 349 / 349F", "CAT 390 / 395"].map((model) => (
            <div key={model} className="bg-[#1a1a1a] border border-white/10 rounded p-3 text-sm text-gray-300 text-center">
              {model}
            </div>
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Процесс ремонта гидронасоса CAT</h2>
        <div className="space-y-6 mb-8">
          {[
            {
              step: "01",
              title: "Диагностика",
              desc: "Снимаем насос, проводим flow-test на стенде. Замеряем объёмный КПД, давление, расход. Определяем точную причину неисправности.",
            },
            {
              step: "02",
              title: "Дефектовка",
              desc: "Разбираем насос, осматриваем все детали: блок цилиндров, поршни, распределительную шайбу, вал. Замеряем износ микрометром.",
            },
            {
              step: "03",
              title: "Ремонт",
              desc: "Заменяем изношенные детали: ремкомплект, качающий узел или отдельные компоненты. Используем оригинальные или качественные аналоги.",
            },
            {
              step: "04",
              title: "Обкатка и испытания",
              desc: "После сборки обкатываем насос на стенде под нагрузкой. Проверяем давление, расход, температуру. Выдаём протокол испытаний.",
            },
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

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Стоимость ремонта гидронасоса CAT в Астане</h2>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 font-normal">Модель / Услуга</th>
                <th className="text-right p-4 text-gray-400 font-normal">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Диагностика гидронасоса", "Бесплатно при ремонте"],
                ["Ремонт гидронасоса CAT 320", "от 80 000 тг"],
                ["Ремонт гидронасоса CAT 330", "от 90 000 тг"],
                ["Ремонт гидронасоса CAT 336", "от 100 000 тг"],
                ["Замена ремкомплекта", "от 40 000 тг"],
                ["Замена качающего узла", "от 120 000 тг"],
              ].map(([service, price]) => (
                <tr key={service} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-300">{service}</td>
                  <td className="p-4 text-right text-[#FFC000] font-bold">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#FFC000]/10 border border-[#FFC000]/20 rounded-lg p-6 mb-10">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-[#FFC000]">Важно:</strong> Стоимость ремонта гидронасоса CAT указана ориентировочно и зависит от степени износа, модели и необходимых запчастей. Точную цену определяем после бесплатной диагностики. Гарантия на ремонт — 12 месяцев.
          </p>
        </div>

        {/* Internal links */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные услуги</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/hydraulic-pumps">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидронасосов
              </span>
            </Link>
            <Link href="/services/excavator-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт экскаваторов CAT
              </span>
            </Link>
            <Link href="/services/mobile-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Выездной ремонт
              </span>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1a1a1a] border border-[#FFC000]/30 rounded-xl p-8 text-center">
          <h3 className="font-bebas text-3xl mb-3">
            Нужен ремонт гидронасоса <span className="text-[#FFC000]">CAT?</span>
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Бесплатная диагностика. Выезд на объект. Гарантия 12 месяцев.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/77714177925?text=Здравствуйте!%20Нужен%20ремонт%20гидронасоса%20CAT"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.gtag_whatsapp_conversion?.()}
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

import React from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, AlertTriangle } from "lucide-react";

declare global {
  interface Window {
    gtag_whatsapp_conversion?: () => void;
  }
}

export default function PadaetDavlenieGidravliki() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Почему падает давление гидравлики экскаватора: 7 причин",
    description:
      "Низкое давление в гидросистеме экскаватора — 7 причин и способы диагностики. Как определить неисправность и что делать.",
    datePublished: "2026-01-25",
    dateModified: "2026-01-25",
    author: {
      "@type": "Person",
      name: "Сергей Петров",
      jobTitle: "Сервисный инженер",
    },
    publisher: {
      "@id": "https://acahydraulic.kz/#business",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://acahydraulic.kz/blog/padaet-davlenie-gidravliki-ekskavatora",
    },
    image: "https://acahydraulic.kz/images/excavator-tech-repair.webp",
  };

  const causes = [
    {
      num: "01",
      title: "Износ гидронасоса",
      desc: "Самая частая причина. При износе поршневой группы или распределительной шайбы насос теряет объёмный КПД — давление падает. Диагностируется flow-тестом на стенде.",
      fix: "Ремонт или замена гидронасоса",
    },
    {
      num: "02",
      title: "Неправильная настройка предохранительного клапана",
      desc: "Предохранительный клапан открывается раньше времени, сбрасывая давление в бак. Может произойти из-за загрязнения или механического повреждения.",
      fix: "Очистка или замена клапана, регулировка давления",
    },
    {
      num: "03",
      title: "Внутренние утечки в гидрораспределителе",
      desc: "Изношенные золотниковые пары пропускают масло между секциями. Давление в системе падает, операции замедляются.",
      fix: "Ремонт гидрораспределителя, замена золотников",
    },
    {
      num: "04",
      title: "Загрязнение гидравлического масла",
      desc: "Металлическая стружка, вода или воздух в масле разрушают уплотнения и рабочие поверхности. Давление нестабильно, насос шумит.",
      fix: "Замена масла и фильтров, промывка системы",
    },
    {
      num: "05",
      title: "Неисправность гидроцилиндра",
      desc: "Изношенные уплотнения поршня гидроцилиндра создают внутренние перетечки. Стрела или рукоять медленно опускаются под нагрузкой.",
      fix: "Замена уплотнений гидроцилиндра",
    },
    {
      num: "06",
      title: "Засорение фильтра всасывания",
      desc: "Забитый фильтр создаёт кавитацию на входе насоса. Давление нестабильное, насос издаёт характерный вой.",
      fix: "Замена фильтра всасывания",
    },
    {
      num: "07",
      title: "Неисправность регулятора насоса",
      desc: "Регулятор переменной производительности не удерживает заданное давление. Насос не выходит на рабочий режим.",
      fix: "Ремонт или замена регулятора насоса",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Почему падает давление гидравлики экскаватора: 7 причин | ACA Hydraulic"
        description="Низкое давление в гидросистеме экскаватора — 7 причин: износ насоса, клапан, утечки. Как диагностировать самостоятельно и что делать. Выезд мастера в Астане."
        keywords="падает давление гидравлики экскаватора, низкое давление гидравлики, причины падения давления гидравлики, диагностика гидравлики экскаватора"
        canonical="/blog/padaet-davlenie-gidravliki-ekskavatora"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Почему падает давление гидравлики", url: "/blog/padaet-davlenie-gidravliki-ekskavatora" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему падает давление гидравлики экскаватора?",
            answer:
              "Основные причины: износ гидронасоса, неправильная настройка предохранительного клапана, внутренние утечки в гидрораспределителе, загрязнение масла, неисправность гидроцилиндра, засорение фильтра, неисправность регулятора насоса.",
          },
          {
            question: "Как проверить давление гидравлики экскаватора?",
            answer:
              "Давление проверяется манометром на диагностических штуцерах гидросистемы. Нормальное рабочее давление для большинства экскаваторов — 300-350 бар. Для точной диагностики используется flow-тест на стенде.",
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

      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] transition-colors mb-8 cursor-pointer text-sm">
            <ArrowLeft size={16} />
            Назад в блог
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="bg-[#FFC000]/10 border border-[#FFC000]/20 text-[#FFC000] px-3 py-1 rounded font-bold uppercase tracking-wider">
            Диагностика
          </span>
          <span className="flex items-center gap-1"><Calendar size={12} />25.01.2026</span>
          <span className="flex items-center gap-1"><Clock size={12} />6 мин чтения</span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Почему падает давление гидравлики экскаватора: 7 причин
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Низкое давление в гидросистеме — один из самых распространённых симптомов неисправности спецтехники. Машина работает медленно, не поднимает нагрузку, стрела опускается сама. Разбираем 7 главных причин и объясняем, как их диагностировать.
        </p>

        <img
          src="/images/excavator-tech-repair.webp"
          alt="Диагностика гидравлики экскаватора"
          className="w-full rounded-lg mb-10 object-cover h-64"
          loading="lazy"
        />

        <div className="bg-[#FFC000]/10 border border-[#FFC000]/20 rounded-lg p-5 mb-10 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Важно:</strong> Не игнорируйте падение давления. Продолжение работы с неисправной гидравликой приводит к дорогостоящему ремонту насоса и других компонентов.
          </p>
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-6">7 причин падения давления гидравлики</h2>

        <div className="space-y-6 mb-10">
          {causes.map((cause) => (
            <div key={cause.num} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="font-bebas text-3xl text-[#FFC000] flex-shrink-0">{cause.num}</span>
                <div>
                  <h3 className="font-bebas text-xl mb-2">{cause.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{cause.desc}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Решение:</span>
                    <span className="text-[#FFC000]">{cause.fix}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Как диагностировать причину самостоятельно</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Без специального оборудования точно определить причину невозможно, но есть признаки, которые помогут сузить круг поиска:
        </p>
        <ul className="space-y-3 mb-8 text-gray-300 text-sm">
          <li className="flex gap-3"><span className="text-[#FFC000] font-bold flex-shrink-0">→</span> Шум при работе насоса (вой, свист) — кавитация, засорение фильтра или износ насоса</li>
          <li className="flex gap-3"><span className="text-[#FFC000] font-bold flex-shrink-0">→</span> Давление падает только под нагрузкой — износ насоса или утечки в гидрораспределителе</li>
          <li className="flex gap-3"><span className="text-[#FFC000] font-bold flex-shrink-0">→</span> Стрела опускается самостоятельно — утечки в гидроцилиндре или гидрораспределителе</li>
          <li className="flex gap-3"><span className="text-[#FFC000] font-bold flex-shrink-0">→</span> Перегрев масла — засорение фильтра, утечки или неправильная настройка клапана</li>
        </ul>

        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные услуги</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/hydraulic-pumps">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидронасосов
              </span>
            </Link>
            <Link href="/services/hydraulic-valves">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидрораспределителей
              </span>
            </Link>
            <Link href="/services/excavator-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт экскаваторов
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#FFC000]/30 rounded-xl p-8 text-center">
          <h3 className="font-bebas text-3xl mb-3">
            Упало давление? <span className="text-[#FFC000]">Выедем и диагностируем</span>
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Бесплатная диагностика на объекте. Выезд в течение 2 часов по Астане.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/77714177925?text=Здравствуйте!%20Упало%20давление%20гидравлики%20экскаватора"
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

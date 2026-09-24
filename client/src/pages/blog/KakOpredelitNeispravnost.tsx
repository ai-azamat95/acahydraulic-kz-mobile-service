import React from "react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    gtag_whatsapp_conversion?: () => void;
  }
}

export default function KakOpredelitNeispravnost() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Не работает гидравлика спецтехники: 10 признаков и порядок проверки",
    description: "Проблемы по гидравлике спецтехники: как описать симптомы, что безопасно проверить до выезда специалиста и почему одного признака недостаточно для диагноза.",
    datePublished: "2025-12-20",
    dateModified: "2026-09-25",
    author: { "@type": "Organization", name: "ACA Hydraulic" },
    publisher: { "@id": "https://acahydraulic.kz/#business" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://acahydraulic.kz/blog/kak-opredelit-neispravnost-gidravliki" },
    image: "https://acahydraulic.kz/images/hydraulic-schematic-overlay.webp",
  };

  const signs = [
    { num: "01", sign: "Медленная работа", desc: "Стрела, рукоять или ковш двигаются медленнее обычного. Проверяют насос и его регулятор, управляющее давление, клапаны, фильтры и внутренние утечки." },
    { num: "02", sign: "Посторонний шум", desc: "Вой, свист или скрежет при работе гидравлики. Возможны подсос воздуха, ограничения на всасывании, кавитация или механический износ. По одному звуку причину не определяют." },
    { num: "03", sign: "Перегрев масла", desc: "Масло нагревается выше диапазона, указанного изготовителем конкретной машины. Проверяют охлаждение, нагрузку, масло, клапаны и внутренние утечки; универсального порога для всей техники нет." },
    { num: "04", sign: "Самопроизвольное опускание стрелы", desc: "Стрела или рукоять медленно опускаются при нейтральном положении рычагов. Возможны внутренние утечки в цилиндре, распределителе или удерживающем клапане." },
    { num: "05", sign: "Утечка масла", desc: "Видимые подтёки масла на шлангах, цилиндрах, насосе или моторе. Требует немедленного устранения." },
    { num: "06", sign: "Рывки при движении", desc: "Экскаватор едет рывками или не едет совсем. Проверяют управление ходом, давление по сторонам, тормозной клапан, гидромотор и механическую часть." },
    { num: "07", sign: "Отсутствие поворота", desc: "Башня не поворачивается или поворачивается с трудом. Проверяют управляющий контур, распределитель, тормоз поворота, гидромотор и редуктор." },
    { num: "08", sign: "Вспенивание масла", desc: "Масло в баке пенится или имеет молочный цвет. Признак попадания воздуха или воды в систему." },
    { num: "09", sign: "Нестабильное давление", desc: "Давление на манометре скачет или не достигает значения из сервисных данных. Проверяют условия измерения, насос, регулятор, клапаны, пилотный контур и управляющие сигналы." },
    { num: "10", sign: "Запах горелого масла", desc: "Резкий запах горелого масла указывает на сильный перегрев. Немедленно остановите технику и вызовите специалиста." },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Не работает гидравлика спецтехники: 10 признаков | ACA Hydraulic"
        description="Проблемы по гидравлике: слабая работа, шум, перегрев, рывки или утечка. Что проверить безопасно, какие данные записать и когда остановить технику."
        keywords="не работает гидравлика, проблемы по гидравлике, признаки неисправности гидравлики, диагностика гидравлики экскаватора, симптомы поломки гидравлики"
        canonical="/blog/kak-opredelit-neispravnost-gidravliki"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Как определить неисправность гидравлики", url: "/blog/kak-opredelit-neispravnost-gidravliki" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Как определить неисправность гидравлики экскаватора?",
            answer: "Зафиксируйте, какие операции работают медленно, когда появляется симптом, есть ли шум, перегрев, утечки и коды ошибок. Точный диагноз подтверждают измерением давления, управляющих сигналов, слива и других параметров по сервисной процедуре конкретной модели.",
          },
          {
            question: "Что делать, если гидравлика спецтехники не работает совсем?",
            answer: "Остановите работу, безопасно опустите оборудование, проверьте уровень и явные утечки масла, доступные предупреждения и коды ошибок. Не регулируйте клапаны и не разбирайте магистрали под давлением без процедуры и измерительных приборов.",
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
          <a href="tel:+77714177925" className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors">
            <Phone className="w-4 h-4 text-[#FFC000]" />
            <span className="text-[#FFC000] font-bold font-bebas text-lg">+7 (771) 417-79-25</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] transition-colors mb-8 cursor-pointer text-sm">
            <ArrowLeft size={16} />Назад в блог
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="bg-[#FFC000]/10 border border-[#FFC000]/20 text-[#FFC000] px-3 py-1 rounded font-bold uppercase tracking-wider">Диагностика</span>
          <span className="flex items-center gap-1"><Calendar size={12} />Обновлено 25.09.2026</span>
          <span className="flex items-center gap-1"><Clock size={12} />9 мин чтения</span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Не работает гидравлика спецтехники: 10 признаков и порядок проверки
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Проблемы по гидравлике часто выглядят одинаково: машина медленно работает, слабеет после прогрева, шумит, дёргается или перестаёт выполнять отдельную операцию. Симптом помогает выбрать направление проверки, но не подтверждает поломку конкретного узла без измерений.
        </p>

        <img src="/images/hydraulic-schematic-overlay.webp" alt="Диагностика гидравлики спецтехники" className="w-full rounded-lg mb-10 object-cover h-64" loading="lazy" />

        <div className="bg-[#FFC000]/10 border border-[#FFC000]/20 rounded-lg p-5 mb-10 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Важно:</strong> не открывайте гидролинии и не регулируйте предохранительные клапаны без сервисной процедуры. Остаточное давление и тяжёлое навесное оборудование создают риск травмы и дополнительной поломки.
          </p>
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-6">10 признаков неисправности гидравлики</h2>

        <div className="space-y-4 mb-10">
          {signs.map((item) => (
            <div key={item.num} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-5 flex gap-4">
              <span className="font-bebas text-2xl text-[#FFC000] flex-shrink-0 w-10">{item.num}</span>
              <div>
                <h3 className="font-bebas text-xl mb-1">{item.sign}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Если гидравлика не работает совсем</h2>
        <div className="grid gap-3 mb-8">
          {[
            "Безопасно опустите рабочее оборудование и остановите машину",
            "Проверьте уровень масла, явные утечки и повреждения рукавов",
            "Запишите предупреждения и коды ошибок на панели",
            "Уточните, не работает вся система или только одна операция",
            "Сообщите модель, серийный номер, город и что происходило перед отказом",
          ].map((item) => (
            <div key={item} className="flex gap-3 items-start text-gray-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#FFC000] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-300 mb-10 leading-relaxed">
          Если система работает, но давление падает под нагрузкой или после прогрева, используйте отдельный чек-лист: {" "}
          <Link href="/blog/padaet-davlenie-gidravliki-ekskavatora">
            <span className="text-[#FFC000] hover:underline cursor-pointer">почему падает давление в гидросистеме экскаватора</span>
          </Link>.
        </p>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Когда вызывать специалиста немедленно</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">Немедленно остановите технику и вызовите специалиста, если:</p>
        <ul className="space-y-2 mb-8 text-gray-300 text-sm">
          {[
            "Запах горелого масла или дым",
            "Резкое падение давления до нуля",
            "Сильная утечка масла (лужа под машиной)",
            "Металлический скрежет в насосе или моторе",
            "Машина не реагирует на рычаги управления",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-red-400 font-bold flex-shrink-0">!</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные услуги</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/mobile-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">Выездная диагностика</span>
            </Link>
            <Link href="/services/hydraulic-pumps">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">Ремонт гидронасосов</span>
            </Link>
            <Link href="/services/hydraulic-motors">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">Ремонт гидромоторов</span>
            </Link>
            <Link href="/blog/padaet-davlenie-gidravliki-ekskavatora">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">Падает давление гидравлики</span>
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#FFC000]/30 rounded-xl p-8 text-center">
          <h3 className="font-bebas text-3xl mb-3">Заметили симптомы? <span className="text-[#FFC000]">Вызовите мастера</span></h3>
          <p className="text-gray-400 mb-6 text-sm">Диагностика спецтехники от 200 000 ₸. Ремонт, запчасти и расходы на выезд — отдельно. Время выезда согласуем.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/77714177925?text=Здравствуйте!%20Нужна%20диагностика%20гидравлики" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bebas text-lg px-6 py-3 rounded transition-colors">
              <MessageCircle className="w-5 h-5" />WhatsApp
            </a>
            <a href="tel:+77714177925" className="flex items-center justify-center gap-2 bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas text-lg px-6 py-3 rounded transition-colors">
              <Phone className="w-5 h-5" />+7 (771) 417-79-25
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

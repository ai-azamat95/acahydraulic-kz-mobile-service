import React from "react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, AlertTriangle, Gauge, CheckCircle2 } from "lucide-react";

export default function PadaetDavlenieGidravliki() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Почему падает давление гидравлики экскаватора: причины и диагностика",
    description:
      "Почему экскаватор теряет давление, медленно работает или слабеет после нагрева. Причины и порядок профессиональной диагностики гидросистемы.",
    datePublished: "2026-01-25",
    dateModified: "2026-09-12",
    author: {
      "@type": "Organization",
      name: "ACA Hydraulic",
      url: "https://acahydraulic.kz/",
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
      title: "Износ или неисправность гидронасоса",
      desc: "При внутреннем износе насос может терять производительность и хуже держать параметры под нагрузкой, особенно после прогрева масла.",
      check: "Сравнить давление и поведение системы на холодную и после прогрева; оценить управляющее давление и работу регулятора.",
    },
    {
      num: "02",
      title: "Предохранительный или разгрузочный клапан",
      desc: "Если клапан открывается раньше требуемого значения или не держит настройку, часть потока уходит в слив и рабочий орган становится слабым.",
      check: "Измерить фактическое давление срабатывания по процедуре для конкретной модели техники.",
    },
    {
      num: "03",
      title: "Внутренние утечки в распределителе",
      desc: "Износ золотниковых пар, зависание клапанов или внутренние перетечки могут давать медленную работу отдельных операций или всей машины.",
      check: "Сопоставить давление по операциям, проверить управляющие линии, температуру и слив.",
    },
    {
      num: "04",
      title: "Регулятор насоса и управляющее давление",
      desc: "Даже исправный насос не выйдет на требуемый режим, если регулятор получает неправильный управляющий сигнал или есть проблема в пилотном контуре.",
      check: "Проверить пилотное давление, сигналы управления, соленоиды и реакцию регулятора под нагрузкой.",
    },
    {
      num: "05",
      title: "Внутренняя утечка в гидроцилиндре или гидромоторе",
      desc: "Износ уплотнений и рабочих пар может уводить поток внутри узла без заметной наружной течи.",
      check: "Проверить удержание нагрузки, слив и разницу поведения конкретного рабочего органа относительно остальных.",
    },
    {
      num: "06",
      title: "Ограничение на всасывании или загрязнение масла",
      desc: "Забитый фильтр, подсос воздуха, загрязнение или металлические частицы ухудшают работу насоса и могут ускорять разрушение гидросистемы.",
      check: "Осмотреть масло и фильтры, проверить всасывающую магистраль и исключить кавитацию.",
    },
    {
      num: "07",
      title: "Электрика, датчики и соленоиды",
      desc: "Современная спецтехника управляет производительностью гидравлики через электронные сигналы. Ошибка датчика, проводки или соленоида может выглядеть как механическая поломка насоса.",
      check: "Сопоставить фактические давления с командами блока управления и проверить проводку, датчики и исполнительные клапаны.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Падает давление гидравлики экскаватора — причины и диагностика | ACA Hydraulic"
        description="Экскаватор теряет давление, медленно работает или слабеет на горячую? Разбираем причины и порядок диагностики гидросистемы. Выезд ACA Hydraulic по Казахстану."
        keywords="падает давление гидравлики экскаватора, низкое давление гидравлики, диагностика гидравлики экскаватора, экскаватор теряет мощность на горячую, медленно работает гидравлика"
        canonical="/blog/padaet-davlenie-gidravliki-ekskavatora"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Падает давление гидравлики экскаватора", url: "/blog/padaet-davlenie-gidravliki-ekskavatora" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему падает давление гидравлики экскаватора?",
            answer:
              "Причина может быть в гидронасосе, регуляторе, предохранительном клапане, распределителе, пилотном контуре, исполнительном узле, загрязнении масла или электрическом управлении. Точная причина определяется измерениями под нагрузкой.",
          },
          {
            question: "Как правильно проверить давление гидравлики экскаватора?",
            answer:
              "Давление измеряют в предусмотренных производителем контрольных точках и в заданном режиме работы. Нормативное значение необходимо брать из сервисной документации конкретной модели, потому что оно отличается по машинам и контурам.",
          },
          {
            question: "Почему гидравлика становится слабой после нагрева?",
            answer:
              "После прогрева вязкость масла снижается, поэтому внутренние утечки в изношенном насосе, распределителе или исполнительном узле могут проявляться сильнее. Также проверяют регулятор, клапаны и управляющее давление.",
          },
        ]}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex gap-[3px] h-[28px]">
                <div className="w-[10px] h-full bg-[#FFC000]" />
                <div className="flex flex-col justify-between h-full">
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]" />
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]" />
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
            Диагностика гидравлики
          </span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Обновлено 12.09.2026</span>
          <span className="flex items-center gap-1"><Clock size={12} /> 7 мин чтения</span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Падает давление гидравлики экскаватора: причины и порядок диагностики
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Если экскаватор стал медленным, не тянет под нагрузкой, слабеет после прогрева, дёргается или одна операция заметно отличается от остальных, замена насоса «наугад» может не решить проблему. Сначала нужно определить, где именно теряется давление или управление гидросистемой.
        </p>

        <img
          src="/images/excavator-tech-repair.webp"
          alt="Выездная диагностика давления гидравлики экскаватора"
          className="w-full rounded-lg mb-10 object-cover h-64"
          loading="lazy"
        />

        <div className="bg-[#FFC000]/10 border border-[#FFC000]/20 rounded-lg p-5 mb-10 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Важно:</strong> универсального «правильного давления» для всех экскаваторов нет. Давление разгрузки, основной системы, пилотного контура и отдельных операций проверяют по сервисным данным конкретной модели и при заданных условиях измерения.
          </p>
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-6">7 основных направлений проверки</h2>

        <div className="space-y-6 mb-10">
          {causes.map((cause) => (
            <div key={cause.num} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="font-bebas text-3xl text-[#FFC000] flex-shrink-0">{cause.num}</span>
                <div>
                  <h3 className="font-bebas text-xl mb-2">{cause.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{cause.desc}</p>
                  <div className="flex items-start gap-2 text-sm">
                    <Gauge className="w-4 h-4 text-[#FFC000] mt-0.5 shrink-0" />
                    <span className="text-gray-300"><strong className="text-white">Что проверять:</strong> {cause.check}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Если проблема появляется только на горячую</h2>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Такой симптом особенно важен для диагностики. Машину нужно проверять не только сразу после запуска, но и после выхода масла и узлов на рабочую температуру. Если параметры заметно меняются после прогрева, это помогает локализовать внутренние утечки, работу регулятора, клапанов и насоса.
        </p>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Что подготовить перед выездом специалиста</h2>
        <div className="grid gap-3 mb-10">
          {[
            "Марку и точную модель машины",
            "Фото заводской таблички и серийного номера",
            "Короткое видео, как проявляется неисправность",
            "Информацию: проблема на холодную, на горячую или постоянно",
            "Что уже меняли или регулировали до обращения",
          ].map((item) => (
            <div key={item} className="flex gap-3 items-start text-gray-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#FFC000] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные услуги</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/mobile-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Выездная диагностика гидравлики
              </span>
            </Link>
            <Link href="/services/hydraulic-pumps">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт гидронасосов
              </span>
            </Link>
            <Link href="/services/excavator-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                Ремонт экскаваторов
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#FFC000]/40 rounded-xl p-6 md:p-8 text-center">
          <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">ACA Hydraulic · выезд по Казахстану</div>
          <h3 className="font-bebas text-3xl mb-3">
            Нужна диагностика? <span className="text-[#FFC000]">Стоимость от 200 000 ₸</span>
          </h3>
          <p className="text-gray-400 mb-2 text-sm">
            Проверяем гидросистему под нагрузкой, насосы и регуляторы, управляющее давление, клапаны, датчики, соленоиды и электропроводку — в зависимости от симптома и конструкции машины.
          </p>
          <p className="text-gray-500 mb-6 text-xs">
            Выезд, ремонт, запчасти и дополнительные работы рассчитываются отдельно в зависимости от местонахождения техники и результатов диагностики.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/77714177925?text=Здравствуйте!%20Нужна%20выездная%20диагностика%20гидравлики.%20Стоимость%20от%20200%20000%20₸%20понятна.%20Отправлю%20марку,%20модель,%20город%20и%20видео%20неисправности."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bebas text-lg px-6 py-3 rounded transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Отправить данные в WhatsApp
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

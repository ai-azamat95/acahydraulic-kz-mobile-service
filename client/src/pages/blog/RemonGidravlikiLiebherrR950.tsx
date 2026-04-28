import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function RemonGidravlikiLiebherrR950() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Ремонт гидравлики экскаватора Liebherr R950: потеря мощности ковша в карьере",
    description:
      "Реальный кейс ACA Hydraulic: экскаватор Liebherr R950 потерял мощность ковша и стрелы — давление упало с 350 до 180 бар. Диагностика, ремонт насоса Linde HPV-02 за 72 часа.",
    datePublished: "2026-03-25",
    dateModified: "2026-03-25",
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
      "@id": "https://acahydraulic.kz/blog/remont-gidravliki-liebherr-r950",
    },
    articleSection: "Ремонт Liebherr",
    keywords:
      "ремонт гидравлики Liebherr R950, ремонт гидронасоса Liebherr, Liebherr R950 потеря мощности, ремонт экскаватора Liebherr Казахстан, насос Linde HPV ремонт",
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Ремонт гидравлики Liebherr R950: потеря мощности ковша | ACA Hydraulic"
        description="Реальный кейс: экскаватор Liebherr R950 потерял мощность ковша — давление упало с 350 до 180 бар. Ремонт насоса Linde HPV-02 за 72 часа. Карагандинская область."
        keywords="ремонт гидравлики Liebherr R950, ремонт гидронасоса Liebherr, Liebherr R950 потеря мощности, ремонт экскаватора Liebherr Казахстан, насос Linde HPV ремонт"
        canonical="/blog/remont-gidravliki-liebherr-r950"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Ремонт Liebherr R950", url: "/blog/remont-gidravliki-liebherr-r950" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему экскаватор Liebherr R950 теряет мощность ковша?",
            answer:
              "Основная причина — износ аксиально-поршневого насоса Linde HPV: изнашиваются поршни, блок цилиндров, распределительный диск. Давление в системе падает ниже рабочего, ковш и стрела теряют усилие. Также возможна неисправность регулятора давления или клапана управления.",
          },
          {
            question: "Сколько стоит ремонт гидронасоса Liebherr R950?",
            answer:
              "Восстановление насоса Linde HPV-02 для Liebherr R950 стоит от 350 000 до 700 000 тенге в зависимости от степени износа. Это в 3–5 раз дешевле нового агрегата. Диагностика выездная — бесплатно при последующем ремонте.",
          },
          {
            question: "Как быстро можно отремонтировать гидравлику Liebherr R950?",
            answer:
              "При наличии запасных частей — от 48 до 72 часов. ACA Hydraulic выполняет выездную диагностику в день обращения и имеет склад запчастей для техники Liebherr в Казахстане.",
          },
          {
            question: "Можно ли отремонтировать насос Liebherr прямо на объекте?",
            answer:
              "Диагностика и демонтаж — на объекте. Восстановление насоса выполняется в мастерской на специализированном стенде. После ремонта — монтаж и пуско-наладка снова на объекте.",
          },
        ]}
      />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-[#FFC000]">Блог</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Ремонт Liebherr R950</span>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] transition-colors mb-8">
          <ArrowLeft size={16} />
          Назад к блогу
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["Liebherr", "Экскаваторы", "Гидронасосы", "Карьерная техника", "Кейс"].map(tag => (
            <span key={tag} className="px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-6">
          Ремонт гидравлики <span className="text-[#FFC000]">Liebherr R950</span>: потеря мощности ковша в карьере
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-white/10">
          <span className="flex items-center gap-2"><Calendar size={14} className="text-[#FFC000]" /> 25 марта 2026</span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-[#FFC000]" /> 7 минут чтения</span>
          <span className="flex items-center gap-2 text-[#FFC000] font-medium">★ Реальный кейс ACA Hydraulic</span>
        </div>

        {/* Intro */}
        <div className="bg-[#1a1a1a] border border-[#FFC000]/20 rounded-lg p-6 mb-10">
          <p className="text-gray-200 text-lg leading-relaxed">
            <strong className="text-white">Экскаватор Liebherr R950 SME</strong> — карьерная машина весом 90 тонн с рабочим давлением гидросистемы 350 бар. Когда давление упало до 180 бар, ковш перестал справляться с плотным грунтом, производительность снизилась на 60%. Официальный дилер назначил срок ремонта 3 недели. ACA Hydraulic восстановил машину за 72 часа.
          </p>
        </div>

        {/* Problem */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4 flex items-center gap-3">
            <AlertTriangle className="text-[#FFC000]" size={28} />
            Проблема
          </h2>
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
            <p className="text-gray-300 leading-relaxed mb-4">
              Горнодобывающая компания в Карагандинской области эксплуатировала экскаватор Liebherr R950 SME в круглосуточном режиме на вскрышных работах. Постепенно оператор начал замечать снижение усилия ковша — машина стала «буксовать» на плотных породах, которые раньше брала без проблем.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Диагностика на месте показала: рабочее давление в гидросистеме упало с номинальных <strong className="text-white">350 бар до 180 бар</strong>. Стрела и ковш работали вяло, скорость движений снизилась вдвое. Производительность экскаватора упала на 60%, что срывало план добычи.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Официальный сервис Liebherr назначил срок ремонта <strong className="text-white">3 недели</strong> и предложил замену насосного блока в сборе. Заказчик обратился в ACA Hydraulic за альтернативным решением.
            </p>
          </div>
        </section>

        {/* Diagnostics */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Диагностика</h2>
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
            <p className="text-gray-300 leading-relaxed mb-4">
              Инженер ACA Hydraulic выехал на объект в день обращения. Подключили диагностическое оборудование <strong className="text-white">Bosch ESI[tronic]</strong> и провели замер давлений во всех контурах гидросистемы.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Результат: просадка давления локализована в <strong className="text-white">главном насосном блоке Linde HPV-02</strong> — сдвоенный аксиально-поршневой насос, установленный на Liebherr R950. Давление на выходе насоса не достигало рабочего значения даже при максимальных оборотах двигателя.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Насос демонтировали и доставили в мастерскую для детальной дефектовки.
            </p>
          </div>
        </section>

        {/* Defect */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Что нашли при разборке</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Износ поршневой группы", desc: "Поршни и башмаки — выработка сверх допустимого зазора, потеря герметичности рабочих камер" },
              { title: "Задиры на блоке цилиндров", desc: "Риски и задиры на зеркале блока цилиндров из-за загрязнённого масла и абразивного износа" },
              { title: "Разрушение сепаратора подшипника", desc: "Осколки сепаратора попали в рабочую зону насоса, вызвав вторичный износ деталей" },
              { title: "Износ распределительного диска", desc: "Рабочая поверхность диска потеряла геометрию — внутренние утечки достигли критического уровня" },
            ].map((item, i) => (
              <div key={i} className="bg-[#222] border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-bold mb-2 text-sm uppercase tracking-wider">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Solution */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Этапы ремонта</h2>
          <div className="space-y-3">
            {[
              "Выезд на объект, подключение диагностического оборудования Bosch ESI[tronic]",
              "Замер давлений во всех контурах гидросистемы, выявление просадки в главном насосном блоке",
              "Демонтаж сдвоенного аксиально-поршневого насоса Linde HPV-02",
              "Дефектовка: износ поршневой группы, задиры на блоке цилиндров, разрушение сепаратора подшипника",
              "Восстановление насоса: замена поршней, блока цилиндров, подшипников, уплотнений",
              "Регулировка регулятора давления и расхода по заводским параметрам Liebherr",
              "Монтаж, промывка системы, пуско-наладка и проверка под нагрузкой",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                <span className="flex-shrink-0 w-7 h-7 bg-[#FFC000] text-black rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Result */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4 flex items-center gap-3">
            <CheckCircle className="text-green-400" size={28} />
            Результат
          </h2>
          <div className="bg-[#1a1a1a] border border-green-500/20 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bebas text-[#FFC000] mb-1">350 бар</div>
                <div className="text-gray-400 text-sm">Давление восстановлено</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bebas text-[#FFC000] mb-1">72 часа</div>
                <div className="text-gray-400 text-sm">Время ремонта</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bebas text-[#FFC000] mb-1">в 10 раз</div>
                <div className="text-gray-400 text-sm">Быстрее официального дилера</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Давление в гидросистеме восстановлено до <strong className="text-white">350 бар</strong>. Производительность экскаватора вернулась к 100%. Ремонт выполнен за 72 часа — в 10 раз быстрее, чем предложил официальный дилер. Техника продолжила работу в карьере без простоя. Стоимость восстановления насоса составила <strong className="text-white">около 480 000 тенге</strong> — против 2 200 000 тенге за новый агрегат.
            </p>
          </div>
        </section>

        {/* Why ACA */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Почему выбрали ACA Hydraulic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Выезд на объект в день обращения — без ожидания",
              "Диагностика профессиональным оборудованием Bosch",
              "Ремонт насоса Linde HPV на специализированном стенде",
              "Восстановление в 4,5 раза дешевле нового агрегата",
              "Гарантия 6 месяцев на выполненный ремонт",
              "Опыт работы с карьерной техникой Liebherr по всему Казахстану",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                <CheckCircle size={16} className="text-[#FFC000] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Links */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Связанные материалы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/brands/liebherr" className="block bg-[#1a1a1a] border border-[#FFC000]/20 hover:border-[#FFC000]/50 rounded-lg p-5 transition-colors group">
              <div className="text-[#FFC000] text-xs font-bold uppercase tracking-wider mb-2">Страница бренда</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Ремонт гидравлики Liebherr в Казахстане →</div>
              <div className="text-gray-500 text-sm mt-1">Все услуги, модели, цены и FAQ</div>
            </Link>
            <Link href="/blog/remont-gidravliki-frezy-wirtgen-1500" className="block bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/30 rounded-lg p-5 transition-colors group">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Другой кейс</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Ремонт Wirtgen 1500: потеря хода при нагреве →</div>
              <div className="text-gray-500 text-sm mt-1">Выездная диагностика, замена уплотнений</div>
            </Link>
            <Link href="/blog/kapitalnyy-remont-shantui-sd32" className="block bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/30 rounded-lg p-5 transition-colors group">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Другой кейс</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Капремонт SHANTUI SD32: ДВС и гидравлика →</div>
              <div className="text-gray-500 text-sm mt-1">18 дней, полное восстановление</div>
            </Link>
            <Link href="/projects" className="block bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/30 rounded-lg p-5 transition-colors group">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Портфолио</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Все выполненные проекты →</div>
              <div className="text-gray-500 text-sm mt-1">Реальные кейсы с фото и описанием</div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#FFC000] rounded-lg p-8 text-black">
          <h2 className="font-bebas text-3xl uppercase mb-3">Ваш Liebherr требует ремонта?</h2>
          <p className="text-black/80 mb-6 leading-relaxed">
            Выезд на объект в день обращения. Диагностика бесплатно при последующем ремонте. Работаем по всему Казахстану.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/77714177925"
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a
              href="tel:+77714177925"
              className="flex items-center justify-center gap-2 bg-white/20 text-black border border-black/20 px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors"
            >
              <Phone size={18} />
              +7 (771) 417-79-25
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}

import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function VosstanovlenieGidromotoraVolvoEC380() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Восстановление гидромотора хода Volvo EC380: машина не двигалась на объекте",
    description:
      "Реальный кейс ACA Hydraulic: экскаватор Volvo EC380 полностью потерял ход из-за разрушения вала гидромотора. Ремонт за 48 часов вместо 6 недель ожидания у дилера.",
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
      "@id": "https://acahydraulic.kz/blog/vosstanovlenie-gidromotora-volvo-ec380",
    },
    articleSection: "Ремонт Volvo",
    keywords:
      "ремонт гидромотора Volvo EC380, Volvo EC380 не едет, ремонт ходовой части Volvo, ремонт экскаватора Volvo Казахстан, гидромотор хода Volvo ремонт",
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Ремонт гидромотора хода Volvo EC380: машина не двигалась | ACA Hydraulic"
        description="Реальный кейс: экскаватор Volvo EC380 полностью потерял ход — разрушение вала гидромотора. Ремонт за 48 часов, стоимость в 3,7 раза дешевле нового агрегата. Астана."
        keywords="ремонт гидромотора Volvo EC380, Volvo EC380 не едет, ремонт ходовой части Volvo, ремонт экскаватора Volvo Казахстан, гидромотор хода Volvo ремонт"
        canonical="/blog/vosstanovlenie-gidromotora-volvo-ec380"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Ремонт Volvo EC380", url: "/blog/vosstanovlenie-gidromotora-volvo-ec380" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему экскаватор Volvo EC380 не двигается?",
            answer:
              "Полная потеря хода на Volvo EC380 чаще всего вызвана неисправностью гидромотора ходовой части (Travel Motor): разрушение вала ротора, износ пакета тормозных дисков или повреждение уплотнений. Также возможна неисправность клапана подпитки или гидронасоса хода.",
          },
          {
            question: "Сколько стоит ремонт гидромотора хода Volvo EC380?",
            answer:
              "Восстановление гидромотора хода Volvo EC380 стоит от 800 000 до 1 500 000 тенге в зависимости от степени повреждений. Это в 3–4 раза дешевле нового агрегата. Диагностика выездная — бесплатно при последующем ремонте.",
          },
          {
            question: "Как быстро можно отремонтировать гидромотор Volvo EC380?",
            answer:
              "При наличии запасных частей — от 48 до 72 часов. ACA Hydraulic выполняет выездную диагностику в день обращения, имеет склад уплотнений и расходных материалов для техники Volvo CE.",
          },
          {
            question: "Можно ли восстановить вал гидромотора Volvo, или нужна замена?",
            answer:
              "В большинстве случаев вал восстанавливается методом наплавки и последующей шлифовки до заводских допусков. Это значительно дешевле замены. ACA Hydraulic имеет оборудование для восстановления валов диаметром до 120 мм.",
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
        <span className="text-white">Ремонт Volvo EC380</span>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] transition-colors mb-8">
          <ArrowLeft size={16} />
          Назад к блогу
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["Volvo CE", "Экскаваторы", "Гидромоторы", "Ходовая часть", "Кейс"].map(tag => (
            <span key={tag} className="px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-6">
          Восстановление гидромотора хода <span className="text-[#FFC000]">Volvo EC380</span>: машина не двигалась
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-10 pb-8 border-b border-white/10">
          <span className="flex items-center gap-2"><Calendar size={14} className="text-[#FFC000]" /> 25 марта 2026</span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-[#FFC000]" /> 6 минут чтения</span>
          <span className="flex items-center gap-2 text-[#FFC000] font-medium">★ Реальный кейс ACA Hydraulic</span>
        </div>

        {/* Intro */}
        <div className="bg-[#1a1a1a] border border-[#FFC000]/20 rounded-lg p-6 mb-10">
          <p className="text-gray-200 text-lg leading-relaxed">
            <strong className="text-white">Экскаватор Volvo EC380DL</strong> встал на строительном объекте в центре Астаны — правая гусеница не двигалась. Официальный дилер: 6 недель ожидания и 4 500 000 тенге за новый агрегат. ACA Hydraulic восстановил гидромотор за <strong className="text-white">48 часов</strong> и <strong className="text-white">1 200 000 тенге</strong>.
          </p>
        </div>

        {/* Problem */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4 flex items-center gap-3">
            <AlertTriangle className="text-[#FFC000]" size={28} />
            Ситуация
          </h2>
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5">
            <p className="text-gray-300 leading-relaxed mb-4">
              Строительная компания вела нулевой цикл в центре Астаны. Экскаватор Volvo EC380DL работал в напряжённом режиме — плотный грунт, постоянные развороты. В один день правая гусеница перестала двигаться: машина могла вращаться только на месте.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Причина — <strong className="text-white">разрушение вала ротора гидромотора правой гусеницы</strong>. Осколки вала повредили пакет тормозных дисков и уплотнения. Масло начало уходить внутрь тормозного отсека.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Срыв сроков нулевого цикла грозил штрафными санкциями по контракту. Официальный дилер Volvo CE предложил замену нового гидромотора в сборе: <strong className="text-white">6 недель ожидания, цена от 4 500 000 тенге</strong>. Заказчик обратился в ACA Hydraulic.
            </p>
          </div>
        </section>

        {/* Defect */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Что нашли при дефектовке</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Разрушение вала ротора", desc: "Усталостный излом вала в зоне шлицевого соединения — результат длительной перегрузки без замены масла" },
              { title: "Износ тормозных дисков", desc: "Пакет из 7 дисков — полный износ фрикционных накладок, коробление стальных дисков" },
              { title: "Повреждение уплотнений", desc: "Все динамические уплотнения разрушены осколками вала, масло проникло в тормозной отсек" },
              { title: "Загрязнение рабочей жидкости", desc: "Металлическая стружка в масле — признак длительного износа без своевременного обслуживания" },
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
              "Выезд на объект, диагностика и демонтаж гидромотора Volvo Travel Motor",
              "Дефектовка в мастерской: разрушение вала ротора, износ дисков тормоза, повреждение уплотнений",
              "Восстановление вала методом наплавки и шлифовки до заводских допусков",
              "Замена пакета тормозных дисков, подшипников и полного комплекта уплотнений",
              "Сборка, стендовые испытания при давлении 420 бар",
              "Монтаж на технику, регулировка давления подпитки",
              "Ходовые испытания: проверка хода вперёд/назад, разворота, нагрузочные тесты",
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
                <div className="text-3xl font-bebas text-[#FFC000] mb-1">48 часов</div>
                <div className="text-gray-400 text-sm">Время ремонта</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bebas text-[#FFC000] mb-1">1 200 000 ₸</div>
                <div className="text-gray-400 text-sm">Стоимость ремонта</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bebas text-[#FFC000] mb-1">в 3,7 раза</div>
                <div className="text-gray-400 text-sm">Дешевле нового агрегата</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Гидромотор восстановлен за 48 часов. Стоимость ремонта составила <strong className="text-white">1 200 000 тенге</strong> — в 3,7 раза дешевле нового агрегата (4 500 000 тенге). Экскаватор вернулся в работу, заказчик выдержал сроки сдачи объекта и избежал штрафных санкций.
            </p>
          </div>
        </section>

        {/* Why ACA */}
        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Почему выбрали ACA Hydraulic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Выезд на объект в день обращения — без ожидания",
              "Восстановление вала методом наплавки — без замены в сборе",
              "Стендовые испытания при 420 бар перед монтажом",
              "Ремонт в 3,7 раза дешевле нового агрегата",
              "Гарантия 6 месяцев на выполненный ремонт",
              "Опыт работы с техникой Volvo CE по всему Казахстану",
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
            <Link href="/brands/volvo" className="block bg-[#1a1a1a] border border-[#FFC000]/20 hover:border-[#FFC000]/50 rounded-lg p-5 transition-colors group">
              <div className="text-[#FFC000] text-xs font-bold uppercase tracking-wider mb-2">Страница бренда</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Ремонт гидравлики Volvo CE в Казахстане →</div>
              <div className="text-gray-500 text-sm mt-1">Все услуги, модели, цены и FAQ</div>
            </Link>
            <Link href="/blog/remont-gidravliki-liebherr-r950" className="block bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/30 rounded-lg p-5 transition-colors group">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Другой кейс</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Ремонт Liebherr R950: потеря мощности ковша →</div>
              <div className="text-gray-500 text-sm mt-1">Ремонт насоса Linde HPV-02 за 72 часа</div>
            </Link>
            <Link href="/blog/remont-gidravliki-frezy-wirtgen-1500" className="block bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/30 rounded-lg p-5 transition-colors group">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Другой кейс</div>
              <div className="text-white font-medium group-hover:text-[#FFC000] transition-colors">Ремонт Wirtgen 1500: потеря хода при нагреве →</div>
              <div className="text-gray-500 text-sm mt-1">Выездная диагностика, замена уплотнений</div>
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
          <h2 className="font-bebas text-3xl uppercase mb-3">Ваш Volvo требует ремонта?</h2>
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

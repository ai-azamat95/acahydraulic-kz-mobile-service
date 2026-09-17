import { Link } from "wouter";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PumpPhoto, SanyPumpVideo } from "@/components/PumpCaseMedia";
import { pumpCasePath, pumpCaseTitle, pumpCaseDescription, pumpOptions, pumpCaseFaq } from "@/content/pumpCases";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC000]";
const container = "container mx-auto max-w-6xl px-4";
function Contact({ source, children }: { source: string; children: React.ReactNode }) {
  const message = `Здравствуйте! Нужен расчёт: ${source}. Модель техники: __. Город: __. Нужен только насос / насос с заменой: __. Пришлю фото шильдика и подключений.`;
  return <a href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"
    onClick={() => trackCatalogEvent("case_whatsapp_click", { case_id: "pump-supply", request_type: source })}
    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#FFC000] px-5 py-3 text-center font-bold text-black hover:bg-[#eab000] ${focus}`}>
    <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />{children}
  </a>;
}

export default function PumpSupplyInstallation() {
  return <main className="min-h-screen bg-[#0a0a0a] pt-8 text-white">
    <SEO title={pumpCaseTitle} description={pumpCaseDescription} canonical={pumpCasePath}
      ogImage="https://acahydraulic.kz/media/pump-cases/sany-sy365h.webp"
      breadcrumbs={[{ name: "Кейсы", url: "/cases" }, { name: "Поставка и замена гидронасоса", url: pumpCasePath }]}
      faq={pumpCaseFaq}
      schema={{ "@context": "https://schema.org", "@type": "VideoObject", name: "SANY SY365H: поставка и замена гидронасоса K5V160DT", description: "Реальный заказ ACA Hydraulic: насос, доставка, демонтаж старого насоса, установка нового и запуск экскаватора.", thumbnailUrl: ["https://acahydraulic.kz/media/pump-cases/sany-sy365h.webp"], contentUrl: "https://acahydraulic.kz/media/pump-cases/sany-pump-36s.mp4", uploadDate: "2026-09-17T00:00:00+05:00", duration: "PT36S", inLanguage: "ru" }} />
    <section className="border-b border-white/10 py-10 md:py-16">
      <div className={container}>
        <Link href="/cases" className={`inline-block py-2 text-sm text-gray-400 underline ${focus}`}>Все кейсы ремонта</Link>
        <p className="mt-5 text-sm font-bold uppercase tracking-wider text-[#FFC000]">ACA Hydraulic · поставка и сервис по Казахстану</p>
        <h1 className="mt-4 max-w-4xl font-bebas text-4xl leading-tight sm:text-5xl md:text-7xl">Гидронасос — с подбором, доставкой и заменой</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">Одна команда ведёт заказ от проверки исполнения насоса до работ на машине. Ниже — завершённый ремонт SANY и текущий заказ HANDOK для Hitachi.</p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Contact source="насос и работы">Отправить шильдик для расчёта</Contact>
          <a href="#pump-options" className={`inline-flex min-h-12 items-center gap-2 px-2 text-[#FFC000] underline underline-offset-4 ${focus}`}>Посмотреть насосы и цены <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
        <p className="mt-4 text-sm text-gray-400">Подготовьте модель техники, фото шильдика и город. Если причина неисправности не установлена — начнём с диагностики.</p>
      </div>
    </section>

    <section id="sany-completed" className="scroll-mt-24 py-12 md:py-16">
      <div className={`${container} grid gap-10 lg:grid-cols-[1fr_340px]`}>
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold text-[#FFC000]"><CheckCircle2 className="h-5 w-5" aria-hidden="true" />Завершено · экскаватор запущен</p>
          <h2 className="mt-4 font-bebas text-4xl md:text-5xl">SANY SY365H: насос K5V160DT и ремонт под ключ</h2>
          <p className="mt-5 leading-relaxed text-gray-300">Клиент обратился по ремонту экскаватора и заказал запчасть через ACA Hydraulic. Мы организовали поставку насоса с доставкой, сняли старый насос, установили новый и запустили машину.</p>
          <ol className="my-7 space-y-3 border-l-2 border-[#FFC000] pl-5 text-gray-300">
            <li><strong className="text-white">1. Заказ запчасти.</strong> Подбор насоса для конкретной машины.</li>
            <li><strong className="text-white">2. Поставка.</strong> Новый K5V160DT с доставкой.</li>
            <li><strong className="text-white">3. Замена.</strong> Демонтаж старого и установка нового насоса.</li>
            <li><strong className="text-white">4. Запуск.</strong> Проверка работы экскаватора после ремонта.</li>
          </ol>
          <div className="grid gap-5 sm:grid-cols-2">
            <PumpPhoto file="k5v160dt-delivery.webp" alt="Новый гидронасос K5V160DT в транспортной упаковке" caption="Насос K5V160DT: фото из материалов поставки." />
            <PumpPhoto file="sany-installed.webp" alt="Насос в отсеке экскаватора SANY SY365H" caption="Насос на машине: кадр из видео работ на SANY." />
          </div>
          <p className="my-5 text-sm leading-relaxed text-gray-400">Это опыт работы с конкретным экскаватором. Для другого SANY SY365H исполнение насоса также нужно сверить по шильдику и подключениям.</p>
          <Link href="/cases/sany-sy365h-gidravlika-na-goryachuyu" className={`inline-block py-2 text-[#FFC000] underline underline-offset-4 ${focus}`}>Подробнее о диагностике гидравлики SANY</Link>
        </div>
        <SanyPumpVideo />
      </div>
    </section>

    <section id="hitachi-order" className="scroll-mt-24 border-y border-white/10 bg-[#151515] py-12">
      <div className={`${container} grid gap-8 md:grid-cols-[1fr_300px]`}>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">В работе · заказ оплачен, ожидает поставки</p>
          <h2 className="mt-4 font-bebas text-4xl md:text-5xl">Hitachi: клиент выбрал корейский HANDOK</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-gray-300">Для заказа рассмотрели китайский и корейский варианты насоса. Клиент выбрал HANDOK, оплатил заказ и сейчас ожидает поставки. Ниже — фотографии выбранного насоса и варианты для расчёта.</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-gray-400">Статус на 17 сентября 2026 года: насос заказан. Установка и запуск по этому заказу ещё не выполнены.</p>
          <div className="mt-6"><Contact source="HANDOK для Hitachi">Обсудить насос для моей техники</Contact></div>
        </div>
        <PumpPhoto file="handok-h5v80dtp.webp" alt="Насос HANDOK из материалов заказа для Hitachi" caption="Фото выбранного насоса. Маркировка на шильдике: H5V80DTP-12T, Made in Korea." />
      </div>
    </section>

    <section id="pump-options" className="scroll-mt-24 py-12 md:py-16">
      <div className={container}>
        <h2 className="font-bebas text-4xl md:text-5xl">Два варианта насоса под заказ</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-gray-400">Сначала проверяем исполнение и совместимость. Сравнение ниже помогает обсудить бюджет; выбрать насос только по названию серии нельзя.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {pumpOptions.map(option => <article key={option.id} className="flex flex-col rounded-lg border border-white/15 bg-[#151515] p-5 md:p-7">
            <PumpPhoto file={option.image} alt={option.alt} caption={option.origin} />
            <h3 className="mt-5 text-2xl font-bold">{option.name}</h3>
            <p className="mt-3 text-3xl font-bold text-[#FFC000]">{option.price}</p>
            <p className="mt-2 text-sm text-gray-400">Под заказ · стоимость указанного насоса</p>
            <p className="my-5 flex-1 leading-relaxed text-gray-300">{option.detail}</p>
            <Contact source={option.name}>Проверить совместимость и расчёт</Contact>
          </article>)}
        </div>
        <p className="mt-5 max-w-4xl text-sm leading-relaxed text-gray-400">Цены согласованы 17 сентября 2026 года. Комплектацию, итоговую стоимость, доставку, срок и состав работ подтверждаем в расчёте до оплаты. Эти цены не являются стоимостью ремонта под ключ.</p>
      </div>
    </section>

    <section className="border-y border-white/10 bg-[#151515] py-12">
      <div className={container}>
        <h2 className="font-bebas text-4xl">Что проверяем до заказа</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div><h3 className="font-bold text-[#FFC000]">Техника и неисправность</h3><p className="mt-3 leading-relaxed text-gray-300">Модель, серийный номер и симптомы. Если диагноз не подтверждён — согласуем диагностику до замены дорогостоящего узла.</p></div>
          <div><h3 className="font-bold text-[#FFC000]">Исполнение насоса</h3><p className="mt-3 leading-relaxed text-gray-300">Шильдик, вал, фланец, порты, направление вращения, регулятор, датчики и комплектация.</p></div>
          <div><h3 className="font-bold text-[#FFC000]">Условия заказа</h3><p className="mt-3 leading-relaxed text-gray-300">Что входит в поставку и работы, цена, срок, доставка и условия приёмки. Согласуем до оплаты.</p></div>
        </div>
      </div>
    </section>
    <section className="py-12 md:py-16">
      <div className={container}>
        <h2 className="font-bebas text-4xl">Частые вопросы</h2>
        <div className="mt-6 divide-y divide-white/15">{pumpCaseFaq.map(item => <details key={item.question} className="py-5"><summary className={`cursor-pointer text-lg font-bold ${focus}`}>{item.question}</summary><p className="mt-4 max-w-4xl leading-relaxed text-gray-300">{item.answer}</p></details>)}</div>
        <div className="mt-10 border-l-4 border-[#FFC000] bg-[#151515] p-6 md:p-8">
          <h2 className="font-bebas text-3xl md:text-4xl">Начнём с вашей техники</h2>
          <p className="my-5 max-w-3xl leading-relaxed text-gray-300">Пришлите шильдик насоса, модель экскаватора, город и короткое описание неисправности. Укажите, нужна ли поставка отдельно или насос с заменой и запуском.</p>
          <Contact source="поставка насоса с заменой">Отправить данные в WhatsApp</Contact>
          <a href="tel:+77714177925" className={`mt-4 block w-fit py-2 font-bold text-[#FFC000] ${focus}`}>+7 771 417 79 25</a>
        </div>
      </div>
    </section>
  </main>;
}

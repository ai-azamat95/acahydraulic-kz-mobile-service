import { CheckCircle2, MessageCircle, PackageCheck, Search, ShieldCheck, Truck } from "lucide-react";
import { Link, useRoute } from "wouter";

import { SEO } from "@/components/SEO";
import {
  cumminsEngineFamilies,
  cumminsEngineGroupFor,
  cumminsEnginePath,
  findCumminsEngineBySlug,
  type CumminsEngineFamily,
} from "@/data/cumminsEngineFamilies";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import NotFound from "@/pages/NotFound";

const categoryPath = "/parts/engines-complete";
const brandCatalogPath = "/parts/engines-complete/cummins";

const selectionByGroup: Record<string, string[]> = {
  "compact-medium": [
    "Сверяем полный индекс двигателя и исполнение топливной системы",
    "Проверяем точки крепления, маховик, кожух и подключение навесного оборудования",
    "Сопоставляем электрические разъёмы, датчики, систему охлаждения и выхлоп",
  ],
  "heavy-duty": [
    "Проверяем полный индекс, CPL или другую маркировку конкретного исполнения",
    "Сверяем навесное оборудование, маховик, кожух, стартер, генератор и турбонаддув",
    "Уточняем, какие узлы допускается перенести со старого двигателя и кто выполняет монтаж",
  ],
  "generator-marine": [
    "Уточняем режим работы, требуемую мощность и назначение силовой установки",
    "Проверяем сопряжение с генератором, редуктором или судовым оборудованием",
    "Согласуем комплект поставки, охлаждение, органы управления и требования объекта",
  ],
};

function requestUrl(engine: CumminsEngineFamily) {
  const text = `Здравствуйте! Интересует двигатель Cummins ${engine.name} в сборе.
Техника и модель: 
Полный индекс двигателя: 
Серийный номер двигателя/техники: 
Город поставки: 
Нужен монтаж и запуск: да / нет
Требуемый срок: 
Фото шильдика пришлю следующим сообщением.
https://acahydraulic.kz${cumminsEnginePath(engine)}/`;
  return `https://wa.me/77714177925?text=${encodeURIComponent(text)}`;
}

function relatedEngines(engine: CumminsEngineFamily) {
  const group = cumminsEngineGroupFor(engine);
  const sameGroup = (group?.engines ?? []).filter((item) => item.id !== engine.id);
  const fallback = cumminsEngineFamilies.filter((item) => item.id !== engine.id && !sameGroup.some((candidate) => candidate.id === item.id));
  return [...sameGroup, ...fallback].slice(0, 4);
}

export function CumminsEngineProductPage({ engine }: { engine: CumminsEngineFamily }) {
  const productPath = cumminsEnginePath(engine);
  const group = cumminsEngineGroupFor(engine);
  const selectionChecks = selectionByGroup[group?.id ?? "compact-medium"];
  const productName = `Двигатель Cummins ${engine.name} в сборе`;
  const description = `${productName} под заказ для спецтехники и промышленного оборудования. Подбор по полному индексу и шильдику, поставка по Казахстану, монтаж и запуск по согласованию.`;
  const faq = [
    {
      question: `Можно ли заказать Cummins ${engine.name} только по названию серии?`,
      answer: `Нет. Название ${engine.name} обозначает семейство. Перед расчётом сверяем полный индекс, серийный номер, шильдик техники, навесное оборудование и подключения.`,
    },
    {
      question: `Сколько стоит двигатель Cummins ${engine.name}?`,
      answer: "Цена зависит от точного исполнения, комплектации, производителя поставляемого двигателя, маршрута и срока. Актуальную стоимость фиксируем в коммерческом предложении после проверки исходных данных.",
    },
    {
      question: "Можно ли заказать установку и запуск?",
      answer: "Да, если техника и место работ позволяют выполнить монтаж. Состав работ, переносимые узлы, запуск и гарантийные условия рассчитываются отдельно и фиксируются до начала работ.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description,
    image: `https://acahydraulic.kz${engine.image}`,
    url: `https://acahydraulic.kz${productPath}/`,
    sku: engine.name,
    model: engine.name,
    category: "Двигатели Cummins в сборе",
    brand: { "@type": "Brand", name: "Cummins" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Ориентир мощности семейства", value: engine.powerKw },
      { "@type": "PropertyValue", name: "Применение", value: engine.application },
      { "@type": "PropertyValue", name: "Проверка совместимости", value: "По полному индексу, шильдику и серийному номеру" },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#111827]">
      <SEO
        title={`${productName} — купить с поставкой по Казахстану`}
        description={description}
        keywords={`двигатель Cummins ${engine.name} купить, Cummins ${engine.name} цена, двигатель ${engine.name} в сборе Казахстан, поставка двигателя Cummins`}
        canonical={productPath}
        ogImage={engine.image}
        schema={schema}
        breadcrumbs={[
          { name: "Каталог", url: "/catalog/" },
          { name: "Двигатели в сборе", url: `${categoryPath}/` },
          { name: "Cummins", url: `${brandCatalogPath}/` },
          { name: engine.name, url: productPath },
        ]}
        faq={faq}
      />

      <section className="border-b border-gray-200 bg-white py-8 md:py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <nav aria-label="Навигация по каталогу" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#7a5000] underline underline-offset-4">
            <Link href={`${categoryPath}/`}>Все двигатели</Link>
            <Link href={`${brandCatalogPath}/`}>Каталог Cummins</Link>
          </nav>

          <div className="mt-7 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <figure className="overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <img src={engine.image} alt={`Фото серии Cummins ${engine.name}`} width={480} height={480} fetchPriority="high" className="aspect-square w-full object-contain" />
              <figcaption className="border-t border-gray-100 px-2 pb-1 pt-3 text-sm leading-6 text-gray-500">
                Фото серии от поставщика. Фактическое исполнение, маркировку и комплектность подтверждаем до оплаты.
              </figcaption>
            </figure>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#8a5b00]">Двигатель Cummins в сборе</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{productName}</h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">{engine.application}. Диапазон <strong className="text-gray-900">{engine.powerKw}</strong> указан как ориентир по семейству; конкретное исполнение подбираем по шильдику и серийному номеру.</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-[#f8fafc] p-4">
                  <p className="text-sm text-gray-500">Цена и срок поставки</p>
                  <p className="mt-1 text-xl font-extrabold">По запросу</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#f8fafc] p-4">
                  <p className="text-sm text-gray-500">Монтаж и запуск</p>
                  <p className="mt-1 text-xl font-extrabold">По согласованию</p>
                </div>
              </div>

              <a
                href={requestUrl(engine)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCatalogEvent("engine_product_whatsapp_click", { item_id: engine.id, source: "cummins-engine-product" })}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3 font-extrabold text-black hover:bg-[#eab000] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />Запросить цену и срок
              </a>
              <p className="mt-4 text-sm leading-6 text-gray-500">Для расчёта пришлите фото шильдика двигателя и техники, город, количество и требуемый срок.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "Подбор", value: "По индексу и шильдику" },
              { icon: PackageCheck, title: "Комплектация", value: "Фиксируется в предложении" },
              { icon: Truck, title: "Поставка", value: "По Казахстану" },
              { icon: ShieldCheck, title: "Гарантия", value: "Условия по договору" },
            ].map(({ icon: Icon, title, value }) => (
              <article key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                <Icon className="h-6 w-6 text-[#9a6500]" aria-hidden="true" />
                <h2 className="mt-4 text-sm font-bold uppercase tracking-wide text-gray-500">{title}</h2>
                <p className="mt-2 font-bold">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8a5b00]">Совместимость до заказа</p>
              <h2 className="mt-3 text-3xl font-extrabold">Как подбираем Cummins {engine.name}</h2>
              <ul className="mt-6 space-y-4 text-gray-700">
                {selectionChecks.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6500]" aria-hidden="true" /><span>{item}</span></li>)}
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6500]" aria-hidden="true" /><span>До оплаты согласуем фото, видео, маркировку, документы, срок и гарантийные условия</span></li>
              </ul>
            </section>

            <aside className="rounded-xl bg-[#111827] p-6 text-white md:p-8">
              <h2 className="text-2xl font-extrabold">Что входит в предложение</h2>
              <p className="mt-4 leading-relaxed text-gray-300">Отдельно показываем стоимость двигателя, логистики и работ. Перечень навесного оборудования, состояние, изготовителя, срок и гарантия подтверждаются для конкретного предложения.</p>
              <p className="mt-4 leading-relaxed text-gray-300">Если нужен монтаж, заранее фиксируем переносимые узлы, объём работ, порядок запуска и приёмки.</p>
            </aside>
          </div>
        </div>
      </section>

      {engine.casePath && (
        <section data-engine-case className="border-y border-gray-200 bg-white py-12 md:py-16">
          <div className="container mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
            <img src="/media/shantui-sd32-engine/installation.webp" alt="Установка двигателя Cummins NTA855 на Shantui SD32" width={900} height={1600} loading="lazy" className="max-h-[560px] w-full rounded-xl bg-[#f4f5f7] object-contain" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8a5b00]">Подтверждённый кейс ACA Hydraulic</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{engine.caseTitle}</h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">Поставили новый комплектный двигатель с навесным оборудованием, перенесли гидротрансформатор со старого двигателя, выполнили монтаж и запуск. Стоимость двигателя в этом заказе составляла 12 860 000 ₸ без монтажа.</p>
              <Link href={engine.casePath} className="mt-6 inline-flex min-h-12 items-center justify-center rounded bg-[#111827] px-6 py-3 font-bold text-white hover:bg-black">Смотреть фото и видео кейса</Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-extrabold md:text-4xl">Другие двигатели Cummins</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedEngines(engine).map((item) => (
              <Link key={item.id} href={cumminsEnginePath(item)} className="group rounded-xl border border-gray-200 bg-white p-4 hover:border-[#b97800]">
                <img src={item.image} alt={`Cummins ${item.name}`} width={480} height={480} loading="lazy" className="aspect-[4/3] w-full object-contain" />
                <h3 className="mt-4 text-xl font-extrabold group-hover:text-[#7a5000]">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{item.application}</p>
              </Link>
            ))}
          </div>

          <section className="mt-12 max-w-4xl">
            <h2 className="text-3xl font-extrabold">Вопросы по Cummins {engine.name}</h2>
            <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
              {faq.map((item) => <details key={item.question} className="py-5"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-relaxed text-gray-600">{item.answer}</p></details>)}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function CumminsEngineProductRoute() {
  const [matches, params] = useRoute<{ slug: string }>(`${brandCatalogPath}/:slug`);
  const engine = matches ? findCumminsEngineBySlug(params?.slug) : undefined;
  return engine ? <CumminsEngineProductPage engine={engine} /> : <NotFound />;
}

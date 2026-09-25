import { Link } from "wouter";
import { CheckCircle2, Factory, Gauge, MessageCircle, ShieldCheck, Truck } from "lucide-react";

import { CumminsEngineCard } from "@/components/engines/CumminsEngineCard";
import { SEO } from "@/components/SEO";
import { cumminsEngineFamilies, cumminsEngineGroups, cumminsEnginePath } from "@/data/cumminsEngineFamilies";

export const cumminsEngineCatalogPath = "/parts/engines-complete/cummins";
const heroImage = "/catalog-assets/cummins-engine-range.webp";

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Двигатели Cummins в сборе для спецтехники",
      description: "Подбор и поставка двигателей семейств QSB, QSL, QSC, QSM, N855, K19, QSK и X15 по Казахстану.",
      url: `https://acahydraulic.kz${cumminsEngineCatalogPath}/`,
      inLanguage: "ru-KZ",
    },
    {
      "@type": "ItemList",
      numberOfItems: cumminsEngineFamilies.length,
      itemListElement: cumminsEngineFamilies.map((engine, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `Двигатель ${engine.name}`,
        url: `https://acahydraulic.kz${cumminsEnginePath(engine)}/`,
      })),
    },
  ],
};

const generalWhatsappUrl = `https://wa.me/77714177925?text=${encodeURIComponent(`Здравствуйте! Нужен двигатель Cummins в сборе.
Техника и модель: 
Предполагаемая серия двигателя: 
Полный индекс и серийный номер: 
Город поставки: 
Нужен монтаж и запуск: да / нет
Фото шильдика пришлю следующим сообщением.
https://acahydraulic.kz${cumminsEngineCatalogPath}/`)}`;

export default function CumminsEngineCatalog() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#111827]">
      <SEO
        title="Двигатели Cummins в сборе: QSB, N855, K19, QSK и X15"
        description="Каталог двигателей Cummins в сборе для спецтехники: QSB, QSL, QSC, QSM11, N855, K19, QSK19, QSK23, QSK38, QSK50 и X15. Подбор по шильдику, поставка по Казахстану, монтаж и запуск."
        keywords="двигатель Cummins в сборе Казахстан, Cummins N855, QSB6.7, QSM11, K19, QSK19, QSK38, QSK50, X15 купить"
        canonical={cumminsEngineCatalogPath}
        ogImage={heroImage}
        schema={pageSchema}
        breadcrumbs={[
          { name: "Каталог", url: "/catalog/" },
          { name: "Двигатели в сборе", url: "/parts/engines-complete/" },
          { name: "Двигатели Cummins", url: cumminsEngineCatalogPath },
        ]}
      />

      <section className="border-b border-gray-200 bg-white py-10 md:py-16">
        <div className="container mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Link href="/parts/engines-complete/" className="text-sm font-bold text-[#8a5b00] underline underline-offset-4">Двигатели в сборе</Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-[#8a5b00]">Каталог под заказ</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">Двигатели Cummins для спецтехники и промышленного оборудования</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">Подбираем конкретное исполнение по полному индексу двигателя, шильдику техники, серийному номеру и требуемой комплектации. Организуем поставку по Казахстану; монтаж и запуск рассчитываем отдельно.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#engine-families" className="inline-flex min-h-12 items-center justify-center rounded bg-[#111827] px-6 py-3 font-bold text-white hover:bg-black">Выбрать серию</a>
              <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3 font-extrabold text-black hover:bg-[#eab000]"><MessageCircle className="h-5 w-5" aria-hidden="true" />Отправить шильдик</a>
            </div>
          </div>
          <figure className="rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
            <img src={heroImage} alt="Линейка промышленных дизельных двигателей в сборе" width={1600} height={900} fetchPriority="high" className="aspect-video w-full rounded-xl object-cover" />
            <figcaption className="px-2 pb-1 pt-3 text-sm leading-6 text-gray-500">Оригинальный визуал категории. Фактическое исполнение двигателя подтверждаем фото, видео и шильдиком до оплаты.</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#111827] py-8 text-white">
        <div className="container mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3">
          {[
            { icon: Gauge, title: `${cumminsEngineFamilies.length} семейств`, text: "От компактных QSB до тяжёлых QSK50" },
            { icon: ShieldCheck, title: "Проверка до оплаты", text: "Индекс, шильдик, серийный номер и комплектность" },
            { icon: Truck, title: "Поставка по Казахстану", text: "Цена, маршрут и срок фиксируются в предложении" },
          ].map(({ icon: Icon, title, text }) => <article key={title} className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-5"><Icon className="mt-0.5 h-6 w-6 shrink-0 text-[#FFC000]" aria-hidden="true" /><div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-gray-300">{text}</p></div></article>)}
        </div>
      </section>

      <div id="engine-families" className="container mx-auto max-w-7xl space-y-14 px-4 py-12 md:py-16">
        {cumminsEngineGroups.map((group) => (
          <section key={group.id} aria-labelledby={`${group.id}-title`}>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8a5b00]">Поставка двигателей</p>
              <h2 id={`${group.id}-title`} className="mt-2 text-3xl font-extrabold md:text-4xl">{group.title}</h2>
              <p className="mt-3 leading-relaxed text-gray-600">{group.description}</p>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.engines.map((engine) => <CumminsEngineCard key={engine.id} engine={engine} source="cummins-engine-catalog" />)}
            </div>
          </section>
        ))}
      </div>

      <section className="border-y border-gray-200 bg-white py-12 md:py-16">
        <div className="container mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">Что нужно для точного подбора</h2>
            <ul className="mt-6 grid gap-4 text-gray-700 sm:grid-cols-2">
              {["Полный индекс и фото шильдика двигателя", "Марка, модель и серийный номер техники", "Фото навесного оборудования и подключений", "Город, количество и требуемый срок", "Нужны ли монтаж, запуск и перенос узлов", "Требования предприятия к документам и приёмке"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6500]" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </div>
          <aside className="rounded-xl bg-[#111827] p-7 text-white">
            <Factory className="h-8 w-8 text-[#FFC000]" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-extrabold">Без неподтверждённых обещаний</h2>
            <p className="mt-4 leading-relaxed text-gray-300">Диапазоны мощности используются как ориентир по семейству. Конкретную модификацию, производителя, состояние, наличие, цену, срок и гарантию подтверждаем в коммерческом предложении.</p>
            <a href={generalWhatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded bg-[#FFC000] px-5 py-3 font-extrabold text-black">Получить расчёт поставки</a>
          </aside>
        </div>
      </section>
    </main>
  );
}

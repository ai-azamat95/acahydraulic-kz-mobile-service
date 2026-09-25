import { Building2, CheckCircle2, ClipboardCheck, MessageCircle, PackageCheck, Settings, Truck } from "lucide-react";
import { Link } from "wouter";

import { SEO } from "@/components/SEO";
import { CumminsEngineCard } from "@/components/engines/CumminsEngineCard";
import { cumminsEngineFamilies, cumminsEngineGroups } from "@/data/cumminsEngineFamilies";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

const pagePath = "/parts/engines-complete";
const casePath = "/cases/shantui-sd32-postavka-dvigatelya-cummins-nta855";
const cumminsCatalogPath = "/parts/engines-complete/cummins";
const message = `Здравствуйте! Нужен двигатель в сборе для спецтехники.\nМарка и модель техники: \nМодель двигателя: \nСерийный номер техники/двигателя: \nГород поставки: \nКоличество: \nНужен монтаж и запуск: да / нет\nТребуемый срок: \nФото шильдика пришлю следующим сообщением.\nhttps://acahydraulic.kz${pagePath}/`;

const faq = [
  {
    question: "Можно ли подобрать двигатель только по названию серии?",
    answer: "Нет. Для заказа сверяем полный индекс двигателя, серийный номер, шильдик техники, комплектацию и навесное оборудование. Одна серия может иметь разные исполнения.",
  },
  {
    question: "Что входит в поставку двигателя?",
    answer: "Состав комплектации фиксируем в коммерческом предложении и договоре после проверки запроса. Отдельно указываем навесное оборудование, доставку, монтаж, запуск и узлы, которые переносятся со старого двигателя.",
  },
  {
    question: "Какая гарантия на двигатель и установку?",
    answer: "Условия и срок гарантии указываются в договоре для конкретного двигателя и состава работ. До оплаты заказчик получает согласованную комплектацию и гарантийные условия.",
  },
  {
    question: "Цена 12 860 000 ₸ действует сейчас?",
    answer: "Это историческая стоимость двигателя в выполненном заказе для Shantui SD32. Монтаж в неё не входил. Для нового запроса цену, срок и комплектацию рассчитываем заново.",
  },
];

const process = [
  { icon: ClipboardCheck, title: "Проверяем исходные данные", text: "Модель техники, полный индекс и серийный номер двигателя, фото шильдиков, город, количество и требуемый срок." },
  { icon: PackageCheck, title: "Фиксируем комплектацию", text: "Согласуем навесное оборудование, документы, фото и видео до отгрузки, условия поставки и гарантии." },
  { icon: Truck, title: "Организуем поставку", text: "Маршрут и срок подтверждаем в расчёте. Для предприятия отдельно согласуем порядок приёмки и документы." },
  { icon: Settings, title: "Устанавливаем и запускаем", text: "Монтаж, перенос согласованных узлов и запуск считаются отдельным составом работ и фиксируются до начала." },
];

export default function CompleteEngines() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#111827]">
      <SEO
        title="Каталог двигателей в сборе Cummins — поставка и монтаж"
        description="Каталог двигателей Cummins в сборе для спецтехники: 25 серий, подбор по шильдику, поставка по Казахстану, монтаж и запуск по согласованию. Реальный кейс NTA855 для Shantui SD32."
        keywords="каталог двигателей Cummins, двигатель в сборе купить Казахстан, Cummins NT855, Cummins QSB, Cummins QSK, двигатель для спецтехники с установкой"
        canonical={pagePath}
        ogImage="/catalog-assets/cummins-engine-range.webp"
        pageType="service"
        breadcrumbs={[{ name: "Запчасти", url: "/catalog/" }, { name: "Двигатели в сборе", url: pagePath }]}
        faq={faq}
        serviceSchema={{
          serviceName: "Поставка двигателей в сборе с установкой",
          serviceDescription: "Подбор, поставка, монтаж и запуск двигателей для спецтехники. Совместимость и комплектация проверяются по полному индексу, серийному номеру и шильдику.",
          serviceUrl: pagePath,
          areaServed: ["Казахстан"],
        }}
      />

      <section className="border-b border-white/10 bg-[#111] py-12 text-white md:py-20">
        <div className="container mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Link href="/catalog/" className="text-sm font-bold text-[#FFC000] underline underline-offset-4">Каталог запчастей</Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#FFC000]">25 серий Cummins в отдельном товарном каталоге</p>
            <h1 className="mt-4 font-bebas text-5xl leading-none md:text-7xl">Новые двигатели в сборе — <span className="text-[#FFC000]">поставка и монтаж</span></h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">Выберите серию двигателя и откройте полноценную карточку. Точное исполнение подбираем по полному индексу, серийному номеру и шильдику; цену, срок и комплектацию подтверждаем до оплаты, гарантийные условия фиксируем в договоре.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCatalogEvent("engine_supply_whatsapp_click", { source: "complete-engines-landing" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3 font-bold text-black hover:bg-[#eab000]"
              ><MessageCircle className="h-5 w-5" aria-hidden="true" />Подобрать двигатель</a>
              <a href="#engine-catalog" className="inline-flex min-h-12 items-center justify-center rounded border border-white/20 px-6 py-3 font-bold hover:border-[#FFC000] hover:text-[#FFC000]">Смотреть все {cumminsEngineFamilies.length} серий</a>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-400">Для расчёта нужны модель техники, полный индекс двигателя, фото шильдика, город и требуемый срок. Каталог будет пополняться другими марками.</p>
          </div>
          <figure>
            <img src="/catalog-assets/cummins-engine-range.webp" alt="Линейка промышленных двигателей Cummins в сборе" width={1600} height={900} fetchPriority="high" className="w-full rounded-xl bg-white object-contain" />
            <figcaption className="mt-3 text-sm leading-6 text-gray-400">Изображение линейки. Фактическое исполнение и комплектность подтверждаем для конкретного запроса.</figcaption>
          </figure>
        </div>
      </section>

      <section id="engine-catalog" className="scroll-mt-20 py-12 md:py-18" aria-labelledby="engine-products-title">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8a5b00]">Каталог двигателей в сборе</p>
            <h2 id="engine-products-title" className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Выберите серию Cummins</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">Каждая карточка ведёт на отдельную страницу с назначением, ориентиром мощности, условиями подбора и запросом расчёта. Реальный кейс показан только у серии N855 / NT855 / NTA855.</p>
            <Link href={cumminsCatalogPath} className="mt-4 inline-flex font-bold text-[#7a5000] underline underline-offset-4">Открыть каталог бренда Cummins</Link>
          </div>

          {cumminsEngineGroups.map((group) => (
            <section key={group.id} className="mt-12" aria-labelledby={`engine-group-${group.id}`}>
              <div className="max-w-3xl">
                <h2 id={`engine-group-${group.id}`} className="text-3xl font-extrabold">{group.title}</h2>
                <p className="mt-3 leading-relaxed text-gray-600">{group.description}</p>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {group.engines.map((engine) => <CumminsEngineCard key={engine.id} engine={engine} source="complete-engines" />)}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111] py-14 text-white md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="font-bebas text-4xl md:text-5xl">Как проходит поставка</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-xl border border-white/10 bg-[#181818] p-6">
                <Icon className="h-7 w-7 text-[#FFC000]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-gray-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14 md:py-20">
        <div className="container mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <img src="/media/shantui-sd32-engine/installation.webp" alt="Монтаж двигателя Cummins NTA855 на бульдозер Shantui SD32" width={900} height={1600} loading="lazy" className="max-h-[620px] w-full rounded-xl bg-[#f4f5f7] object-contain" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#8a5b00]">Подтверждённый заказ</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight md:text-5xl">Shantui SD32: поставка Cummins NTA855, установка и запуск</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">Поставили новый комплектный двигатель с навесным оборудованием. Гидротрансформатор перенесли со старого двигателя, затем установили двигатель на бульдозер и выполнили запуск.</p>
            <div className="mt-6 rounded-lg border border-[#e0b000] bg-[#fff9df] p-6">
              <p className="text-sm text-gray-600">Стоимость двигателя в этом заказе</p>
              <p className="mt-2 text-4xl font-bold text-[#8a5b00]">12 860 000 ₸</p>
              <p className="mt-3 text-sm leading-6 text-gray-600">Историческая цена конкретной поставки. Монтаж не входил в указанную сумму. Новый заказ рассчитывается заново.</p>
            </div>
            <Link href={casePath} className="mt-6 inline-flex min-h-12 items-center rounded bg-[#111827] px-6 py-3 font-bold text-white hover:bg-black">Фото, видео и состав работ</Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-4xl font-extrabold">Что фиксируем до оплаты</h2>
            <ul className="mt-6 space-y-4 text-gray-700">
              {["Полный индекс и серийный номер двигателя, модель и серийный номер техники", "Комплектацию и навесное оборудование; перечень узлов, которые переносятся со старого двигателя", "Фото, видео и маркировку поставляемого двигателя до отгрузки", "Стоимость двигателя, логистики и монтажа отдельными строками", "Срок, порядок приёмки и гарантийные условия по договору"].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6500]" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </div>
          <aside className="rounded-xl bg-[#111827] p-7 text-white">
            <Building2 className="h-8 w-8 text-[#FFC000]" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">Запрос от предприятия</h2>
            <p className="mt-4 leading-relaxed text-gray-300">Укажите количество единиц техники, город, желаемый срок и нужен ли монтаж. Подготовим предложение с разделением двигателя, доставки и работ.</p>
            <a href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black">Отправить данные техники</a>
          </aside>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-4xl font-extrabold">Вопросы по поставке двигателя</h2>
          <div className="mt-6 divide-y divide-gray-200">{faq.map(item => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-bold">{item.question}</summary><p className="mt-4 leading-relaxed text-gray-600">{item.answer}</p></details>)}</div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-bold text-[#7a5000] underline underline-offset-4"><Link href="/catalog/category/engine-fuel/">Запчасти двигателя</Link><Link href="/brands/shantui/">Сервис Shantui</Link><Link href="/services/bulldozer-repair/">Ремонт бульдозеров</Link></div>
        </div>
      </section>
    </main>
  );
}

import { Link } from "wouter";
import { Building2, CheckCircle2, ClipboardCheck, MessageCircle, PackageCheck, Settings, Truck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

const pagePath = "/parts/engines-complete";
const casePath = "/cases/shantui-sd32-postavka-dvigatelya-cummins-nta855";
const message = `Здравствуйте! Нужен новый двигатель в сборе для спецтехники.\nМарка и модель техники: \nМодель двигателя: \nСерийный номер техники/двигателя: \nГород поставки: \nКоличество: \nНужен монтаж и запуск: да / нет\nТребуемый срок: \nФото шильдика пришлю следующим сообщением.\nhttps://acahydraulic.kz${pagePath}/`;

const faq = [
  {
    question: "Можно ли подобрать двигатель только по названию NTA855?",
    answer: "Нет. Для заказа сверяем полный индекс двигателя, серийный номер, шильдик техники, комплектацию и навесное оборудование. Одинаковая базовая серия может иметь разные исполнения.",
  },
  {
    question: "Что входит в поставку двигателя?",
    answer: "Состав комплектации фиксируем в коммерческом предложении и договоре после проверки запроса. Отдельно указываем навесное оборудование, доставку, монтаж, пуск и то, какие узлы переносятся со старого двигателя.",
  },
  {
    question: "Какая гарантия на новый двигатель и установку?",
    answer: "Гарантийные условия и срок указываются в договоре для конкретного двигателя и состава работ. До оплаты заказчик получает согласованную комплектацию и условия гарантии.",
  },
  {
    question: "Цена 12 860 000 ₸ действует сейчас?",
    answer: "Это стоимость двигателя в конкретном выполненном заказе для Shantui SD32. Монтаж в неё не входил. Для нового запроса цену, срок и комплектацию рассчитываем заново.",
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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="Новые двигатели в сборе для спецтехники с установкой"
        description="Поставка новых двигателей в сборе для спецтехники по Казахстану: проверка по шильдику, комплектация, гарантия по договору, монтаж и запуск. Реальный кейс Cummins NTA855 для Shantui SD32."
        keywords="двигатель в сборе для спецтехники, купить двигатель Cummins NTA855, двигатель Shantui SD32, поставка двигателя с установкой Казахстан"
        canonical={pagePath}
        ogImage="/media/shantui-sd32-engine/og.webp"
        pageType="service"
        breadcrumbs={[{ name: "Запчасти", url: "/catalog/" }, { name: "Двигатели в сборе", url: pagePath }]}
        faq={faq}
        serviceSchema={{
          serviceName: "Поставка новых двигателей в сборе с установкой",
          serviceDescription: "Подбор, поставка, монтаж и запуск новых двигателей для спецтехники. Совместимость и комплектация проверяются по полному индексу, серийному номеру и шильдику.",
          serviceUrl: pagePath,
          areaServed: ["Казахстан"],
        }}
      />

      <section className="border-b border-white/10 bg-[#111] py-12 md:py-20">
        <div className="container mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <Link href="/catalog/" className="text-sm font-bold text-[#FFC000] underline underline-offset-4">Каталог запчастей</Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#FFC000]">Для предприятий и владельцев спецтехники</p>
            <h1 className="mt-4 font-bebas text-5xl leading-none md:text-7xl">Новые двигатели в сборе — <span className="text-[#FFC000]">с гарантией и установкой</span></h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">Подбираем двигатель по полному индексу и шильдику, согласуем комплектацию, организуем поставку по Казахстану. Монтаж и запуск включаем в расчёт отдельной строкой, гарантийные условия фиксируем в договоре.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCatalogEvent("engine_supply_whatsapp_click", { source: "complete-engines-landing" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3 font-bold text-black hover:bg-[#eab000]"
              ><MessageCircle className="h-5 w-5" aria-hidden="true" />Получить расчёт поставки</a>
              <Link href={casePath} className="inline-flex min-h-12 items-center justify-center rounded border border-white/20 px-6 py-3 font-bold hover:border-[#FFC000] hover:text-[#FFC000]">Смотреть кейс Shantui SD32</Link>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-400">Для расчёта нужны: модель техники, полный индекс двигателя, фото шильдика, город, количество и требуемый срок.</p>
          </div>
          <figure>
            <img src="/media/shantui-sd32-engine/new-engine.webp" alt="Новый комплектный двигатель Cummins NTA855 перед установкой на Shantui SD32" width={900} height={1600} fetchPriority="high" className="max-h-[650px] w-full rounded-xl bg-[#181818] object-contain" />
            <figcaption className="mt-3 text-sm leading-6 text-gray-400">Реальный двигатель из выполненной поставки для бульдозера Shantui SD32.</figcaption>
          </figure>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-xl border border-white/10 bg-[#141414] p-6">
                <Icon className="h-7 w-7 text-[#FFC000]" aria-hidden="true" />
                <h2 className="mt-5 text-xl font-bold">{title}</h2>
                <p className="mt-3 leading-relaxed text-gray-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#141414] py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <img src="/media/shantui-sd32-engine/installation.webp" alt="Монтаж двигателя Cummins NTA855 на бульдозер Shantui SD32" width={900} height={1600} loading="lazy" className="max-h-[620px] w-full rounded-xl object-contain" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Выполненный заказ</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl">Shantui SD32: поставка Cummins NTA855, установка и запуск</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-300">Поставили новый комплектный двигатель с навесным оборудованием. Гидротрансформатор перенесли со старого двигателя, затем установили двигатель на бульдозер и выполнили запуск.</p>
            <div className="mt-6 rounded-lg border border-[#FFC000]/30 bg-black/20 p-6">
              <p className="text-sm text-gray-400">Стоимость двигателя в этом заказе</p>
              <p className="mt-2 text-4xl font-bold text-[#FFC000]">12 860 000 ₸</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">Историческая цена конкретной поставки. Монтаж не входил в указанную сумму. Для нового заказа цена и срок рассчитываются заново.</p>
            </div>
            <Link href={casePath} className="mt-6 inline-flex min-h-12 items-center rounded bg-[#FFC000] px-6 py-3 font-bold text-black hover:bg-[#eab000]">Фото, видео и состав работ</Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-bebas text-4xl md:text-5xl">Что фиксируем до оплаты</h2>
            <ul className="mt-6 space-y-4 text-gray-300">
              {["Полный индекс и серийный номер двигателя, модель и серийный номер техники", "Комплектацию и навесное оборудование; перечень узлов, которые переносятся со старого двигателя", "Фото, видео и маркировку поставляемого двигателя до отгрузки", "Стоимость двигателя, логистики и монтажа отдельными строками", "Срок, порядок приёмки и гарантийные условия по договору"].map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC000]" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
          </div>
          <aside className="rounded-xl border border-white/10 bg-[#151515] p-7">
            <Building2 className="h-8 w-8 text-[#FFC000]" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">Запрос от предприятия</h2>
            <p className="mt-4 leading-relaxed text-gray-400">Укажите количество единиц техники, город, желаемый срок и нужен ли монтаж. Подготовим структуру предложения с разделением двигателя, доставки и работ.</p>
            <a href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black">Отправить данные техники</a>
          </aside>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#111] py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="font-bebas text-4xl md:text-5xl">Вопросы по поставке двигателя</h2>
          <div className="mt-6 divide-y divide-white/10">{faq.map(item => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-bold">{item.question}</summary><p className="mt-4 leading-relaxed text-gray-300">{item.answer}</p></details>)}</div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[#FFC000] underline underline-offset-4"><Link href="/catalog/category/engine-fuel/">Запчасти двигателя</Link><Link href="/brands/shantui/">Сервис Shantui</Link><Link href="/services/bulldozer-repair/">Ремонт бульдозеров</Link></div>
        </div>
      </section>
    </main>
  );
}

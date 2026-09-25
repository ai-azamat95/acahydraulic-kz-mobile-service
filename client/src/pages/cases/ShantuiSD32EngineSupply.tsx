import { Link } from "wouter";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

const casePath = "/cases/shantui-sd32-postavka-dvigatelya-cummins-nta855";
const enginePath = "/parts/engines-complete";
const mediaRoot = "/media/shantui-sd32-engine";
const message = `Здравствуйте! Нужен двигатель в сборе для спецтехники.\nМарка и модель техники: \nПолный индекс двигателя: \nСерийный номер: \nГород: \nНужен монтаж и запуск: да / нет\nФото шильдика пришлю следующим сообщением.\nhttps://acahydraulic.kz${casePath}/`;

const faq = [
  { question: "Что вошло в цену 12 860 000 ₸?", answer: "Это стоимость нового комплектного двигателя с навесным оборудованием в данном выполненном заказе. Монтаж в цену не входил." },
  { question: "Что перенесли со старого двигателя?", answer: "Со старого двигателя на новый перенесли гидротрансформатор. Остальная согласованная комплектация поставлялась вместе с двигателем." },
  { question: "Как заказать такой двигатель для другой машины?", answer: "Нужны модель техники, полный индекс и серийный номер двигателя, фото шильдика, город и требуемый срок. Совместимость нельзя подтверждать только по базовой серии NTA855." },
  { question: "Какая гарантия действует?", answer: "Для нового заказа срок и условия гарантии на двигатель и монтаж фиксируются в договоре после подтверждения комплектации и состава работ." },
];

export default function ShantuiSD32EngineSupply() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] py-10 text-white md:py-16">
      <SEO
        title="Shantui SD32: поставка двигателя Cummins NTA855 за 12 860 000 ₸"
        description="Реальный кейс ACA Hydraulic: новый комплектный Cummins NTA855 для Shantui SD32 за 12 860 000 ₸ без монтажа. Перенос гидротрансформатора, установка и запуск бульдозера."
        keywords="двигатель Cummins NTA855 Shantui SD32, купить двигатель Shantui SD32, двигатель в сборе спецтехника Казахстан, установка двигателя бульдозера"
        canonical={casePath}
        ogImage={`${mediaRoot}/og.webp`}
        pageType="article"
        publishedDate="2026-09-25"
        modifiedDate="2026-09-25"
        breadcrumbs={[{ name: "Кейсы", url: "/cases/" }, { name: "Двигатель Shantui SD32", url: casePath }]}
        faq={faq}
        schema={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "Установка двигателя Cummins NTA855 на Shantui SD32",
          description: "Реальные кадры поставки и установки комплектного двигателя на бульдозер Shantui SD32.",
          thumbnailUrl: [`https://acahydraulic.kz${mediaRoot}/installation.webp`],
          contentUrl: `https://acahydraulic.kz${mediaRoot}/installation.mp4`,
          uploadDate: "2026-09-25T00:00:00+05:00",
          duration: "PT48S",
          inLanguage: "ru",
        }}
      />

      <div className="container mx-auto max-w-6xl px-4">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><Link href="/cases/" className="font-bold text-[#FFC000] underline">Все кейсы</Link><Link href={enginePath} className="text-gray-300 underline">Новые двигатели в сборе</Link></nav>

        <section className="mt-7 grid items-start gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Выполненный заказ · поставка и установка</p>
            <h1 className="mt-4 font-bebas text-5xl leading-none md:text-7xl">Shantui SD32: новый Cummins NTA855, установка и запуск</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">Для бульдозера поставили новый комплектный двигатель Cummins серии NTA855 с навесным оборудованием. Гидротрансформатор перенесли со старого двигателя, двигатель установили и бульдозер запустили.</p>
            <div className="mt-7 rounded-xl border border-[#FFC000]/30 bg-[#151515] p-6">
              <p className="text-sm text-gray-400">Стоимость двигателя в этом заказе</p>
              <p className="mt-2 text-4xl font-bold text-[#FFC000]">12 860 000 ₸</p>
              <p className="mt-3 leading-6 text-gray-300">Новый комплектный двигатель с навесным оборудованием.</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">Монтаж не входил в указанную цену. Это цена конкретной завершённой поставки, а не действующий универсальный прайс.</p>
            </div>
          </div>
          <figure>
            <img src={`${mediaRoot}/new-engine.webp`} alt="Новый комплектный двигатель Cummins NTA855 для бульдозера Shantui SD32" width={900} height={1600} fetchPriority="high" className="max-h-[650px] w-full rounded-xl bg-[#151515] object-contain" />
            <figcaption className="mt-3 text-sm leading-6 text-gray-400">Двигатель перед установкой. На имеющихся материалах подтверждается серия NTA855; полное исполнение для каждого нового заказа сверяем по шильдику.</figcaption>
          </figure>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            ["1. Поставка", "Новый двигатель в сборе поступил с согласованным навесным оборудованием."],
            ["2. Перенос узла", "Гидротрансформатор сняли со старого двигателя и перенесли на новый."],
            ["3. Монтаж и результат", "Двигатель установили на Shantui SD32, после сборки бульдозер запустили."],
          ].map(([title, text]) => <article key={title} className="rounded-xl border border-white/10 bg-[#141414] p-6"><CheckCircle2 className="h-6 w-6 text-[#FFC000]" aria-hidden="true" /><h2 className="mt-4 text-2xl font-bold">{title}</h2><p className="mt-3 leading-relaxed text-gray-400">{text}</p></article>)}
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-bebas text-4xl md:text-5xl">Новый двигатель и подготовка</h2>
            <video controls playsInline preload="none" poster={`${mediaRoot}/new-engine.webp`} className="mt-5 aspect-[9/16] max-h-[680px] w-full rounded-xl bg-black object-contain">
              <source src={`${mediaRoot}/walkaround.mp4`} type="video/mp4" />
            </video>
            <p className="mt-3 text-sm text-gray-400">Реальные кадры двигателя перед установкой, 21 секунда.</p>
          </div>
          <div>
            <h2 className="font-bebas text-4xl md:text-5xl">Установка на Shantui SD32</h2>
            <video controls playsInline preload="none" poster={`${mediaRoot}/installation.webp`} className="mt-5 aspect-[9/16] max-h-[680px] w-full rounded-xl bg-black object-contain">
              <source src={`${mediaRoot}/installation.mp4`} type="video/mp4" />
            </video>
            <p className="mt-3 text-sm text-gray-400">Монтаж двигателя на бульдозер, 48 секунд. Видео не запускается автоматически.</p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-bebas text-4xl md:text-5xl">Детали выполненной работы</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <figure><img src={`${mediaRoot}/old-engine.webp`} alt="Старый двигатель Shantui SD32 перед заменой" width={1280} height={960} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" /><figcaption className="mt-3 text-sm text-gray-400">Старый двигатель перед заменой.</figcaption></figure>
            <figure><img src={`${mediaRoot}/torque-converter.webp`} alt="Гидротрансформатор Shantui SD32, перенесённый на новый двигатель" width={900} height={1600} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" /><figcaption className="mt-3 text-sm text-gray-400">Гидротрансформатор перенесли со старого двигателя.</figcaption></figure>
            <figure><img src={`${mediaRoot}/installation.webp`} alt="Установка двигателя Cummins NTA855 на Shantui SD32" width={900} height={1600} loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" /><figcaption className="mt-3 text-sm text-gray-400">Двигатель устанавливают на бульдозер.</figcaption></figure>
          </div>
        </section>

        <section className="mt-14 grid gap-8 border-y border-white/10 py-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="font-bebas text-4xl md:text-5xl">Что нужно для точного расчёта</h2>
            <ol className="mt-6 list-decimal space-y-3 pl-5 leading-relaxed text-gray-300"><li>Марка, модель и серийный номер техники.</li><li>Полный индекс и серийный номер двигателя, фото всех шильдиков.</li><li>Фото двигателя со стороны навесного оборудования и подключений.</li><li>Город поставки, количество, желаемый срок.</li><li>Нужны ли демонтаж старого двигателя, перенос узлов, монтаж и запуск.</li></ol>
            <p className="mt-5 text-sm leading-6 text-gray-400">Базовой маркировки NTA855 недостаточно для подтверждения совместимости. Конкретное исполнение, комплектацию, срок и гарантию фиксируем до оплаты.</p>
          </div>
          <aside className="rounded-xl border border-[#FFC000]/30 bg-[#151515] p-7">
            <h2 className="text-2xl font-bold">Нужен двигатель для вашей техники?</h2>
            <p className="mt-4 leading-relaxed text-gray-400">Отправьте шильдик и данные машины. Подготовим расчёт двигателя, доставки и установки отдельными строками.</p>
            <a href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackCatalogEvent("case_whatsapp_click", { case_id: "shantui-sd32-engine", request_type: "complete-engine" })} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-5 py-3 text-center font-bold text-black"><MessageCircle className="h-5 w-5" aria-hidden="true" />Получить расчёт</a>
            <a href="tel:+77714177925" className="mt-4 block text-center font-bold text-[#FFC000]">+7 (771) 417-79-25</a>
          </aside>
        </section>

        <section className="mt-12"><h2 className="font-bebas text-4xl md:text-5xl">Вопросы по кейсу</h2><div className="mt-5 divide-y divide-white/10">{faq.map(item => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-bold">{item.question}</summary><p className="mt-4 leading-relaxed text-gray-300">{item.answer}</p></details>)}</div></section>
        <section className="mt-12 rounded-xl bg-[#151515] p-7 md:p-9"><h2 className="text-3xl font-bold">Поставка двигателя под договор</h2><p className="mt-4 max-w-3xl leading-relaxed text-gray-300">Согласуем точное исполнение, комплектацию, стоимость, логистику, монтаж и гарантийные условия. Историческая цена этого кейса используется только как подтверждение опыта поставки.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[#FFC000] underline"><Link href={enginePath}>Новые двигатели в сборе</Link><Link href="/catalog/category/engine-fuel/">Запчасти двигателя</Link><Link href="/services/bulldozer-repair/">Сервис бульдозеров</Link></div></section>
      </div>
    </main>
  );
}

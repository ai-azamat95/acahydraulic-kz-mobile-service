import { SEO } from "@/components/SEO";
import Hidromek102bHuscoMedia from "@/components/Hidromek102bHuscoMedia";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import repairCase from "../../../../shared/husco-hidromek-102b-case.json";
import { Link } from "wouter";

const productPath = `/catalog/${repairCase.handle}/`;
const message = `Здравствуйте! Нужен гидрораспределитель HUSCO C16E303 для HIDROMEK HMK 102B. Прошу проверить исполнение и подготовить расчёт.\nМодель и серийный номер машины: \nМаркировка старого распределителя: \nГород: \nКоличество: \nНужен к дате: \nПришлю фото шильдика, портов и разъёмов.\nhttps://acahydraulic.kz${repairCase.casePath}/`;

const faq = [
  {
    question: "Какая маркировка читается на снятом распределителе?",
    answer: "На шильдике читаются HUSCO C16E303, F18/22233 и 6600-E163 A00, а также Made in England.",
  },
  {
    question: "Подходит ли любой HUSCO C16E303 для HIDROMEK HMK 102B?",
    answer: "Нет. Кроме C16E303 нужно сверить дополнительные номера, число и конфигурацию секций, порты, клапаны, электромагниты, разъёмы и крепления конкретной машины.",
  },
  {
    question: "Что подтверждает результат установки?",
    answer: "На финальном видео оператор проверяет подъём, опускание и движение заднего рабочего оборудования HIDROMEK HMK 102B после установки распределителя.",
  },
  {
    question: "Можно заказать распределитель вместе с установкой?",
    answer: "Да. Поставку, выезд и установку рассчитываем после проверки шильдика и конфигурации узла. Цена, срок и состав работ подтверждаются до оплаты.",
  },
];

const videoSchema = {
  "@context": "https://schema.org",
  "@graph": repairCase.videos.map((video) => ({
    "@type": "VideoObject",
    name: video.title,
    description: video.caption,
    thumbnailUrl: `https://acahydraulic.kz${video.poster}`,
    uploadDate: "2026-09-29",
    duration: video.duration,
    contentUrl: `https://acahydraulic.kz${video.src}`,
    mainEntityOfPage: `https://acahydraulic.kz${repairCase.casePath}/`,
  })),
};

export default function Hidromek102bHuscoC16E303() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#101010] py-10 text-white md:py-16">
      <SEO
        title={repairCase.caseTitle}
        description={repairCase.caseDescription}
        keywords="HUSCO C16E303, гидрораспределитель HIDROMEK 102B, задний распределитель HMK 102B, F18/22233, 6600-E163"
        canonical={repairCase.casePath}
        ogImage={repairCase.ogImage}
        pageType="article"
        publishedDate="2026-09-29"
        modifiedDate="2026-09-29"
        breadcrumbs={[
          { name: "Кейсы", url: "/cases/" },
          { name: "HIDROMEK 102B — HUSCO C16E303", url: repairCase.casePath },
        ]}
        faq={faq}
        schema={videoSchema}
      />

      <div className="container mx-auto max-w-6xl px-4">
        <Link href="/cases/" className="inline-flex min-h-11 items-center text-[#FFC000] underline">
          Все кейсы ACA Hydraulic
        </Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_1.05fr]">
          <figure className="rounded-lg bg-white p-4">
            <img
              src={repairCase.image}
              alt="Снятый задний гидрораспределитель HUSCO C16E303 с HIDROMEK HMK 102B"
              width={1400}
              height={1400}
              fetchPriority="high"
              className="aspect-square w-full object-contain"
            />
            <figcaption className="mt-3 text-center text-sm leading-6 text-gray-600">
              Реальный снятый узел из кейса; маркировка и конфигурация сохранены без подмены изображения.
            </figcaption>
          </figure>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Экскаватор-погрузчик · поставка · установка · проверка</p>
            <h1 className="mt-4 break-words text-3xl font-bold leading-tight md:text-5xl">{repairCase.caseTitle}</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Для HIDROMEK HMK 102B поставили и установили задний гидрораспределитель. На снятом узле читается HUSCO C16E303 и дополнительные номера, по которым проверяем точное исполнение перед новым заказом.
            </p>
            <div className="mt-7 rounded-lg border border-[#FFC000]/30 bg-[#181818] p-6">
              <p className="font-bold text-[#FFC000]">Цена и наличие — по запросу</p>
              <p className="mt-3 leading-relaxed text-gray-300">Стоимость поставки и установки в исходных материалах не зафиксирована. Для нового заказа отдельно подтверждаем узел, срок, доставку и состав работ.</p>
              <Link href={productPath} className="mt-5 inline-flex min-h-12 items-center bg-[#FFC000] px-5 py-3 font-bold text-black">
                Карточка HUSCO C16E303
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Что подтвердили по шильдику</h2>
            <dl className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-[#151515] p-6 text-sm">
              <div className="grid grid-cols-[140px_1fr] gap-3"><dt className="text-gray-500">Производитель</dt><dd className="font-semibold">HUSCO</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-3"><dt className="text-gray-500">Модель</dt><dd className="font-semibold">C16E303</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-3"><dt className="text-gray-500">Доп. номера</dt><dd className="font-semibold">F18/22233 · 6600-E163 A00</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-3"><dt className="text-gray-500">Маркировка</dt><dd className="font-semibold">Made in England</dd></div>
              <div className="grid grid-cols-[140px_1fr] gap-3"><dt className="text-gray-500">Техника</dt><dd className="font-semibold">HIDROMEK HMK 102B</dd></div>
            </dl>
          </div>
          <figure className="rounded-lg bg-white p-4">
            <img src={repairCase.nameplateImage} alt="Шильдик HUSCO C16E303 F18/22233 6600-E163 A00" width={1600} height={2134} loading="lazy" className="max-h-[620px] w-full object-contain" />
            <figcaption className="mt-3 text-center text-sm text-gray-600">Крупный план маркировки снятого гидрораспределителя.</figcaption>
          </figure>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-bold">Как проходила замена</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="rounded-lg border border-white/10 bg-[#151515] p-5"><strong className="text-[#FFC000]">1. Доступ и демонтаж</strong><p className="mt-3 text-gray-300">Открыли задний отсек гидросистемы и сняли распределитель с машины.</p></li>
            <li className="rounded-lg border border-white/10 bg-[#151515] p-5"><strong className="text-[#FFC000]">2. Установка и подключения</strong><p className="mt-3 text-gray-300">Установили узел и подключили гидролинии к соответствующим секциям.</p></li>
            <li className="rounded-lg border border-white/10 bg-[#151515] p-5"><strong className="text-[#FFC000]">3. Функциональная проверка</strong><p className="mt-3 text-gray-300">Проверили подъём, опускание и движение задней стрелы и ковша.</p></li>
          </ol>
          <div className="mt-8"><Hidromek102bHuscoMedia /></div>
          <p className="mt-5 text-sm leading-6 text-gray-400">В материалах нет протокола замеров давления и температуры, поэтому публикуем только то, что видно на фото и видео: маркировку узла, монтаж и функциональную проверку движений.</p>
        </section>

        <section className="mt-14 rounded-lg border border-white/10 bg-[#151515] p-6 md:p-8">
          <h2 className="text-3xl font-bold">Как проверяем совместимость C16E303</h2>
          <p className="mt-4 leading-relaxed text-gray-300">Одинаковая надпись C16E303 не гарантирует одинаковое исполнение. До оплаты сверяем F18/22233, 6600-E163 A00, число и порядок секций, расположение портов, резьбы, клапаны, электромагниты, разъёмы и крепления.</p>
          <ul className="mt-5 grid gap-2 text-gray-300"><li>Фото шильдика и узла со всех сторон.</li><li>Модель и серийный номер HIDROMEK.</li><li>Фото подключённых гидролиний и электрических разъёмов.</li><li>Количество, город и требуемая дата поставки.</li></ul>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-bold">Вопросы по HUSCO C16E303</h2>
          <div className="mt-6 grid gap-4">
            {faq.map((item) => <details key={item.question} className="rounded-lg border border-white/10 bg-[#151515] p-5"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-relaxed text-gray-300">{item.answer}</p></details>)}
          </div>
        </section>

        <section className="mt-14 rounded-lg bg-[#FFC000] p-7 text-black md:p-9">
          <h2 className="text-3xl font-bold">Нужен HUSCO C16E303 для HIDROMEK 102B?</h2>
          <p className="mt-3 max-w-3xl leading-relaxed">Пришлите шильдик, фото портов и разъёмов. Проверим исполнение и подготовим отдельный расчёт на распределитель, доставку и установку.</p>
          <a
            href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCatalogEvent("case_whatsapp_click", { case_id: "hidromek-102b-husco-c16e303", request_type: "control-valve-c16e303" })}
            className="mt-6 inline-flex min-h-12 items-center rounded bg-black px-5 py-3 font-bold text-white"
          >
            Отправить данные в WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}

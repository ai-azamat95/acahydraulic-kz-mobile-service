import { SEO } from "@/components/SEO";
import XcmgXz200PumpMedia from "@/components/XcmgXz200PumpMedia";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import sale from "../../../../shared/xcmg-xz200-pump-sale.json";
import { Link } from "wouter";

const productPath = `/catalog/${sale.handle}/`;
const message = `Здравствуйте! Нужен гидронасос XCMG 803001730 для буровой ГНБ. Прошу проверить совместимость и подготовить расчёт.\nМодель и серийный номер техники: \nГород: \nКоличество: \nНужен к дате: \nПришлю фото шильдика старого насоса и подключений.\nhttps://acahydraulic.kz${sale.casePath}/`;

const faq = [
  {
    question: "Какой номер насоса указан на шильдике?",
    answer: "На шильдике нового насоса читается номер детали 803001730, бренд XCMG, поставщик 100015 и страна происхождения Китай.",
  },
  {
    question: "Сколько стоил насос в этом заказе?",
    answer: "Цена нового насоса в зафиксированном заказе — 1 350 000 ₸. Установка в эту сумму не входила. Для нового заказа цену и условия подтверждаем отдельно.",
  },
  {
    question: "Подходит ли насос 803001730 для XCMG XZ200E?",
    answer: "Насос заявлен для XCMG XZ200E. В показанном кейсе шильдик буровой установки указывает модель XZ200. Перед заказом для XZ200E обязательно сверяем шильдик старого насоса, вал, фланец, порты и подключения.",
  },
  {
    question: "Можно заказать насос вместе с установкой?",
    answer: "Да, поставку и установку можно рассчитать вместе. Состав работ, выезд, расходные материалы и проверку после монтажа согласуем до начала работ.",
  },
];

const videoSchema = {
  "@context": "https://schema.org",
  "@graph": sale.videos.map((video) => ({
    "@type": "VideoObject",
    name: video.title,
    description: video.caption,
    thumbnailUrl: `https://acahydraulic.kz${video.poster}`,
    uploadDate: "2026-09-29",
    duration: video.duration,
    contentUrl: `https://acahydraulic.kz${video.src}`,
    mainEntityOfPage: `https://acahydraulic.kz${sale.casePath}/`,
  })),
};

export default function XcmgXz200PumpInstallation() {
  return (
    <main className="min-h-screen bg-[#101010] py-10 text-white md:py-16">
      <SEO
        title={sale.caseTitle}
        description={sale.caseDescription}
        keywords="XCMG 803001730, гидронасос XCMG XZ200, гидронасос XZ200E, насос для ГНБ, запчасти XCMG Казахстан"
        canonical={sale.casePath}
        ogImage={sale.ogImage}
        pageType="article"
        publishedDate="2026-09-29"
        modifiedDate="2026-09-29"
        breadcrumbs={[
          { name: "Кейсы", url: "/cases/" },
          { name: "XCMG XZ200 — насос 803001730", url: sale.casePath },
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
              src={sale.image}
              alt="Новый гидравлический насос XCMG 803001730 на белом фоне"
              width={1200}
              height={1200}
              fetchPriority="high"
              className="aspect-square w-full object-contain"
            />
            <figcaption className="mt-3 text-center text-sm leading-6 text-gray-600">
              Реальный насос из заказа. Фон очищен без генерации изображения.
            </figcaption>
          </figure>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">
              ГНБ · поставка · монтаж у клиента
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{sale.caseTitle}</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Для буровой установки клиента поставили новый гидравлический насос XCMG с номером
              803001730 и выполнили монтаж. Насос обеспечивает поток рабочей жидкости для гидравлических
              функций установки, включая рабочие операции бурового комплекса.
            </p>

            <div className="mt-7 rounded-lg border border-[#FFC000]/30 bg-[#181818] p-6">
              <p className="text-sm text-gray-400">Стоимость насоса в этом заказе</p>
              <p className="mt-2 text-4xl font-bold text-[#FFC000]">1 350 000 ₸</p>
              <p className="mt-3 leading-relaxed text-gray-300">
                Новый насос · номер 803001730 · цена указана только за насос. Установка рассчитывалась отдельно.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Для нового заказа подтверждаем наличие, исполнение, срок, доставку и гарантийные условия до оплаты.
              </p>
              <Link
                href={productPath}
                className="mt-5 inline-flex min-h-12 items-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-[#eab000]"
              >
                Карточка насоса 803001730
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Что подтверждено по шильдику</h2>
            <dl className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-[#151515] p-6 text-sm">
              <div className="grid grid-cols-[130px_1fr] gap-3"><dt className="text-gray-500">Бренд</dt><dd className="font-semibold">XCMG</dd></div>
              <div className="grid grid-cols-[130px_1fr] gap-3"><dt className="text-gray-500">Номер детали</dt><dd className="font-semibold">803001730</dd></div>
              <div className="grid grid-cols-[130px_1fr] gap-3"><dt className="text-gray-500">Поставщик</dt><dd className="font-semibold">100015</dd></div>
              <div className="grid grid-cols-[130px_1fr] gap-3"><dt className="text-gray-500">Происхождение</dt><dd className="font-semibold">Китай, Сюйчжоу</dd></div>
            </dl>
            <img
              src={sale.nameplateImage}
              alt="Шильдик гидронасоса XCMG с номером детали 803001730"
              width={1200}
              height={1200}
              loading="lazy"
              className="mt-5 w-full rounded-lg bg-white object-contain"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold">XZ200 и XZ200E: как проверяем совместимость</h2>
            <p className="mt-5 leading-relaxed text-gray-300">
              Насос указан для буровой установки XCMG XZ200E. В реальном видео установки шильдик машины
              показывает модель XZ200. Поэтому совпадения только по внешнему виду недостаточно: для каждой
              модификации проверяем номер старого насоса, модель и серийный номер техники, вал, фланец,
              порты, направление вращения и подключения.
            </p>
            <div className="mt-6 rounded-lg border-l-4 border-[#FFC000] bg-[#171717] p-5 text-sm leading-6 text-gray-300">
              Карточка не обещает универсальную замену для всех XZ200/XZ200E. Совместимость подтверждаем до оплаты по данным конкретной машины.
            </div>
            <h2 className="mt-10 text-3xl font-bold">Что сделали</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed text-gray-300">
              <li>Поставили клиенту новый гидравлический насос XCMG 803001730.</li>
              <li>Проверили узел и комплектацию перед монтажом.</li>
              <li>Установили насос на буровую установку клиента.</li>
              <li>Зафиксировали установку и технику на видео для истории заказа.</li>
            </ol>
            <p className="mt-5 text-sm leading-6 text-gray-400">
              В материалах нет протокола замера давления или расхода после монтажа, поэтому такие показатели в кейсе не заявлены.
            </p>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="case-videos-title">
          <h2 id="case-videos-title" className="text-3xl font-bold">Видео насоса и установки</h2>
          <p className="mb-6 mt-4 max-w-4xl leading-relaxed text-gray-300">
            Три реальных видео: новый насос до монтажа, процесс установки и буровая XCMG после выполненной работы.
          </p>
          <XcmgXz200PumpMedia />
        </section>

        <section className="mt-14 border-y border-white/15 py-8">
          <h2 className="text-3xl font-bold">Что прислать для подбора насоса</h2>
          <ul className="mt-5 grid gap-3 leading-relaxed text-gray-300 md:grid-cols-2">
            <li>Модель и серийный номер буровой установки.</li>
            <li>Фото шильдика старого насоса крупным планом.</li>
            <li>Общий вид насоса и его подключения.</li>
            <li>Фото вала, фланца, портов и регулятора.</li>
            <li>Город доставки и требуемая дата.</li>
            <li>Нужна ли установка и проверка после монтажа.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Вопросы по насосу XCMG 803001730</h2>
          <div className="mt-5 divide-y divide-white/15">
            {faq.map((item) => (
              <details key={item.question} className="py-5">
                <summary className="cursor-pointer text-lg font-bold">{item.question}</summary>
                <p className="mt-4 leading-relaxed text-gray-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-lg bg-[#1a1a1a] p-6 md:p-8">
          <h2 className="text-3xl font-bold">Нужен насос для XCMG XZ200 или XZ200E?</h2>
          <p className="my-5 max-w-3xl leading-relaxed text-gray-300">
            Отправьте фото шильдика и подключения. Проверим номер и исполнение, затем подготовим расчёт насоса, доставки и установки.
          </p>
          <a
            href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCatalogEvent("case_whatsapp_click", { case_id: "xcmg-xz200-pump-installation", request_type: "pump-803001730" })}
            className="inline-flex min-h-12 items-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-[#eab000]"
          >
            Проверить насос по шильдику в WhatsApp
          </a>
          <nav className="mt-5 flex flex-wrap gap-x-6 gap-y-3" aria-label="Связанные страницы">
            <Link href={productPath} className="text-[#FFC000] underline">Карточка 803001730</Link>
            <Link href="/catalog/category/hydraulic-pumps/" className="text-[#FFC000] underline">Каталог гидронасосов</Link>
            <Link href="/services/gnb-repair/" className="text-[#FFC000] underline">Ремонт буровых ГНБ</Link>
            <Link href="/blog/zapchasti-po-nomeru-i-shildiku/" className="text-[#FFC000] underline">Как сфотографировать шильдик</Link>
          </nav>
        </section>
      </div>
    </main>
  );
}

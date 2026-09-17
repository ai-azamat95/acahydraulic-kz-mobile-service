import { Link } from "wouter";
import { publicAsset } from "@/lib/assets";
import { catalogSearchHref } from "@/lib/catalogLinks";
import { pumpCasePath, pumpOptions } from "@/content/pumpCases";
import type { CatalogLanguage } from "@/content/partsCatalog";

export const supplyPumpOffers = [
  { id: "sany-k5v160dt", name: "K5V160DT", image: "k5v160dt-delivery.webp", price: null,
    brands: ["sany"], tags: ["K5V160DT", "SANY", "SY365H", "hydraulic pump"],
    caseAnchor: "sany-completed", query: "K5V160DT",
    status: { ru: "Кейс SANY SY365H: установлен, машина запущена", kz: "SANY SY365H: орнатылды, техника іске қосылды", en: "SANY SY365H case: installed, machine running" } },
  { id: pumpOptions[0].id, name: pumpOptions[0].name, image: pumpOptions[0].image, price: pumpOptions[0].price,
    brands: [], tags: ["K5V80DTP", "China", "Китай", "hydraulic pump"],
    caseAnchor: pumpOptions[0].id, query: "K5V80DTP",
    status: { ru: "Китайский насос · поставка под заказ", kz: "Қытай сорғысы · тапсырыс бойынша", en: "Chinese pump · supplied to order" } },
  { id: pumpOptions[1].id, name: pumpOptions[1].name, image: pumpOptions[1].image, price: pumpOptions[1].price,
    brands: ["hitachi"], tags: ["HANDOK", "H5V80DTP", "K5V80DTP", "Hitachi", "ZX160W", "hydraulic pump"],
    caseAnchor: "hitachi-order", query: "HANDOK",
    status: { ru: "Заказ для Hitachi ZX160W: ожидает поставки", kz: "Hitachi ZX160W тапсырысы: жеткізуді күтуде", en: "Hitachi ZX160W order: awaiting delivery" } },
];

const labels = {
  ru: { title: "Насосы из наших поставок", intro: "Реальные фото, цены и история заказа. Можно заказать насос отдельно или обсудить доставку с заменой.", quote: "Цена по исполнению", unit: "Стоимость насоса · под заказ", details: "Насос и история заказа", find: "Искать запчасти этой серии", note: "Совместимость проверяем по шильдику и подключениям. Доставку и работы рассчитываем отдельно.", more: "Другие варианты в каталоге", empty: "Других совпадений в каталоге пока нет. Измените запрос или отправьте шильдик для подбора." },
  kz: { title: "Біздің жеткізілімдердегі сорғылар", intro: "Нақты фотолар, бағалар және тапсырыс тарихы. Сорғыны жеке немесе ауыстыру қызметімен бірге талқылаңыз.", quote: "Нұсқасына қарай есептеледі", unit: "Сорғы бағасы · тапсырыс бойынша", details: "Сорғы және тапсырыс тарихы", find: "Осы серияның бөлшектерін іздеу", note: "Сәйкестікті тақтайша мен қосылымдар бойынша тексереміз. Жеткізу мен жұмыстар бөлек есептеледі.", more: "Каталогтағы басқа нұсқалар", empty: "Каталогта басқа сәйкестік жоқ. Сұрауды өзгертіңіз немесе таңдау үшін тақтайша фотосын жіберіңіз." },
  en: { title: "Pumps from our supply projects", intro: "Real photos, prices and order history. Request a pump on its own or discuss delivery and replacement.", quote: "Price by configuration", unit: "Pump price · supplied to order", details: "Pump and order history", find: "Search parts in this series", note: "We check the nameplate and connections for fitment. Delivery and labour are quoted separately.", more: "More catalogue options", empty: "No other catalogue matches yet. Adjust the search or send a nameplate photo for help." },
};
export const pumpSupplyLabels = labels;

export default function PumpSupplyOffers({ offers, language }: { offers: typeof supplyPumpOffers; language: CatalogLanguage }) {
  if (!offers.length) return null;
  const t = labels[language];
  return <section id="aca-supply-offers" aria-labelledby="aca-supply-title" className="mb-10 scroll-mt-24">
    <h2 id="aca-supply-title" className="font-bebas text-3xl font-bold md:text-4xl">{t.title}</h2>
    <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">{t.intro}</p>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {offers.map(offer => <article key={offer.id} data-supply-offer={offer.id} className="flex min-w-0 flex-col rounded-lg border border-gray-200 bg-white text-gray-900 p-4 md:p-5">
        <Link href={`${pumpCasePath}#${offer.caseAnchor}`} aria-label={`${t.details}: ${offer.name}`} className="block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">
          <img src={publicAsset(`media/pump-cases/${offer.image}`)} alt={offer.name} width={640} height={640} loading="lazy" className="h-48 w-full rounded bg-gray-100 object-contain" />
        </Link>
        <h3 className="mt-4 break-words text-xl font-bold">{offer.name}</h3>
        <p className="mt-2 text-2xl font-bold text-gray-900">{offer.price || t.quote}</p>
        <p className="mt-1 text-xs text-gray-600">{offer.price ? t.unit : "SANY SY365H"}</p>
        <p className="my-4 flex-1 text-sm leading-relaxed text-gray-600">{offer.status[language]}</p>
        <Link href={`${pumpCasePath}#${offer.caseAnchor}`} className="flex min-h-11 items-center justify-center rounded bg-[#FFC000] px-3 py-2 text-center text-sm font-bold text-black hover:bg-[#eab000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]">{t.details}</Link>
        <Link href={catalogSearchHref(offer.query)} className="mt-2 inline-flex min-h-11 items-center text-sm text-[#8a6100] underline underline-offset-4">{t.find}</Link>
      </article>)}
    </div>
    <p className="mt-4 text-sm leading-relaxed text-gray-600">{t.note}</p>
  </section>;
}

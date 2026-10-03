import { Link } from "wouter";
import { CheckCircle2, MessageCircle, ShieldCheck, Truck, Wrench } from "lucide-react";

import { SEO } from "@/components/SEO";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import { shantuiEngineOffer } from "@/data/shantuiEngineOffer";

export const completeEngineProductPath = shantuiEngineOffer.path;

const productName = shantuiEngineOffer.name;
const imagePath = shantuiEngineOffer.image;
const casePath = shantuiEngineOffer.casePath;
const requestText = `Здравствуйте! Интересует двигатель Cummins NTA855-C360S10 в сборе для Shantui SD32.
Цена двигателя: ${shantuiEngineOffer.priceLabel}, без монтажа.
Серийный номер бульдозера: 
Фото шильдика техники: пришлю следующим сообщением
Город поставки: 
Нужен монтаж и запуск: да / нет
Требуемый срок: 
https://acahydraulic.kz${completeEngineProductPath}/`;

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: productName,
  description: "Новый двигатель Cummins NTA855-C360S10 в сборе с навесным оборудованием для Shantui SD32. Под заказ, ожидание 3–14 дней. Цена 12 860 000 ₸ с доставкой по Казахстану, без монтажа. Совместимость проверяем по шильдику.",
  image: `https://acahydraulic.kz${imagePath}`,
  url: `https://acahydraulic.kz${completeEngineProductPath}/`,
  sku: "NTA855-C360S10",
  mpn: "NTA855-C360S10",
  model: "NTA855-C360S10",
  category: "Двигатели в сборе для спецтехники",
  brand: { "@type": "Brand", name: "Cummins" },
  offers: {
    "@type": "Offer",
    price: shantuiEngineOffer.price,
    priceCurrency: shantuiEngineOffer.priceCurrency,
    url: `https://acahydraulic.kz${completeEngineProductPath}/`,
    itemCondition: "https://schema.org/NewCondition",
    availability: "https://schema.org/BackOrder",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "KZT" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "KZ" },
    },
    seller: { "@type": "Organization", name: "ACA Hydraulic" },
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Техника", value: "Shantui SD32" },
    { "@type": "PropertyValue", name: "Состояние", value: "Новый" },
    { "@type": "PropertyValue", name: "Проверка совместимости", value: "По шильдику и серийному номеру" },
  ],
};

const checks = [
  "Сверяем полный индекс NTA855-C360S10 и серийный номер двигателя",
  "Проверяем шильдик и серийный номер бульдозера Shantui SD32",
  "Фиксируем навесное оборудование и переносимые со старого двигателя узлы",
  "Согласуем стоимость двигателя, логистику, монтаж и запуск отдельными строками",
  "Указываем срок и гарантийные условия в коммерческом предложении и договоре",
];

export default function CompleteEngineProduct() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="Двигатель Cummins NTA855-C360S10 в сборе для Shantui SD32"
        description="Cummins NTA855-C360S10 для Shantui SD32 — 12 860 000 ₸ с доставкой по Казахстану. Новый двигатель в сборе под заказ, ожидание 3–14 дней. Монтаж отдельно. Реальный кейс."
        keywords="Cummins NTA855-C360S10, двигатель Shantui SD32, купить двигатель в сборе Shantui, двигатель NTA855 Казахстан"
        canonical={completeEngineProductPath}
        ogImage={imagePath}
        schema={productSchema}
        breadcrumbs={[
          { name: "Каталог", url: "/catalog/" },
          { name: "Двигатели в сборе", url: "/parts/engines-complete/" },
          { name: "Cummins NTA855-C360S10", url: completeEngineProductPath },
        ]}
      />

      <section className="border-b border-white/10 bg-[#111] py-10 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <Link href="/parts/engines-complete/" className="text-sm font-bold text-[#FFC000] underline underline-offset-4">
            Двигатели в сборе
          </Link>
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <figure className="overflow-hidden rounded-xl bg-white p-3">
              <img src={imagePath} alt={productName} width={900} height={1600} fetchPriority="high" className="max-h-[680px] w-full object-contain" />
              <figcaption className="px-2 pb-2 pt-3 text-sm leading-6 text-gray-600">
                Реальный двигатель из выполненной поставки для Shantui SD32.
              </figcaption>
            </figure>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#FFC000]">Новый двигатель в сборе</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">{productName}</h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-300">
                Поставка по Казахстану с согласованием комплектации. Монтаж и запуск рассчитываются отдельно. До заказа проверяем двигатель и технику по шильдикам — одного названия серии NTA855 недостаточно.
              </p>

              <div className="mt-7 rounded-xl border border-[#FFC000]/35 bg-[#171717] p-6">
                <p className="text-sm text-gray-400">Цена нового двигателя в сборе</p>
                <p className="mt-2 text-3xl font-extrabold text-[#FFC000]">{shantuiEngineOffer.priceLabel}</p>
                <p className="mt-3 text-sm leading-6 text-gray-300">С навесным оборудованием, без монтажа и запуска. Гидротрансформатор не входит: в выполненном заказе его перенесли со старого двигателя.</p>
                <p className="mt-3 text-sm font-bold leading-6 text-white">{shantuiEngineOffer.availabilityLabel}. {shantuiEngineOffer.leadTimeLabel}.</p>
                <p className="mt-3 text-sm leading-6 text-gray-300">{shantuiEngineOffer.shippingLabel}. Дату поставки согласуем до заказа; совместимость и комплектность фиксируем после проверки шильдика.</p>
              </div>

              <a
                href={`https://wa.me/77714177925?text=${encodeURIComponent(requestText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCatalogEvent("engine_product_whatsapp_click", { item_id: "nta855-c360s10", source: "engine-product-page" })}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-6 py-3 font-extrabold text-black hover:bg-[#eab000] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Заказать двигатель — уточнить поставку
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wrench, title: "Применение", value: "Бульдозер Shantui SD32" },
              { icon: CheckCircle2, title: "Модель", value: "Cummins NTA855-C360S10" },
              { icon: Truck, title: "Поставка", value: "По Казахстану" },
              { icon: ShieldCheck, title: "Гарантия", value: "Условия фиксируются в договоре" },
            ].map(({ icon: Icon, title, value }) => (
              <article key={title} className="rounded-xl border border-white/10 bg-[#141414] p-5">
                <Icon className="h-6 w-6 text-[#FFC000]" aria-hidden="true" />
                <h2 className="mt-4 text-sm font-bold uppercase tracking-wide text-gray-400">{title}</h2>
                <p className="mt-2 font-bold text-white">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <h2 className="text-3xl font-extrabold">Что проверяем до заказа</h2>
              <ul className="mt-6 space-y-4 text-gray-300">
                {checks.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC000]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="rounded-xl border border-white/10 bg-[#141414] p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Подтверждённый кейс</p>
              <h2 className="mt-3 text-2xl font-bold">Поставка и запуск двигателя на Shantui SD32</h2>
              <p className="mt-4 leading-relaxed text-gray-400">В выполненном заказе поставили новый комплектный двигатель, перенесли гидротрансформатор со старого двигателя, установили и запустили бульдозер.</p>
              <Link href={casePath} className="mt-6 inline-flex min-h-11 items-center rounded border border-[#FFC000] px-5 py-2 font-bold text-[#FFC000] hover:bg-[#FFC000] hover:text-black">
                Продали и установили на Shantui SD32 — фото и видео
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

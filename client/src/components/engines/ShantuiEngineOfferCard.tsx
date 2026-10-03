import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

import { shantuiEngineOffer } from "@/data/shantuiEngineOffer";

export function ShantuiEngineOfferCard() {
  return (
    <article data-complete-engine-offer-card className="flex min-h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <Link href={shantuiEngineOffer.path} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b97800] focus-visible:ring-offset-2">
        <img src={shantuiEngineOffer.image} alt={shantuiEngineOffer.name} width={900} height={1600} loading="lazy" className="aspect-[4/3] w-full rounded-lg bg-white object-contain p-3" />
        <h3 className="mt-5 text-2xl font-extrabold leading-tight text-[#111827] group-hover:text-[#7a5000]">Cummins NTA855-C360S10 для Shantui SD32</h3>
      </Link>
      <p className="mt-3 flex-1 leading-relaxed text-gray-600">Новый двигатель в сборе с навесным оборудованием. Есть реальный кейс поставки, монтажа и запуска.</p>
      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-2xl font-extrabold text-[#111827]">{shantuiEngineOffer.priceLabel}</p>
        <p className="mt-2 text-sm leading-6 text-gray-600">Без монтажа. Наличие, срок и стоимость доставки уточняем до заказа. Совместимость проверяем по шильдику.</p>
      </div>
      <Link href={shantuiEngineOffer.path} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded bg-[#FFC000] px-4 font-extrabold text-black hover:bg-[#eab000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b97800] focus-visible:ring-offset-2">
        Открыть карточку <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

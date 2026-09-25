import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";

import { cumminsEnginePath, type CumminsEngineFamily } from "@/data/cumminsEngineFamilies";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

type CumminsEngineCardProps = {
  engine: CumminsEngineFamily;
  source: "complete-engines" | "cummins-engine-catalog" | "related-engines";
};

function whatsappUrl(engine: CumminsEngineFamily) {
  const productPath = cumminsEnginePath(engine);
  const text = `Здравствуйте! Нужен двигатель Cummins ${engine.name} в сборе.
Техника и модель: 
Полный индекс двигателя: 
Серийный номер: 
Город поставки: 
Нужен монтаж и запуск: да / нет
Фото шильдика пришлю следующим сообщением.
https://acahydraulic.kz${productPath}/`;
  return `https://wa.me/77714177925?text=${encodeURIComponent(text)}`;
}

export function CumminsEngineCard({ engine, source }: CumminsEngineCardProps) {
  const productPath = cumminsEnginePath(engine);

  return (
    <article id={engine.id} data-cummins-engine-card data-engine-product-card className="flex min-h-full scroll-mt-24 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <Link href={productPath} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b97800] focus-visible:ring-offset-2">
        <figure className="overflow-hidden rounded-lg border border-gray-100 bg-white">
          <img
            src={engine.image}
            alt={`Фото серии двигателей Cummins ${engine.name}`}
            width={480}
            height={480}
            loading="lazy"
            decoding="async"
            data-cummins-engine-image
            className="aspect-[4/3] w-full object-contain p-3 transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <figcaption className="border-t border-gray-100 px-3 py-2 text-xs leading-5 text-gray-500">
            Фото серии. Точное исполнение и комплектность подтверждаем до оплаты.
          </figcaption>
        </figure>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a5b00]">Двигатель Cummins в сборе</p>
          <h3 className="mt-2 text-2xl font-extrabold leading-tight text-[#111827]">
            <Link href={productPath} className="hover:text-[#7a5000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b97800]">
              {engine.name}
            </Link>
          </h3>
        </div>
        <span className="shrink-0 rounded-full border border-[#f1c40f] bg-[#fff8dc] px-3 py-1 text-xs font-bold text-[#704900]">{engine.powerKw}</span>
      </div>

      {engine.casePath && <p className="mt-3 text-sm font-bold text-[#765000]">Есть подтверждённый кейс поставки и запуска</p>}
      <p className="mt-3 flex-1 leading-relaxed text-gray-600">{engine.application}. Точный индекс, производителя, комплектацию и применяемость подтверждаем до оплаты.</p>

      <div className="mt-5 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-500">
        <p><strong className="text-gray-800">Цена и срок:</strong> по запросу</p>
        <p><strong className="text-gray-800">Проверка:</strong> шильдик и серийный номер</p>
      </div>

      <div className="mt-5 grid gap-2">
        <Link
          href={productPath}
          data-engine-product-link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-gray-300 px-4 font-bold text-gray-900 hover:border-[#b97800] hover:text-[#7a5000]"
        >
          Открыть карточку <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a
          href={whatsappUrl(engine)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCatalogEvent("cummins_engine_quote_click", { item_id: engine.id, source })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-[#FFC000] px-4 font-extrabold text-black hover:bg-[#eab000]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />Запросить подбор
        </a>
      </div>
    </article>
  );
}

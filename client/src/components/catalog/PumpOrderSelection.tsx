import { useState, type FormEvent } from "react";
import { MessageCircle, Phone } from "lucide-react";
import selection from "@shared/pump-order-selection.json" with { type: "json" };
import {
  buildPumpOrderWhatsAppUrl,
  pumpOrderBrand,
  type PumpOrderFamily,
} from "@shared/pump-order-selection.mjs";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import { createContactIntentId } from "@/lib/contactIntent";

const actionClass = "inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 whitespace-normal rounded bg-[#FFC000] px-4 py-3 text-center text-sm font-bold leading-relaxed text-black hover:bg-[#E6AC00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]";
const inputClass = "mt-2 block min-h-11 w-full min-w-0 rounded border border-white/25 bg-[#101010] px-3 py-2 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]";

function PumpFamilyRequest({ brandSlug, family }: { brandSlug: string; family: PumpOrderFamily }) {
  const [fields, setFields] = useState({ model: "", city: "", machine: "" });
  const [preparedUrl, setPreparedUrl] = useState("");
  const [preparedIntentId, setPreparedIntentId] = useState("");
  const directUrl = buildPumpOrderWhatsAppUrl(brandSlug, family.id);
  const trackIntent = (requestType: string, contactIntentId?: string) => trackCatalogEvent("catalog_whatsapp_click", {
    catalog_source: "pump_order_selection",
    brand_slug: brandSlug,
    pump_family: family.id,
    request_type: requestType,
    contact_method: "whatsapp",
    lead_stage: "contact_intent",
    contact_intent_id: contactIntentId,
  });
  const prepareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contactIntentId = createContactIntentId();
    const url = buildPumpOrderWhatsAppUrl(brandSlug, family.id, { ...fields, contactIntentId });
    setPreparedUrl(url);
    setPreparedIntentId(contactIntentId);
    window.open(url, "_blank", "noopener,noreferrer");
    trackIntent("prepared_request", contactIntentId);
  };

  return (
    <article id={family.id} data-pump-family={family.id} className="min-w-0 scroll-mt-28 rounded-lg border border-white/15 bg-[#151515] p-4 md:p-6">
      <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">{family.name} под заказ</h3>
      <p className="mt-3 leading-relaxed text-gray-300">{family.intro}</p>
      <h4 className="mt-5 font-bold text-white">Что прислать для проверки</h4>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-300">
        {family.checklist.map(item => <li key={item}>{item}</li>)}
      </ul>
      <a href={directUrl} target="_blank" rel="noopener noreferrer" data-aca-contact-managed="react" onClick={() => trackIntent("nameplate_selection")} className={`${actionClass} mt-5`}>
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="min-w-0">{selection.cta}</span>
      </a>
      <p className="mt-2 text-xs leading-relaxed text-gray-400">Откроется WhatsApp с подготовленным текстом. Прикрепите фото и отправьте сообщение в чате.</p>
      <details className="mt-5 border-t border-white/15 pt-3">
        <summary className="min-h-11 cursor-pointer py-2 font-bold text-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">Уточнить модель и город в запросе</summary>
        <form onSubmit={prepareRequest} className="mt-3 space-y-4" aria-label={`Подготовить запрос ${family.name}`}>
          <div>
            <label htmlFor={`${family.id}-model`} className="block text-sm text-gray-200">Модель / номер со шильдика *</label>
            <input id={`${family.id}-model`} required maxLength={180} value={fields.model} onChange={event => setFields({ ...fields, model: event.target.value })} placeholder={`Полное обозначение ${family.name}`} className={inputClass} />
          </div>
          <div>
            <label htmlFor={`${family.id}-city`} className="block text-sm text-gray-200">Город поставки *</label>
            <input id={`${family.id}-city`} required maxLength={180} value={fields.city} onChange={event => setFields({ ...fields, city: event.target.value })} autoComplete="address-level2" className={inputClass} />
          </div>
          <div>
            <label htmlFor={`${family.id}-machine`} className="block text-sm text-gray-200">Марка и модель техники, если известны</label>
            <input id={`${family.id}-machine`} maxLength={180} value={fields.machine} onChange={event => setFields({ ...fields, machine: event.target.value })} className={inputClass} />
          </div>
          <p className="text-xs leading-relaxed text-gray-400">Сведения попадут в подготовленный текст WhatsApp. Перед отправкой вы сможете его проверить. <a href="/privacy/" className="underline underline-offset-4">Политика конфиденциальности</a>.</p>
          <button type="submit" className={actionClass}>Подготовить запрос и открыть WhatsApp</button>
          {preparedUrl && <p role="status" className="text-sm leading-relaxed text-gray-200">Запрос подготовлен. Отправьте сообщение в WhatsApp; сайт не подтверждает его получение. Если окно не открылось, <a href={preparedUrl} target="_blank" rel="noopener noreferrer" data-aca-contact-managed="react" onClick={() => trackIntent("prepared_request_retry", preparedIntentId)} className="font-bold text-[#FFC000] underline underline-offset-4">откройте подготовленный запрос</a>.</p>}
        </form>
      </details>
      <a href="tel:+77714177925" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#FFC000] underline underline-offset-4"><Phone className="h-4 w-4 shrink-0" aria-hidden="true" />Позвонить: +7 771 417 79 25</a>
      <p className="mt-2 text-xs leading-relaxed"><a href={family.documentationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-gray-400 underline underline-offset-4">{family.sourceLabel}</a></p>
    </article>
  );
}

export function PumpOrderNavigation() {
  return <nav data-pump-order-navigation aria-label="Подбор по семейству гидронасоса" className="mt-5 rounded-lg border border-white/15 p-4">
    <h2 className="font-bold text-white">Подбор по семейству гидронасоса</h2>
    <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">{Object.entries(selection.brands).flatMap(([slug, brand]) => brand.families.map(family => <li key={family.id}><a href={`/catalog/brand/${slug}/#${family.id}`} className="inline-flex min-h-11 items-center py-2 text-sm font-bold text-[#FFC000] underline underline-offset-4">{family.name}</a></li>))}</ul>
  </nav>;
}

export function PumpOrderSelection({ brandSlug, activeCategory = "" }: { brandSlug: string; activeCategory?: string }) {
  const brand = pumpOrderBrand(brandSlug, activeCategory);
  if (!brand) return null;
  return (
    <section className="mt-6 min-w-0 rounded-xl border border-[#FFC000]/40 bg-[#101010] p-4 md:p-7" data-pump-order-selection={brandSlug} aria-labelledby={`pump-order-${brandSlug}`}>
      <h2 id={`pump-order-${brandSlug}`} className="font-bebas text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">Подбор насоса по семейству</h2>
      <p className="mt-3 max-w-4xl leading-relaxed text-gray-300">{selection.terms}</p>
      <nav className="mt-4" aria-label="Семейства гидронасосов"><ul className="flex flex-wrap gap-x-5 gap-y-1">{brand.families.map(family => <li key={family.id}><a href={`#${family.id}`} className="inline-flex min-h-11 items-center py-2 font-bold text-[#FFC000] underline underline-offset-4">{family.name}</a></li>)}</ul></nav>
      <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
        {brand.families.map(family => <PumpFamilyRequest key={family.id} brandSlug={brandSlug} family={family} />)}
      </div>
    </section>
  );
}

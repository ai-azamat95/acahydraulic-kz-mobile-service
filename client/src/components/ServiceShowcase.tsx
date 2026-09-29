import { ArrowUpRight, ClipboardList, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import showcase from "../../../shared/service-showcase.json";
import assessment from "../../../shared/service-assessment.json";

export default function ServiceShowcase() {
  const [location] = useLocation();
  const slug = location.replace(/\/+$/, "").match(/^\/services\/([^/]+)$/)?.[1];
  if (!slug || !(slug in showcase)) return null;
  const service = showcase[slug as keyof typeof showcase];
  const diagnostic = assessment[slug as keyof typeof assessment];

  return (
    <>
      <SEO title={service.title} description={service.description} canonical={`/services/${slug}`} ogImage={`/images/services/${service.image}`} breadcrumbs={[{ name: "Услуги", url: "/services" }, { name: service.label, url: `/services/${slug}` }]} />
      <section aria-labelledby="service-showcase-title" className="relative z-10 overflow-hidden bg-[#f5f6f1] text-[#17242b]">
        <div className="relative min-h-48 overflow-hidden bg-[#e7ede5] md:min-h-56">
          <img src={`/images/services/${service.image}`} alt="" role="presentation" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#e9eee7] via-[#e9eee7]/95 to-[#e9eee7]/50" />
          <div className="relative mx-auto flex min-h-48 max-w-6xl flex-col justify-center px-4 py-9 md:min-h-56 md:px-6">
            <span className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#8c690c]">ACA Hydraulic · {service.label}</span>
            <h2 id="service-showcase-title" className="max-w-2xl text-2xl font-bold leading-tight md:text-3xl">Как мы подходим к этой задаче</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3d5550] md:text-base">{service.summary} Сроки, стоимость и состав работ согласуем после уточнения модели и проверки техники.</p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          {service.cases.length > 0 ? (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8c690c]">Реальные работы</p><h3 className="mt-2 text-xl font-bold md:text-2xl">Примеры по подходящей технике</h3></div>
                <p className="max-w-md text-sm text-[#53665e]">Видео и кейсы показывают конкретные работы; результат для вашей машины определит диагностика.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {service.cases.map((item) => (
                  <article key={`${item.model}-${item.work}`} className="flex flex-col rounded-xl border border-[#d8e0d8] bg-white p-5 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#8b6a12]">{item.model}</span>
                    <h4 className="mt-2 text-lg font-bold leading-snug">{item.work}</h4>
                    <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5 text-sm font-semibold text-[#715100]">
                      {"href" in item && item.href && <Link href={item.href} className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4">Кейс <ArrowUpRight size={16} /></Link>}
                      {"video" in item && item.video && <a href={item.video} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4">Видео в TikTok <ArrowUpRight size={16} /></a>}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#d8e0d8] bg-white p-6 md:p-8"><ClipboardList className="text-[#9a7410]" /><h3 className="mt-3 text-xl font-bold">Что важно проверить по вашей технике</h3>{diagnostic && <><p className="mt-3 max-w-3xl leading-relaxed text-[#52645c]">{diagnostic.intro}</p><ul className="mt-5 grid gap-2 md:grid-cols-3">{diagnostic.checks.map((check) => <li key={check} className="rounded-lg bg-[#f0f4ef] p-3 text-sm font-medium">{check}</li>)}</ul></>}<p className="mt-5 max-w-2xl text-sm text-[#52645c]">Для этого направления пока не публикуем отдельный подтверждённый кейс. Пришлите модель, фото шильдика, видео неисправности и местоположение машины.</p></div>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f4bc2a] px-6 font-bold transition hover:bg-[#e8b01d]"><MessageCircle size={18} /> Отправить данные по технике</a>
            <Link href="/services/" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#b9c6bc] px-6 font-semibold transition hover:bg-white">Все услуги</Link>
          </div>
        </div>
      </section>
      <footer data-service-footer className="bg-[#172923] px-4 py-7 text-sm text-white/80"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><span>ACA Hydraulic · Астана, Казахстан</span><nav aria-label="Ссылки раздела услуг" className="flex gap-5"><Link href="/services/" className="underline underline-offset-4">Услуги</Link><Link href="/cases/" className="underline underline-offset-4">Кейсы</Link><Link href="/contacts/" className="underline underline-offset-4">Контакты</Link></nav></div></footer>
    </>
  );
}

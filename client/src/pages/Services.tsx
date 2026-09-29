import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ClipboardList, MessageCircle, Phone, Search, Wrench } from "lucide-react";
import { SEO } from "@/components/SEO";
import MobileSiteMenu from "@/components/MobileSiteMenu";
import SiteHomeLink from "@/components/SiteHomeLink";
import showcase from "../../../shared/service-showcase.json";

type Service = (typeof showcase)[keyof typeof showcase];
type ServiceEntry = { slug: string; service: Service; category: string };

const categorySlugs: Record<string, string[]> = {
  "Ремонт спецтехники": ["excavator-repair", "bulldozer-repair", "loader-repair", "grader-repair", "mining-truck-repair", "mining-loader-repair", "manipulator-repair", "wirtgen-repair", "railway-repair"],
  "Буровые и ГНБ": ["gnb-repair", "drilling-repair", "piledriver-repair"],
  "Гидравлические узлы": ["hydraulic-pumps", "hydraulic-motors", "hydraulic-valves"],
  "Выезд и предприятия": ["mobile-repair", "emergency-service", "industrial-service", "press-repair", "b2b-maintenance"],
};

const entries: ServiceEntry[] = Object.entries(categorySlugs).flatMap(([category, slugs]) =>
  slugs.map((slug) => ({ slug, service: showcase[slug as keyof typeof showcase], category })),
);

const normalize = (value: string) => value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();

export default function Services() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = normalize(query);
    return term
      ? entries.filter(({ service, category }) => normalize(`${service.label} ${service.summary} ${service.description} ${category}`).includes(term))
      : entries;
  }, [query]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f5f0] pb-8 text-[#17242b]">
      <SEO
        title="Ремонт гидравлики и спецтехники в Астане — услуги ACA Hydraulic"
        description="Найдите сервис по типу спецтехники или гидравлическому узлу. Выездная диагностика, ремонт по согласованной смете и реальные примеры работ ACA Hydraulic."
        canonical="/services"
        ogImage="/images/services/field-diagnostics-illustration.webp"
        breadcrumbs={[{ name: "Услуги", url: "/services" }]}
      />
      <header className="relative z-30 border-b border-[#dce1de] bg-white/95 px-4 py-3 backdrop-blur md:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <SiteHomeLink aria-label="ACA Hydraulic — главная">
            <span className="flex items-center gap-3 font-bold tracking-wide text-[#17242b]">
              <span className="flex h-9 gap-[3px]" aria-hidden="true"><span className="w-[11px] bg-[#f4bc2a]" /><span className="flex flex-col justify-between"><span className="h-[16px] w-[11px] bg-[#f4bc2a]" /><span className="h-[16px] w-[11px] bg-[#f4bc2a]" /></span></span>
              <span className="leading-tight">ACA <span className="block text-[11px] tracking-[0.2em]">HYDRAULIC</span></span>
            </span>
          </SiteHomeLink>
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Основная навигация">
            <Link href="/services" className="text-[#936800]">Услуги</Link>
            <Link href="/catalog" className="hover:text-[#936800]">Запчасти</Link>
            <Link href="/cases" className="hover:text-[#936800]">Кейсы</Link>
            <Link href="/contacts" className="hover:text-[#936800]">Контакты</Link>
          </nav>
          <div className="flex items-center gap-3">
            <a href="tel:+77714177925" className="hidden rounded-lg border border-[#cad1ce] px-4 py-2 text-sm font-semibold transition hover:border-[#a27500] sm:inline-flex">+7 (771) 417-79-25</a>
            <MobileSiteMenu light />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-[#dce1de] bg-[#eaf0eb]">
          <div className="absolute inset-0 opacity-15 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[48%] lg:opacity-100">
            <img src="/images/services/field-diagnostics-illustration.webp" alt="" role="presentation" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eaf0eb] via-[#eaf0eb]/30 to-transparent" />
          </div>
          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 md:py-20 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c8d1cb] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#55685c]">
                <Wrench size={14} /> ACA Hydraulic · сервис спецтехники
              </span>
              <h1 className="max-w-2xl font-sans text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">Найдём причину. <span className="text-[#a37500]">Вернём технику в работу.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#465957] md:text-lg">Выберите технику или гидравлический узел. Если причина поломки неизвестна — начнём с диагностики и согласуем ремонт после проверки.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#service-search" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f4bc2a] px-6 font-bold text-[#17242b] transition hover:bg-[#e9ae13]">Выбрать услугу <ArrowRight size={18} /></a>
                <a href="https://wa.me/77714177925?text=%D0%9D%D1%83%D0%B6%D0%BD%D0%B0%20%D0%B4%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D0%B3%D0%B8%D0%B4%D1%80%D0%B0%D0%B2%D0%BB%D0%B8%D0%BA%D0%B8" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#aab9b0] bg-white/75 px-6 font-semibold transition hover:bg-white"><MessageCircle size={18} /> Написать инженеру</a>
              </div>
            </div>
          </div>
        </section>

        <section id="service-search" className="mx-auto max-w-7xl scroll-mt-6 px-4 py-12 md:py-16">
          <div className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#97710b]">Каталог услуг</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">По технике или узлу</h2>
              <p className="mt-3 text-[#50605c]">Введите «экскаватор», «ГНБ», «насос» или выберите раздел ниже.</p>
            </div>
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#bdcac3] bg-white px-4 shadow-sm focus-within:border-[#b88b14] focus-within:ring-2 focus-within:ring-[#f4bc2a]/30 md:w-80">
              <Search size={19} className="shrink-0 text-[#697b72]" />
              <span className="sr-only">Поиск услуги</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, ГНБ или насос" className="w-full bg-transparent py-3 text-[#17242b] outline-none placeholder:text-[#74827c]" />
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-[#d9e0da] bg-white p-7">
              <h3 className="text-xl font-bold">Не нашли точное название?</h3>
              <p className="mt-2 text-[#52615c]">Напишите модель техники, фото шильдика и симптомы — подскажем, с чего начать проверку.</p>
              <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center font-bold text-[#815f00] underline underline-offset-4">Отправить данные в WhatsApp</a>
            </div>
          ) : Object.entries(categorySlugs).map(([category]) => {
            const items = filtered.filter((entry) => entry.category === category);
            if (!items.length) return null;
            return (
              <section key={category} className="mb-10">
                <h3 className="mb-4 border-b border-[#cdd7ce] pb-3 text-xl font-bold md:text-2xl">{category}</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map(({ slug, service }) => (
                    <Link key={slug} href={`/services/${slug}/`} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-[#d7dfd8] bg-white p-5 shadow-[0_3px_16px_rgba(15,31,23,0.04)] transition hover:-translate-y-0.5 hover:border-[#cba544] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47808]">
                      <span className="flex items-start justify-between gap-3"><span className="text-lg font-bold leading-snug">{service.label}</span><ArrowRight size={19} className="shrink-0 text-[#a47908] transition group-hover:translate-x-1" /></span>
                      <span className="mt-4 text-sm leading-relaxed text-[#53645d]">{service.summary}</span>
                      {service.cases.length > 0 && <span className="mt-4 text-xs font-semibold text-[#87640a]">Есть реальные примеры работ</span>}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </section>

        <section className="border-y border-[#d6dfd8] bg-white px-4 py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1.5fr] md:items-center">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#97710b]">Если модель уже известна</p><h2 className="text-2xl font-bold md:text-3xl">Быстрый запрос без лишней формы</h2><p className="mt-3 text-[#53645d]">Инженеру нужны данные, чтобы отделить неисправность узла от проблемы в системе.</p></div>
            <ol className="grid gap-3 sm:grid-cols-3">
              {["Модель и серийный номер техники", "Фото шильдика неисправного узла", "Видео симптома и место работы"].map((item, index) => <li key={item} className="rounded-xl bg-[#f1f5f1] p-4 text-sm font-medium"><span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#f4bc2a] font-bold">{index + 1}</span>{item}</li>)}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="grid gap-7 rounded-2xl bg-[#203831] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div><ClipboardList className="mb-4 text-[#f4bc2a]" /><h2 className="text-2xl font-bold md:text-3xl">Не знаете, какой узел вышел из строя?</h2><p className="mt-3 max-w-xl text-[#d2ded5]">Опишите симптом. Предложим порядок диагностики и согласуем условия выезда, работ и запчастей до начала ремонта.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col"><a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f4bc2a] px-6 font-bold text-[#17242b]">WhatsApp <ArrowRight size={17} /></a><a href="tel:+77714177925" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/45 px-6 font-semibold"><Phone size={17} /> Позвонить</a></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#d4ded6] px-4 py-7 text-sm text-[#51625a]"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3"><span>ACA Hydraulic · Астана, Казахстан</span><span><Link href="/contacts" className="underline underline-offset-4">Контакты</Link> · <Link href="/cases" className="underline underline-offset-4">Кейсы</Link></span></div></footer>
    </div>
  );
}

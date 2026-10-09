import { Link } from "wouter";
import { ArrowUpRight, Check, MessageCircle, Play, Wrench } from "lucide-react";
import { SEO } from "@/components/SEO";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import repair from "../../../../shared/xcmg-xz320e-repair-case.json";

const baseUrl = "https://acahydraulic.kz";
const canonical = `${baseUrl}${repair.casePath}/`;
const video = repair.video as typeof repair.video & { duration?: string; seconds?: number };
const message = `Здравствуйте! Посмотрел кейс ремонта ГНБ XCMG XZ320E. Нужна помощь с буровой установкой.\nМодель и серийный номер: \nЧто не работает и когда появилась проблема: \nГород и местоположение техники: \nПришлю фото шильдика и видео неисправности.\n${canonical}`;
const contactUrl = `https://wa.me/77714177925?text=${encodeURIComponent(message)}`;
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": `${canonical}#video`,
  name: video.title,
  description: video.description,
  thumbnailUrl: [`${baseUrl}${video.poster}`],
  contentUrl: `${baseUrl}${video.src}`,
  url: canonical,
  mainEntityOfPage: canonical,
  uploadDate: video.uploadDate,
  ...(video.duration ? { duration: video.duration } : {}),
  inLanguage: "ru",
};

function recordInquiry() {
  trackCatalogEvent("case_whatsapp_click", {
    case_id: "xcmg-xz320e-repair",
    request_type: "gnb-repair",
  });
}

export default function XcmgXz320eRepair() {
  return (
    <main className="min-h-screen bg-[#101010] text-white">
      <SEO
        title={repair.seoTitle}
        description={repair.description}
        canonical={repair.casePath}
        ogImage={repair.ogImage}
        pageType="article"
        publishedDate={repair.publishedOn}
        modifiedDate={repair.modifiedOn}
        schema={videoSchema}
        breadcrumbs={[
          { name: "Кейсы", url: "/cases/" },
          { name: "Ремонт ГНБ XCMG XZ320E", url: repair.casePath },
        ]}
      />

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <Link href="/cases/" className="inline-flex min-h-11 items-center text-sm text-[#FFC000] underline underline-offset-4">
          Все реальные работы
        </Link>

        <section className="mt-5 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12" aria-labelledby="case-title">
          <div className="lg:pt-6">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FFC000]">
              <Wrench size={16} aria-hidden="true" /> ACA Hydraulic · выездной ремонт
            </p>
            <h1 id="case-title" className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              {repair.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">{repair.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {["Промывка гидробака", "Замена насоса", "Проверка на расширении"].map((label) => (
                <span key={label} className="rounded-full border border-white/15 px-3 py-1.5 text-gray-300">{label}</span>
              ))}
            </div>
            <a href="#repair-video" className="mt-6 inline-flex min-h-11 items-center gap-2 text-[#FFC000] underline underline-offset-4">
              <Play size={16} aria-hidden="true" /> Посмотреть ремонт на видео
            </a>
            <div className="mt-8 hidden rounded-lg border-l-2 border-[#FFC000] bg-white/5 p-5 lg:block">
              <p className="font-semibold">Есть проблема с буровой установкой?</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">Пришлите модель, симптомы и местоположение техники — уточним задачу и согласуем следующий шаг.</p>
              <a href={contactUrl} onClick={recordInquiry} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-[#FFC000]">
                Написать в WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <figure id="repair-video" className="mx-auto w-full max-w-[440px] scroll-mt-20">
            <video
              controls
              playsInline
              preload="none"
              poster={video.poster}
              width={video.width}
              height={video.height}
              aria-label={video.title}
              className="aspect-[9/16] max-h-[78vh] w-full rounded-xl bg-black object-contain ring-1 ring-white/15"
            >
              <source src={video.src} type="video/mp4" />
              <a href={video.src}>Открыть видео ремонта XCMG XZ320E</a>
            </video>
            <figcaption className="mt-3 flex items-center justify-between gap-3 text-sm leading-6 text-gray-400">
              <span>Гидробак, новый насос, проводка и проверка на расширении</span>
              <a href={video.src} className="shrink-0 text-[#FFC000] underline underline-offset-4">Открыть видео</a>
            </figcaption>
          </figure>
        </section>

        <section className="mt-14 border-t border-white/10 pt-10" aria-labelledby="work-title">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFC000]">Этапы ремонта</p>
          <h2 id="work-title" className="mt-3 text-3xl font-bold">Что сделали на XCMG XZ320E</h2>
          <ol className="mt-7 grid gap-5 md:grid-cols-2">
            {repair.steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-white/10 bg-[#171717] p-6">
                <span className="text-sm font-bold text-[#FFC000]">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-gray-400">{repair.scopeNote}</p>
        </section>

        <section className="mt-12" aria-labelledby="photos-title">
          <h2 id="photos-title" className="text-3xl font-bold">Гидробак, насос и результат</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {repair.gallery.map((photo) => (
              <figure key={photo.src}>
                <a href={photo.src} target="_blank" rel="noopener noreferrer" className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC000]">
                  <img src={photo.src} alt={photo.alt} width={720} height={1280} loading="lazy" className="aspect-[9/16] max-h-[560px] w-full rounded-lg bg-[#171717] object-contain" />
                </a>
                <figcaption className="mt-3 text-sm leading-6 text-gray-400">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-xl border border-[#FFC000]/25 bg-[#191919] p-6 md:p-8" aria-labelledby="request-title">
          <div className="grid gap-7 md:grid-cols-[1fr_0.85fr] md:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFC000]">Ремонт вашей техники</p>
              <h2 id="request-title" className="mt-3 text-3xl font-bold">Нужна помощь с ГНБ?</h2>
              <p className="mt-4 leading-7 text-gray-300">Опишите, какая функция работает неправильно: ход, вращение, подача или зажим. Укажите, меняется ли работа после прогрева и какие действия уже выполнялись.</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">После уточнения задачи согласуем возможность выезда, состав работ и стоимость.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Для первого обращения подготовьте</h3>
              <ul className="mt-4 space-y-3 text-gray-300">
                {["Модель и серийный номер установки", "Симптомы и короткое видео проблемы", "Фото шильдика и нужного узла", "Город и местоположение техники"].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6"><Check size={18} className="mt-1 shrink-0 text-[#FFC000]" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <a href={contactUrl} onClick={recordInquiry} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#FFC000] px-4 py-3 text-center font-bold text-black hover:bg-[#eab000]">
                <MessageCircle size={20} className="shrink-0" aria-hidden="true" /> Обсудить ремонт в WhatsApp
              </a>
            </div>
          </div>
        </section>

        <nav className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3" aria-label="Связанные услуги и запчасти">
          <Link href="/services/gnb-repair/" className="inline-flex min-h-12 items-center justify-between gap-2 rounded-lg bg-white/5 p-4 text-sm font-semibold text-[#FFC000]">Ремонт установок ГНБ <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></Link>
          <Link href="/catalog/category/hydraulic-pumps/" className="inline-flex min-h-12 items-center justify-between gap-2 rounded-lg bg-white/5 p-4 text-sm font-semibold text-[#FFC000]">Подбор гидронасосов <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></Link>
          <Link href="/blog/zapchasti-po-nomeru-i-shildiku/" className="inline-flex min-h-12 items-center justify-between gap-2 rounded-lg bg-white/5 p-4 text-sm font-semibold text-[#FFC000]">Как сфотографировать шильдик <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></Link>
        </nav>
      </div>
    </main>
  );
}

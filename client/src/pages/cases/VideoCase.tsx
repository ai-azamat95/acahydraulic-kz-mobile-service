import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import { publicAsset } from "@/lib/assets";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import cases from "../../../../shared/video-cases.json";

export default function VideoCase() {
  const [location] = useLocation();
  const item = cases.find(item => location.replace(/\/+$/, "").endsWith(`/${item.slug}`))!;
  const [failed, setFailed] = useState(false);
  const played = useRef(false);
  const url = `https://acahydraulic.kz/cases/${item.slug}/`;
  const message = `Здравствуйте! Посмотрел видео ${item.model}. Моя техника: __. Город: __. Симптомы: __. Нужна диагностика / запчасть с заменой. Пришлю шильдик.`;
  return <main className="min-h-screen bg-[#111111] text-white">
    <SEO title={item.title} description={item.description} canonical={url} ogImage={`https://acahydraulic.kz${item.poster}`}
      breadcrumbs={[{ name: "Кейсы", url: "/cases/" }, { name: item.model, url: `/cases/${item.slug}/` }]}
      schema={{ "@context": "https://schema.org", "@type": "VideoObject", "@id": `${url}#video`, name: item.title, description: item.description,
        thumbnailUrl: [`https://acahydraulic.kz${item.poster}`], contentUrl: `https://acahydraulic.kz${item.video}`, url,
        mainEntityOfPage: url, uploadDate: item.uploadDate, duration: item.duration, inLanguage: "ru" }} />
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      <nav aria-label="Навигация по кейсам" className="mb-6 flex flex-wrap gap-5 text-sm text-[#FFC000] underline">
        <Link href="/">Главная</Link><Link href="/cases/">Все кейсы</Link><Link href="/catalog/">Каталог запчастей</Link>
      </nav>
      <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#FFC000]">Реальная работа ACA Hydraulic · {item.durationLabel}</p>
      <h1 className="max-w-4xl font-bebas text-4xl leading-tight md:text-5xl">{item.title}</h1>
      <div className="mt-6 grid items-start gap-8 md:grid-cols-[1fr_340px]">
        <div>
          <p className="mt-5 text-lg leading-relaxed text-gray-300">{item.summary}</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">Видео с объекта. Исполнение узлов на другой машине проверяем отдельно по шильдику, валу, фланцу, портам и регулятору. Замена дорогостоящего насоса — после подтверждения причины неисправности.</p>
          <a className="mt-6 inline-flex min-h-12 items-center rounded-md bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-yellow-400" href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"
            onClick={() => trackCatalogEvent("case_whatsapp_click", { case_id: item.slug })}>Отправить модель и симптомы в WhatsApp</a>
          <p className="mt-3 text-sm text-gray-400">Выезд по согласованию · Казахстан</p>
        </div>
        <figure className="order-first mx-auto w-full max-w-sm md:order-last">
          <video controls playsInline preload="none" width={720} height={1280} poster={publicAsset(item.poster)} aria-label={item.title}
            className="aspect-[9/16] max-h-[72vh] w-full rounded-lg bg-black object-contain" onError={() => setFailed(true)}
            onPlay={() => { if (!played.current) { played.current = true; trackCatalogEvent("case_video_play", { case_id: item.slug }); } }}>
            <source src={publicAsset(item.video)} type="video/mp4" />Ваш браузер не поддерживает видео.
          </video>
          <figcaption className="mt-3 text-sm text-gray-400">{item.durationLabel} · с титрами на русском языке</figcaption>
          {failed && <p role="status" className="mt-3 text-sm text-amber-300">Не удалось загрузить видео. Откройте файл по ссылке ниже.</p>}
          <a href={publicAsset(item.video)} className="mt-2 inline-block py-2 text-sm text-[#FFC000] underline">Открыть видео отдельно</a>
        </figure>
      </div>
      <section className="mt-12 border-t border-white/15 pt-8" aria-labelledby="video-steps">
        <h2 id="video-steps" className="font-bebas text-3xl">Что показано в видео</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-2">{item.steps.map((step, index) => <li key={step.title}>
          <h3 className="text-lg font-bold text-[#FFC000]">{index + 1}. {step.title}</h3><p className="mt-2 leading-relaxed text-gray-300">{step.text}</p>
        </li>)}</ol>
      </section>
      <section className="mt-10 border-t border-white/15 pt-8">
        <h2 className="font-bebas text-3xl">Подобрать запчасть или согласовать ремонт</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">{item.links.map(link => <li key={link.href}><Link href={link.href} className="inline-block py-3 text-[#FFC000] underline underline-offset-4">{link.label}</Link></li>)}</ul>
      </section>
    </div>
  </main>;
}

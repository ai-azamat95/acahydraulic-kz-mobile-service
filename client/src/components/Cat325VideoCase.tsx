import { useState } from "react";
import { MessageCircle, Video } from "lucide-react";
import { publicAsset } from "@/lib/assets";

const videoPath = "videos/cat325c-repair-74s.mp4";
const posterPath = "videos/cat325c-repair-poster.webp";
const contactUrl = `https://wa.me/77714177925?text=${encodeURIComponent("Здравствуйте! Посмотрел кейс CAT 325C. Нужна диагностика. Модель:  Город:  Симптомы: ")}`;

export const cat325VideoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": "https://acahydraulic.kz/cases/#cat325c-video",
  name: "CAT 325C глохнет под нагрузкой: диагностика и выездной ремонт",
  description: "Реальный ремонт ACA Hydraulic: замер давления, восстановление электрокосы, устранение утечек регуляторов, регулировка и проверка рабочих операций экскаватора CAT 325C.",
  thumbnailUrl: [`https://acahydraulic.kz/${posterPath}`],
  contentUrl: `https://acahydraulic.kz/${videoPath}`,
  uploadDate: "2026-09-17T00:00:00+05:00",
  duration: "PT73.6S",
  inLanguage: "ru",
};

export default function Cat325VideoCase() {
  const [failed, setFailed] = useState(false);
  return (
    <section id="cat325c-video" aria-labelledby="cat325c-title" className="scroll-mt-24 border-y border-white/10 bg-[#111111] py-10 md:py-14">
      <div className="container mx-auto grid items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#FFC000]">
            <Video className="h-5 w-5 shrink-0" aria-hidden="true" /> Реальный выездной ремонт · 1 мин 14 сек
          </p>
          <h2 id="cat325c-title" className="font-bebas text-4xl leading-tight text-white md:text-5xl">CAT 325C глохнет под нагрузкой</h2>
          <p id="cat325c-summary" className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg">
            При работе гидравлики двигатель останавливался. Показываем диагностику, выполненные работы и проверку экскаватора после ремонта.
          </p>
          <ol className="mt-5 space-y-3 text-gray-300">
            <li><span className="font-bold text-[#FFC000]">01.</span> Замер давления и проверка электропроводки.</li>
            <li><span className="font-bold text-[#FFC000]">02.</span> Восстановление электрокосы и устранение утечек регуляторов.</li>
            <li><span className="font-bold text-[#FFC000]">03.</span> Регулировка, калибровка и проверка рабочих операций.</li>
          </ol>
          <p className="mt-6 text-white">Похожая неисправность? Пришлите модель техники, город и видео симптомов.</p>
          <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC000]">
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> Обсудить диагностику в WhatsApp
          </a>
          <p className="mt-3 text-sm text-gray-400">Выезд по согласованию, по Казахстану.</p>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <video controls playsInline preload="none" width={720} height={1280}
            poster={publicAsset(posterPath)} aria-label="Видео ремонта CAT 325C, 1 минута 14 секунд" aria-describedby="cat325c-summary"
            onError={() => setFailed(true)} className="mx-auto aspect-[9/16] max-h-[70vh] w-full rounded-lg bg-black object-contain">
            <source src={publicAsset(videoPath)} type="video/mp4" />
            Ваш браузер не поддерживает встроенное видео. Откройте ролик по ссылке ниже.
          </video>
          {failed && <p role="status" className="mt-3 text-sm text-gray-300">Видео не загрузилось. Попробуйте открыть его отдельно по ссылке ниже.</p>}
          <a href={publicAsset(videoPath)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm text-gray-300 underline underline-offset-4 hover:text-[#FFC000]">Открыть видео отдельно</a>
        </div>
      </div>
    </section>
  );
}

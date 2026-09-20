import { useRef, useState } from "react";
import { publicAsset } from "@/lib/assets";
import { Link } from "wouter";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

export function PumpPhoto({ file, alt, caption }: { file: string; alt: string; caption: string }) {
  const src = publicAsset(`media/pump-cases/${file}`);
  return <figure className="min-w-0">
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Открыть фото: ${alt}`} className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">
      <img src={src} width={900} height={1200} alt={alt} loading="lazy" className="h-64 w-full rounded-lg bg-[#202020] object-contain" />
    </a>
    <figcaption className="mt-3 text-sm leading-relaxed text-gray-400">{caption}</figcaption>
  </figure>;
}

export function SanyPumpVideo() {
  const [failed, setFailed] = useState(false);
  const played = useRef(false);
  return <figure className="mx-auto w-full max-w-sm">
    <video controls playsInline preload="none" width={720} height={1280}
      poster={publicAsset("media/pump-cases/sany-sy365h.webp")}
      aria-label="SANY SY365H: поставка, замена насоса и запуск — 36 секунд, с титрами"
      className="aspect-[9/16] w-full rounded-lg bg-black"
      onError={() => setFailed(true)}
      onPlay={() => { if (!played.current) { played.current = true; trackCatalogEvent("case_video_play", { case_id: "sany-pump", content_type: "repair_case" }); } }}
      onEnded={() => trackCatalogEvent("case_video_complete", { case_id: "sany-pump" })}>
      <source src={publicAsset("media/pump-cases/sany-pump-36s.mp4")} type="video/mp4" />
      Ваш браузер не поддерживает встроенное видео.
    </video>
    <figcaption className="mt-3 text-sm leading-relaxed text-gray-400">36 секунд: насос, демонтаж, работы на объекте и проверка экскаватора. Ролик без звука, этапы подписаны в кадре.</figcaption>
    <Link href="/cases/sany-sy365h-zamena-gidronasosa-video/" className="mt-2 inline-block py-2 text-sm text-[#FFC000] underline">Видео замены насоса SANY с описанием работ</Link>
    {failed && <p role="status" className="mt-3 text-sm text-amber-300">Не удалось загрузить видео. Откройте файл по ссылке ниже.</p>}
    <a className="mt-2 inline-block py-2 text-sm text-[#FFC000] underline underline-offset-4" href={publicAsset("media/pump-cases/sany-pump-36s.mp4")}>Открыть видео отдельным файлом</a>
  </figure>;
}

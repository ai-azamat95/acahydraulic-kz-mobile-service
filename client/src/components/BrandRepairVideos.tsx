import { useRef, useState } from "react";
import { ArrowRight, ExternalLink, PlayCircle } from "lucide-react";
import { Link } from "wouter";
import brandVideos from "@shared/brand-repair-videos.json";

type Brand = keyof typeof brandVideos;
type RepairVideo = {
  platform: string;
  id: string;
  title: string;
  description: string;
  relatedHref?: string;
  relatedLabel?: string;
};

export default function BrandRepairVideos({ brand }: { brand: Brand }) {
  const collection: { name: string; videos: RepairVideo[] } =
    brandVideos[brand];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const selected: RepairVideo = collection.videos[selectedIndex];
  const isYouTube = selected.platform === "youtube";
  const watchUrl = (video: RepairVideo) =>
    video.platform === "youtube"
      ? `https://www.youtube.com/watch?v=${video.id}`
      : `https://www.tiktok.com/@acaservice01/video/${video.id}`;
  const playerUrl = isYouTube
    ? `https://www.youtube-nocookie.com/embed/${selected.id}?rel=0`
    : `https://www.tiktok.com/player/v1/${selected.id}?rel=0&autoplay=0`;

  return (
    <section
      id="repair-videos"
      aria-labelledby={`${brand}-videos-title`}
      data-brand-videos={brand}
      className="scroll-mt-28 border-y border-white/10 bg-[#111] py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#FFC000]">
          Работы ACA Hydraulic на объекте
        </p>
        <h2 id={`${brand}-videos-title`} className="mb-4 text-3xl font-bold">
          Видео ремонта {collection.name}
        </h2>
        <p className="mb-8 max-w-3xl leading-relaxed text-white/70">
          Выберите ролик, чтобы посмотреть работы с техникой {collection.name}.
          В каждом видео указана модель или тема ремонта.
        </p>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <ol aria-label={`Ролики ${collection.name}`} className="space-y-3">
              {collection.videos.map((video, index) => (
                <li
                  key={`${video.platform}-${video.id}`}
                  className="rounded-xl border border-white/15 bg-[#1a1a1a] p-4"
                >
                  <button
                    type="button"
                    aria-pressed={selectedIndex === index}
                    aria-controls={`${brand}-video-player`}
                    onClick={() => {
                      setSelectedIndex(index);
                      setPlayerOpen(false);
                      if (window.matchMedia("(max-width: 1023px)").matches) {
                        playerRef.current?.focus({ preventScroll: true });
                        playerRef.current?.scrollIntoView({
                          block: "start",
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                          ).matches
                            ? "instant"
                            : "smooth",
                        });
                      }
                    }}
                    className={`flex min-h-11 w-full items-start gap-3 text-left font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC000] ${selectedIndex === index ? "text-[#FFC000]" : "text-white hover:text-[#FFC000]"}`}
                  >
                    <PlayCircle
                      className="mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{video.title}</span>
                  </button>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {video.description}
                  </p>
                  <a
                    href={watchUrl(video)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Открыть в ${video.platform === "youtube" ? "YouTube" : "TikTok"}: ${video.title}`}
                    className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-[#FFC000] underline underline-offset-4"
                  >
                    Открыть в{" "}
                    {video.platform === "youtube" ? "YouTube" : "TikTok"}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                  {video.relatedHref && (
                    <Link
                      href={video.relatedHref}
                      className="mt-2 flex min-h-11 items-center gap-2 text-sm text-[#FFC000] underline underline-offset-4"
                    >
                      {video.relatedLabel}
                      <ArrowRight
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ol>
            <Link
              href="/services/mobile-repair/"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-[#FFC000] underline underline-offset-4"
            >
              Условия выездной диагностики
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div
            ref={playerRef}
            id={`${brand}-video-player`}
            tabIndex={-1}
            className="order-1 min-w-0 scroll-mt-28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC000] lg:order-2 lg:sticky lg:top-28"
          >
            <h3 className="mb-4 text-xl font-bold">{selected.title}</h3>
            <div
              className={`relative mx-auto w-full overflow-hidden rounded-xl border border-white/15 bg-black ${isYouTube ? "aspect-video" : "aspect-[9/16] max-w-[360px]"}`}
            >
              {playerOpen ? (
                <iframe
                  key={`${selected.platform}-${selected.id}`}
                  src={playerUrl}
                  title={selected.title}
                  loading="lazy"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlayerOpen(true)}
                  aria-label={`Смотреть на странице: ${selected.title}`}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-[#FFC000] hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#FFC000]"
                >
                  <PlayCircle className="h-14 w-14" aria-hidden="true" />
                  <span className="font-semibold">Смотреть на странице</span>
                  <span className="text-sm text-white/70">
                    {isYouTube ? "YouTube" : "TikTok"}
                  </span>
                </button>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Если плеер не показывает видео или просит войти в аккаунт,{" "}
              <a
                href={watchUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFC000] underline underline-offset-4"
              >
                откройте ролик в {isYouTube ? "YouTube" : "TikTok"}
              </a>
              .
            </p>
            {selected.relatedHref && (
              <Link
                href={selected.relatedHref}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-[#FFC000] underline underline-offset-4"
              >
                {selected.relatedLabel}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

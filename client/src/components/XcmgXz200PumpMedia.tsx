import sale from "../../../shared/xcmg-xz200-pump-sale.json";

export default function XcmgXz200PumpMedia() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {sale.videos.map((video) => (
        <figure key={video.id} className="rounded-lg border border-white/10 bg-[#151515] p-3">
          <video
            controls
            playsInline
            preload="none"
            poster={video.poster}
            width={720}
            height={1280}
            aria-label={video.title}
            className="aspect-[9/16] max-h-[620px] w-full rounded bg-black object-contain"
          >
            <source src={video.src} type="video/mp4" />
            <a href={video.src}>Открыть видео</a>
          </video>
          <figcaption className="mt-3 text-sm leading-6 text-gray-400">{video.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

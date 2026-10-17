import { brandPumpHighlight } from "@/lib/catalogLandings";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import { ArrowRight, MessageCircle, PackageSearch } from "lucide-react";
import { Link } from "wouter";

const WHATSAPP_NUMBER = "77714177925";
const PUMP_CATEGORY_IDS = new Set([
  "hydraulic-pumps",
  "gear-pumps",
  "piston-pumps",
]);

export function BrandPumpShowcase({
  brandSlug,
  activeCategory = "",
}: {
  brandSlug: string;
  activeCategory?: string;
}) {
  const brand = brandPumpHighlight(brandSlug);
  if (!brand) return null;

  if (activeCategory && !PUMP_CATEGORY_IDS.has(activeCategory)) {
    const sectionName =
      activeCategory === "hydraulic-motors"
        ? "Гидромоторы"
        : activeCategory === "pump-parts"
          ? "Комплектующие гидронасосов"
          : "Выбранный раздел каталога";
    return (
      <section
        className="mt-6 rounded-xl border border-white/15 bg-[#151515] p-5 md:p-7"
        data-brand-non-pump-section={activeCategory}
        aria-labelledby={`brand-related-${brandSlug}`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFC000]">
          Отдельно от каталога насосов
        </p>
        <h2
          id={`brand-related-${brandSlug}`}
          className="mt-2 font-bebas text-3xl font-bold uppercase tracking-wide text-white"
        >
          {sectionName} {brand.displayName}
        </h2>
        <p className="mt-2 max-w-4xl leading-relaxed text-gray-300">
          Результаты ниже отфильтрованы по выбранному типу продукции. Эти
          позиции не входят в подборку гидронасосов.
        </p>
        <nav
          className="mt-4 flex flex-wrap gap-x-5 gap-y-2"
          aria-label={`Разделы каталога ${brand.displayName}`}
        >
          <Link
            href={brand.pumpHref}
            className="inline-flex min-h-11 items-center font-bold text-[#FFC000] underline underline-offset-4"
          >
            Вернуться к насосам {brand.displayName}
          </Link>
          {brand.relatedCatalog.map(item => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                item.href.includes(`category=${activeCategory}`)
                  ? "page"
                  : undefined
              }
              className="inline-flex min-h-11 items-center font-bold text-[#FFC000] underline underline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>
    );
  }

  const whatsappMessage = [
    `Здравствуйте. Нужен подбор насоса ${brand.displayName} по шильдику.`,
    "Модель техники: ____",
    "Фото шильдика и подключений пришлю в чат.",
    `Раздел: https://acahydraulic.kz${brand.pumpHref}`,
  ].join("\n");

  return (
    <section
      className="mt-6 rounded-xl border border-[#FFC000]/40 bg-[#151515] p-5 md:p-7"
      data-brand-pump-showcase={brandSlug}
      aria-labelledby={`brand-pump-showcase-${brandSlug}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFC000]">
            Отдельные карточки насосов
          </p>
          <h2
            id={`brand-pump-showcase-${brandSlug}`}
            className="aca-pump-brand-heading mt-2 font-bebas text-3xl font-bold uppercase tracking-wide text-white md:text-4xl"
          >
            {brand.featuredHeading}
          </h2>
          <p className="mt-2 leading-relaxed text-gray-300">
            {brand.featuredIntro}
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
          data-aca-contact-managed="react"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackCatalogEvent("catalog_whatsapp_click", {
              catalog_source: "brand_pump_showcase",
              landing_id: brand.href,
              brand_slug: brandSlug,
              request_type: "nameplate_selection",
            })
          }
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded bg-[#FFC000] px-5 font-bold text-black transition hover:bg-[#E6AC00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Отправить шильдик для подбора
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {brand.featuredPumps.map(pump => (
          <article
            key={pump.id}
            className="group/pump overflow-hidden rounded-lg border border-white/10 bg-[#0e0e0e] transition hover:border-[#FFC000]/60"
          >
            <Link
              href={pump.href}
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#FFC000]"
            >
              <span className="block aspect-[4/3] bg-white p-4">
                <img
                  src={pump.imageUrl}
                  alt={pump.title}
                  width="640"
                  height="480"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain transition group-hover/pump:scale-[1.02]"
                />
              </span>
              <span className="block p-4">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#FFC000]">
                  Артикул {pump.sku}
                </span>
                <strong className="mt-2 block min-h-12 leading-snug text-white group-hover/pump:text-[#FFC000]">
                  {pump.title}
                </strong>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#FFC000]">
                  Открыть карточку{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </article>
        ))}
      </div>

      <aside
        className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4"
        aria-label="Гидромоторы и комплектующие бренда"
        data-brand-related-catalog
      >
        <div className="flex items-start gap-3">
          <PackageSearch
            className="mt-0.5 h-5 w-5 shrink-0 text-[#FFC000]"
            aria-hidden="true"
          />
          <div>
            <h3 className="font-bold text-white">
              Другие типы продукции — отдельно от насосов
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              Гидромоторы и комплектующие открываются отдельными фильтрами и не
              входят в подборку насосов выше.
            </p>
            <nav
              className="mt-3 flex flex-wrap gap-x-5 gap-y-2"
              aria-label={`Гидромоторы и комплектующие ${brand.displayName}`}
            >
              {brand.relatedCatalog.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-sm font-bold text-[#FFC000] underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </section>
  );
}

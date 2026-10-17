import pumpBrandHighlights from "@shared/catalog-pump-brand-highlights.json";
import { ArrowRight, Gauge } from "lucide-react";
import { Link } from "wouter";

type PumpBrandNavigationProps = {
  source: "home" | "hydraulic-pumps";
  className?: string;
};

export function PumpBrandNavigation({
  source,
  className = "",
}: PumpBrandNavigationProps) {
  return (
    <section
      className={`rounded-xl border border-[#FFC000]/35 bg-[#17140b] p-5 md:p-7 ${className}`}
      aria-labelledby={`pump-brand-navigation-${source}`}
      data-pump-brand-navigation={source}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFC000]">
          Каталог по производителю насоса
        </p>
        <h2
          id={`pump-brand-navigation-${source}`}
          className="aca-pump-brand-heading mt-2 font-bebas text-3xl font-bold uppercase tracking-wide text-white md:text-4xl"
        >
          Bosch Rexroth и Danfoss / Sauer-Danfoss
        </h2>
        <p className="mt-2 leading-relaxed text-gray-300">
          Откройте существующий каталог бренда и выберите насос по точному
          номеру. Исполнение подтверждаем по шильдику до заказа.
        </p>
      </div>
      <nav
        className="mt-5 grid gap-3 md:grid-cols-2"
        aria-label="Каталоги насосов Bosch Rexroth и Danfoss"
      >
        {Object.values(pumpBrandHighlights).map(brand => (
          <Link
            key={brand.href}
            href={brand.pumpHref}
            className="group flex min-h-32 items-start gap-4 rounded-lg border border-white/15 bg-[#0e0e0e] p-5 transition hover:border-[#FFC000]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FFC000]/10 text-[#FFC000]"
              aria-hidden="true"
            >
              <Gauge className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <strong className="block text-lg text-white group-hover:text-[#FFC000]">
                {brand.navigationTitle}
              </strong>
              <span className="mt-2 block text-sm leading-relaxed text-gray-400">
                {brand.navigationText}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#FFC000]">
                Открыть насосы{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}

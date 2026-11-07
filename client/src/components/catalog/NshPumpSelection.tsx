import {
  nshPumpCopy,
  nshPumpRequestHref,
  nshPumpSeries,
} from "@shared/nsh-pump-selection.mjs";
import type { CatalogLanguage } from "@/content/partsCatalog";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";

export default function NshPumpSelection({
  language,
}: {
  language: CatalogLanguage;
}) {
  const t = nshPumpCopy(language);
  const contactProps = (seriesId: string) => ({
    href: nshPumpRequestHref(seriesId, language),
    target: "_blank",
    rel: "noopener noreferrer",
    "data-aca-contact-managed": "react",
    "data-nsh-series": seriesId,
    onClick: () =>
      trackCatalogEvent("catalog_whatsapp_click", {
        catalog_source: "catalog_nsh_selection",
        part_category: "gear-pumps",
        pump_family: seriesId,
        request_type: "series_selection",
      }),
  });

  return (
    <section
      id="nsh-selection"
      data-nsh-selection
      aria-labelledby="nsh-selection-title"
      className="mt-5 min-w-0 rounded-xl border border-[#b68b00]/35 bg-[#fffaf0] p-4 text-[#17242b] md:p-5"
    >
      <h2 id="nsh-selection-title" className="text-xl font-bold leading-snug">
        {t.heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{t.intro}</p>
      <ul className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {nshPumpSeries.map(series => (
          <li key={series.id} className="min-w-0">
            <a
              {...contactProps(series.id)}
              className="flex min-h-16 min-w-0 flex-col items-center justify-center rounded-lg border border-[#b68b00]/40 bg-white px-3 py-3 text-center hover:bg-[#fff1c2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#795809]"
            >
              <span className="text-lg font-bold leading-tight">
                {series.name}
              </span>
              <span className="mt-1 text-xs font-medium text-[#795809]">
                {t.action}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <a
        {...contactProps("other")}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center py-2 text-center text-sm font-semibold text-[#795809] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#795809]"
      >
        {t.other}
      </a>
      <p className="mt-1 text-xs leading-relaxed text-gray-600">{t.note}</p>
    </section>
  );
}

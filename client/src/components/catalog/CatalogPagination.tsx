import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { catalogPageNumbers } from "@shared/catalog-pagination.mjs";
import type { CatalogLanguage } from "@/content/partsCatalog";
import "@/catalog-navigation.css";

const labels = {
  ru: { nav: "Страницы каталога", back: "Назад", next: "Далее", page: "Страница", of: "из" },
  kz: { nav: "Каталог беттері", back: "Артқа", next: "Келесі", page: "Бет", of: "/" },
  en: { nav: "Catalogue pages", back: "Previous", next: "Next", page: "Page", of: "of" },
};

export function CatalogPagination({ page, pages, href, language = "ru" }: {
  page: number; pages: number; href: (page: number) => string; language?: CatalogLanguage;
}) {
  const copy = labels[language];
  if (pages <= 1) return null;
  return <nav className="aca-pagination" aria-label={copy.nav} data-catalog-pagination>
    {page > 1 ? <Link href={href(page - 1)} rel="prev" className="aca-page-direction" data-page-prev><ChevronLeft aria-hidden="true" />{copy.back}</Link>
      : <span className="aca-page-direction" aria-disabled="true"><ChevronLeft aria-hidden="true" />{copy.back}</span>}
    <div className="aca-page-numbers">
      {catalogPageNumbers(page, pages).map((number, index) => typeof number === "number"
        ? <Link key={number} href={href(number)} aria-label={`${copy.page} ${number}`} aria-current={number === page ? "page" : undefined}>{number}</Link>
        : <span key={`gap-${index}`} aria-hidden="true">…</span>)}
    </div>
    <span className="aca-page-position" aria-live="polite">{copy.page} {page} {copy.of} {pages}</span>
    {page < pages ? <Link href={href(page + 1)} rel="next" className="aca-page-direction" data-page-next>{copy.next}<ChevronRight aria-hidden="true" /></Link>
      : <span className="aca-page-direction" aria-disabled="true">{copy.next}<ChevronRight aria-hidden="true" /></span>}
  </nav>;
}

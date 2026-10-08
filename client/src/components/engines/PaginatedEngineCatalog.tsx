import { useEffect, useRef } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { CATALOG_PAGE_SIZE, catalogPage, catalogPageHref } from "@shared/catalog-pagination.mjs";
import { cumminsEngineFamilies, cumminsEngineGroups, cumminsEnginePath } from "@/data/cumminsEngineFamilies";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CumminsEngineCard } from "./CumminsEngineCard";
import { ShantuiEngineOfferCard } from "./ShantuiEngineOfferCard";

export function PaginatedEngineCatalog({ source }: { source: "complete-engines" | "cummins-engine-catalog" }) {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const total = cumminsEngineFamilies.length + 1;
  const pages = Math.ceil(total / CATALOG_PAGE_SIZE);
  const requested = catalogPage(search);
  const page = Math.min(requested, pages);
  const start = (page - 1) * CATALOG_PAGE_SIZE;
  // The specific SD32 offer occupies one place on the first page.
  const visibleIds = new Set(cumminsEngineFamilies.slice(Math.max(0, start - 1), start + CATALOG_PAGE_SIZE - 1).map(engine => engine.id));
  const root = useRef<HTMLDivElement>(null);
  const previousPage = useRef(requested);
  useEffect(() => {
    if (requested !== page) navigate(catalogPageHref(location, search, page), { replace: true });
    if (previousPage.current !== requested) {
      previousPage.current = requested;
      root.current?.scrollIntoView({ block: "start" });
      root.current?.focus({ preventScroll: true });
    }
  }, [requested, page, location, search, navigate]);

  return <div ref={root} tabIndex={-1} className="mt-8 scroll-mt-24" data-engine-page={page}>
    <p className="aca-page-summary" role="status">{start + 1}–{Math.min(start + CATALOG_PAGE_SIZE, total)} из {total} предложений · по 10 на странице</p>
    <details className="mt-4 rounded border border-gray-300 bg-white p-4">
      <summary className="min-h-11 cursor-pointer py-2 font-bold">Быстрый переход: все {cumminsEngineFamilies.length} серий Cummins</summary>
      <nav className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Все серии Cummins" data-engine-directory>
        {cumminsEngineFamilies.map(engine => <Link key={engine.id} href={cumminsEnginePath(engine)} className="inline-flex min-h-11 items-center text-sm text-[#795809] underline underline-offset-4">{engine.name}</Link>)}
      </nav>
    </details>
    {page === 1 && <section className="mt-6" aria-labelledby="exact-engine-offers-title">
      <h2 id="exact-engine-offers-title" className="text-2xl font-bold">Двигатель с указанной ценой</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><ShantuiEngineOfferCard /></div>
    </section>}
    {cumminsEngineGroups.map(group => ({ ...group, engines: group.engines.filter(engine => visibleIds.has(engine.id)) })).filter(group => group.engines.length).map(group => <section key={group.id} className="mt-8" aria-labelledby={`engine-group-${group.id}`}>
      <h2 id={`engine-group-${group.id}`} className="text-2xl font-bold">{group.title}</h2>
      <p className="mt-2 max-w-3xl leading-relaxed text-gray-600">{group.description}</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {group.engines.map(engine => <CumminsEngineCard key={engine.id} engine={engine} source={source} />)}
      </div>
    </section>)}
    <CatalogPagination page={page} pages={pages} href={next => catalogPageHref(location, search, next)} />
  </div>;
}

import { Link, useLocation } from "wouter";

export default function SiteQuickNav() {
  const [location] = useLocation();
  const onHome = location === "/";
  const onCatalog = location === "/catalog" || location.startsWith("/catalog/");

  return (
    <nav aria-label="Быстрые переходы" className="fixed inset-x-0 top-0 z-[60] h-12 border-b border-white/15 bg-[#101010] text-white">
      <div className="container mx-auto flex h-full items-center gap-2 px-4 text-sm font-semibold sm:gap-4">
        <Link href="/" aria-current={onHome ? "page" : undefined}
          className="inline-flex min-h-11 items-center rounded px-3 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] aria-[current=page]:text-[#FFC000]">
          На главную
        </Link>
        <Link href="/catalog" aria-current={onCatalog ? "page" : undefined}
          className="inline-flex min-h-11 items-center rounded px-3 text-[#FFC000] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]">
          В каталог
        </Link>
        <Link href="/sitemap/" className="inline-flex min-h-11 items-center rounded px-2 text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]">
          Разделы сайта
        </Link>
      </div>
    </nav>
  );
}

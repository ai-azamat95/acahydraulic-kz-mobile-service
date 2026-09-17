import { Link } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { catalogSearchHref } from "@/lib/catalogLinks";

export default function CaseCatalogLinks() {
  const links = [
    { label: "Гидронасосы в сборе", href: "/catalog/category/hydraulic-pumps" },
    { label: "Запчасти гидронасосов", href: "/catalog/category/pump-parts" },
    { label: "Запчасти SANY", href: "/catalog/brand/sany" },
    { label: "Запчасти Hitachi ZX160W", href: catalogSearchHref("ZX160W") },
  ];
  return <section aria-labelledby="case-catalog-title" className="border-y border-white/10 bg-[#151515] py-10 md:py-12">
    <div className="container mx-auto max-w-6xl px-4">
      <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Запчасти для вашей техники</p>
      <h2 id="case-catalog-title" className="mt-3 font-bebas text-4xl">Продолжить подбор в каталоге</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-gray-300">Ищите по модели насоса, номеру детали или технике. В каталоге можно изменить запрос и выбрать другой узел. Совместимость выбранной детали подтвердим до заказа.</p>
      <nav aria-label="Каталог по технике и узлу" className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map(link => <Link key={link.href} href={link.href} className="flex min-h-14 items-center justify-between gap-3 rounded border border-white/20 px-4 py-3 font-bold hover:border-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">{link.label}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#FFC000]" /></Link>)}
      </nav>
      <Link href="/catalog" className="inline-flex min-h-12 items-center gap-2 rounded bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-[#eab000]"><Search aria-hidden="true" className="h-5 w-5" />Открыть весь каталог запчастей</Link>
    </div>
  </section>;
}

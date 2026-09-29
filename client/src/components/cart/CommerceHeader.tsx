import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { CartButton } from "@/components/cart/CartButton";
import SiteHomeLink from "@/components/SiteHomeLink";

export function CommerceHeader({ backHref = "/catalog", backLabel = "В каталог" }: { backHref?: string; backLabel?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101010]/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3 md:gap-6">
          <SiteHomeLink className="flex shrink-0 items-center gap-3" aria-label="ACA Hydraulic">
            <span className="flex h-7 gap-[3px]" aria-hidden="true"><span className="w-2.5 bg-[#FFC000]" /><span className="flex flex-col justify-between"><span className="h-3 w-2.5 bg-[#FFC000]" /><span className="h-3 w-2.5 bg-[#FFC000]" /></span></span>
            <span className="hidden flex-col leading-none sm:flex"><strong className="text-lg tracking-wide">ACA</strong><span className="mt-0.5 text-[11px] tracking-wider">HYDRAULIC</span></span>
          </SiteHomeLink>
          <Link href={backHref} className="inline-flex min-h-11 min-w-0 items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#FFC000]">
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{backLabel}</span>
          </Link>
        </div>
        <CartButton />
      </div>
    </header>
  );
}

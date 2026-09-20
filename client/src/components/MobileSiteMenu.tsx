import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import SiteHomeLink from "@/components/SiteHomeLink";

const sections = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/catalog", key: "catalog" },
  { href: "/about", key: "about" },
  { href: "/cases", key: "cases" },
  { href: "/reviews", key: "reviews" },
  { href: "/blog", key: "blog" },
  { href: "/contacts", key: "contacts" },
];
const brands = [
  ["CAT", "cat"], ["KOMATSU", "komatsu"], ["HITACHI", "hitachi"],
  ["HYUNDAI", "hyundai"], ["WIRTGEN", "wirtgen"], ["SHANTUI", "shantui"],
  ["LIEBHERR", "liebherr"], ["VOLVO CE", "volvo"],
];

export default function MobileSiteMenu() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();
  useEffect(() => setOpen(false), [location]);
  const close = () => setOpen(false);

  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button aria-label="Открыть меню" variant="ghost" size="icon" className="h-11 w-11 shrink-0 text-white hover:bg-white/10 hover:text-[#FFC000] xl:hidden">
        <Menu aria-hidden="true" className="h-7 w-7" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" closeLabel="Закрыть меню" aria-describedby={undefined}
      className="h-dvh max-h-dvh w-[min(22rem,100vw)] gap-0 overflow-y-auto overscroll-contain border-l border-white/10 bg-[#111111] p-0 text-white"
      data-site-menu>
      <div className="shrink-0 border-b border-white/10 px-6 pb-4 pt-6">
        <SheetTitle className="pr-14 font-bebas text-2xl text-white">{t("nav.menu")}</SheetTitle>
        <div className="mt-3"><LanguageSwitcher /></div>
      </div>
      <nav aria-label="Основные разделы" className="flex shrink-0 flex-col gap-1 px-6 py-4">
        {sections.map(({ href, key }) => {
          const active = href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`) || (href === "/cases" && location === "/projects");
          const props = {
            onClick: close,
            className: `flex min-h-11 items-center rounded px-3 py-2 text-lg font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000] ${active ? "bg-white/10 text-[#FFC000]" : "text-white hover:bg-white/5 hover:text-[#FFC000]"}`,
            "aria-current": active ? "page" as const : undefined,
            children: t(`nav.${key}`),
          };
          return href === "/" ? <SiteHomeLink key={href} {...props} /> : <Link key={href} href={href} {...props} />;
        })}
      </nav>
      <nav aria-label="Бренды техники" className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 px-6 py-4">
        {brands.map(([label, slug]) => <Link key={slug} href={`/brands/${slug}`} onClick={close} className="flex min-h-11 items-center rounded border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFC000]">{label}</Link>)}
      </nav>
      <div className="mt-auto shrink-0 border-t border-white/10 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <a href="tel:+77714177925" className="flex min-h-11 items-center gap-3 text-[#FFC000]"><Phone aria-hidden="true" className="h-5 w-5" />+7 (771) 417-79-25</a>
      </div>
    </SheetContent>
  </Sheet>;
}

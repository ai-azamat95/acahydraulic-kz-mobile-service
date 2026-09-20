import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { publicAsset } from "@/lib/assets";
import { pumpCasePath } from "@/content/pumpCases";

export default function PumpCaseTeaser() {
  return (
    <section aria-label="Поставка насоса с заменой: реальный кейс" className="border-y border-white/10 bg-[#151515] py-8 md:py-12 text-white">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-[180px_1fr] md:items-center">
        <img src={publicAsset("media/pump-cases/sany-sy365h.webp")} width={720} height={1280} loading="lazy" alt="SANY SY365H на объекте после работ ACA Hydraulic" className="h-48 w-full rounded-lg object-cover md:h-52" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Реальная поставка и ремонт</p>
          <h2 className="mt-3 font-bebas text-3xl md:text-4xl">Заказали насос. Заменили. Запустили SANY.</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">Клиент SANY SY365H заказал у нас весь комплекс: насос K5V160DT, доставку, установку и запуск. Посмотрите фото и видео работ, а также варианты насосов под заказ.</p>
          <Link href={pumpCasePath} className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-[#FFC000] underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            Посмотреть кейс и варианты насосов <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <nav aria-label="Статьи перед покупкой насоса" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#FFC000] underline underline-offset-4">
            <Link href="/blog/k3v112dt-kak-podobrat-gidronasos/" className="py-2">Подбор K3V112DT</Link>
            <Link href="/blog/remont-ili-zamena-gidronasosa/" className="py-2">Ремонт или замена?</Link>
            <Link href="/blog/k5v80dtp-handok-hitachi-zx160w/" className="py-2">K5V80DTP и HANDOK</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

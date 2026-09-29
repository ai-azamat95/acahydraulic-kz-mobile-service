import { ArrowRight, PackageOpen, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

import { CartItemRow } from "@/components/cart/CartItemRow";
import { CommerceHeader } from "@/components/cart/CommerceHeader";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { formatKzt } from "@/lib/cart";

export default function Cart() {
  const { items, summary, clearCart } = useCart();
  return (
    <div className="min-h-[100dvh] bg-[#101010] text-white font-roboto">
      <SEO title="Корзина — ACA Hydraulic" description="Корзина запчастей ACA Hydraulic: количество, проверка цены и переход к оформлению заказа." canonical="/cart" noIndex />
      <CommerceHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#FFC000]">Заказ запчастей</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-5xl">Корзина</h1>
            <p className="mt-3 max-w-2xl leading-7 text-gray-400">Проверьте состав и количество. Совместимость, наличие и окончательная стоимость подтверждаются до оплаты.</p>
          </div>
          {items.length > 0 && <button type="button" onClick={clearCart} className="min-h-11 text-sm text-gray-400 underline underline-offset-4 hover:text-white">Очистить корзину</button>}
        </div>

        {items.length === 0 ? (
          <section className="mt-10 grid min-h-80 place-items-center rounded border border-white/10 bg-[#151515] p-8 text-center" aria-label="Пустая корзина">
            <div>
              <PackageOpen className="mx-auto h-12 w-12 text-[#FFC000]" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold">Добавьте запчасти из каталога</h2>
              <p className="mt-2 text-gray-400">Можно добавить товар даже без фиксированной цены — мы рассчитаем его при оформлении.</p>
              <Link href="/catalog" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded bg-[#FFC000] px-6 font-extrabold text-black hover:bg-[#E6AC00]">Открыть каталог <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </section>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <section className="rounded border border-white/10 bg-[#151515] px-4 md:px-6" aria-label="Товары в корзине">
              {items.map((item) => <CartItemRow key={item.id} item={item} />)}
            </section>

            <aside className="rounded border border-white/10 bg-[#151515] p-5 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold">Итого</h2>
              <dl className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-gray-400">Товаров</dt><dd className="font-bold">{summary.itemCount}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-400">С фиксированной ценой</dt><dd className="font-bold">{summary.fixedLineCount}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-400">Нужен расчёт</dt><dd className="font-bold">{summary.quoteLineCount}</dd></div>
                <div className="mt-2 flex items-end justify-between gap-4 border-t border-white/10 pt-4"><dt className="text-gray-300">Подтверждённая сумма</dt><dd className="text-2xl font-extrabold text-[#FFC000]">{formatKzt(summary.totalKzt)}</dd></div>
              </dl>
              {summary.quoteLineCount > 0 && <p className="mt-3 text-xs leading-5 text-gray-400">Итог увеличится после расчёта позиций с ценой по запросу.</p>}
              <div className="mt-5 flex items-start gap-2 border-l-2 border-[#FFC000] bg-white/[0.03] p-3 text-xs leading-5 text-gray-300">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC000]" aria-hidden="true" />
                Сумма для оплаты должна быть заново рассчитана защищённым сервером, а не браузером.
              </div>
              <Link href="/checkout" className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#FFC000] px-5 font-extrabold text-black hover:bg-[#E6AC00]">Перейти к оформлению <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/catalog" className="mt-2 flex min-h-11 items-center justify-center text-sm font-bold text-white underline underline-offset-4">Продолжить покупки</Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

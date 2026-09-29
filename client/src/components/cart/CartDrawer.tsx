import { PackageOpen, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

import { CartItemRow } from "@/components/cart/CartItemRow";
import { useCart } from "@/contexts/CartContext";
import { formatKzt } from "@/lib/cart";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const { items, summary, drawerOpen, setDrawerOpen } = useCart();
  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        closeLabel="Закрыть корзину"
        className="h-dvh w-[min(30rem,100vw)] max-w-none gap-0 overflow-hidden border-l border-white/10 bg-[#101010] p-0 text-white sm:max-w-[30rem]"
      >
        <SheetHeader className="border-b border-white/10 px-5 py-5 pr-16 text-left">
          <SheetTitle className="text-2xl text-white">Корзина</SheetTitle>
          <SheetDescription className="text-gray-400">
            {summary.itemCount > 0 ? `${summary.itemCount} товаров. Цена и совместимость подтверждаются до оплаты.` : "Добавьте нужные запчасти из каталога."}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <PackageOpen className="mx-auto h-12 w-12 text-[#FFC000]" aria-hidden="true" />
              <p className="mt-4 text-lg font-bold">Корзина пока пуста</p>
              <p className="mt-2 text-sm leading-6 text-gray-400">Ищите по OEM, модели техники или типу узла.</p>
              <SheetClose asChild>
                <Link href="/catalog" className="mt-6 inline-flex min-h-12 items-center rounded bg-[#FFC000] px-5 font-extrabold text-black">Перейти в каталог</Link>
              </SheetClose>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              {items.map((item) => <CartItemRow key={item.id} item={item} compact />)}
            </div>
            <div className="border-t border-white/10 bg-[#151515] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-end justify-between gap-4">
                <span className="text-sm text-gray-400">Подтверждённая сумма</span>
                <strong className="text-2xl text-[#FFC000]">{formatKzt(summary.totalKzt)}</strong>
              </div>
              {summary.quoteLineCount > 0 && <p className="mt-2 text-xs leading-5 text-gray-400">Для {summary.quoteLineCount} поз. цена будет рассчитана после проверки исполнения.</p>}
              <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC000]" aria-hidden="true" />
                Оплата станет доступна только после серверной проверки состава и суммы заказа.
              </div>
              <SheetClose asChild>
                <Link href="/checkout" className="mt-4 flex min-h-12 w-full items-center justify-center rounded bg-[#FFC000] px-5 font-extrabold text-black hover:bg-[#E6AC00]">Оформить заказ</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/cart" className="mt-2 flex min-h-11 w-full items-center justify-center text-sm font-bold text-white underline underline-offset-4">Открыть корзину</Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { ImageIcon, Trash2 } from "lucide-react";
import { Link } from "wouter";

import { QuantityControl } from "@/components/cart/QuantityControl";
import { useCart } from "@/contexts/CartContext";
import { formatKzt, type CartItem } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function CartItemRow({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { setQuantity, removeItem, setDrawerOpen } = useCart();
  const lineTotal = item.unitPriceKzt === null ? null : item.unitPriceKzt * item.quantity;
  return (
    <article className={cn("grid gap-4 border-b border-white/10 py-5", compact ? "grid-cols-[72px_1fr]" : "grid-cols-[88px_1fr] md:grid-cols-[112px_1fr_auto]")}>
      <Link
        href={`/catalog/${item.productHandle}`}
        onClick={() => setDrawerOpen(false)}
        className={cn("grid overflow-hidden rounded border border-white/10 bg-white", compact ? "h-[72px]" : "h-[88px] md:h-28")}
        aria-label={`Открыть товар: ${item.title}`}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" loading="lazy" className="h-full w-full object-contain p-1.5" />
        ) : (
          <ImageIcon className="m-auto h-7 w-7 text-gray-400" aria-hidden="true" />
        )}
      </Link>
      <div className="min-w-0">
        <Link href={`/catalog/${item.productHandle}`} onClick={() => setDrawerOpen(false)} className="line-clamp-2 font-bold leading-snug text-white hover:text-[#FFC000]">
          {item.title}
        </Link>
        {item.variantTitle && <p className="mt-1 line-clamp-1 text-xs text-gray-400">{item.variantTitle}</p>}
        <p className="mt-1 text-xs text-gray-500">SKU: {item.sku}</p>
        <p className="mt-2 font-extrabold text-[#FFC000]">
          {lineTotal === null ? "Цена после проверки" : formatKzt(lineTotal)}
        </p>
        {compact && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <QuantityControl quantity={item.quantity} itemName={item.title} onChange={(quantity) => setQuantity(item.id, quantity)} />
            <button type="button" onClick={() => removeItem(item.id)} className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-400 underline underline-offset-4 hover:text-white">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Удалить
            </button>
          </div>
        )}
      </div>
      {!compact && (
        <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 md:col-span-1 md:flex-col md:items-end">
          <QuantityControl quantity={item.quantity} itemName={item.title} onChange={(quantity) => setQuantity(item.id, quantity)} />
          <button type="button" onClick={() => removeItem(item.id)} className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-400 underline underline-offset-4 hover:text-white">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Удалить
          </button>
        </div>
      )}
    </article>
  );
}

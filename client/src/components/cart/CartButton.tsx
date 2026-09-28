import { ShoppingCart } from "lucide-react";

import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

export function CartButton({ className, label = "Корзина" }: { className?: string; label?: string }) {
  const { summary, setDrawerOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      className={cn(
        "relative inline-flex min-h-11 items-center justify-center gap-2 rounded border border-white/15 px-3 font-bold text-white transition-colors hover:border-[#FFC000] hover:text-[#FFC000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]",
        className,
      )}
      aria-label={`${label}: ${summary.itemCount} товаров`}
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
      {summary.itemCount > 0 && (
        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#FFC000] px-1 text-[11px] font-extrabold leading-none text-black" aria-hidden="true">
          {summary.itemCount > 99 ? "99+" : summary.itemCount}
        </span>
      )}
    </button>
  );
}

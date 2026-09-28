import { Minus, Plus } from "lucide-react";

import { MAX_CART_QUANTITY } from "@/lib/cart";

type QuantityControlProps = {
  quantity: number;
  itemName: string;
  onChange: (quantity: number) => void;
};

export function QuantityControl({ quantity, itemName, onChange }: QuantityControlProps) {
  return (
    <div className="inline-grid grid-cols-[44px_48px_44px] items-center overflow-hidden rounded border border-white/15" aria-label={`Количество: ${itemName}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="grid h-11 place-items-center text-gray-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Уменьшить количество: ${itemName}`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="grid h-11 place-items-center border-x border-white/15 text-sm font-bold" aria-live="polite">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_CART_QUANTITY, quantity + 1))}
        disabled={quantity >= MAX_CART_QUANTITY}
        className="grid h-11 place-items-center text-gray-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Увеличить количество: ${itemName}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button, Lucide } from "@repo/ui";
import { useRegister } from "@/lib/store";

const { Plus, Minus, X } = Lucide;

const TAX_RATE = 0.16;

export default function SaleTicket({ subdomain }: { subdomain: string }) {
  const items = useRegister((state) => state.items);
  const incrementQty = useRegister((state) => state.incrementQty);
  const decrementQty = useRegister((state) => state.decrementQty);
  const removeItem = useRegister((state) => state.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return (
    <div className="bg-surface rounded-2xl border border-primary/10 p-6 flex flex-col h-full">
      <h2 className="text-lg font-bebas text-text tracking-wide mb-4">
        Current Sale
      </h2>

      {items.length === 0 ? (
        <p className="text-muted text-sm flex-1">
          Tap a product to add it to this sale.
        </p>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-2 border-b border-input-bg pb-3"
            >
              <div className="min-w-0">
                <p className="text-sm text-text truncate">{item.name}</p>
                <p className="text-xs text-muted">
                  KES {item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${item.name}`}
                  onClick={() => decrementQty(item.productId)}
                  className="p-1 rounded bg-inputBg text-text cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm text-text w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${item.name}`}
                  onClick={() => incrementQty(item.productId)}
                  className="p-1 rounded bg-inputBg text-text cursor-pointer"
                >
                  <Plus size={12} />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from sale`}
                  onClick={() => removeItem(item.productId)}
                  className="p-1 rounded text-muted hover:text-text cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-input-bg space-y-1 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax (16%)</span>
          <span>KES {tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-text font-bold text-base">
          <span>Total</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <Button variant="accent" disabled className="w-full mt-4 opacity-50">
          Charge
        </Button>
      ) : (
        <Link href={`/register/${subdomain}/payment`} className="block mt-4">
          <Button variant="accent" className="w-full">
            Charge
          </Button>
        </Link>
      )}
    </div>
  );
}

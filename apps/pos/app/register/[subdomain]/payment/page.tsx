"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { useRegister } from "@/lib/store";

const METHODS = [
  { key: "cash", label: "Cash" },
  { key: "card", label: "Card" },
  { key: "mpesa", label: "M-Pesa" },
] as const;

export default function PaymentPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const router = useRouter();
  const items = useRegister((state) => state.items);
  const completeSale = useRegister((state) => state.completeSale);
  const [method, setMethod] = useState<"cash" | "card" | "mpesa">("cash");
  const [isCompleting, setIsCompleting] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;

  const handleComplete = () => {
    setIsCompleting(true);
    // Stand-in for real payment processing (M-Pesa STK push, card terminal,
    // etc.) — completeSale() just snapshots the sale and clears the
    // register, same honesty level as apps/clearracks' checkout flow.
    completeSale(method);
    router.push(`/register/${subdomain}/receipt`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md">
        <p className="text-muted">
          There&apos;s no active sale to charge. Add items from the register
          first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h2 className="text-2xl font-bebas text-text mb-6">Take Payment</h2>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 mb-6">
        <div className="flex justify-between text-text font-bold text-lg">
          <span>Total Due</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMethod(m.key)}
            className={`py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              method === m.key
                ? "bg-primary text-white"
                : "bg-inputBg text-text hover:bg-surface"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Button
        variant="accent"
        onClick={handleComplete}
        disabled={isCompleting}
        className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isCompleting ? "Completing..." : "Complete Sale"}
      </Button>
    </div>
  );
}

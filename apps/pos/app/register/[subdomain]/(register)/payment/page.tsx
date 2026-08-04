"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { useRegister } from "@/lib/store";
import { submitSale } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";

const METHODS = [
  { key: "cash", label: "Cash" },
  { key: "card", label: "Card" },
  { key: "mpesa", label: "M-Pesa" },
] as const;

const PAYMENT_METHOD_API = {
  cash: "Cash",
  card: "Card",
  mpesa: "Mpesa",
} as const;

export default function PaymentPage() {
  const router = useRouter();
  const items = useRegister((state) => state.items);
  const clearItems = useRegister((state) => state.clearItems);
  const [method, setMethod] = useState<"cash" | "card" | "mpesa">("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [error, setError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;

  const handleComplete = async () => {
    const merchantId = getMerchantId();
    if (!merchantId) {
      setError("Couldn't determine your merchant account. Please log in again.");
      return;
    }
    setError("");
    setIsCompleting(true);
    try {
      const result = await submitSale({
        merchantId,
        customerName: customerName || "Walk-in Customer",
        customerPhone,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: PAYMENT_METHOD_API[method],
      });
      clearItems();
      router.push(`/receipt?orderId=${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale failed.");
    } finally {
      setIsCompleting(false);
    }
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

      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name (optional)"
          className="w-full bg-inputBg border border-primary/10 rounded-lg p-3 text-sm text-text outline-none focus:border-accent"
        />
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Customer phone (optional)"
          className="w-full bg-inputBg border border-primary/10 rounded-lg p-3 text-sm text-text outline-none focus:border-accent"
        />
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

      {error && <p className="text-sm text-rose-400 mb-4">{error}</p>}

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

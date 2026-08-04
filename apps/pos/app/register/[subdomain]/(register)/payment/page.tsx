"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Lucide } from "@repo/ui";
import type { PosPaymentInput } from "@repo/types";
import { useRegister } from "@/lib/store";
import { checkoutCart, useCart } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";

const { X } = Lucide;

const METHODS: PosPaymentInput["method"][] = ["Cash", "Card", "Mpesa"];

interface PaymentLine {
  method: PosPaymentInput["method"];
  amount: string;
  referenceNumber: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const merchantId = getMerchantId();
  const cartId = useRegister((state) => state.cartId);
  const clearCartId = useRegister((state) => state.clearCartId);
  const { data: cart } = useCart(merchantId, cartId);

  const [lines, setLines] = useState<PaymentLine[]>([]);
  const [newMethod, setNewMethod] = useState<PosPaymentInput["method"]>("Cash");
  const [newAmount, setNewAmount] = useState("");
  const [newReference, setNewReference] = useState("");
  const [error, setError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const total = cart?.total ?? 0;
  const tendered = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const remaining = total - tendered;

  const addLine = () => {
    if (!newAmount || Number(newAmount) <= 0) return;
    setLines((prev) => [
      ...prev,
      { method: newMethod, amount: newAmount, referenceNumber: newReference },
    ]);
    setNewAmount("");
    setNewReference("");
  };

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (!merchantId || cartId === null) {
      setError("Couldn't determine your merchant account. Please log in again.");
      return;
    }
    setError("");
    setIsCompleting(true);
    try {
      const result = await checkoutCart(
        merchantId,
        cartId,
        lines.map((l) => ({
          method: l.method,
          amount: Number(l.amount),
          referenceNumber: l.referenceNumber || undefined,
        })),
      );
      clearCartId();
      router.push(`/receipt?orderId=${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sale failed.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
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

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 mb-6 space-y-1">
        <div className="flex justify-between text-muted text-sm">
          <span>Subtotal</span>
          <span>KES {cart.subtotal.toLocaleString()}</span>
        </div>
        {cart.discountType && (
          <div className="flex justify-between text-muted text-sm">
            <span>Discount</span>
            <span>-KES {cart.discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-text font-bold text-lg pt-1">
          <span>Total Due</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
      </div>

      {lines.length > 0 && (
        <div className="space-y-2 mb-4">
          {lines.map((line, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-inputBg rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-text">
                {line.method} — KES {Number(line.amount).toLocaleString()}
                {line.referenceNumber ? ` (${line.referenceNumber})` : ""}
              </span>
              <button
                type="button"
                onClick={() => removeLine(index)}
                className="text-muted hover:text-text cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-primary/10 p-4 mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Remaining</span>
          <span
            className={remaining > 0 ? "text-text font-bold" : "text-accent font-bold"}
          >
            KES {remaining.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setNewMethod(m)}
              className={`py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                newMethod === m
                  ? "bg-primary text-white"
                  : "bg-inputBg text-text hover:bg-surface"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Amount"
            className="flex-1 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text outline-none focus:border-accent"
          />
          {newMethod === "Mpesa" && (
            <input
              type="text"
              value={newReference}
              onChange={(e) => setNewReference(e.target.value)}
              placeholder="Reference"
              className="flex-1 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text outline-none focus:border-accent"
            />
          )}
          <button
            type="button"
            onClick={addLine}
            disabled={!newAmount}
            className="px-4 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-rose-400 mb-4">{error}</p>}

      <Button
        variant="accent"
        onClick={handleComplete}
        disabled={isCompleting || remaining > 0 || lines.length === 0}
        className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isCompleting ? "Completing..." : "Complete Sale"}
      </Button>
    </div>
  );
}

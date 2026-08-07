"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Lucide } from "@repo/ui";
import type { PosDiscountInput } from "@repo/types";
import {
  applyCartDiscount,
  overridePrice,
  removeCartDiscount,
  removeCartItem,
  updateCartItemQty,
  useCart,
} from "@/lib/posApi";
import { useCurrentUser } from "@/lib/auth";
import { useRegister } from "@/lib/store";

const { Plus, Minus, X } = Lucide;

export default function SaleTicket({ merchantId }: { merchantId: number }) {
  const cartId = useRegister((state) => state.cartId);
  const { data: cart } = useCart(merchantId, cartId);
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] =
    useState<PosDiscountInput["discountType"]>("Percentage");
  const [discountSubmitting, setDiscountSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [overrideItemId, setOverrideItemId] = useState<number | null>(null);
  const [overridePriceValue, setOverridePriceValue] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);

  const setCart = (updated: typeof cart) => {
    if (cartId !== null) {
      queryClient.setQueryData(["pos-cart", merchantId, cartId], updated);
    }
  };

  const handleQtyChange = async (itemId: number, quantity: number) => {
    if (cartId === null) return;
    setError("");
    setPendingItemId(itemId);
    try {
      const updated = await updateCartItemQty(
        merchantId,
        cartId,
        itemId,
        quantity,
      );
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update that item.");
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemove = async (itemId: number) => {
    if (cartId === null) return;
    setError("");
    setPendingItemId(itemId);
    try {
      const updated = await removeCartItem(merchantId, cartId, itemId);
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't remove that item.");
    } finally {
      setPendingItemId(null);
    }
  };

  const handleApplyDiscount = async () => {
    if (cartId === null || !discountValue) return;
    setError("");
    setDiscountSubmitting(true);
    try {
      const updated = await applyCartDiscount(merchantId, cartId, {
        discountType,
        discountValue: Number(discountValue),
      });
      setCart(updated);
      setDiscountValue("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't apply that discount.",
      );
    } finally {
      setDiscountSubmitting(false);
    }
  };

  const startOverride = (itemId: number, currentPrice: number) => {
    setOverrideItemId(itemId);
    setOverridePriceValue(String(currentPrice));
    setOverrideReason("");
    setError("");
  };

  const handleApplyOverride = async () => {
    if (overrideItemId === null || !overridePriceValue) return;
    setError("");
    setOverrideSubmitting(true);
    try {
      const updated = await overridePrice(
        merchantId,
        overrideItemId,
        Number(overridePriceValue),
        overrideReason || undefined,
      );
      setCart(updated);
      setOverrideItemId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't override that price.",
      );
    } finally {
      setOverrideSubmitting(false);
    }
  };

  const handleRemoveDiscount = async () => {
    if (cartId === null) return;
    setError("");
    setDiscountSubmitting(true);
    try {
      const updated = await removeCartDiscount(merchantId, cartId);
      setCart(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't remove the discount.",
      );
    } finally {
      setDiscountSubmitting(false);
    }
  };

  const items = cart?.items ?? [];

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
            <div key={item.id} className="border-b border-input-bg pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-text truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted">
                    KES {item.unitPrice.toLocaleString()}
                    {user?.appRole === "Merchant" && (
                      <button
                        type="button"
                        onClick={() => startOverride(item.id, item.unitPrice)}
                        className="ml-2 text-accent underline"
                      >
                        Override
                      </button>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.productName}`}
                    disabled={pendingItemId === item.id}
                    onClick={() =>
                      item.quantity > 1
                        ? handleQtyChange(item.id, item.quantity - 1)
                        : handleRemove(item.id)
                    }
                    className="p-1 rounded bg-inputBg text-text cursor-pointer disabled:opacity-50"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm text-text w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.productName}`}
                    disabled={pendingItemId === item.id}
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-inputBg text-text cursor-pointer disabled:opacity-50"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${item.productName} from sale`}
                    disabled={pendingItemId === item.id}
                    onClick={() => handleRemove(item.id)}
                    className="p-1 rounded text-muted hover:text-text cursor-pointer disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {overrideItemId === item.id && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={overridePriceValue}
                    onChange={(e) => setOverridePriceValue(e.target.value)}
                    className="bg-inputBg text-text rounded px-2 py-1 text-xs w-20"
                  />
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Reason"
                    className="bg-inputBg text-text rounded px-2 py-1 text-xs flex-1"
                  />
                  <button
                    type="button"
                    disabled={overrideSubmitting || !overridePriceValue}
                    onClick={handleApplyOverride}
                    className="text-accent text-xs font-bold disabled:opacity-50"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverrideItemId(null)}
                    className="text-muted text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-input-bg">
        {cart && cart.discountType ? (
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted">
              Discount ({cart.discountType} {cart.discountValue})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text">
                -KES {cart.discountAmount.toLocaleString()}
              </span>
              <button
                type="button"
                disabled={discountSubmitting}
                onClick={handleRemoveDiscount}
                className="text-muted hover:text-text cursor-pointer disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          items.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(
                    e.target.value as PosDiscountInput["discountType"],
                  )
                }
                className="bg-inputBg text-text rounded px-2 py-1 text-xs"
              >
                <option value="Percentage">%</option>
                <option value="FixedAmount">KES</option>
              </select>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="Discount"
                className="bg-inputBg text-text rounded px-2 py-1 text-xs w-20"
              />
              <button
                type="button"
                disabled={discountSubmitting || !discountValue}
                onClick={handleApplyDiscount}
                className="text-accent text-xs font-bold disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )
        )}

        {error && <p className="text-xs text-rose-400 mb-2">{error}</p>}

        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>KES {(cart?.subtotal ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-text font-bold text-base">
            <span>Total</span>
            <span>KES {(cart?.total ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <Button variant="accent" disabled className="w-full mt-4 opacity-50">
          Charge
        </Button>
      ) : (
        <Link href="/payment" className="block mt-4">
          <Button variant="accent" className="w-full">
            Charge
          </Button>
        </Link>
      )}
    </div>
  );
}

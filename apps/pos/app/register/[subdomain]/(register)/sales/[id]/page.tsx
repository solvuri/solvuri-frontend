"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Lucide } from "@repo/ui";
import { exchangeSale, refundSale, useCatalogProducts, useSale, voidSale } from "@/lib/posApi";
import { getMerchantId, useCurrentUser } from "@/lib/auth";
import type { ExchangeNewItemInput, RefundLineInput } from "@repo/types";

const { ChevronLeft, Receipt } = Lucide;

const FIELD_CLASS =
  "w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text";

type ActionMode = null | "void" | "refund" | "exchange";

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id } = use(params);
  const merchantId = getMerchantId();
  const user = useCurrentUser();
  const saleId = Number(id);
  const { data: sale, isLoading, error, refetch } = useSale(merchantId, saleId);
  const { data: products } = useCatalogProducts(merchantId);

  const [mode, setMode] = useState<ActionMode>(null);
  const [actionError, setActionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultNote, setResultNote] = useState("");

  const [voidReason, setVoidReason] = useState("");

  const [isFullRefund, setIsFullRefund] = useState(true);
  const [refundReason, setRefundReason] = useState("");
  const [refundQuantities, setRefundQuantities] = useState<
    Record<number, string>
  >({});

  const [returnQuantities, setReturnQuantities] = useState<
    Record<number, string>
  >({});
  const [exchangeNewItems, setExchangeNewItems] = useState<
    ExchangeNewItemInput[]
  >([]);
  const [newItemProductId, setNewItemProductId] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");

  if (isLoading) {
    return <p className="text-muted text-sm">Loading sale...</p>;
  }

  if (error || !sale) {
    return <p className="text-sm text-rose-400">Couldn&apos;t find this sale.</p>;
  }

  const alreadyVoided = sale.status.toLowerCase().includes("void");
  const isOwner = user?.appRole === "Merchant";

  const openMode = (next: ActionMode) => {
    setMode(next);
    setActionError("");
    setResultNote("");
    setVoidReason("");
    setIsFullRefund(true);
    setRefundReason("");
    setRefundQuantities({});
    setReturnQuantities({});
    setExchangeNewItems([]);
    setNewItemProductId("");
    setNewItemQuantity("");
  };

  const buildRefundLines = (
    quantities: Record<number, string>,
  ): RefundLineInput[] =>
    Object.entries(quantities)
      .map(([orderItemId, quantity]) => ({
        orderItemId: Number(orderItemId),
        quantity: Number(quantity),
      }))
      .filter((line) => line.quantity > 0);

  const handleVoid = async () => {
    if (!merchantId) return;
    setActionError("");
    setSubmitting(true);
    try {
      await voidSale(saleId, {
        merchantId,
        ...(voidReason && { reason: voidReason }),
      });
      setResultNote("Sale voided.");
      setMode(null);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't void this sale.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefund = async () => {
    if (!merchantId) return;
    const items = isFullRefund ? undefined : buildRefundLines(refundQuantities);
    if (!isFullRefund && (!items || items.length === 0)) {
      setActionError("Enter a quantity for at least one line.");
      return;
    }
    setActionError("");
    setSubmitting(true);
    try {
      await refundSale(saleId, {
        merchantId,
        isFullRefund,
        ...(refundReason && { reason: refundReason }),
        ...(items && { items }),
      });
      setResultNote(isFullRefund ? "Sale fully refunded." : "Partial refund processed.");
      setMode(null);
      await refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Couldn't process this refund.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const addNewItem = () => {
    if (!newItemProductId || !newItemQuantity) return;
    setExchangeNewItems((prev) => [
      ...prev,
      { productId: Number(newItemProductId), quantity: Number(newItemQuantity) },
    ]);
    setNewItemProductId("");
    setNewItemQuantity("");
  };

  const removeNewItem = (index: number) => {
    setExchangeNewItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExchange = async () => {
    if (!merchantId) return;
    const returnItems = buildRefundLines(returnQuantities);
    if (returnItems.length === 0 && exchangeNewItems.length === 0) {
      setActionError("Add at least one returned line or one new item.");
      return;
    }
    setActionError("");
    setSubmitting(true);
    try {
      const result = await exchangeSale(saleId, {
        merchantId,
        ...(returnItems.length > 0 && { returnItems }),
        ...(exchangeNewItems.length > 0 && { newItems: exchangeNewItems }),
      });
      setResultNote(
        result.netAmountDue > 0
          ? `Exchange processed — customer owes KES ${result.netAmountDue.toLocaleString()} more (collect separately).`
          : result.netAmountDue < 0
            ? `Exchange processed — customer is owed KES ${Math.abs(result.netAmountDue).toLocaleString()} (refund separately).`
            : "Exchange processed — no balance due either way.",
      );
      setMode(null);
      await refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Couldn't process this exchange.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/sales"
          aria-label="Back to sales history"
          className="p-2 bg-surface border border-primary/10 rounded-lg"
        >
          <ChevronLeft size={20} className="text-text" />
        </Link>
        <h1 className="text-xl font-bebas text-text">Sale #{sale.id}</h1>
      </div>

      <section className="bg-surface p-6 rounded-2xl border border-primary/10 mb-4">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
          <Receipt size={18} /> Items
        </h3>
        {sale.items.map((item) => (
          <div
            key={item.orderItemId}
            className="flex justify-between text-sm py-2 text-muted"
          >
            <span>
              {item.productName} <span>x{item.quantity}</span>
            </span>
            <span className="font-bold text-text">
              KES {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-input-bg pt-4 space-y-2 text-sm text-muted">
          <div className="flex justify-between font-bold text-lg text-text pt-2">
            <span>Total</span>
            <span>KES {sale.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="bg-surface p-6 rounded-2xl border border-primary/10 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Customer</span>
          <span className="text-text">{sale.customerName}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted">Status</span>
          <span className="text-text">{sale.status}</span>
        </div>
        {sale.payments.map((payment) => (
          <div key={payment.id} className="flex justify-between text-sm mt-2">
            <span className="text-muted capitalize">{payment.method}</span>
            <span className="text-text">
              KES {payment.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </section>

      {resultNote && (
        <p className="text-sm text-emerald-400 mb-4">{resultNote}</p>
      )}

      {!alreadyVoided && (
        <section className="bg-surface p-6 rounded-2xl border border-primary/10 space-y-3">
          <h3 className="text-sm font-bold text-text">Sale Actions</h3>

          {mode === null && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openMode("refund")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
              >
                Refund
              </button>
              <button
                type="button"
                onClick={() => openMode("exchange")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
              >
                Exchange
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => openMode("void")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-rose-400"
                >
                  Void Sale
                </button>
              )}
            </div>
          )}

          {mode === "void" && (
            <div className="space-y-3">
              <p className="text-xs text-muted">
                Fully reverses this sale: every line is restocked and every
                payment is reversed. This cannot be undone.
              </p>
              <input
                type="text"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Reason (optional)"
                className={FIELD_CLASS}
              />
              {actionError && (
                <p className="text-xs text-rose-400">{actionError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleVoid}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white disabled:opacity-50"
                >
                  {submitting ? "Voiding..." : "Confirm Void"}
                </button>
              </div>
            </div>
          )}

          {mode === "refund" && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  checked={isFullRefund}
                  onChange={(e) => setIsFullRefund(e.target.checked)}
                />
                Full refund
              </label>
              {!isFullRefund && (
                <div className="space-y-2">
                  {sale.items.map((item) => (
                    <div
                      key={item.orderItemId}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="text-muted flex-1">
                        {item.productName} (max {item.quantity})
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={item.quantity}
                        value={refundQuantities[item.orderItemId] ?? ""}
                        onChange={(e) =>
                          setRefundQuantities((prev) => ({
                            ...prev,
                            [item.orderItemId]: e.target.value,
                          }))
                        }
                        className="w-20 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
                      />
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Reason (optional)"
                className={FIELD_CLASS}
              />
              {actionError && (
                <p className="text-xs text-rose-400">{actionError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleRefund}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </div>
          )}

          {mode === "exchange" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-muted">Return quantities</p>
                {sale.items.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-muted flex-1">
                      {item.productName} (max {item.quantity})
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={item.quantity}
                      value={returnQuantities[item.orderItemId] ?? ""}
                      onChange={(e) =>
                        setReturnQuantities((prev) => ({
                          ...prev,
                          [item.orderItemId]: e.target.value,
                        }))
                      }
                      className="w-20 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted">New items</p>
                {exchangeNewItems.map((item, index) => {
                  const product = products?.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="text-text flex-1">
                        {product?.productName ?? `Product #${item.productId}`} x
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewItem(index)}
                        className="text-rose-400 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                <div className="flex gap-2">
                  <select
                    value={newItemProductId}
                    onChange={(e) => setNewItemProductId(e.target.value)}
                    className={FIELD_CLASS}
                  >
                    <option value="">Select product...</option>
                    {(products ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.productName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="Qty"
                    className="w-20 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
                  />
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
                  >
                    Add
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted">
                Any balance due is shown after processing — it isn&apos;t
                collected or refunded automatically.
              </p>
              {actionError && (
                <p className="text-xs text-rose-400">{actionError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleExchange}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Confirm Exchange"}
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

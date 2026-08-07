"use client";

import { useState } from "react";
import { getMerchantId, useCurrentUser } from "@/lib/auth";
import {
  bulkUpdatePrices,
  useCatalogProducts,
  usePriceHistory,
} from "@/lib/posApi";

export default function PricingPage() {
  const merchantId = getMerchantId();
  const user = useCurrentUser();
  const { data: products } = useCatalogProducts(merchantId);
  const {
    data: history,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = usePriceHistory(merchantId);

  const [prices, setPrices] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultNote, setResultNote] = useState("");

  if (user && user.appRole !== "Merchant") {
    return (
      <p className="text-sm text-rose-400">
        Pricing is only available to the merchant owner.
      </p>
    );
  }

  const handleSave = async () => {
    if (!merchantId) return;
    const updates = Object.entries(prices)
      .map(([productId, newPrice]) => ({
        productId: Number(productId),
        newPrice: Number(newPrice),
      }))
      .filter((u) => !Number.isNaN(u.newPrice) && u.newPrice > 0);
    if (updates.length === 0) {
      setError("Change at least one price first.");
      return;
    }
    setError("");
    setResultNote("");
    setSubmitting(true);
    try {
      const result = await bulkUpdatePrices(merchantId, updates);
      setResultNote(`Updated ${result.updatedCount} product price(s).`);
      setPrices({});
      await refetchHistory();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't update prices.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-bebas text-text">Pricing</h2>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Bulk Price Update</h3>
        {!products || products.length === 0 ? (
          <p className="text-muted text-sm">No products yet.</p>
        ) : (
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Current Price</th>
                <th className="pb-2 font-medium text-right">New Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">{product.productName}</td>
                  <td className="py-2 text-muted text-right">
                    KES {product.price.toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      value={prices[product.id] ?? ""}
                      onChange={(e) =>
                        setPrices((prev) => ({
                          ...prev,
                          [product.id]: e.target.value,
                        }))
                      }
                      placeholder={String(product.price)}
                      className="w-28 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <p className="text-sm text-rose-400 mb-2">{error}</p>}
        {resultNote && (
          <p className="text-sm text-emerald-400 mb-2">{resultNote}</p>
        )}
        <button
          type="button"
          disabled={submitting}
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Price Changes"}
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Price Change History</h3>
        {historyLoading && <p className="text-muted text-sm">Loading...</p>}
        {!historyLoading && (!history || history.length === 0) && (
          <p className="text-muted text-sm">No price changes recorded yet.</p>
        )}
        {!historyLoading && history && history.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Old Price</th>
                <th className="pb-2 font-medium text-right">New Price</th>
                <th className="pb-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">{entry.productName}</td>
                  <td className="py-2 text-muted text-right">
                    KES {entry.oldPrice.toLocaleString()}
                  </td>
                  <td className="py-2 text-text text-right">
                    KES {entry.newPrice.toLocaleString()}
                  </td>
                  <td className="py-2 text-muted">{entry.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

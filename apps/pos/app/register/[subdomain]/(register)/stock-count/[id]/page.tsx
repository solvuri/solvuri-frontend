"use client";

import { use } from "react";
import Link from "next/link";
import { getMerchantId } from "@/lib/auth";
import { useStockCountSession } from "@/lib/posApi";

export default function StockCountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const sessionId = Number(id);
  const merchantId = getMerchantId();
  const { data: session, isLoading, error } = useStockCountSession(
    merchantId,
    sessionId,
  );

  if (isLoading) {
    return <p className="text-muted text-sm">Loading count session...</p>;
  }

  if (error || !session) {
    return (
      <p className="text-sm text-rose-400">
        Couldn&apos;t find this count session.
      </p>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link
        href="/stock-count"
        className="text-sm text-muted hover:text-text"
      >
        &larr; Back to Stock Count
      </Link>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bebas text-text">
            Count #{session.id}
          </h2>
          <span className="text-xs text-muted">{session.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Started</span>
          <span className="text-text">
            {new Date(session.startedAt).toLocaleString()}
          </span>
        </div>
        {session.completedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">Completed</span>
            <span className="text-text">
              {new Date(session.completedAt).toLocaleString()}
            </span>
          </div>
        )}
        {session.notes && (
          <p className="text-xs text-muted">{session.notes}</p>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Items</h3>
        {session.items.length === 0 ? (
          <p className="text-muted text-sm">No items were scanned.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">System Qty</th>
                <th className="pb-2 font-medium text-right">Counted Qty</th>
                <th className="pb-2 font-medium text-right">Variance</th>
              </tr>
            </thead>
            <tbody>
              {session.items.map((item) => (
                <tr
                  key={item.productId}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">{item.productName}</td>
                  <td className="py-2 text-muted text-right">
                    {item.systemQuantity}
                  </td>
                  <td className="py-2 text-text text-right">
                    {item.countedQuantity}
                  </td>
                  <td
                    className={`py-2 text-right font-bold ${
                      item.variance === 0
                        ? "text-muted"
                        : item.variance < 0
                          ? "text-rose-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {item.variance > 0 ? `+${item.variance}` : item.variance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

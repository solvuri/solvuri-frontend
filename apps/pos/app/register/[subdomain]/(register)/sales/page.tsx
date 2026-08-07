"use client";

import Link from "next/link";
import { useSales } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-emerald-500/15 text-emerald-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Failed: "bg-rose-500/15 text-rose-400",
};

export default function SalesHistoryPage() {
  const merchantId = getMerchantId();
  const { data: sales, isLoading, error } = useSales(merchantId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bebas text-text">Sales History</h2>
        <Link href="/" className="text-sm text-accent">
          Back to Register
        </Link>
      </div>

      {isLoading && <p className="text-muted text-sm">Loading sales...</p>}
      {error && (
        <p className="text-sm text-rose-400">Couldn&apos;t load sales.</p>
      )}
      {sales && sales.length === 0 && (
        <p className="text-muted text-sm">No sales yet.</p>
      )}

      {sales && sales.length > 0 && (
        <div className="bg-surface rounded-2xl border border-primary/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="p-4 font-medium">Sale</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="p-4 text-text">
                    <Link href={`/sales/${sale.id}`} className="hover:underline">
                      #{sale.id}
                    </Link>
                  </td>
                  <td className="p-4 text-muted">{sale.customerName}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[sale.status] ?? "bg-muted/15 text-muted"}`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-4 text-text text-right">
                    KES {sale.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

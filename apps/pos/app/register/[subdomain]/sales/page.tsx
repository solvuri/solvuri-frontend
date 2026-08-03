"use client";

import { use } from "react";
import Link from "next/link";
import { useSales } from "@repo/data";

const METHOD_STYLES: Record<string, string> = {
  cash: "bg-emerald-500/15 text-emerald-400",
  card: "bg-sky-500/15 text-sky-400",
  mpesa: "bg-amber-500/15 text-amber-400",
};

export default function SalesHistoryPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const { data: sales, isLoading, error } = useSales();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bebas text-text">Sales History</h2>
        <Link href={`/register/${subdomain}`} className="text-sm text-accent">
          Back to Register
        </Link>
      </div>

      {isLoading && <p className="text-muted text-sm">Loading sales...</p>}
      {error && (
        <p className="text-sm text-rose-400">Couldn&apos;t load sales.</p>
      )}

      {sales && (
        <div className="bg-surface rounded-2xl border border-primary/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="p-4 font-medium">Sale</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Payment</th>
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
                    <Link
                      href={`/register/${subdomain}/sales/${sale.id}`}
                      className="hover:underline"
                    >
                      {sale.id}
                    </Link>
                  </td>
                  <td className="p-4 text-muted">
                    {sale.items.length} item
                    {sale.items.length === 1 ? "" : "s"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${METHOD_STYLES[sale.paymentMethod] ?? "bg-muted/15 text-muted"}`}
                    >
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4 text-text text-right">
                    KES {sale.total.toLocaleString()}
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

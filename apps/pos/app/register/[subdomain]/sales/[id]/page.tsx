"use client";

import { use } from "react";
import Link from "next/link";
import { Lucide } from "@repo/ui";
import { useSale } from "@repo/data";

const { ChevronLeft, Receipt } = Lucide;

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { subdomain, id } = use(params);
  const { data: sale, isLoading, error } = useSale(id);

  if (isLoading) {
    return <p className="text-muted text-sm">Loading sale...</p>;
  }

  if (error || !sale) {
    return <p className="text-sm text-rose-400">Couldn&apos;t find this sale.</p>;
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/register/${subdomain}/sales`}
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
            key={item.productId}
            className="flex justify-between text-sm py-2 text-muted"
          >
            <span>
              {item.name} <span>x{item.quantity}</span>
            </span>
            <span className="font-bold text-text">
              KES {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-input-bg pt-4 space-y-2 text-sm text-muted">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>KES {sale.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>KES {sale.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-text pt-2 border-t border-input-bg">
            <span>Total</span>
            <span>KES {sale.total.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="bg-surface p-6 rounded-2xl border border-primary/10">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Payment method</span>
          <span className="text-text capitalize">{sale.paymentMethod}</span>
        </div>
        {sale.cashierName && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted">Cashier</span>
            <span className="text-text">{sale.cashierName}</span>
          </div>
        )}
      </section>
    </div>
  );
}

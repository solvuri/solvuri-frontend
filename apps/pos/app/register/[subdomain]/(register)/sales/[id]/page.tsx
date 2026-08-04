"use client";

import { use } from "react";
import Link from "next/link";
import { Lucide } from "@repo/ui";
import { useSale } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";

const { ChevronLeft, Receipt } = Lucide;

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { id } = use(params);
  const merchantId = getMerchantId();
  const saleId = Number(id);
  const { data: sale, isLoading, error } = useSale(merchantId, saleId);

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

      <section className="bg-surface p-6 rounded-2xl border border-primary/10">
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
    </div>
  );
}

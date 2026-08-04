"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Lucide } from "@repo/ui";
import { useReceipt } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";

const { CheckCircle2 } = Lucide;

function ReceiptContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const merchantId = getMerchantId();
  const saleId = orderId ? Number(orderId) : null;
  const { data: receipt, isLoading, error } = useReceipt(merchantId, saleId);

  if (!saleId) {
    return (
      <div className="max-w-md">
        <p className="text-muted">
          No recent sale to show.{" "}
          <Link href="/" className="text-accent">
            Back to register
          </Link>
          .
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-muted text-sm">Loading receipt...</p>;
  }

  if (error || !receipt) {
    return (
      <p className="text-sm text-rose-400">Couldn&apos;t load this receipt.</p>
    );
  }

  return (
    <div className="max-w-md">
      <div className="flex flex-col items-center text-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-accent mb-3" />
        <h2 className="text-2xl font-bebas text-text">Sale Complete</h2>
        <p className="text-muted text-sm">Sale #{receipt.saleId}</p>
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 mb-6">
        <div className="space-y-2 mb-4">
          {receipt.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-muted"
            >
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>KES {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-input-bg pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>KES {receipt.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-text font-bold text-base">
            <span>Total</span>
            <span>KES {receipt.totalAmount.toLocaleString()}</span>
          </div>
          {receipt.payments.map((payment, index) => (
            <div key={index} className="flex justify-between text-muted">
              <span className="capitalize">{payment.method}</span>
              <span>KES {payment.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button variant="secondary" className="w-full">
            New Sale
          </Button>
        </Link>
        <Link href="/sales" className="flex-1">
          <Button variant="accent" className="w-full">
            Sales History
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<p className="text-muted text-sm">Loading...</p>}>
      <ReceiptContent />
    </Suspense>
  );
}

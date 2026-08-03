"use client";

import { use } from "react";
import Link from "next/link";
import { Button, Lucide } from "@repo/ui";
import { useRegister } from "@/lib/store";

const { CheckCircle2 } = Lucide;

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const lastReceipt = useRegister((state) => state.lastReceipt);

  if (!lastReceipt) {
    return (
      <div className="max-w-md">
        <p className="text-muted">
          No recent sale to show.{" "}
          <Link href={`/register/${subdomain}`} className="text-accent">
            Back to register
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <div className="flex flex-col items-center text-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-accent mb-3" />
        <h2 className="text-2xl font-bebas text-text">Sale Complete</h2>
        <p className="text-muted text-sm capitalize">
          Paid by {lastReceipt.paymentMethod}
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 mb-6">
        <div className="space-y-2 mb-4">
          {lastReceipt.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm text-muted"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>KES {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-input-bg pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>KES {lastReceipt.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span>KES {lastReceipt.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-text font-bold text-base">
            <span>Total</span>
            <span>KES {lastReceipt.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href={`/register/${subdomain}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            New Sale
          </Button>
        </Link>
        <Link href={`/register/${subdomain}/sales`} className="flex-1">
          <Button variant="accent" className="w-full">
            Sales History
          </Button>
        </Link>
      </div>
    </div>
  );
}

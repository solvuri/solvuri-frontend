"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Lucide } from "@repo/ui";
import { emailReceipt, smsReceipt, useReceipt } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";

const { CheckCircle2 } = Lucide;

const FIELD_CLASS =
  "flex-1 bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const merchantId = getMerchantId();
  const saleId = orderId ? Number(orderId) : null;
  const { data: receipt, isLoading, error } = useReceipt(merchantId, saleId);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendError, setSendError] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [sending, setSending] = useState<"email" | "sms" | null>(null);

  const handleEmail = async () => {
    if (!merchantId || !saleId || !email) return;
    setSendError("");
    setSendStatus("");
    setSending("email");
    try {
      await emailReceipt(merchantId, saleId, email);
      setSendStatus("Receipt emailed.");
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Couldn't email the receipt.",
      );
    } finally {
      setSending(null);
    }
  };

  const handleSms = async () => {
    if (!merchantId || !saleId || !phone) return;
    setSendError("");
    setSendStatus("");
    setSending("sms");
    try {
      await smsReceipt(merchantId, saleId, phone);
      setSendStatus("Receipt texted.");
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Couldn't text the receipt.",
      );
    } finally {
      setSending(null);
    }
  };

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

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 mb-6 space-y-3">
        <h3 className="text-sm font-bold text-text">Send Receipt</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className={FIELD_CLASS}
          />
          <button
            type="button"
            disabled={sending === "email" || !email}
            onClick={handleEmail}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text disabled:opacity-50"
          >
            {sending === "email" ? "Sending..." : "Email"}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (2547...)"
            className={FIELD_CLASS}
          />
          <button
            type="button"
            disabled={sending === "sms" || !phone}
            onClick={handleSms}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text disabled:opacity-50"
          >
            {sending === "sms" ? "Sending..." : "Text"}
          </button>
        </div>
        {sendStatus && (
          <p className="text-sm text-emerald-400">{sendStatus}</p>
        )}
        {sendError && <p className="text-sm text-rose-400">{sendError}</p>}
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

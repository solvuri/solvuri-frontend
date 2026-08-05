"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Lucide } from "@repo/ui";
const { Check, Mail } = Lucide;

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <Check size={40} className="text-emerald-600" />
      </div>

      <h1 className="text-2xl font-black text-zinc-900 mb-2">
        Order Placed! 🥳
      </h1>
      <p className="text-zinc-500 mb-8 text-center">
        The merchant will confirm your order and follow up about payment.
      </p>

      {orderId && (
        <div className="bg-white border rounded-xl p-6 text-center mb-8 w-full max-w-sm shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Order Reference
          </p>
          <p className="text-2xl font-black text-blue-700">#{orderId}</p>
        </div>
      )}

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 w-full max-w-sm mb-8">
        <div className="flex gap-3">
          <Mail size={20} className="text-blue-700 mt-1" />
          <div>
            <p className="font-bold text-sm text-zinc-900">
              Keep an eye on your phone/email
            </p>
            <p className="text-xs text-zinc-600">
              The merchant will reach out directly to confirm your order and
              arrange payment — this store hasn&apos;t set up online payment
              yet.
            </p>
          </div>
        </div>
      </div>

      <Link href="/" className="w-full max-w-sm">
        <button className="w-full bg-white border border-zinc-200 text-zinc-900 py-3 rounded-xl font-bold hover:bg-zinc-100">
          Go Home
        </button>
      </Link>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}

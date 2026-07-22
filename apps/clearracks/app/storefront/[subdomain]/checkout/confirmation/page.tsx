"use client";

import Link from "next/link";

import { Lucide } from "@repo/ui";
const { Check, Mail, Truck, Package } = Lucide;

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <Check size={40} className="text-emerald-600" />
      </div>

      {/* Confirmation Title */}
      <h1 className="text-2xl font-black text-zinc-900 mb-2">
        Order Confirmed! 🥳
      </h1>
      <p className="text-zinc-500 mb-8">
        Your order has been placed successfully
      </p>

      {/* Order Reference */}
      <div className="bg-white border rounded-xl p-6 text-center mb-8 w-full max-w-sm shadow-sm">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
          Order Reference
        </p>
        <p className="text-2xl font-black text-blue-700">ORD-8700</p>
      </div>

      {/* What's Next Section */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 w-full max-w-sm mb-8">
        <h3 className="text-blue-900 font-bold mb-4">WHAT&apos;S NEXT?</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Mail size={20} className="text-blue-700 mt-1" />
            <div>
              <p className="font-bold text-sm text-zinc-900">
                Confirmation Sent
              </p>
              <p className="text-xs text-zinc-600">Check your email and SMS</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Truck size={20} className="text-blue-700 mt-1" />
            <div>
              <p className="font-bold text-sm text-zinc-900">
                Track Your Order
              </p>
              <p className="text-xs text-zinc-600">
                Monitor delivery status in Orders
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Package size={20} className="text-blue-700 mt-1" />
            <div>
              <p className="font-bold text-sm text-zinc-900">
                View Full Details
              </p>
              <p className="text-xs text-zinc-600">
                Check Orders for complete info
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <Link href="/orders/ORD-8700" className="flex-1">
          <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800">
            View Order
          </button>
        </Link>
        <Link href="/" className="flex-1">
          <button className="w-full bg-white border border-zinc-200 text-zinc-900 py-3 rounded-xl font-bold hover:bg-zinc-100">
            Go Home
          </button>
        </Link>
      </div>
    </main>
  );
}

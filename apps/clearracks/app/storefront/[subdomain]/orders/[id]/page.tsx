"use client";

import Link from "next/link";
import { Lucide } from "@repo/ui";
const { ChevronLeft, Package, Truck, Calendar, MapPin } = Lucide;

// Mock data - in a real app, you would fetch this by the ID from your database
const ORDER_DETAIL = {
  id: "ORD-8700",
  status: "Confirmed",
  date: "June 22, 2026",
  items: [
    { name: "Leather Safari Bag", quantity: 2, price: 17000, image: "..." },
  ],
  shipping: 200,
  tax: 2752,
  total: 19952,
  address: "Waiyaki Way, Suite 12, Westlands, Nairobi",
};

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen bg-zinc-50 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders" className="p-2 bg-white border rounded-lg">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black">Order #{params.id}</h1>
      </div>

      {/* Status Card */}
      <div className="bg-white p-6 rounded-xl border mb-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-zinc-500 font-bold uppercase">Status</p>
          <p className="font-black text-emerald-600">{ORDER_DETAIL.status}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 font-bold uppercase">Date</p>
          <p className="font-bold text-zinc-900">{ORDER_DETAIL.date}</p>
        </div>
      </div>

      {/* Items Section */}
      <section className="bg-white p-6 rounded-xl border mb-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Package size={18} /> Items
        </h3>
        {ORDER_DETAIL.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2">
            <span>
              {item.name}{" "}
              <span className="text-zinc-500">x{item.quantity}</span>
            </span>
            <span className="font-bold">
              KES {(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t pt-4 space-y-2 text-sm text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              KES{" "}
              {ORDER_DETAIL.items
                .reduce((acc, i) => acc + i.price * i.quantity, 0)
                .toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>KES {ORDER_DETAIL.shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>KES {ORDER_DETAIL.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-black text-lg text-blue-900 pt-2 border-t">
            <span>Total</span>
            <span>KES {ORDER_DETAIL.total.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="bg-white p-6 rounded-xl border">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <MapPin size={18} /> Shipping Address
        </h3>
        <p className="text-sm text-zinc-600">{ORDER_DETAIL.address}</p>
      </section>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex gap-3">
        <button className="flex-1 border py-3 rounded-xl font-bold">
          Contact Support
        </button>
        <button className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-bold">
          Track Order
        </button>
      </div>
    </main>
  );
}

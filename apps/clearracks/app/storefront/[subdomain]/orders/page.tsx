"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data representing your order history
const ORDERS = [
  {
    id: "SAF-8821",
    name: "Easter in Diani",
    date: "Booked Mar 10, 2026",
    price: 28500,
    status: "Confirmed",
    type: "Experiences",
  },
  {
    id: "ORD-4421",
    name: "Safari Linen Shirt x2",
    date: "Ordered Mar 5, 2026",
    price: 5700,
    status: "Delivered",
    type: "Products",
  },
  {
    id: "SVC-3312",
    name: "Guided Bush Walk — Tsavo",
    date: "Booked Feb 28, 2026",
    price: 5500,
    status: "Upcoming",
    type: "Services",
  },
  {
    id: "SAF-7743",
    name: "Baecation in Malindi",
    date: "Booked Mar 1, 2026",
    price: 38000,
    status: "Upcoming",
    type: "Experiences",
  },
];

const FILTERS = ["All", "Experiences", "Products", "Services"];

export default function OrdersPage() {
  const [filter, setFilter] = useState("All");

  const filteredOrders =
    filter === "All" ? ORDERS : ORDERS.filter((o) => o.type === filter);

  return (
    <main className="min-h-screen bg-zinc-50 p-4">
      <h1 className="text-2xl font-black mb-6">My Orders</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
              filter === f
                ? "bg-blue-700 text-white"
                : "bg-white border text-zinc-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl border space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-zinc-200 rounded-lg" />{" "}
                {/* Placeholder for product image */}
                <div>
                  <h3 className="font-bold">{order.name}</h3>
                  <p className="text-xs text-zinc-500">{order.date}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded ${
                  order.status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-600"
                    : order.status === "Delivered"
                      ? "bg-sky-50 text-sky-600"
                      : "bg-orange-50 text-orange-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-bold text-sm text-blue-700">
                KES {order.price.toLocaleString()}
              </span>
              <div className="flex gap-4 text-xs font-bold">
                {order.status === "Upcoming" && (
                  <button className="text-red-600">Cancel</button>
                )}
                {order.status === "Delivered" && (
                  <button className="text-orange-600">Write a Review</button>
                )}
                <Link href={`/orders/${order.id}`} className="text-zinc-500">
                  Details &gt;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

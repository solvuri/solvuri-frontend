"use client";

import Link from "next/link";
import { useOrders } from "@/lib/merchantApi";

export default function MerchantOrdersPage() {
  const { data: orders, isLoading, error } = useOrders();

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-black text-zinc-900 mb-1">Orders</h2>
      <p className="text-sm text-zinc-500 mb-6">
        Orders placed through your storefront, requested manually, or
        confirmed from the POS till.
      </p>

      <div className="bg-white border rounded-2xl p-6">
        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}
        {error && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Couldn't load orders."}
          </p>
        )}
        {!isLoading && !error && (!orders || orders.length === 0) && (
          <p className="text-sm text-zinc-500">No orders yet.</p>
        )}
        {!isLoading && orders && orders.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400 uppercase text-xs tracking-widest border-b">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Payment</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 text-zinc-900">
                    <Link
                      href={`/merchant/orders/${order.id}`}
                      className="text-blue-700 font-bold underline"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="py-3 text-zinc-500">{order.customerName}</td>
                  <td className="py-3 text-zinc-500">{order.status}</td>
                  <td className="py-3 text-zinc-500">{order.paymentStatus}</td>
                  <td className="py-3 text-zinc-900 text-right">
                    KES {order.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

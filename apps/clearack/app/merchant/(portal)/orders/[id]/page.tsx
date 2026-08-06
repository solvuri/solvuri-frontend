"use client";

import { use } from "react";
import Link from "next/link";
import { useOrder } from "@/lib/merchantApi";

export default function MerchantOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const orderId = Number(id);
  const { data: order, isLoading, error } = useOrder(orderId);

  return (
    <div className="max-w-2xl">
      <Link
        href="/merchant/orders"
        className="text-sm text-zinc-500 hover:text-zinc-900 mb-4 inline-block"
      >
        &larr; Back to Orders
      </Link>

      {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}
      {error && (
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Couldn't find this order."}
        </p>
      )}

      {order && (
        <>
          <h2 className="text-xl font-black text-zinc-900 mb-6">
            Order #{order.id}
          </h2>

          <div className="bg-white border rounded-2xl p-6 mb-4">
            <h3 className="font-bold text-sm text-zinc-900 mb-4">Items</h3>
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm py-2 text-zinc-500"
              >
                <span>
                  {item.productName} <span>x{item.quantity}</span>
                </span>
                <span className="font-bold text-zinc-900">
                  KES {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="border-t pt-4 mt-2 flex justify-between font-bold text-lg text-zinc-900">
              <span>Total</span>
              <span>KES {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Customer</span>
              <span className="text-zinc-900">{order.customerName}</span>
            </div>
            {order.customerEmail && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Email</span>
                <span className="text-zinc-900">{order.customerEmail}</span>
              </div>
            )}
            {order.customerPhone && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Phone</span>
                <span className="text-zinc-900">{order.customerPhone}</span>
              </div>
            )}
            {order.shippingAddress && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping Address</span>
                <span className="text-zinc-900">{order.shippingAddress}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Status</span>
              <span className="text-zinc-900">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Payment</span>
              <span className="text-zinc-900">{order.paymentStatus}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

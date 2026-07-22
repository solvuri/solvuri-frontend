"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";

import { Lucide } from "@repo/ui";
const { ChevronLeft, Trash2, Plus, Minus, Tag } = Lucide;

export default function CartPage() {
  const { cart, increment, decrement, removeFromCart } = useStore();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-zinc-50 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href=".." className="p-2 bg-white border rounded-lg">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-black">My Cart</h1>
          <p className="text-xs text-zinc-500">{cart.length} items</p>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl border flex gap-4"
          >
            <div className="relative w-20 h-20 shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              {/* Product Badge */}
              <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                Product
              </span>

              <div className="flex justify-between items-start mt-1">
                <h3 className="font-bold text-sm">{item.name}</h3>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-zinc-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Variant info (Assuming mock data if needed) */}
              <p className="text-[10px] text-zinc-400">
                Large (65L) • Tan Brown
              </p>

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-bold text-blue-700">
                  KES {item.price.toLocaleString()}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 border rounded-lg w-max p-1">
                  <button onClick={() => decrement(item.id)} className="p-1">
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm px-2">
                    {item.quantity}
                  </span>
                  <button onClick={() => increment(item.id)} className="p-1">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Section */}
      <section className="bg-white p-4 rounded-xl border mb-4">
        <div className="flex items-center gap-2 mb-2 text-sm font-bold text-zinc-900">
          <Tag size={16} className="text-orange-600" /> Promo Code
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code e.g. SAFARI10"
            className="flex-1 border rounded-lg p-3 text-sm focus:outline-blue-600"
          />
          <button className="bg-blue-700 text-white px-6 rounded-lg font-bold text-sm">
            Apply
          </button>
        </div>
      </section>

      {/* Order Summary */}
      <section className="bg-white p-4 rounded-xl border space-y-3">
        <h3 className="font-bold">Order Summary</h3>
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Subtotal</span>
          <span className="font-bold text-zinc-900">
            KES {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm text-zinc-600">
          <span>Tax (VAT 16%)</span>
          <span className="font-bold text-zinc-900">
            KES {tax.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between font-black text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-blue-700">KES {total.toLocaleString()}</span>
        </div>
      </section>

      {/* Sticky Checkout Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-zinc-200 z-40">
        <Link href="/checkout" className="block w-full">
          <button className="w-full bg-blue-700 cursor-pointer text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
            Proceed to Checkout <span>&gt;</span>
          </button>
        </Link>
      </div>
    </main>
  );
}

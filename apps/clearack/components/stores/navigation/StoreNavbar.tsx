"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { displayName } from "@/lib/merchants";

import { Lucide } from "@repo/ui";
const { ShoppingCart } = Lucide;

export default function StoreNavbar({ subdomain }: { subdomain: string }) {
  // Use Zustand to get the total cart quantity dynamically
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-xl font-black text-blue-900 tracking-tighter"
        >
          {displayName(subdomain).toUpperCase()}
        </Link>

        {/* Navigation Links — just "Store" for now: this app has a single
            product listing (the home page), no separate collections/about
            content exists to link to yet. */}
        <div className="flex gap-8 font-bold text-sm text-zinc-600">
          <Link href="/" className="hover:text-blue-600">
            Store
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative p-2 text-zinc-600 hover:bg-zinc-100 rounded-full"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

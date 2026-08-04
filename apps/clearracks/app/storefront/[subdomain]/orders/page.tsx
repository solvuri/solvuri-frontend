"use client";

import Link from "next/link";
import { Lucide } from "@repo/ui";
const { PackageSearch } = Lucide;

// The real Clearack API has no anonymous "browse my past orders" endpoint —
// GET /api/clearack/orders/{id} requires an authenticated caller scoped to
// their own merchantId, not a guest buyer checking an unrelated order. This
// is an honest stub, not fabricated order history.
export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-4 flex flex-col items-center justify-center text-center">
      <PackageSearch size={40} className="text-zinc-400 mb-4" />
      <h1 className="text-lg font-black text-zinc-900 mb-2">
        Order history isn&apos;t available yet
      </h1>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">
        Guest checkout orders aren&apos;t tied to an account, so there&apos;s
        nowhere to look them up from here yet. Check the confirmation email
        or SMS the merchant sent after checkout for your order reference.
      </p>
      <Link href=".." className="text-blue-700 text-sm font-bold underline">
        Back to store
      </Link>
    </main>
  );
}

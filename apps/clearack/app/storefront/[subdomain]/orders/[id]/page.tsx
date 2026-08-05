"use client";

import Link from "next/link";
import { Lucide } from "@repo/ui";
const { PackageSearch } = Lucide;

// Same honest limitation as ../page.tsx: no anonymous order-lookup
// endpoint exists in the real API, so there's no real detail to show here.
export default function OrderDetailsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 p-4 flex flex-col items-center justify-center text-center">
      <PackageSearch size={40} className="text-zinc-400 mb-4" />
      <h1 className="text-lg font-black text-zinc-900 mb-2">
        Order lookup isn&apos;t available yet
      </h1>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">
        Guest checkout orders aren&apos;t tied to an account, so there&apos;s
        no way to look up a specific order here yet. Check the confirmation
        email or SMS the merchant sent after checkout.
      </p>
      <Link href="../.." className="text-blue-700 text-sm font-bold underline">
        Back to store
      </Link>
    </main>
  );
}

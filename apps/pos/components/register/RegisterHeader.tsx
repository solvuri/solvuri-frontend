"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@repo/api-client";
import { useCurrentRegisterSession } from "@/lib/posApi";
import { getMerchantId, useCurrentUser } from "@/lib/auth";

export default function RegisterHeader({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const label = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  const merchantId = getMerchantId();
  const user = useCurrentUser();
  const { data: session } = useCurrentRegisterSession(merchantId);

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-input-bg flex items-center justify-between px-8">
      <h1 className="font-bebas text-xl text-text tracking-widest">
        {label} — Register
      </h1>
      <div className="flex items-center gap-6">
        <Link
          href="/session"
          className="flex items-center gap-2 text-sm hover:text-text"
        >
          <span
            className={`w-2 h-2 rounded-full ${session ? "bg-emerald-400" : "bg-muted"}`}
          />
          <span className="text-muted">
            {session ? "Session Open" : "No Session"}
          </span>
        </Link>
        <Link href="/sales" className="text-sm text-muted hover:text-text">
          Sales History
        </Link>
        <Link href="/inventory" className="text-sm text-muted hover:text-text">
          Inventory
        </Link>
        <Link
          href="/stock-count"
          className="text-sm text-muted hover:text-text"
        >
          Stock Count
        </Link>
        <Link href="/customers" className="text-sm text-muted hover:text-text">
          Customers
        </Link>
        <Link href="/products" className="text-sm text-muted hover:text-text">
          Products
        </Link>
        {user?.appRole === "Merchant" && (
          <Link href="/reports" className="text-sm text-muted hover:text-text">
            Reports
          </Link>
        )}
        {user?.appRole === "Merchant" && (
          <Link href="/pricing" className="text-sm text-muted hover:text-text">
            Pricing
          </Link>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-muted hover:text-text cursor-pointer"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

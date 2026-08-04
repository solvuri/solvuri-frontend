"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@repo/api-client";
import { useCurrentUser } from "@/lib/auth";

export default function MerchantPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useCurrentUser();

  const handleLogout = () => {
    clearAuthToken();
    router.push("/merchant/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="h-16 border-b bg-white flex items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <h1 className="font-black text-zinc-900">
            Merchant Portal{user?.username ? ` — ${user.username}` : ""}
          </h1>
          <nav className="flex items-center gap-6 text-sm font-bold text-zinc-500">
            <Link href="/merchant/settings" className="hover:text-zinc-900">
              Payment Settings
            </Link>
            {/* Staff management is owner-only — a MerchantAgent gets a
                403 from the backend, so the entry point stays hidden for
                them rather than surfacing a link that always errors. */}
            {user?.appRole === "Merchant" && (
              <Link href="/merchant/agents" className="hover:text-zinc-900">
                Staff
              </Link>
            )}
          </nav>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer"
        >
          Log out
        </button>
      </header>
      <div className="p-8">{children}</div>
    </div>
  );
}

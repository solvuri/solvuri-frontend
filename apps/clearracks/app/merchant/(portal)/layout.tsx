"use client";

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
        <h1 className="font-black text-zinc-900">
          Merchant Portal{user?.username ? ` — ${user.username}` : ""}
        </h1>
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

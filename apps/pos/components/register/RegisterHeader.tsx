"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@repo/api-client";

export default function RegisterHeader({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const label = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

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
        <Link href="/sales" className="text-sm text-muted hover:text-text">
          Sales History
        </Link>
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

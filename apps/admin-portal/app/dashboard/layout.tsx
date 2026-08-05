// apps/admin-portal/app/dashboard/layout.tsx
"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@repo/ui";
import { Lucide } from "@repo/ui";
import { clearAuthToken } from "@repo/api-client";
const {
  LayoutDashboard,
  Building2,
  Store,
  CreditCard,
  LayoutGrid,
  Settings,
  LogOut,
} = Lucide;

const navItems = [
  { icon: LayoutDashboard, label: "Global Stats", href: "/dashboard" },
  { icon: Building2, label: "Merchants", href: "/dashboard/merchants" },
  { icon: LayoutGrid, label: "Catalog", href: "/dashboard/catalog" },
  { icon: Store, label: "Clearrack Stores", href: "/dashboard/clearrack" },
  { icon: CreditCard, label: "POS Locations", href: "/dashboard/pos" },
];

const footerItems = [
  { icon: Settings, label: "Platform Settings", href: "/dashboard/settings" },
];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthToken();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-input-bg hidden md:flex flex-col">
        <Sidebar title="SOLVURI" items={navItems} footerItems={footerItems} />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Added Header to match the platform look */}
        <header className="h-16 border-b border-input-bg flex items-center justify-between px-8">
          <h2 className="font-bebas text-xl text-text tracking-widest">
            PLATFORM OVERVIEW
          </h2>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex items-center gap-2 text-sm text-muted hover:text-text cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}

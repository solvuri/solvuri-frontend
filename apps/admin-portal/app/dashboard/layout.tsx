// apps/admin-portal/app/dashboard/layout.tsx
import { LocalSidebar } from "@/components/LocalSidebar";
import { Sidebar } from "@repo/ui";
import { Lucide } from "@repo/ui";
const { LayoutDashboard, Store, ShoppingBag, Settings } = Lucide;

const navItems = [
  { icon: LayoutDashboard, label: "Global Stats", href: "/dashboard" },
  { icon: Store, label: "Clearrack Stores", href: "/dashboard/clearrack" },
  { icon: ShoppingBag, label: "Safyri Bookings", href: "/dashboard/safyri" },
];

const footerItems = [
  { icon: Settings, label: "Platform Settings", href: "/settings" },
];
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* <aside className="w-64 border-r border-input-bg hidden md:flex flex-col">
        <Sidebar title="SOLVURI" items={navItems} footerItems={footerItems} />
      </aside> */}

      <aside className="w-64 border-r border-input-bg hidden md:flex flex-col">
        <LocalSidebar items={navItems} />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Added Header to match the platform look */}
        <header className="h-16 border-b border-input-bg flex items-center px-8">
          <h2 className="font-bebas text-xl text-text tracking-widest">
            PLATFORM OVERVIEW
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </main>
    </div>
  );
}

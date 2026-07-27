// packages/ui/src/sidebar.tsx
"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
  footerItems?: SidebarItem[]; // Optional footer items
}

export const Sidebar = ({ title, items, footerItems }: SidebarProps) => (
  <nav className="p-4 space-y-2 text-text">
    <div className="px-4 py-6 font-bebas text-2xl text-text tracking-widest">
      {title}
    </div>

    {items.map((item) => (
      <NavItem key={item.href} {...item} />
    ))}

    {footerItems && (
      <div className="pt-4 border-t border-input-bg mt-4">
        {footerItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    )}
  </nav>
);

const NavItem = ({ icon: Icon, label, href }: SidebarItem) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-6 py-3 text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-surface text-text"
          : "text-muted hover:bg-surface hover:text-text"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="font-medium truncate">{label}</span>
    </Link>
  );
};

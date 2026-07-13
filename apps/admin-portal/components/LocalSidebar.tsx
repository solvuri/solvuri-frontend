// apps/admin-portal/components/LocalSidebar.tsx
export interface SidebarItem {
  label: string;
  href: string;
}

export const LocalSidebar = ({ items }: { items: SidebarItem[] }) => (
  <nav className="flex flex-col gap-3 p-6 bg-surface h-full">
    {items.map((item) => (
      <a
        key={item.href}
        href={item.href}
        className="flex items-center gap-4 px-6 py-4 text-base text-text hover:bg-primary rounded-xl transition-all"
      >
        {/* Placeholder icon to avoid lucide-react dependency */}
        <div className="w-6 h-6 rounded-full bg-accent" />
        <span className="font-medium">{item.label}</span>
      </a>
    ))}
  </nav>
);

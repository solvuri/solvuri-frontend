import Link from "next/link";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  brand: { name: string; description?: string };
  columns: FooterColumn[];
  /** Extra content rendered next to the brand block in the "sticky" variant
   *  (ClearRacks's "Core APIs Active" status badge). */
  accent?: React.ReactNode;
  /** Bottom legal ribbon, "sticky" variant only. */
  legal?: React.ReactNode;
  /** "floating": SOLVURI-brand 5-col footer. "sticky": ClearRacks-brand
   *  12-col footer + legal ribbon. Matches Navbar's variant values. */
  variant?: "floating" | "sticky";
}

export function Footer({ brand, columns, accent, legal, variant = "sticky" }: FooterProps) {
  return variant === "floating" ? (
    <FloatingFooter brand={brand} columns={columns} />
  ) : (
    <StickyFooter brand={brand} columns={columns} accent={accent} legal={legal} />
  );
}

function FloatingFooter({
  brand,
  columns,
}: Pick<FooterProps, "brand" | "columns">) {
  return (
    <footer className="bg-background px-6 md:px-10 pt-16 md:pt-24 pb-12 border-t border-[#1D1C45]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-16 md:mb-24">
          <div className="col-span-1 text-center md:text-left">
            <h2 className="text-accent font-bold text-xl mb-4">{brand.name}</h2>
            {brand.description && (
              <p className="text-[#5C5A8A] text-sm leading-relaxed max-w-none md:max-w-50 mx-auto md:mx-0">
                {brand.description}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {columns.map((section) => (
              <div key={section.title} className="text-center md:text-left">
                <h3 className="text-primary-light font-bold text-xs tracking-widest mb-6 uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#1D1C45] gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} {brand.name} Ltd. All rights reserved.
          </p>
          <p className="text-muted text-xs">Built for builders.</p>
        </div>
      </div>
    </footer>
  );
}

function StickyFooter({
  brand,
  columns,
  accent,
  legal,
}: Pick<FooterProps, "brand" | "columns" | "accent" | "legal">) {
  return (
    <footer className="w-full bg-brand-bg text-brand-muted font-sans antialiased text-xs border-t border-stone-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-6 items-start">
        {columns.map((section) => (
          <div key={section.title} className="col-span-1 md:col-span-3 space-y-4">
            <h4 className="font-bold text-stone-900 tracking-wide text-[13px] uppercase">
              {section.title}
            </h4>
            <ul className="space-y-2.5 font-medium text-brand-muted">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-1 md:col-span-3 flex flex-col items-start md:items-end space-y-4 md:text-right">
          <div className="flex items-center gap-1.5 text-stone-900 font-black uppercase tracking-wider text-sm select-none">
            {brand.name}
            <span className="text-brand-primary">.</span>
          </div>
          {accent}
        </div>
      </div>

      {legal && (
        <div className="border-t border-stone-200/60 py-8 bg-stone-50/50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-stone-500 font-medium text-[11px]">
            {legal}
          </div>
        </div>
      )}
    </footer>
  );
}

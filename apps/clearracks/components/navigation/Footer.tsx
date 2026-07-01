import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-brand-bg text-brand-muted font-sans antialiased text-xs border-t border-stone-200 mt-24">
      {/* Top Section: Multi-column Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-6 items-start">
        {/* Column 1: Solutions */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h4 className="font-bold text-stone-900 tracking-wide text-[13px] uppercase">
            Solutions
          </h4>
          <ul className="space-y-2.5 font-medium text-brand-muted">
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Capsule Stock Drops
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                1-of-1 Inventory Guard
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Automated Chat Checkout
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                M-Pesa STK Push Integration
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Multi-Tenant Store Routing
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Resources */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h4 className="font-bold text-stone-900 tracking-wide text-[13px] uppercase">
            Resources
          </h4>
          <ul className="space-y-2.5 font-medium text-brand-muted">
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Merchant Case Studies
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                API Documentation
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                System Help Desk
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Developer Webhooks
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          <h4 className="font-bold text-stone-900 tracking-wide text-[13px] uppercase">
            Company
          </h4>
          <ul className="space-y-2.5 font-medium text-brand-muted">
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Changelog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Engineering Blog
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="mailto:ops@clearrack.io"
                className="hover:text-brand-primary transition-colors duration-200"
              >
                Contact Ops
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Brand Identity & Status Logo */}
        <div className="col-span-1 md:col-span-3 flex flex-col items-start md:items-end space-y-4 md:text-right">
          <div className="flex items-center gap-1.5 text-stone-900 font-black uppercase tracking-wider text-sm select-none">
            ClearRack<span className="text-brand-primary">.</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-brand-primary/20 text-brand-primary px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            Core APIs Active
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright & Legal Ribbon */}
      <div className="border-t border-stone-200/60 py-8 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-stone-500 font-medium text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} ClearRack Inc. All rights
            reserved.
          </div>

          <div className="flex items-center gap-6 text-stone-500">
            <Link
              href="#"
              className="hover:text-brand-primary transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:text-brand-primary transition-colors duration-200"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

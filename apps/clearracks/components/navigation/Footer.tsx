import Link from "next/link";
import { Footer as SharedFooter } from "@repo/ui";

const columns = [
  {
    title: "Solutions",
    links: [
      { label: "Capsule Stock Drops", href: "#" },
      { label: "1-of-1 Inventory Guard", href: "#" },
      { label: "Automated Chat Checkout", href: "#" },
      { label: "M-Pesa STK Push Integration", href: "#" },
      { label: "Multi-Tenant Store Routing", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Merchant Case Studies", href: "#" },
      { label: "API Documentation", href: "#" },
      { label: "System Help Desk", href: "#" },
      { label: "Developer Webhooks", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Changelog", href: "#" },
      { label: "Engineering Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact Ops", href: "mailto:ops@clearrack.io" },
    ],
  },
];

export default function Footer() {
  return (
    <SharedFooter
      variant="sticky"
      brand={{ name: "ClearRack" }}
      columns={columns}
      accent={
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-brand-primary/20 text-brand-primary px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
          Core APIs Active
        </div>
      }
      legal={
        <>
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
        </>
      }
    />
  );
}

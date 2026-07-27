// apps/web/app/press/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@repo/ui";

export const metadata: Metadata = {
  title: "Press | Solvuri",
  description: "Solvuri press resources are coming soon.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#0F0E2A] flex items-center justify-center relative overflow-hidden px-10 pt-20">
      <div className="absolute w-150 h-150 rounded-full bg-[#7C6EFF] blur-[120px] opacity-10"></div>

      <div className="text-center relative z-10 max-w-lg">
        <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-4">
          Press
        </div>
        <h1 className="font-bebas text-6xl md:text-7xl text-white mb-6">
          Coming Soon.
        </h1>
        <p className="text-[#9896B8] mb-10 leading-relaxed">
          Press resources and media mentions will live here. In the meantime, if
          you&apos;re a journalist or writer looking for information, reach out
          directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:hello@solvuri.com">
            <Button
              variant="accent"
              className="bg-[#C8D400] text-[#0F0E2A] px-10 py-3 rounded-full text-lg font-bold hover:bg-[#AAB800] transition-colors w-full sm:w-auto"
            >
              Contact Us
            </Button>
          </a>
          <Link href="/">
            <Button className="bg-[#16153D] border border-[#7C6EFF]/20 text-white px-10 py-3 rounded-full text-lg font-bold w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

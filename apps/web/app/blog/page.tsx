// apps/web/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@repo/ui";

export const metadata: Metadata = {
  title: "Blog | Solvuri",
  description: "The Solvuri blog is coming soon.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0F0E2A] flex items-center justify-center relative overflow-hidden px-10 pt-20">
      <div className="absolute w-150 h-150 rounded-full bg-[#7C6EFF] blur-[120px] opacity-10"></div>

      <div className="text-center relative z-10 max-w-lg">
        <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-4">
          Blog
        </div>
        <h1 className="font-bebas text-6xl md:text-7xl text-white mb-6">
          Coming Soon.
        </h1>
        <p className="text-[#9896B8] mb-10 leading-relaxed">
          We&apos;re working on it. When we have something worth writing about —
          product updates, engineering notes, launches — it&apos;ll land here.
        </p>
        <Link href="/">
          <Button
            variant="accent"
            className="bg-[#C8D400] text-[#0F0E2A] px-10 py-3 rounded-full text-lg font-bold hover:bg-[#AAB800] transition-colors"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

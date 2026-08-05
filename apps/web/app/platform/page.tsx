// apps/web/app/platform/page.tsx
import type { Metadata } from "next";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";
import { Button } from "@repo/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform | Solvuri",
  description:
    "One shared infrastructure layer for every white-label module you run — multi-tenant by design, with a single console to operate it all.",
};

const PILLARS = [
  {
    label: "Multi-Tenant by Design",
    title: "One Infrastructure. Every Brand.",
    description:
      "Every storefront you launch — yours or your customers' — runs on the same shared infrastructure, fully isolated from every other tenant. Provisioning, routing, and data separation are handled for you, so launching under a new brand is a configuration, not a new build.",
  },
  {
    label: "Operations",
    title: "One Console, Full Visibility",
    description:
      "The admin console gives your operations team a single place to see every store and module you run: platform-wide settings, per-tenant configuration, and the health of the storefronts sitting on top of it — instead of stitching together visibility across separate systems per product.",
  },
  {
    label: "Composable",
    title: "Modules That Work Together",
    description:
      "ClearRack and POS are each complete products on their own, but they're built to compose: run one to start, and add the other as your business grows, without re-platforming.",
  },
];

export default function PlatformPage() {
  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-6">
            The Solvuri Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bebas text-white mb-8 leading-tight">
            One Platform. <br />
            <span className="text-[#7C6EFF]">Every Module. Your Brand.</span>
          </h1>
          <p className="text-[#9896B8] text-xl mb-16 max-w-2xl">
            Solvuri isn&apos;t a bundle of separate products stitched together
            after the fact — it&apos;s a single infrastructure layer that every
            module is built on top of.
          </p>

          <div className="space-y-12 mb-16">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-[#16153D] p-8 md:p-10 rounded-2xl border border-[#7C6EFF]/15"
              >
                <div className="text-[#C8D400] text-xs font-bold tracking-widest uppercase mb-3">
                  {pillar.label}
                </div>
                <h2 className="text-2xl md:text-3xl font-bebas text-white mb-3">
                  {pillar.title}
                </h2>
                <p className="text-[#9896B8] leading-relaxed max-w-2xl">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#7C6EFF] p-12 rounded-3xl text-center">
            <h2 className="text-3xl font-bebas text-white mb-6">
              See the modules built on it
            </h2>
            <p className="mb-8 text-[#E2E0FF]">
              ClearRack and POS — each ready to deploy on its own or together.
            </p>
            <Link href="/modules">
              <Button className="bg-[#0F0E2A] text-white px-8 py-4 rounded-full font-bold">
                Explore modules
              </Button>
            </Link>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}

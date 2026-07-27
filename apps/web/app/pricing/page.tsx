// apps/web/app/pricing/page.tsx
import type { Metadata } from "next";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";
import { Button } from "@repo/ui";
import Link from "next/link";
import { MODULES_DATA } from "../../utils/modulesData";

export const metadata: Metadata = {
  title: "Pricing | Solvuri",
  description:
    "Per-module pricing for ClearRack, Safyri, Reservr, and Master, or one Super License covering every module under a single contract.",
};

// Indicative starting prices per module. Not final — see disclaimer below.
const MODULE_PRICING: Record<string, number> = {
  clearrack: 800,
  safyri: 900,
  reservr: 600,
  master: 500,
};

export default function PricingPage() {
  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-6">
            Pricing
          </div>
          <h1 className="text-5xl md:text-7xl font-bebas text-white mb-6 leading-tight">
            Pay for What <span className="text-[#7C6EFF]">You Deploy.</span>
          </h1>
          <p className="text-[#9896B8] text-xl mb-4 max-w-2xl">
            Run one module or run them all — pricing scales with what your
            business actually needs.
          </p>
          <p className="text-[#5C5A8A] text-sm mb-12 max-w-2xl">
            Pricing shown below is indicative. Contact sales for a formal quote
            tailored to your scale.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {MODULES_DATA.map((m) => (
              <div
                key={m.title}
                className="bg-[#16153D] p-6 md:p-8 rounded-2xl border border-[#7C6EFF]/15 flex flex-col"
              >
                <span
                  className="text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full inline-block mb-4 self-start"
                  style={{
                    color: m.accentColor,
                    backgroundColor: `${m.accentColor}26`,
                  }}
                >
                  {m.category}
                </span>
                <h3 className="font-bebas text-3xl text-white mb-2">
                  {m.title}
                </h3>
                <p className="text-[#9896B8] text-sm leading-relaxed mb-6 grow">
                  {m.description}
                </p>
                <div className="mb-6">
                  <span
                    className="text-3xl font-bebas"
                    style={{ color: m.accentColor }}
                  >
                    From ${MODULE_PRICING[m.slug]?.toLocaleString()}
                  </span>
                  <span className="text-[#9896B8] text-sm"> / month</span>
                </div>
                <Link href={`/contact?reason=general&module=${m.title}`}>
                  <Button
                    className="w-full text-[#0F0E2A] font-bold rounded-full"
                    style={{ backgroundColor: m.accentColor }}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-[#7C6EFF] p-10 md:p-12 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="text-[#0F0E2A] font-bold tracking-widest uppercase text-xs mb-3">
                  The Super License
                </div>
                <h2 className="text-3xl md:text-4xl font-bebas text-white mb-3">
                  Every Module. One Contract.
                </h2>
                <p className="text-[#E2E0FF] max-w-md">
                  All four modules under one license — roughly $400/month less
                  than licensing each separately, with one unified admin hub
                  across all of them.
                </p>
              </div>
              <div className="text-left md:text-right shrink-0">
                <div className="text-4xl font-bebas text-white mb-4">
                  From $2,400{" "}
                  <span className="text-lg text-[#E2E0FF]">/ month</span>
                </div>
                <Link href="/superlicense">
                  <Button className="bg-[#0F0E2A] text-white px-8 py-4 rounded-full font-bold">
                    Request a Super License
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}

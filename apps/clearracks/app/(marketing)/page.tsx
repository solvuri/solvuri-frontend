export const dynamic = "force-dynamic";

import CostConsolidation from "@/components/homepage/CostConsolidation";
import DropChaosComparison from "@/components/homepage/DropChaosComparison";
import FeatureCard from "@/components/homepage/FeatureCard";
import PlatformFeatures from "@/components/homepage/PlatformFeatures";
import WorkspaceForm from "@/components/homepage/WorkSpaceForm";
import { Lucide } from "@repo/ui";
const { MessageSquare, Bot, Sparkles } = Lucide;

export default async function Home() {
  return (
    <div className="w-full bg-brand-bg text-foreground font-sans antialiased flex flex-col selection:bg-brand-primary selection:text-white">
      {/* Main Hero Grid Presentation Container */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side Presentation Content Block */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 bg-orange-50 border border-brand-primary/30 text-brand-primary px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            High-Velocity E-Commerce Infrastructure
          </span>

          <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.05] uppercase">
            Clear your racks. <br />
            <span className="text-brand-primary">
              Turn stock into instant cash.
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-brand-muted font-medium leading-relaxed mx-auto lg:mx-0">
            Stop forcing unique collections or capsule apparel drops into slow,
            heavy e-commerce templates. Sell out your limited items instantly
            through automated WhatsApp checkout streams backed by instant M-Pesa
            verification.
          </p>

          {/* Hero Micro-Features Row */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0 text-left">
            <FeatureCard
              icon={MessageSquare}
              title="Frictionless Sales"
              description="Buyers browse your drops and check out instantly right inside WhatsApp."
            />
            <FeatureCard
              icon={Bot}
              title="1-of-1 Order Guard"
              description="AI registers orders in real time to perfectly block double-booking on unique pieces."
            />
            <FeatureCard
              icon={Sparkles}
              title="Instant Cash Flow"
              description="Automated STK push matches transactions directly to stock units for immediate payout."
            />
          </div>
        </div>

        {/* Right Side Input Action Interactive Form */}
        <div className="lg:col-span-5 w-full" id="claim-workspace">
          <WorkspaceForm />
        </div>
      </section>

      {/* Extracted Core Platform Features Grid Section */}
      <PlatformFeatures />

      {/* Context-Building Side-by-Side Comparison Block */}
      <DropChaosComparison />
      <CostConsolidation />
    </div>
  );
}

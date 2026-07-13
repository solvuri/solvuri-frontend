// apps/web/app/superlicense/page.tsx
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";
import { Button } from "@repo/ui";
import Link from "next/link";

export default function SuperLicensePage() {
  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-6">
            The Solvuri Super License
          </div>
          <h1 className="text-5xl md:text-7xl font-bebas text-white mb-8 leading-tight">
            Deploy Every Module. <br />
            <span className="text-[#7C6EFF]">Scale Your Entire Ecosystem.</span>
          </h1>

          <p className="text-[#9896B8] text-xl mb-12 max-w-2xl">
            Stop juggling multiple contracts and fragmented infrastructure. The
            Super License gives you full access to ClearRack, Safyri, Reservr,
            and Master — unified by a single, powerful administrative hub.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "One Contract",
                desc: "Consolidated billing and licensing.",
              },
              {
                title: "Unified Data",
                desc: "Centralized analytics across all products.",
              },
              {
                title: "Priority Support",
                desc: "Dedicated engineering assistance.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#16153D] p-6 rounded-2xl border border-[#7C6EFF]/15"
              >
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-[#9896B8] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#7C6EFF] p-12 rounded-3xl text-center">
            <h2 className="text-3xl font-bebas text-white mb-6">
              Ready to scale?
            </h2>
            <p className="mb-8 text-[#E2E0FF]">
              Request a demo or speak with our solutions team to tailor your
              license.
            </p>
            <Link href="/contact">
              <Button className="bg-[#0F0E2A] text-white px-8 py-4 rounded-full font-bold">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}

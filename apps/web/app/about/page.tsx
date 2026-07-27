// apps/web/app/about/page.tsx
import type { Metadata } from "next";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";
import { Button } from "@repo/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Solvuri",
  description:
    "Solvuri builds the shared infrastructure behind white-label commerce, travel, and reservation products, so businesses can launch under their own brand instead of building it all from scratch.",
};

const VALUES = [
  {
    title: "White-label first",
    description:
      "Every product decision starts from the assumption that it needs to disappear behind someone else's brand — not be retrofitted for it later.",
  },
  {
    title: "Modular by design",
    description:
      "Businesses shouldn't have to adopt an entire platform to get one capability. Each module stands on its own, and composes with the rest when you need more.",
  },
  {
    title: "Built to scale with you",
    description:
      "The same infrastructure that runs a single storefront is what runs a hundred — we design for that range from the start, not as an afterthought.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-6">
            About Solvuri
          </div>
          <h1 className="text-5xl md:text-7xl font-bebas text-white mb-8 leading-tight">
            We Run the Engine. <br />
            <span className="text-[#7C6EFF]">You Run the Brand.</span>
          </h1>
          <p className="text-[#9896B8] text-xl mb-16 max-w-2xl">
            Solvuri exists so businesses can launch commerce, travel, and
            reservation products under their own name, without building the
            infrastructure underneath them from scratch.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-[#16153D] p-6 rounded-2xl border border-[#7C6EFF]/15"
              >
                <h3 className="text-white font-bold mb-3">{v.title}</h3>
                <p className="text-[#9896B8] text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#7C6EFF] p-12 rounded-3xl text-center">
            <h2 className="text-3xl font-bebas text-white mb-6">
              Want to build with us?
            </h2>
            <p className="mb-8 text-[#E2E0FF]">
              Tell us what you&apos;re building and we&apos;ll help you figure
              out which modules fit.
            </p>
            <Link href="/contact">
              <Button className="bg-[#0F0E2A] text-white px-8 py-4 rounded-full font-bold">
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}

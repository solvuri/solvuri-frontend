"use client";

import { Lucide } from "@repo/ui";
const { ArrowRight } = Lucide;

export default function CostConsolidation() {
  const tools = [
    {
      name: "Traditional E-Commerce Platform",
      original: "Shopify / Custom Dev",
      cost: "KES 3,900/mo",
    },
    {
      name: "M-Pesa STK Push Gateway Integration",
      original: "Third-Party Aggregator Plugins",
      cost: "KES 2,500/mo",
    },
    {
      name: "Bulk SMS Tracking & Alerts",
      original: "Africa's Talking / Twilio",
      cost: "KES 1,800/mo",
    },
    {
      name: "Inventory Syncing Software",
      original: "Stock Management Apps",
      cost: "KES 3,000/mo",
    },
    {
      name: "Automated Customer Chatbots",
      original: "ManyChat / Premium Tiers",
      cost: "KES 2,200/mo",
    },
  ];

  const handleScrollToForm = () => {
    const targetElement = document.getElementById("claim-workspace");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

      // Optional: Add focus to the first input field inside the workspace form automatically
      const firstInput = targetElement.querySelector("input");
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 600);
      }
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 bg-brand-bg">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="inline-flex text-xs font-black uppercase tracking-widest text-brand-primary bg-orange-50 px-3 py-1 rounded-md border border-brand-primary/20">
          A Simpler Solution
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight uppercase leading-none">
          Stop paying for <br className="hidden sm:inline" />
          <span className="text-brand-primary">5+ different apps</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-muted font-medium leading-relaxed">
          ClearRack consolidates your storefront infrastructure, automated
          drops, inventory pipelines, and payment collection into a single line
          of code.
        </p>
      </div>

      {/* Main Container mirroring the Stan layout structure */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Itemized App Stack List */}
          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 py-1"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-stone-900 tracking-tight">
                    {tool.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-400 font-normal">
                    Replaces {tool.original}
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-700 shrink-0">
                  {tool.cost}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-stone-100" />

          {/* Strikethrough Comparison & The ClearRack Final Price Tag */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-stone-400">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-black">✕</span> What You'd
                Spend Otherwise
              </div>
              <span className="line-through text-red-400">KES 13,400/mo</span>
            </div>

            <div className="flex items-center justify-between bg-orange-50/50 border border-brand-primary/20 rounded-2xl p-4 text-xs sm:text-sm font-black text-stone-900">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-primary flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
                <span>Join the ClearRack Family</span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg text-brand-primary">
                  KES 2,900/mo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Big Action Button under the card frame wired to smooth scroll handler */}
        <div className="mt-8 text-center">
          <button
            onClick={handleScrollToForm}
            className="inline-flex cursor-pointer items-center gap-2 bg-stone-900 hover:bg-brand-primary text-white text-xs sm:text-sm font-black uppercase tracking-wider px-8 py-4 rounded-xl shadow-md shadow-stone-900/10 transition-all duration-200 group"
          >
            Start My 14-Day Free Trial
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

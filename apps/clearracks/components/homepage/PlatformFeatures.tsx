import { Lucide } from "@repo/ui";
const { MessageSquare, Bot, Sparkles, CheckCircle2 } = Lucide;

export default function PlatformFeatures() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="inline-flex text-xs font-black uppercase tracking-widest text-brand-primary bg-orange-50 px-3 py-1 rounded-md border border-brand-primary/20">
          Built For High-Turnover Retail
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight uppercase leading-none">
          E-commerce execution <br className="hidden sm:inline" />
          <span className="text-brand-primary">
            at the speed of a chat message
          </span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-muted font-medium leading-relaxed">
          Ditch clunky shopping carts that kill buyer intent. Bring
          enterprise-grade inventory automation and zero-friction purchase
          channels straight to your storefront drops.
        </p>
      </div>

      {/* Unified, Beautiful Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1: Pure WhatsApp Purchasing */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/30 hover:shadow-md">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-brand-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">
              Zero-Friction Checkout
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted font-medium leading-relaxed">
              Every step happens inside the chat thread where your buyers are
              already active. Customers select catalog drops, pick sizes or
              unique items, and finalize the whole transaction over safe, direct
              M-Pesa STK prompts without landing page drop-offs.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-stone-700 font-bold pt-6 border-t border-stone-100 mt-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0" />{" "}
              Eliminates traditional cart abandonment
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0" />{" "}
              Native M-Pesa checkout processing
            </li>
          </ul>
        </div>

        {/* Feature 2: AI Assistance */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/30 hover:shadow-md">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-brand-primary">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">
              Automated Sales Guard
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted font-medium leading-relaxed">
              When a stock drop goes live, the platform handles massive
              concurrent text traffic instantly. The smart processing core locks
              available items the split-second a purchase stream begins,
              completely removing double-sales or manual booking updates.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-stone-700 font-bold pt-6 border-t border-stone-100 mt-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0" />{" "}
              Flawless 1-of-1 inventory control
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0" />{" "}
              Saves hours spent managing refund mistakes
            </li>
          </ul>
        </div>

        {/* Feature 3: Text-Based Admin Control */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/30 hover:shadow-md">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-brand-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">
              Real-Time Stock Velocity
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted font-medium leading-relaxed">
              Manage your shop metrics and stock units directly on the go.
              Texting images, sizes, or updates directly to your store backend
              automatically structures your customer-facing digital inventory,
              letting you focus entirely on curation.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-stone-700 font-bold pt-6 border-t border-stone-100 mt-6">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0" />{" "}
              Upload and structure stock via image texts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0" />{" "}
              Immediate dashboard synchronization
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

import { Lucide } from "@repo/ui";
const { XCircle, CheckCircle2 } = Lucide;

export default function DropChaosComparison() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-50 border border-stone-200/60 rounded-3xl p-8 lg:p-12">
        {/* Left Descriptive Text Side */}
        <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
          <span className="inline-flex text-[11px] font-black uppercase tracking-wider text-stone-500 bg-stone-200/60 px-2.5 py-1 rounded-md">
            The Reality of Stock Drops
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight uppercase leading-tight">
            Traditional Carts <br />
            <span className="text-brand-primary">Kill the Hype.</span>
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
            When you drop highly anticipated items or unique 1-of-1 pieces,
            standard e-commerce setups create friction. Here is how your sales
            process changes when you run on a direct chat engine.
          </p>
        </div>

        {/* Right Side Side-by-Side Comparison Columns */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Old Way Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider">
                The Slow Old Way
              </span>
            </div>
            <hr className="border-stone-100" />
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span>
                  Customers click a link, wait for a heavy website to load, and
                  drop off before the cart page.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span>
                  Buyers send manual payment screenshots to your DMs, forcing
                  you to cross-check records line-by-line.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span>
                  Two people pay for the exact same unique piece simultaneously,
                  resulting in messy refunds and angry clients.
                </span>
              </li>
            </ul>
          </div>

          {/* New Way Card */}
          <div className="bg-white border border-brand-primary/30 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest">
              Instant
            </div>
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider">
                The ClearRack Flow
              </span>
            </div>
            <hr className="border-stone-100" />
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-stone-800 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <span>
                  Buyers instantly view media catalogs and close checkout
                  entirely inside WhatsApp.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-stone-800 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <span>
                  M-Pesa STK push logs trigger automatically, validating
                  payments in real-time.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-stone-800 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <span>
                  The system instantly updates stock quantities and archives
                  items the exact second cash clears.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

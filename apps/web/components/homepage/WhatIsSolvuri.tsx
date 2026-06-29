// apps/web/components/WhatIsSolvuri.tsx
export const WhatIsSolvuri = () => {
  return (
    <section className="bg-[#F0EEF8] py-6 px-30">
      <div className="max-w-300 mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Heading */}
        <div>
          <div className="flex items-center gap-3 mb-8  font-medium text-xs tracking-widest uppercase">
            <span className="text-[#7C6EFF]">01</span>
            <div className="h-px w-8 bg-[#7C6EFF]"></div>
            <span className="text-[#7C7AAA]">What is Solvuri</span>
          </div>
          <h2 className="font-bebas text-[72px] leading-[0.9] text-[#0F0E2A]">
            WE RUN THE ENGINE.
            <br />
            YOU RUN
            <br />
            <span className="text-[#7C6EFF]">THE BRAND.</span>
          </h2>
        </div>

        {/* Right Column: Body Text */}
        <div className="flex flex-col gap-6 pt-4">
          <p className="text-[#56548A]  text-md leading-relaxed">
            Solvuri is modular, white-label business software. Each module is a
            complete product you resell under your own name — buy what you need
            today, add the rest when you grow, or take everything at once with a
            single Super License.
          </p>
          <p className="text-[#7C7AAA] text-sm">
            No AI marketing. No vague promises. Just serious infrastructure that
            runs quietly in the background while you build a real business under
            your own brand.
          </p>
        </div>
      </div>
    </section>
  );
};

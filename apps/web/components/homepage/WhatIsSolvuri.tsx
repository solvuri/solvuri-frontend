export const WhatIsSolvuri = () => {
  return (
    <section className="bg-[#F0EEF8] py-12 md:py-24 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left Column: Heading */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6 md:mb-8 font-medium text-xs tracking-widest uppercase">
            <span className="text-[#7C6EFF]">01</span>
            <div className="h-px w-8 bg-[#7C6EFF]"></div>
            <span className="text-[#7C7AAA]">What is Solvuri</span>
          </div>
          <h2 className="font-bebas text-[48px] md:text-[72px] leading-[0.9] text-[#0F0E2A]">
            WE RUN THE ENGINE.
            <span className="md:block"> YOU RUN</span>
            <span className="text-[#7C6EFF] md:block"> THE BRAND.</span>
          </h2>
        </div>

        {/* Right Column: Body Text */}
        <div className="flex flex-col gap-6 pt-0 md:pt-4 text-center md:text-left">
          <p className="text-[#56548A] text-lg leading-relaxed">
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

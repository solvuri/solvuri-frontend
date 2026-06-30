// apps/web/components/Hero.tsx
import { Button } from "@repo/ui";
import { BackgroundGrid } from "../shared/BackGroundGrid";

export const Hero = () => {
  return (
    <BackgroundGrid>
      {/* Reduced py-20 to py-12 for better mobile spacing */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-10 py-12 md:py-20 gap-8 md:gap-12">
        {/* Text Content */}
        <div className="flex flex-col text-center md:text-left items-center md:items-start">
          <h1 className="font-bebas text-[56px] md:text-[102px] leading-[0.9] md:leading-[1.1] text-white tracking-tight">
            YOUR BUSINESS, <span className="text-[#C8D400]">BUILT ON</span>{" "}
            SOLVURI.
          </h1>

          <p className="font-montserrat text-base md:text-[17px] text-[#9896B8] mt-6 mb-8 max-w-lg leading-relaxed">
            The infrastructure behind e-commerce, holidays, reservations and
            travel sold entirely under your brand. Buy one module or run them
            all.
          </p>

          {/* Responsive Buttons: Stack on mobile, side-by-side on desktop */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button className="text-[#0F0E2A] bg-[#C8D400] font-bold px-8 py-3 rounded-full w-full sm:w-auto">
              Explore modules
            </Button>
            <Button className="border border-[#7C6EFF26] text-[#E2E0FF] px-8 py-3 rounded-full w-full sm:w-auto">
              Get a Super License →
            </Button>
          </div>
        </div>

        {/* DevOps Illustration */}
        <div className="flex justify-center md:justify-end order-first md:order-last">
          <img
            src="/images/devops-illustration.png"
            alt="DevOps Infrastructure"
            className="w-full max-w-75 md:max-w-150 object-contain"
          />
        </div>
      </section>
    </BackgroundGrid>
  );
};

// apps/web/components/Hero.tsx
import { Button } from "@repo/ui";

export const Hero = () => {
  return (
    <section className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-10 py-20 gap-12">
      {/* Text Content */}
      <div className="flex flex-col">
        <h1 className="font-bebas text-[102px] leading-27.5 text-white tracking-tight">
          YOUR BUSINESS, <span className="text-secondary">BUILT ON</span>{" "}
          SOLVURI.
        </h1>
        <p className="font-montserrat text-[17px] text-muted mt-6 mb-8 max-w-120">
          The infrastructure behind e-commerce, holidays, reservations and
          travel sold entirely under your brand. Buy one module or run them all.
        </p>
        <div className="flex gap-4">
          <Button
            variant="accent"
            className="text-[#0F0E2A] bg-[#C8D400] font-bold px-5 py-2 rounded-full"
          >
            Explore modules
          </Button>
          <Button
            variant="secondary"
            className="border border-[#7C6EFF26] text-[#E2E0FF] px-5 py-2 rounded-full"
          >
            Get a Super License →
          </Button>
        </div>
      </div>

      {/* DevOps Illustration - Ensure this image is in public/images/ */}
      <div className="flex justify-center md:justify-end">
        <img
          src="/images/devops-illustration.png"
          alt="DevOps Infrastructure"
          className="w-full max-w-150 object-contain"
        />
      </div>
    </section>
  );
};

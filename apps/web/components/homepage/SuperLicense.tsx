"use client";
import { motion } from "framer-motion";
import { Button } from "@repo/ui";
import Link from "next/link";

const moduleDots = {
  ClearRack: "bg-[#FF8C69]",
  Safyri: "bg-[#60A5FA]",
  Reservr: "bg-[#00D4AA]",
};

export const SuperLicense = () => {
  return (
    <section className="bg-[#7C6EFF] py-16 md:py-24 px-6 md:px-10 text-center text-white relative overflow-hidden">
      {/* Background Shapes: Reduced size for mobile */}
      <div className="absolute top-[-10%] left-[-5%] w-40 h-40 md:w-75 md:h-75 rounded-full bg-[#5B4FD6] opacity-28"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-40 h-40 md:w-75 md:h-75 rounded-full bg-[#5B4FD6] opacity-28"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-white/70 text-[10px] uppercase tracking-widest font-semibold mb-6">
          03 — The All-In-One Bundle
        </div>

        {/* Scaled Heading: Removed <br /> to allow fluid wrapping */}
        <h2 className="font-bebas text-[#F0EEF8] text-[48px] md:text-[72px] leading-[0.9] mb-8">
          ONE LICENSE. EVERY MODULE.
        </h2>

        <p className="text-[#F0EEF8] text-sm mb-10 max-w-lg mx-auto leading-relaxed">
          Run all four products under one roof, one contract, one bill — with
          shared accounts, analytics and billing across the board.
        </p>

        {/* Module Badges: Wrap on mobile if they get too long */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["ClearRack", "Safyri", "Reservr"].map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 bg-[#0F0E2A]/20 px-4 py-2 rounded-full text-xs font-medium"
            >
              <div
                className={`w-2 h-2 rounded-full ${moduleDots[name as keyof typeof moduleDots]}`}
              ></div>
              {name}
            </div>
          ))}
        </div>

        <div className="text-3xl md:text-4xl font-bold mb-8">
          FROM{" "}
          <span className="font-bebas text-4xl md:text-5xl ml-2 text-[#0F0E2A]">
            $2,400
          </span>{" "}
          / MONTH
        </div>

        {/* Orbit Container: Fixed width container to prevent overflow */}
        <div className="relative inline-flex justify-center items-center h-40">
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#5B4FD6] opacity-28"
              style={{ x: -20, y: -20 }}
            />
          </motion.div>
          <Link href="/superlicense" className="relative z-10">
            <Button className="relative z-10 bg-[#0F0E2A] text-[#E2E0FF] px-8 py-4 rounded-full text-lg font-bold hover:bg-black transition-colors">
              Request a Super License
            </Button>{" "}
          </Link>
        </div>
      </div>
    </section>
  );
};

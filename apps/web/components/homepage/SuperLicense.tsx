"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui";

const moduleDots = {
  ClearRack: "bg-[#FF8C69]",
  Safyri: "bg-[#60A5FA]",
  Reservr: "bg-[#00D4AA]",
};

export const SuperLicense = () => {
  return (
    <section className="bg-[#7C6EFF] py-24 px-10 text-center text-white relative overflow-hidden">
      {/* Static Background Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-75 h-75 rounded-full bg-[#5B4FD6] opacity-28"></div>
      <div className="absolute top-[28%] right-[28%] w-55 h-55 rounded-full bg-[#5B4FD6] opacity-28"></div>
      <div className="absolute bottom-[-20%] right-[-5%] w-75 h-75 rounded-full bg-[#5B4FD6] opacity-28"></div>

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Label */}
        <div className="text-white/70 text-[10px] uppercase tracking-widest font-semibold mb-6">
          03 — The All-In-One Bundle
        </div>

        {/* Heading */}
        <h2 className="font-bebas text-[#F0EEF8] text-[72px] leading-[0.9] mb-8">
          ONE LICENSE.
          <br />
          EVERY MODULE.
        </h2>

        {/* Description */}
        <p className="text-[#F0EEF8] text-sm mb-10 max-w-lg mx-auto leading-relaxed">
          Run all four products under one roof, one contract, one bill — with
          shared accounts, analytics and billing across the board.
        </p>

        {/* Module Badges */}
        <div className="flex justify-center gap-4 mb-12">
          {["ClearRack", "Safyri", "Reservr"].map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 bg-[#0F0E2A47] px-4 py-2 rounded-full text-xs font-medium"
            >
              <div
                className={`w-2 h-2 rounded-full ${moduleDots[name as keyof typeof moduleDots]}`}
              ></div>
              {name}
            </div>
          ))}
        </div>

        {/* Pricing & CTA */}
        <div className="text-4xl font-bold mb-8">
          FROM{" "}
          <span className="font-bebas text-5xl ml-2 text-[#0F0E2A]">
            $2,400
          </span>{" "}
          / MONTH
        </div>

        {/* --- Button and Moving Shape Section --- */}
        <div className="relative inline-block mt-4">
          {/* The Wrapper: This rotates, carrying the shape with it */}
          <motion.div
            className="absolute top-1/2 left-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            {/* The Shape: Positioned offset from the center of the rotation wrapper */}
            <motion.div
              className="w-40 h-40 rounded-full bg-[#5B4FD6] opacity-28"
              style={{ x: -5, y: -50 }} // Offset to create the orbital radius
            />
          </motion.div>

          {/* Fixed Button */}
          <Button className="relative z-10 bg-[#0F0E2A] text-[#E2E0FF] px-6 py-3 rounded-full text-lg font-bold">
            Request a Super License
          </Button>
        </div>
      </div>
    </section>
  );
};

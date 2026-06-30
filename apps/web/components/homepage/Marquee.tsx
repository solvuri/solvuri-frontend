"use client";
import { motion } from "framer-motion";

export const Marquee = () => {
  const items = [
    "SAFYRI",
    "BOOKR",
    "FLYR",
    "WHITE-LABEL",
    "MODULAR",
    "SCALABLE",
    "YOUR BRAND",
    "CLEARRACK",
  ];

  return (
    <div className="w-full bg-[#0F0E2A] py-6 overflow-hidden border-y border-[#7C6EFF]/15">
      <motion.div
        className="flex items-center gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 30, // Increased for a smoother, slower flow
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {/* We double the array to ensure continuous flow */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-12 shrink-0">
            <span className="text-[#5C5A8A] font-medium text-xs tracking-[0.2em] uppercase">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFF]"></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

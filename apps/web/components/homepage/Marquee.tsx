// apps/web/components/Marquee.tsx
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
    <div className="bg-[#0F0E2A] py-6  overflow-hidden">
      <motion.div
        className="flex items-center gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-12">
            <span className="text-[#9896B8] font-medium text-xs tracking-widest uppercase">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#7C6EFF]"></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// apps/web/components/navigation/Navbar.tsx
import React from "react";
import { Button } from "@repo/ui";

export const Navbar = () => {
  const links = ["Modules", "Platform", "Pricing", "About"];

  return (
    // Added border, rounded-full (100px), and specific padding
    <nav className="flex items-center justify-between mt-4 mx-auto max-w-[920px] py-[5px] px-[12px] rounded-full border border-[#7C6EFF]/15 bg-[#0F0E2A]/55 backdrop-blur-sm">
      {/* Logo */}
      <div className="text-lg font-bold tracking-tighter text-white ml-2">
        SOLVURI
      </div>

      {/* Links - Added gap-8 to match the 32px gap property */}
      <div className="flex gap-8 text-sm text-[#9896B8]">
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="hover:text-[#7C6EFF] transition-colors"
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA - Using the specific yellow-green accent */}
      <Button
        variant="accent"
        className="text-[#0F0E2A] bg-[#C8D400] font-bold px-5 py-2 rounded-full"
      >
        Get started
      </Button>
    </nav>
  );
};

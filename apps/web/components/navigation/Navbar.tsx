"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";
import { BackgroundGrid } from "../shared/BackGroundGrid";
import { Menu, X } from "lucide-react"; // Make sure to install lucide-react

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Modules", "Platform", "Pricing", "About"];

  return (
    <>
      <BackgroundGrid>
        <nav className="flex items-center justify-between mt-4 mx-auto max-w-300 py-2 px-4 rounded-full border border-[#7C6EFF]/15 bg-[#0F0E2A]/55 backdrop-blur-sm relative z-50">
          {/* Logo */}
          <div className="text-lg font-bold tracking-tighter text-white ml-2">
            SOLVURI
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-sm text-[#9896B8]">
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

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button className="text-[#0F0E2A] bg-[#C8D400] font-bold px-5 py-2 rounded-full">
              Get started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </BackgroundGrid>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-[#16153D] p-6 rounded-2xl border border-[#7C6EFF]/15 z-40 flex flex-col gap-4 text-center">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white text-lg py-2"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
          <Button className="w-full bg-[#C8D400] text-[#0F0E2A] font-bold py-3 rounded-full mt-2">
            Get started
          </Button>
        </div>
      )}
    </>
  );
};

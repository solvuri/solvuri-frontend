// apps/web/app/modules/page.tsx
"use client";

import { useState } from "react";

import { MODULES_DATA } from "../../utils/modulesData"; // Import the data
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";
import Image from "next/image";

export default function ModulesPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        {/* Increased max-w for better side-by-side layout */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bebas text-white mb-12">
            Infrastructure Modules
          </h1>

          {/* Change space-y-6 to grid with responsive columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES_DATA.map((m, index) => (
              <div
                key={m.title}
                // Remove p-6 from here, keep overflow-hidden to clip the image corners
                className="bg-[#16153D] rounded-2xl border border-[#7C6EFF]/15 flex flex-col md:flex-row overflow-hidden"
              >
                {/* Image container: Set padding to 0, it now fills the border */}
                <div className="relative w-full md:w-1/3 h-48 md:h-auto shrink-0">
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    className="object-cover" // object-cover fills the space completely
                  />
                </div>

                {/* Content container: Apply p-6 here so only the text has padding */}
                <div className="flex flex-col grow p-6">
                  <h2 className="text-2xl font-bold text-white">{m.title}</h2>
                  <p className="text-[#9896B8] mt-2 grow">{m.description}</p>

                  {/* Button and Expandable Content */}
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className="text-[#C8D400] cursor-pointer mt-4 font-semibold hover:underline self-start"
                  >
                    {expandedIndex === index
                      ? "View Less ↑"
                      : "View More Details ↓"}
                  </button>

                  {expandedIndex === index && (
                    <div className="mt-6 pt-6 border-t border-[#7C6EFF]/20 animate-in fade-in">
                      <p className="text-white text-sm leading-relaxed">
                        {m.longDescription}
                      </p>
                      <div className="mt-4">
                        <h4 className="font-bold text-white text-sm">FAQ:</h4>
                        {m.faqs.map((f, i) => (
                          <p key={i} className="text-[#9896B8] mt-2 text-xs">
                            <span className="text-white font-medium">
                              {f.q}
                            </span>{" "}
                            {f.a}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}

"use client";

import React from "react";
import Image from "next/image";

// You can extend this with your actual image data later
const SLIDES = [
  {
    id: 1,
    title: "New Season Arrivals",
    subtitle: "Explore the latest collection",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Premium Craftsmanship",
    subtitle: "Handmade in Kenya",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=600&fit=crop&q=80",
  },
];

export default function HeroSlider() {
  return (
    <div className="relative w-full h-75 md:h-100 overflow-hidden">
      {/* Container for slides - this would be your carousel wrapper */}
      <div className="flex h-full transition-transform duration-500">
        {SLIDES.map((slide) => (
          <div key={slide.id} className="relative min-w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={slide.id === 1}
              className="object-cover"
            />

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            {/* Slide Content */}
            <div className="absolute bottom-10 left-6 md:left-12 text-white">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-blue-600 px-2 py-1 rounded">
                Featured
              </span>
              <h2 className="text-2xl md:text-4xl font-black mt-2">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-zinc-200">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
        {SLIDES.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

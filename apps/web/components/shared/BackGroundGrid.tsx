"use client";

import { useState } from "react";

export const BackgroundGrid = ({ children }: { children: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // This mask is now used for BOTH grid layers
  const mask = `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 60%)`;

  return (
    <div
      className="relative overflow-hidden bg-[#0F0E2A]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* 1. Base Grid (Visible only where mouse is, faint) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M8 0h24a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z' fill='none' stroke='%23C8D400' stroke-opacity='0.12' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
          maskImage: mask,
          WebkitMaskImage: mask,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* 2. Highlighted Grid (Brighter, only visible where mouse is) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M8 0h24a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z' fill='none' stroke='%23C8D400' stroke-opacity='0.6' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
          maskImage: mask,
          WebkitMaskImage: mask,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

"use client";

import { Navbar as SharedNavbar } from "@repo/ui";
import { BackgroundGrid } from "../shared/BackGroundGrid";

const links = ["Modules", "Platform", "Pricing", "About"].map((label) => ({
  label,
  href: `/${label.toLowerCase()}`,
}));

export const Navbar = () => (
  <BackgroundGrid>
    <SharedNavbar
      variant="floating"
      logo="SOLVURI"
      links={links}
      cta={{ label: "Get started", href: "/modules" }}
    />
  </BackgroundGrid>
);

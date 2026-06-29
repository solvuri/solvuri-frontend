// apps/web/app/page.tsx
import { Hero } from "../components/homepage/Hero";
import { Marquee } from "../components/homepage/Marquee";
import { ModulesSection } from "../components/homepage/ModuleSection";
import { SuperLicense } from "../components/homepage/SuperLicense";
import { TrustedBy } from "../components/homepage/TrustedBy";
import { WhatIsSolvuri } from "../components/homepage/WhatIsSolvuri";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      <Marquee />
      <TrustedBy />
      <WhatIsSolvuri />
      <ModulesSection />
      <SuperLicense />
    </main>
  );
}

// apps/web/app/modules/page.tsx
import type { Metadata } from "next";
import { ModulesGrid } from "./ModulesGrid";

export const metadata: Metadata = {
  title: "Modules | Solvuri",
  description:
    "ClearRack, Safyri, Reservr, and Master — four white-label infrastructure modules for e-commerce, travel, reservations, and platform orchestration.",
};

export default function ModulesPage() {
  return <ModulesGrid />;
}

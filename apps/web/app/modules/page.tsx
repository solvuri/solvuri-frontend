// apps/web/app/modules/page.tsx
import type { Metadata } from "next";
import { ModulesGrid } from "./ModulesGrid";

export const metadata: Metadata = {
  title: "Modules | Solvuri",
  description:
    "ClearRack and POS — white-label infrastructure modules for e-commerce and point-of-sale.",
};

export default function ModulesPage() {
  return <ModulesGrid />;
}

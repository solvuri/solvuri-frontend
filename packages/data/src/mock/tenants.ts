import type { Tenant } from "@repo/types";

// Stand-in tenant data until a real tenant/subscription API exists. Spans
// both real modules (clearrack, pos) with varied plan/status/revenue so
// admin views have something realistic to filter and sum over.
// monthlyRevenue is in KES, matching apps/clearracks's existing currency
// convention.
export const MOCK_TENANTS: Tenant[] = [
  {
    id: "tnt-001",
    name: "Nairobi Threads",
    domain: "nairobithreads.solvuri.app",
    module: "clearrack",
    plan: "growth",
    status: "active",
    monthlyRevenue: 620000,
    createdAt: "2026-01-14",
    settings: { whatsappNumber: "+254712345001", themeColor: "#FF8C69" },
  },
  {
    id: "tnt-002",
    name: "Savanna Outfitters",
    domain: "savannaoutfitters.solvuri.app",
    module: "clearrack",
    plan: "enterprise",
    status: "active",
    monthlyRevenue: 1450000,
    createdAt: "2025-09-02",
    settings: { whatsappNumber: "+254712345002", themeColor: "#FF8C69" },
  },
  {
    id: "tnt-003",
    name: "Coastal Craft Co.",
    domain: "coastalcraft.solvuri.app",
    module: "clearrack",
    plan: "starter",
    status: "trial",
    monthlyRevenue: 78000,
    createdAt: "2026-06-30",
    settings: { whatsappNumber: "+254712345003", themeColor: "#FF8C69" },
  },
  {
    id: "tnt-009",
    name: "Westlands Express Mart",
    domain: "demo.solvuripos.xyz",
    module: "pos",
    plan: "growth",
    status: "active",
    monthlyRevenue: 540000,
    createdAt: "2026-02-18",
    settings: { whatsappNumber: "+254712345009", themeColor: "#F59E0B" },
  },
  {
    id: "tnt-010",
    name: "Nakuru Corner Shop",
    domain: "nakurucorner.solvuripos.xyz",
    module: "pos",
    plan: "starter",
    status: "active",
    monthlyRevenue: 95000,
    createdAt: "2026-05-22",
    settings: { whatsappNumber: "+254712345010", themeColor: "#F59E0B" },
  },
];

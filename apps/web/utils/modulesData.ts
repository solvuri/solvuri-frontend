// apps/web/utils/modulesData.ts

import { ModuleInfo } from "@repo/types"; // Import from your shared package

export const MODULES_DATA: ModuleInfo[] = [
  {
    title: "CLEARACK",
    slug: "clearack",
    category: "Ecommerce",
    description:
      "High-velocity white-label e-commerce storefront for stock drops.",
    longDescription:
      "Clearack is an infrastructure engine purpose-built for high-traffic stock drops and limited-edition product releases. It features advanced queue management to prevent server overload, instant checkout capabilities, and real-time transaction monitoring to ensure a seamless experience for your customers during peak spikes.",
    features: [
      "Storefront + headless API",
      "Queue management for stock drops",
      "Real-time transaction monitoring",
    ],
    accentColor: "#FF8C69",
    image: "/images/clearack.png",
    href: "https://clearack.xyz",
    faqs: [
      {
        q: "Is it fully white-label?",
        a: "Yes, you have complete control over the branding, domain, and UI components.",
      },
      {
        q: "Can it handle flash sales?",
        a: "Absolutely. It is specifically optimized to manage thousands of concurrent users during rapid inventory release events.",
      },
    ],
  },
  {
    title: "POS",
    slug: "pos",
    category: "Point of Sale",
    description:
      "In-person register for walk-in sales, synced with the rest of your Solvuri modules.",
    longDescription:
      "POS brings the same white-label infrastructure to in-person retail. Ring up sales from a shared product catalog, take cash, card, or M-Pesa payments, and keep a running sales history — all on the same platform as your online storefront.",
    features: [
      "Fast checkout for walk-in customers",
      "Cash, card & M-Pesa tender",
      "Shared product catalog with Clearack",
      "Works on any tablet or laptop",
    ],
    accentColor: "#F59E0B",
    image: "/images/pos.png",
    href: "https://solvuripos.xyz",
    faqs: [
      {
        q: "Does it share products with Clearack?",
        a: "Yes, POS reads from the same product catalog, so in-person and online inventory stay in sync.",
      },
      {
        q: "What payment methods are supported?",
        a: "Cash, card, and M-Pesa out of the box.",
      },
    ],
  },
];

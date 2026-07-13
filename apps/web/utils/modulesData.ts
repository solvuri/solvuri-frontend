// apps/web/utils/modulesData.ts

import { ModuleInfo } from "@repo/types"; // Import from your shared package

export const MODULES_DATA: ModuleInfo[] = [
  {
    title: "CLEARRACK",
    description:
      "High-velocity white-label e-commerce storefront for stock drops.",
    longDescription:
      "ClearRack is an infrastructure engine purpose-built for high-traffic stock drops and limited-edition product releases. It features advanced queue management to prevent server overload, instant checkout capabilities, and real-time transaction monitoring to ensure a seamless experience for your customers during peak spikes.",
    image: "/images/clearrack.png",
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
    title: "SAFYRI",
    description: "End-to-end white-label travel booking and management engine.",
    longDescription:
      "Safyri empowers travel agencies and tour operators with a robust booking infrastructure. It supports real-time inventory synchronization across multiple providers, automated itinerary generation, and comprehensive booking lifecycle management from search to confirmation.",
    image: "/images/safyri.png",
    faqs: [
      {
        q: "Does it support international payments?",
        a: "Yes, it integrates with major global payment gateways to handle multi-currency transactions.",
      },
      {
        q: "Can I manage live availability?",
        a: "Yes, the system syncs with real-time provider APIs to ensure live accuracy on all booking slots.",
      },
    ],
  },
  {
    title: "RESERVR",
    description:
      "Comprehensive reservation management for services and venues.",
    longDescription:
      "Reservr is a powerful booking solution designed for businesses requiring scheduled time-slot management, such as venue rentals, service appointments, or hospitality bookings. It features smart conflict detection, automated reminder triggers, and seamless calendar integration.",
    image: "/images/reservr.png",
    faqs: [
      {
        q: "Is there an automated reminder system?",
        a: "Yes, you can configure custom email and SMS triggers for upcoming reservations.",
      },
      {
        q: "Does it support group bookings?",
        a: "Yes, the system allows for multi-person slot management with optional capacity constraints.",
      },
    ],
  },
  {
    title: "MASTER",
    description:
      "Advanced centralized platform for multi-module orchestration.",
    longDescription:
      "Master serves as the operational hub, allowing you to manage and orchestrate the entire Solvuri module ecosystem from a single interface. It provides unified data analytics, global user management, and centralized financial reporting across all your white-label business entities.",
    image: "/images/master.png",
    faqs: [
      {
        q: "Can I use Master to run only one module?",
        a: "Yes, Master is modular; you can scale your operations by adding new modules as your business grows.",
      },
      {
        q: "Is there unified reporting?",
        a: "Yes, Master provides a consolidated dashboard for cross-module performance metrics and revenue tracking.",
      },
    ],
  },
];

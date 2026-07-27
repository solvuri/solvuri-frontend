import type { MetadataRoute } from "next";

// Placeholder — confirm the real production domain before launch (see
// layout.tsx's SITE_URL for the same placeholder).
const SITE_URL = "https://solvuri.com";

const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/modules", priority: 0.9 },
  { path: "/platform", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
  { path: "/superlicense", priority: 0.8 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/careers", priority: 0.5 },
  { path: "/blog", priority: 0.3 },
  { path: "/press", priority: 0.3 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/security", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    priority: r.priority,
  }));
}

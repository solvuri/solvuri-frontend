import type { MetadataRoute } from "next";

// Placeholder — confirm the real production domain before launch.
const SITE_URL = "https://solvuri.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

// apps/web/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";

// Configure your custom fonts
const bebasNeue = localFont({
  src: "./fonts/bebas-neue-v16-latin-regular.woff2",
  variable: "--font-bebas-neue",
});

const montserrat = localFont({
  src: [
    {
      path: "./fonts/montserrat-v31-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/montserrat-v31-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/montserrat-v31-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/montserrat-v31-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/montserrat-v31-latin-800.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/montserrat-v31-latin-900.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
});

// Placeholder — confirm the real production domain before launch.
const SITE_URL = "https://solvuri.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Solvuri | Modular Business Infrastructure",
  description:
    "Run e-commerce, holidays, and reservations under your own brand with Solvuri's modular, white-label business software.",
  keywords: [
    "white-label e-commerce",
    "business software",
    "modular infrastructure",
    "Solvuri",
  ],
  authors: [{ name: "Solvuri Ltd." }],
  openGraph: {
    title: "Solvuri | Modular Business Infrastructure",
    description:
      "The infrastructure behind e-commerce, holidays, and travel sold entirely under your brand.",
    siteName: "Solvuri",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Solvuri | Modular Business Infrastructure",
    description:
      "The infrastructure behind e-commerce, holidays, and travel sold entirely under your brand.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <body className="font-montserrat bg-background text-text antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

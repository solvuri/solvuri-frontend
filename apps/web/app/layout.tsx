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
  src: "./fonts/montserrat-v31-latin-regular.woff2",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
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

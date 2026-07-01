import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@/app/globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClearRack | Turn Your Stock Drops Into Instant Cash Flow",
  description:
    "The high-velocity e-commerce engine built for physical stock drops. Sell out your limited apparel collections and 1-of-1 items instantly right inside WhatsApp with automated M-Pesa tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
        {/* Global Fixed Navigation Header Bar */}
        <Navbar />

        {/* Content Node Frame with dynamic top spacing offset for sticky navbar overlay visibility */}
        <main className="flex-1 pt-4">{children}</main>

        {/* Global Marketing Platform Footer */}
        <Footer />
      </body>
    </html>
  );
}

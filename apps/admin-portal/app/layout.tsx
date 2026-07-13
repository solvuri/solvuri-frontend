import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./Providers";

const bebasNeue = localFont({
  src: "../../../apps/web/app/fonts/bebas-neue-v16-latin-regular.woff2",
  variable: "--font-bebas-neue",
});

const montserrat = localFont({
  src: "../../../apps/web/app/fonts/montserrat-v31-latin-regular.woff2",
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

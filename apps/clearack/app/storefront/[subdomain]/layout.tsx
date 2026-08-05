import React from "react";
import "../../globals.css"; // Ensure your global styles are imported here
import StoreNavbar from "@/components/stores/navigation/StoreNavbar";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="w-full min-h-screen bg-stone-50">
          <StoreNavbar subdomain={subdomain} />
          {children}
        </div>
      </body>
    </html>
  );
}

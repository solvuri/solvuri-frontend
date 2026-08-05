"use client";

import React from "react";
import Link from "next/link";
import { FaIcons } from "@repo/ui";
import { displayName } from "@/lib/merchants";
const { FaFacebook, FaInstagram, FaTwitter } = FaIcons;

export default function StoreFooter({ subdomain }: { subdomain: string }) {
  const currentYear = new Date().getFullYear();
  const brand = displayName(subdomain);

  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-white text-xl font-black">
            {brand.toUpperCase()}
          </h2>
          <p className="text-sm">Quality products, all in one place.</p>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="text-white font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/store" className="hover:text-white">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-white">
                Collections
              </Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-white">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-white">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Newsletter */}
        <div className="space-y-4">
          <h4 className="text-white font-bold">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-400">
              <FaFacebook size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-400">
              <FaInstagram size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-400">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-xs">
        <p>
          © {currentYear} {brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

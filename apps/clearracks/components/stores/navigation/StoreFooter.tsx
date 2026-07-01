"use client";

import React from "react";
import Link from "next/link";
import { FaIcons } from "@repo/ui";
const { FaFacebook, FaInstagram, FaTwitter } = FaIcons;

export default function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-white text-xl font-black">SAFYRI</h2>
          <p className="text-sm">
            Handcrafted quality for your next adventure. Made with care by local
            artisans.
          </p>
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
            <a href="#" className="hover:text-blue-400">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-pink-400">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-sky-400">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-800 text-center text-xs">
        <p>© {currentYear} Safyri. All rights reserved.</p>
      </div>
    </footer>
  );
}

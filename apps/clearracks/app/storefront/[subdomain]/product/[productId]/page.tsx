// src/app/product/[id]/page.tsx
"use client";

import ProductDetail from "@/components/stores/ProductDetail";
import Image from "next/image";
import Link from "next/link";

import { Lucide } from "@repo/ui";
import type { Product } from "@repo/types";
const { ChevronLeft, Heart, Share2 } = Lucide;

const MOCK_PRODUCT: Product = {
  id: "prod-10",
  name: "Safari Boots — Suede",
  price: 6500,
  rating: 4.7,
  reviews: 38,
  description:
    "Durable suede safari boots with rubber sole. Perfect for bush walks and outdoor adventures. Water-resistant treatment and cushioned insole for all-day comfort.",
  highlights: [
    "Premium Suede Leather",
    "Water-Resistant Treatment",
    "Cushioned Memory Foam Insole",
    "Anti-Slip Rubber Sole",
    "Ankle Support",
  ],
  colors: ["#e3c8a0", "#5d4037"],
  sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
  images: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=80",
  ],
};

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* 1. Hero Image - Kept here for clean page structure */}
      <div className="relative h-87.5 w-full bg-zinc-200">
        <Image
          src={MOCK_PRODUCT.images[0] ?? ""}
          alt={MOCK_PRODUCT.name}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute top-0 w-full flex items-center justify-between p-4">
          <Link
            href=".."
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex gap-2">
            <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg">
              <Heart size={20} />
            </button>
            <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Import the logic-heavy component */}
      <ProductDetail product={MOCK_PRODUCT} />
    </main>
  );
}

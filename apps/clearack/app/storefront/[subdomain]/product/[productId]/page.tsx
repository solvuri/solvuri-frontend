// src/app/product/[id]/page.tsx
"use client";

import { use } from "react";
import ProductDetail from "@/components/stores/ProductDetail";
import Image from "next/image";
import Link from "next/link";

import { Lucide } from "@repo/ui";
import { useMerchantCategories, useMerchantProducts } from "@/lib/clearackApi";
import { resolveMerchantId } from "@/lib/merchants";
const { ChevronLeft, Heart, Share2 } = Lucide;

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ subdomain: string; productId: string }>;
}) {
  const { subdomain, productId } = use(params);
  const merchantId = resolveMerchantId(subdomain);

  // No dedicated single-product anonymous endpoint exists — fetch the
  // merchant's whole catalog (same call the storefront home page makes,
  // cached by React Query) and find the matching id client-side.
  const { data: products, isLoading, error } = useMerchantProducts(merchantId);
  const { data: categories } = useMerchantCategories(merchantId);

  const product = products?.find((p) => p.id === Number(productId));

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-50 pb-24 p-4">
        <p className="text-sm text-zinc-500">Loading product…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-zinc-50 pb-24 p-4">
        <p className="text-sm text-red-600">Couldn&apos;t find this product.</p>
      </main>
    );
  }

  const categoryName =
    categories?.find((c) => c.id === product.categoryId)?.categoryName ??
    "General";

  return (
    <main className="min-h-screen bg-zinc-50 pb-24">
      {/* 1. Hero Image - Kept here for clean page structure */}
      <div className="relative h-87.5 w-full bg-zinc-200">
        <Image
          src={product.mainImageUrl || "/placeholder.png"}
          alt={product.productName}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute top-0 w-full flex items-center justify-between p-4">
          <Link
            href=".."
            aria-label="Back"
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex gap-2">
            <button
              aria-label="Add to favorites"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-lg"
            >
              <Heart size={20} />
            </button>
            <button
              aria-label="Share"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-lg"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Import the logic-heavy component */}
      <ProductDetail product={product} categoryName={categoryName} />
    </main>
  );
}

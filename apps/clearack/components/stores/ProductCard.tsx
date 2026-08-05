"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Lucide } from "@repo/ui";
const { ShoppingCart, Heart } = Lucide;

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  image: string;
  inStock: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  categoryName,
  image,
  inStock,
}: ProductCardProps) {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);

  const isInCart = cart.some((item) => item.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInCart) {
      addToCart({ id, name, price, image });
    }
  };

  return (
    <div className="group flex flex-col gap-2 rounded-xl bg-white transition-shadow hover:shadow-lg border border-brand-border/50 overflow-hidden">
      {/* Clickable Image Area */}
      <Link
        href={`/product/${id}`}
        className="relative aspect-square overflow-hidden rounded-t-lg bg-brand-surface block"
      >
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[10px] font-medium uppercase tracking-tight rounded border border-brand-border">
            Product
          </span>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        aria-label="Add to favorites"
        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded border border-brand-border hover:bg-zinc-50 z-10"
      >
        <Heart size={14} className="text-brand-muted" />
      </button>

      {!inStock && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <span className="bg-zinc-900 text-white text-[10px] font-bold uppercase px-3 py-1 rounded">
            Sold Out
          </span>
        </div>
      )}

      {/* Info Container */}
      <div className="flex flex-col gap-0.5 p-2">
        <span className="text-[10px] text-brand-muted uppercase tracking-wider">
          {categoryName}
        </span>

        <Link href={`/product/${id}`} className="hover:underline">
          <h3 className="text-sm font-medium text-zinc-900 truncate">{name}</h3>
        </Link>

        {/* Price and Cart Row */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-zinc-900">
            KES {price.toLocaleString()}
          </span>
          <button
            aria-label={isInCart ? "Added to cart" : "Add to cart"}
            disabled={!inStock || isInCart}
            onClick={handleAddToCart}
            className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
              isInCart
                ? "bg-green-600 text-white"
                : "bg-brand-primary text-white hover:bg-brand-primary/90"
            }`}
          >
            {isInCart ? (
              <span className="text-[10px] font-bold px-0.5">ADDED</span>
            ) : (
              <ShoppingCart size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

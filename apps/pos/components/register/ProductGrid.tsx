"use client";

import Image from "next/image";
import type { Product } from "@repo/types";
import { useRegister } from "@/lib/store";

export default function ProductGrid({ products }: { products: Product[] }) {
  const addItem = useRegister((state) => state.addItem);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] ?? "",
            })
          }
          className="group flex flex-col gap-2 rounded-xl bg-surface border border-primary/10 overflow-hidden text-left hover:border-primary/40 transition-colors cursor-pointer"
        >
          <div className="relative aspect-square bg-background">
            <Image
              src={product.images[0] ?? "/placeholder.png"}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="px-3 pb-3">
            <h3 className="text-sm font-medium text-text truncate">
              {product.name}
            </h3>
            <p className="text-sm font-bold text-accent">
              KES {product.price.toLocaleString()}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import type { PosProduct } from "@repo/types";
import { addCartItem, createCart } from "@/lib/posApi";
import { useRegister } from "@/lib/store";

export default function ProductGrid({
  products,
  merchantId,
}: {
  products: PosProduct[];
  merchantId: number;
}) {
  const cartId = useRegister((state) => state.cartId);
  const setCartId = useRegister((state) => state.setCartId);
  const queryClient = useQueryClient();
  const [pendingProductId, setPendingProductId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");

  const handleAdd = async (product: PosProduct) => {
    setError("");
    setPendingProductId(product.id);
    try {
      let activeCartId = cartId;
      if (activeCartId === null) {
        const cart = await createCart(merchantId);
        activeCartId = cart.id;
        setCartId(cart.id);
      }
      const updatedCart = await addCartItem(
        merchantId,
        activeCartId,
        product.id,
        1,
      );
      queryClient.setQueryData(
        ["pos-cart", merchantId, activeCartId],
        updatedCart,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't add that item.",
      );
    } finally {
      setPendingProductId(null);
    }
  };

  return (
    <div>
      {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            disabled={pendingProductId === product.id}
            onClick={() => handleAdd(product)}
            className="group flex flex-col gap-2 rounded-xl bg-surface border border-primary/10 overflow-hidden text-left hover:border-primary/40 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait"
          >
            <div className="relative aspect-square bg-background">
              <Image
                src={product.mainImageUrl || "/placeholder.png"}
                alt={product.productName}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-3 pb-3">
              <h3 className="text-sm font-medium text-text truncate">
                {product.productName}
              </h3>
              <p className="text-sm font-bold text-accent">
                {pendingProductId === product.id
                  ? "Adding..."
                  : `KES ${product.price.toLocaleString()}`}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

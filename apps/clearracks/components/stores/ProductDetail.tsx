"use client";

import { useStore } from "@/lib/store";
import { Lucide } from "@repo/ui";
import type { ClearackProduct } from "@repo/types";
const { ShoppingCart } = Lucide;

interface Props {
  product: ClearackProduct;
  categoryName: string;
}

export default function ProductDetail({ product, categoryName }: Props) {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const isInCart = cart.some((item) => item.id === product.id);
  const inStock = product.stockQuantity > 0;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({
        id: product.id,
        name: product.productName,
        price: product.price,
        image: product.mainImageUrl ?? "",
      });
    }
  };

  return (
    <>
      <div className="p-4 space-y-4">
        {/* Header Info */}
        <section className="bg-white p-4 rounded-lg border flex items-start justify-between">
          <div>
            <span className="text-xs bg-blue-100 rounded-xl py-1 px-2 text-blue-600 font-bold">
              {categoryName}
            </span>
            <h1 className="text-2xl font-black text-zinc-900">
              {product.productName}
            </h1>
            <p className="text-zinc-500 text-sm">
              {inStock
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-bold">price</span>
            <p className="text-xl font-black text-blue-700">
              KES {product.price.toLocaleString()}
            </p>
          </div>
        </section>

        {/* About Section */}
        {product.description && (
          <section className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-sm text-zinc-600">{product.description}</p>
          </section>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 w-full p-4 bg-white border-t flex gap-2 z-30">
        <button
          onClick={handleAddToCart}
          disabled={isInCart || !inStock}
          className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
            isInCart || !inStock
              ? "bg-brand-muted text-white cursor-not-allowed"
              : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
          }`}
        >
          <ShoppingCart size={18} />
          {isInCart ? "Added to Cart" : !inStock ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </>
  );
}

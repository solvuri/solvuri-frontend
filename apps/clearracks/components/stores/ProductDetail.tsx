"use client";

import { useStore } from "@/lib/store";

import { Lucide } from "@repo/ui";
import type { Product } from "@repo/types";
const { Star, ShoppingCart } = Lucide;

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
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
              Product
            </span>
            <h1 className="text-2xl font-black text-zinc-900">
              {product.name}
            </h1>
            <p className="text-zinc-500 text-sm">Nairobi Sole</p>
            <div className="flex items-center gap-1 text-sm mt-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-zinc-400">({product.reviews} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-bold">price</span>
            <p className="text-xl font-black text-blue-700">
              KES {product.price.toLocaleString()}
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">About</h3>
          <p className="text-sm text-zinc-600">{product.description}</p>
        </section>

        {/* Highlights Section */}
        <section className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">Highlights</h3>
          <ul className="space-y-1">
            {(product.highlights ?? []).map((h) => (
              <li
                key={h}
                className="text-sm text-zinc-600 flex items-center gap-3"
              >
                <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full">
                  <span className="text-[10px] font-bold">✓</span>
                </span>
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Color Selection */}
        <section className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">Color</h3>
          <div className="flex gap-3">
            {(product.colors ?? []).map((c) => (
              <div
                key={c}
                className="w-10 h-10 rounded-lg border"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </section>

        {/* Size Selection */}
        <section className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {(product.sizes ?? []).map((s) => (
              <button
                key={s}
                className="p-2 border rounded-md text-sm hover:border-blue-600"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Quantity Selector */}
        <section className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">Quantity</h3>
          <div className="flex items-center gap-4 border rounded-lg w-max p-2">
            <button aria-label="Decrease quantity" className="px-3">
              -
            </button>
            <span className="font-bold">1</span>
            <button aria-label="Increase quantity" className="px-3">
              +
            </button>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold mb-2">Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-300" />
            <div>
              <p className="text-sm font-bold">Michael R.</p>
              <div className="flex text-yellow-400">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-600 mt-2">
            Very comfortable and sturdy. Great for hiking.
          </p>
        </section>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 w-full p-4 bg-white border-t flex gap-2 z-30">
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
            isInCart
              ? "bg-brand-muted text-white cursor-not-allowed"
              : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
          }`}
        >
          <ShoppingCart size={18} />
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </button>
        <button className="flex-1 bg-brand-primary text-white py-3 rounded-lg font-bold">
          Buy Now
        </button>
      </div>
    </>
  );
}

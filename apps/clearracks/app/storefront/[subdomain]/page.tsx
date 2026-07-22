"use client";

import HeroSlider from "@/components/stores/HeroSlider";
import StoreFooter from "@/components/stores/navigation/StoreFooter";
import ProductCard from "@/components/stores/ProductCard";
import { useProducts } from "@repo/data";

// Store/tenant info isn't fetched yet — only product data has a real hook
// so far (see @repo/data's useProducts).
const STORE_NAME = "Nairobi Style";

export default function StorefrontPage() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <main className="min-h-screen bg-white antialiased">
      <HeroSlider />

      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end gap-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
            {STORE_NAME}&apos;s Picks
          </h2>
          {products && (
            <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
              {products.length} Items In Stock
            </span>
          )}
        </div>

        {isLoading && (
          <p className="text-sm text-zinc-500">Loading products…</p>
        )}
        {error && (
          <p className="text-sm text-red-600">
            Couldn&apos;t load products. Please try again.
          </p>
        )}

        {products && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                categoryName={p.category?.name || "General"}
                image={p.images[0] ?? ""}
                isSold={p.isSold}
              />
            ))}
          </div>
        )}
      </section>
      <StoreFooter />
    </main>
  );
}

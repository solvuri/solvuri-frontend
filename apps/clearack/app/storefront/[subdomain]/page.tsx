"use client";

import { use } from "react";
import HeroSlider from "@/components/stores/HeroSlider";
import StoreFooter from "@/components/stores/navigation/StoreFooter";
import ProductCard from "@/components/stores/ProductCard";
import { useMerchantCategories, useMerchantProducts } from "@/lib/clearackApi";
import { resolveMerchantId } from "@/lib/merchants";

export default function StorefrontPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const merchantId = resolveMerchantId(subdomain);

  const { data: products, isLoading, error } = useMerchantProducts(merchantId);
  const { data: categories } = useMerchantCategories(merchantId);

  if (merchantId === null) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <p className="text-zinc-500 text-sm">
          Store not found. Check the URL and try again.
        </p>
      </main>
    );
  }

  const categoryName = (categoryId?: number) =>
    categories?.find((c) => c.id === categoryId)?.categoryName ?? "General";

  return (
    <main className="min-h-screen bg-white antialiased">
      <HeroSlider />

      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end gap-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
            {subdomain}&apos;s Picks
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
        {products && products.length === 0 && (
          <p className="text-sm text-zinc-500">No products yet.</p>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.productName}
                price={p.price}
                categoryName={categoryName(p.categoryId)}
                image={p.mainImageUrl ?? ""}
                inStock={p.stockQuantity > 0}
              />
            ))}
          </div>
        )}
      </section>
      <StoreFooter subdomain={subdomain} />
    </main>
  );
}

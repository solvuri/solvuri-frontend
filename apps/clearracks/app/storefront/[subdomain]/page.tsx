"use client";

import HeroSlider from "@/components/stores/HeroSlider";
import StoreFooter from "@/components/stores/navigation/StoreFooter";
import ProductCard from "@/components/stores/ProductCard";

// 1. DUMMY DATA: Hardcoded store object for UI testing
const MOCK_STORE = {
  id: "test-store",
  name: "Nairobi Style",
  bannerColor: "#1c1917",
  products: [
    {
      id: "prod-1",
      name: "Safari Linen Shirt",
      price: 2850,
      size: "M",
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c"],
      isSold: false,
      category: { name: "Nairobi Style" },
    },
    {
      id: "prod-2",
      name: "Leather Safari Bag",
      price: 8500,
      size: "Large",
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa"],
      isSold: false,
      category: { name: "Kenya Craft" },
    },
    {
      id: "prod-3",
      name: "Nike Shoes",
      price: 4500,
      size: "One Size",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&q=80",
      ],
      isSold: false,
      category: { name: "Sport Shoes" },
    },
  ],
};

export default function StorefrontPage() {
  // 2. USE MOCK DATA: Instead of useQuery, we simply use the constant
  const store = MOCK_STORE;

  return (
    <main className="min-h-screen bg-white antialiased">
      <HeroSlider />

      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end gap-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
            {store.name}'s Picks
          </h2>
          <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
            {store.products.length} Items In Stock
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {store.products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              categoryName={p.category?.name || "General"}
              image={p.images?.[0]}
              isSold={p.isSold}
            />
          ))}
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}

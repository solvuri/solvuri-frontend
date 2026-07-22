import type { Product } from "@repo/types";

// Stand-in product data until a real product API exists. Swapping
// fetchProducts (see ../products.ts) to call a real endpoint requires no
// changes on the consumer side — useProducts' return shape stays the same.
export const MOCK_PRODUCTS: Product[] = [
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
];

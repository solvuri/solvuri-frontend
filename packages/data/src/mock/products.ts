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
    rating: 4.7,
    reviews: 38,
    description:
      "Lightweight linen shirt cut for warm-weather travel. Breathable weave, relaxed fit, and a soft hand-feel that holds up to repeated washing.",
    highlights: [
      "100% Breathable Linen",
      "Relaxed, Roomy Fit",
      "Colorfast Dye",
      "Machine Washable",
    ],
    colors: ["#e3c8a0", "#1c1917"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "prod-2",
    name: "Leather Safari Bag",
    price: 8500,
    size: "Large",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa"],
    isSold: false,
    category: { name: "Kenya Craft" },
    rating: 4.8,
    reviews: 21,
    description:
      "Full-grain leather duffel handmade by Kenyan craftspeople. Reinforced stitching and brass hardware built for daily carry.",
    highlights: [
      "Full-Grain Leather",
      "Hand-Stitched Seams",
      "Brass Hardware",
      "Adjustable Shoulder Strap",
    ],
    colors: ["#5d4037", "#3e2723"],
    sizes: ["One Size"],
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
    rating: 4.7,
    reviews: 38,
    description:
      "Durable suede sneaker with a rubber sole. Cushioned insole for all-day comfort, water-resistant treatment for outdoor wear.",
    highlights: [
      "Premium Suede Upper",
      "Water-Resistant Treatment",
      "Cushioned Insole",
      "Anti-Slip Rubber Sole",
    ],
    colors: ["#e3c8a0", "#5d4037"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"],
  },
];

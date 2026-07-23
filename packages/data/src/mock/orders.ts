import type { Order } from "@repo/types";

// Stand-in order data until a real orders API exists. Only covers the two
// order IDs that are actually product orders (matching apps/clearracks's
// orders list page) — "SAF-*"/"SVC-*" IDs there are experience/service
// bookings with a different shape (no shipping address) and aren't
// represented here.
export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-8700",
    status: "Confirmed",
    date: "June 22, 2026",
    items: [
      {
        name: "Leather Safari Bag",
        quantity: 2,
        price: 17000,
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      },
    ],
    shipping: 200,
    tax: 2752,
    total: 36952,
    address: "Waiyaki Way, Suite 12, Westlands, Nairobi",
  },
  {
    id: "ORD-4421",
    status: "Delivered",
    date: "March 5, 2026",
    items: [
      {
        name: "Safari Linen Shirt",
        quantity: 2,
        price: 2850,
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
      },
    ],
    shipping: 200,
    tax: 456,
    total: 6356,
    address: "Waiyaki Way, Suite 12, Westlands, Nairobi",
  },
];

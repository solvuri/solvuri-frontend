import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand";

export interface SaleLineItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface LastReceipt {
  items: SaleLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card" | "mpesa";
}

export interface RegisterSlice {
  items: SaleLineItem[];
  lastReceipt: LastReceipt | null;
  addItem: (item: Omit<SaleLineItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  incrementQty: (productId: string) => void;
  decrementQty: (productId: string) => void;
  completeSale: (paymentMethod: "cash" | "card" | "mpesa") => void;
}

// 16% VAT, matching apps/clearracks's hardcoded tax-rate convention.
const TAX_RATE = 0.16;

const createRegisterSlice: StateCreator<RegisterSlice> = (set, get) => ({
  items: [],
  lastReceipt: null,
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  incrementQty: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),
  decrementQty: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i,
      ),
    })),
  completeSale: (paymentMethod) => {
    const items = get().items;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + tax;
    set({
      items: [],
      lastReceipt: { items, subtotal, tax, total, paymentMethod },
    });
  },
});

export const useRegister = create<RegisterSlice>()(
  persist(createRegisterSlice, {
    name: "pos-register-storage",
  }),
);

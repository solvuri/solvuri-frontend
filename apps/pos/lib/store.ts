import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand";

export interface SaleLineItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface RegisterSlice {
  items: SaleLineItem[];
  addItem: (item: Omit<SaleLineItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  incrementQty: (productId: number) => void;
  decrementQty: (productId: number) => void;
  clearItems: () => void;
}

const createRegisterSlice: StateCreator<RegisterSlice> = (set) => ({
  items: [],
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
  clearItems: () => set({ items: [] }),
});

export const useRegister = create<RegisterSlice>()(
  persist(createRegisterSlice, {
    name: "pos-register-storage",
  }),
);

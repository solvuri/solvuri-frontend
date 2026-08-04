import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StateCreator } from "zustand";

// The cart itself now lives server-side (see lib/posApi.ts's cart
// functions) — this store just remembers which draft cart is in progress,
// so a page refresh mid-sale doesn't orphan it. No local item/quantity
// math happens here anymore.
export interface RegisterSlice {
  cartId: number | null;
  setCartId: (cartId: number) => void;
  clearCartId: () => void;
}

const createRegisterSlice: StateCreator<RegisterSlice> = (set) => ({
  cartId: null,
  setCartId: (cartId) => set({ cartId }),
  clearCartId: () => set({ cartId: null }),
});

export const useRegister = create<RegisterSlice>()(
  persist(createRegisterSlice, {
    name: "pos-register-storage",
  }),
);

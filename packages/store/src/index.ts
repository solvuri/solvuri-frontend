import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createCartSlice, CartSlice } from "./cartSlice";
import { createUISlice, UISlice } from "./uiSlice";

type StoreState = CartSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCartSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: "clearracks-storage",
    },
  ),
);

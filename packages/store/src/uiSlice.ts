import { StateCreator } from "zustand";

export interface UISlice {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  // Add your other UI states here (e.g., modals, themes)
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
});

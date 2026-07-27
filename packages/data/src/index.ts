import { QueryClient } from "@tanstack/react-query";

// Standardized client configuration for all apps
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1, // Common standard for your infrastructure
    },
  },
});

// Re-export QueryClientProvider so apps can just import it from here
export { QueryClientProvider } from "@tanstack/react-query";

export { useProducts, useProduct } from "./products";
export { useOrders, useOrder } from "./orders";
export { useTenants, useTenant } from "./tenants";
export { useReservations, useReservation } from "./reservations";
export type { Product, Order, Tenant, Reservation } from "@repo/types";

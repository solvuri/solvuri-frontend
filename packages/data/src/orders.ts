import { useQuery } from "@tanstack/react-query";
import type { Order } from "@repo/types";
import { MOCK_ORDERS } from "./mock/orders";

// Stand-in for a real `GET /orders/:id` call — same swap-out story as
// fetchProducts/fetchProduct in ./products.ts. Resolves to `null` (not
// `undefined`) when not found — see fetchProduct's comment for why.
function fetchOrder(id: string): Promise<Order | null> {
  return Promise.resolve(MOCK_ORDERS.find((o) => o.id === id) ?? null);
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id),
  });
}

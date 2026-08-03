import { useQuery } from "@tanstack/react-query";
import type { Sale } from "@repo/types";
import { MOCK_SALES } from "./mock/sales";

// Stand-in for a real `GET /sales` call — swap this body for a real
// endpoint once one exists. useSales' return shape (data/isLoading/error)
// won't need to change.
function fetchSales(): Promise<Sale[]> {
  return Promise.resolve(MOCK_SALES);
}

export function useSales() {
  return useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  });
}

// Stand-in for a real `GET /sales/:id` call — same swap-out story as
// fetchSales above. Resolves to `null` (not `undefined`) when not found —
// React Query treats an `undefined` queryFn result as invalid and never
// transitions the query to "success".
function fetchSale(id: string): Promise<Sale | null> {
  return Promise.resolve(MOCK_SALES.find((s) => s.id === id) ?? null);
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => fetchSale(id),
    enabled: Boolean(id),
  });
}

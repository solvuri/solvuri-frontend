import { useQuery } from "@tanstack/react-query";
import type { Product } from "@repo/types";
import { MOCK_PRODUCTS } from "./mock/products";

// Stand-in for a real API call — swap this body for `webApi.get(...)` /
// `clearracksApi.get(...)` (from @repo/api-client) once a real product
// endpoint exists. useProducts' return shape (data/isLoading/error) won't
// need to change.
function fetchProducts(): Promise<Product[]> {
  return Promise.resolve(MOCK_PRODUCTS);
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

// Stand-in for a real `GET /products/:id` call — same swap-out story as
// fetchProducts above. Resolves to `null` (not `undefined`) when not found —
// React Query treats an `undefined` queryFn result as invalid and never
// transitions the query to "success".
function fetchProduct(id: string): Promise<Product | null> {
  return Promise.resolve(MOCK_PRODUCTS.find((p) => p.id === id) ?? null);
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });
}

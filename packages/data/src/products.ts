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

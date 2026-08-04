// apps/clearracks/lib/clearackApi.ts
import { useQuery } from "@tanstack/react-query";
import type {
  CheckoutRequestInput,
  CheckoutRequestResult,
  ClearackCategory,
  ClearackProduct,
  DeliveryTown,
} from "@repo/types";
import { clearracksApi } from "./api";

// GET /api/clearack/products/merchant/{merchantId} — anonymous, public
// storefront catalog. Works even for a merchant with no paid features.
export function fetchMerchantProducts(
  merchantId: number,
): Promise<ClearackProduct[]> {
  return clearracksApi
    .get<ClearackProduct[]>(`/api/clearack/products/merchant/${merchantId}`)
    .then((res) => res.data);
}

export function useMerchantProducts(merchantId: number | null) {
  return useQuery({
    queryKey: ["clearack-products", merchantId],
    queryFn: () => fetchMerchantProducts(merchantId as number),
    enabled: merchantId !== null,
  });
}

// GET /api/clearack/categories/merchant/{merchantId} — anonymous.
export function fetchMerchantCategories(
  merchantId: number,
): Promise<ClearackCategory[]> {
  return clearracksApi
    .get<ClearackCategory[]>(`/api/clearack/categories/merchant/${merchantId}`)
    .then((res) => res.data);
}

export function useMerchantCategories(merchantId: number | null) {
  return useQuery({
    queryKey: ["clearack-categories", merchantId],
    queryFn: () => fetchMerchantCategories(merchantId as number),
    enabled: merchantId !== null,
  });
}

// GET /api/delivery-towns — anonymous, platform-wide (not per-merchant).
export function fetchDeliveryTowns(): Promise<DeliveryTown[]> {
  return clearracksApi
    .get<DeliveryTown[]>("/api/delivery-towns")
    .then((res) => res.data);
}

export function useDeliveryTowns() {
  return useQuery({
    queryKey: ["delivery-towns"],
    queryFn: fetchDeliveryTowns,
  });
}

// POST /api/clearack/checkout/{merchantId}/request — anonymous. Creates an
// unpaid Pending order for merchants without Online Checkout configured
// (the only path available for a merchant that hasn't verified Mpesa
// credentials yet — see AGENTS.md). The merchant confirms the sale
// manually later.
export function submitCheckoutRequest(
  merchantId: number,
  input: CheckoutRequestInput,
): Promise<CheckoutRequestResult> {
  return clearracksApi
    .post<CheckoutRequestResult>(
      `/api/clearack/checkout/${merchantId}/request`,
      input,
    )
    .then((res) => res.data);
}

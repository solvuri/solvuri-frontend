// apps/clearracks/lib/clearackApi.ts
import { useQuery } from "@tanstack/react-query";
import type {
  CheckoutInitiateResult,
  CheckoutRequestInput,
  CheckoutRequestResult,
  CheckoutStatusResult,
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

// POST /api/clearack/checkout/{merchantId}/initiate — anonymous. Pays now
// via STK push to the merchant's own till. Rejected server-side (with a
// message pointing at the /request fallback above) if the merchant hasn't
// paid for Online Checkout or verified+enabled their Mpesa credentials —
// there's no anonymous way to check that in advance, so the backend's own
// rejection is the source of truth, not a frontend pre-check.
export function submitCheckoutInitiate(
  merchantId: number,
  input: CheckoutRequestInput,
): Promise<CheckoutInitiateResult> {
  return clearracksApi
    .post<CheckoutInitiateResult>(
      `/api/clearack/checkout/${merchantId}/initiate`,
      input,
    )
    .then((res) => res.data);
}

// GET /api/clearack/checkout/status/{checkoutRequestId} — anonymous.
// Actively resolves a Pending STK push (queries Daraja, doesn't just wait
// on the webhook). refetchInterval stops polling itself the moment
// paymentStatus leaves "Pending" — no manual setInterval/cleanup needed.
export function fetchCheckoutStatus(
  checkoutRequestId: string,
): Promise<CheckoutStatusResult> {
  return clearracksApi
    .get<CheckoutStatusResult>(
      `/api/clearack/checkout/status/${checkoutRequestId}`,
    )
    .then((res) => res.data);
}

export function useCheckoutStatus(checkoutRequestId: string | null) {
  return useQuery({
    queryKey: ["checkout-status", checkoutRequestId],
    queryFn: () => fetchCheckoutStatus(checkoutRequestId as string),
    enabled: checkoutRequestId !== null,
    refetchInterval: (query) =>
      query.state.data?.paymentStatus === "Pending" ? 4000 : false,
  });
}

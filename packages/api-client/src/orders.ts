// packages/api-client/src/orders.ts
import type { AxiosInstance } from "axios";
import type { ClearackOrder } from "@repo/types";

// GET /api/clearack/orders/merchant/{merchantId} — IsAuthorizedForMerchant
// (the merchant owner or their agents, or a Solvuri admin). A merchant's
// own storefront orders — distinct from the anonymous buyer's side, which
// has no order-history endpoint at all (see apps/clearack's storefront
// orders stub pages).
export async function listMerchantOrders(
  client: AxiosInstance,
  merchantId: number,
): Promise<ClearackOrder[]> {
  const response = await client.get<ClearackOrder[]>(
    `/api/clearack/orders/merchant/${merchantId}`,
  );
  return response.data;
}

// GET /api/clearack/orders/{id} — any authenticated user, scoped
// internally to the caller's own merchantId unless they're a Solvuri
// admin. Single order detail.
export async function getOrder(
  client: AxiosInstance,
  orderId: number,
): Promise<ClearackOrder> {
  const response = await client.get<ClearackOrder>(
    `/api/clearack/orders/${orderId}`,
  );
  return response.data;
}

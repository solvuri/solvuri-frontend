// packages/api-client/src/products.ts
import type { AxiosInstance } from "axios";
import type {
  AdjustClearackStockInput,
  ClearackCategory,
  ClearackInventoryItem,
  ClearackProduct,
  CreateClearackCategoryInput,
  CreateClearackProductInput,
  UpdateClearackProductInput,
} from "@repo/types";

// POST /api/clearack/products — Merchant or MerchantAgent.
export async function createProduct(
  client: AxiosInstance,
  merchantId: number,
  input: CreateClearackProductInput,
): Promise<ClearackProduct> {
  const response = await client.post<ClearackProduct>("/api/clearack/products", {
    merchantId,
    ...input,
  });
  return response.data;
}

// PUT /api/clearack/products/{id} — Merchant or MerchantAgent.
export async function updateProduct(
  client: AxiosInstance,
  productId: number,
  merchantId: number,
  input: UpdateClearackProductInput,
): Promise<ClearackProduct> {
  const response = await client.put<ClearackProduct>(
    `/api/clearack/products/${productId}`,
    { merchantId, ...input },
  );
  return response.data;
}

// DELETE /api/clearack/products/{id}?merchantId= — Merchant or MerchantAgent.
export async function deleteProduct(
  client: AxiosInstance,
  productId: number,
  merchantId: number,
): Promise<void> {
  await client.delete(`/api/clearack/products/${productId}`, {
    params: { merchantId },
  });
}

// POST /api/clearack/products/{id}/adjust-stock — Merchant or MerchantAgent.
// No documented response example — typed as returning the updated product
// by inference; the request DTO itself (AdjustStockDto) is confirmed via
// the OpenAPI appendix.
export async function adjustProductStock(
  client: AxiosInstance,
  productId: number,
  merchantId: number,
  input: AdjustClearackStockInput,
): Promise<ClearackProduct> {
  const response = await client.post<ClearackProduct>(
    `/api/clearack/products/${productId}/adjust-stock`,
    { merchantId, ...input },
  );
  return response.data;
}

// GET /api/clearack/products/inventory — Merchant or MerchantAgent. Own
// inventory dashboard; no merchantId param — the backend derives the
// caller's own tenant from the JWT. No documented response example (see
// ClearackInventoryItem's comment in @repo/types).
export async function listMerchantInventory(
  client: AxiosInstance,
): Promise<ClearackInventoryItem[]> {
  const response = await client.get<ClearackInventoryItem[]>(
    "/api/clearack/products/inventory",
  );
  return response.data;
}

// POST /api/clearack/categories — IsAuthorizedForMerchant (owner/agent of
// that merchant, or a Solvuri admin).
export async function createCategory(
  client: AxiosInstance,
  merchantId: number,
  input: CreateClearackCategoryInput,
): Promise<ClearackCategory> {
  const response = await client.post<ClearackCategory>(
    "/api/clearack/categories",
    { merchantId, ...input },
  );
  return response.data;
}

// packages/api-client/src/tenantRequests.ts
import type { AxiosInstance } from "axios";
import type { CreateTenantRequestInput, TenantRequest } from "@repo/types";

// POST /api/tenant-requests/request-license — [AllowAnonymous]. Public
// lead-capture form; does not require a logged-in caller or any tenant
// context.
export async function submitTenantRequest(
  client: AxiosInstance,
  input: CreateTenantRequestInput,
): Promise<TenantRequest> {
  const response = await client.post<TenantRequest>(
    "/api/tenant-requests/request-license",
    input,
  );
  return response.data;
}

// GET /api/tenant-requests — Solvuri Admin/SuperAdmin only. Queue of
// active requests, newest first.
export async function listTenantRequests(
  client: AxiosInstance,
): Promise<TenantRequest[]> {
  const response = await client.get<TenantRequest[]>("/api/tenant-requests");
  return response.data;
}

// PUT /api/tenant-requests/{id}/status — Solvuri Admin/SuperAdmin only.
// Echoes the updated row. Does not create the merchant account itself.
export async function updateTenantRequestStatus(
  client: AxiosInstance,
  id: number,
  status: TenantRequest["status"],
): Promise<TenantRequest> {
  const response = await client.put<TenantRequest>(
    `/api/tenant-requests/${id}/status`,
    { status },
  );
  return response.data;
}

// packages/api-client/src/catalog.ts
import type { AxiosInstance } from "axios";
import type { Feature, SystemCategory } from "./registration";

export interface CreateSystemCategoryInput {
  name: string;
  description: string;
}

// POST /api/system-categories — Solvuri Admin/SuperAdmin only.
export async function createSystemCategory(
  client: AxiosInstance,
  input: CreateSystemCategoryInput,
): Promise<SystemCategory> {
  const response = await client.post<SystemCategory>(
    "/api/system-categories",
    input,
  );
  return response.data;
}

// PUT /api/system-categories/{id} — Solvuri Admin/SuperAdmin only.
export async function updateSystemCategory(
  client: AxiosInstance,
  id: number,
  input: CreateSystemCategoryInput,
): Promise<SystemCategory> {
  const response = await client.put<SystemCategory>(
    `/api/system-categories/${id}`,
    input,
  );
  return response.data;
}

// DELETE /api/system-categories/{id} — Solvuri Admin/SuperAdmin only.
export async function deleteSystemCategory(
  client: AxiosInstance,
  id: number,
): Promise<void> {
  await client.delete(`/api/system-categories/${id}`);
}

export interface CreateFeatureInput {
  name: string;
  description: string;
  monthlyPrice: number;
  systemCategoryId: number;
}

// POST /api/features — Solvuri Admin/SuperAdmin only. monthlyPrice here is
// a catalog default/reference value — the price actually billed to a
// specific merchant is set separately via SetMerchantFeaturesDto
// (registration.ts's setMerchantFeatures) and can differ from this.
export async function createFeature(
  client: AxiosInstance,
  input: CreateFeatureInput,
): Promise<Feature> {
  const response = await client.post<Feature>("/api/features", input);
  return response.data;
}

// PUT /api/features/{id} — Solvuri Admin/SuperAdmin only.
export async function updateFeature(
  client: AxiosInstance,
  id: number,
  input: CreateFeatureInput,
): Promise<Feature> {
  const response = await client.put<Feature>(`/api/features/${id}`, input);
  return response.data;
}

// DELETE /api/features/{id} — Solvuri Admin/SuperAdmin only.
export async function deleteFeature(
  client: AxiosInstance,
  id: number,
): Promise<void> {
  await client.delete(`/api/features/${id}`);
}

// packages/api-client/src/registration.ts
import type { AxiosInstance } from "axios";

export interface RegisterTenantInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  brandName: string;
  businessDescription: string;
  email: string;
  phoneNumber: string;
  password: string;
  domainName: string;
  customMonthlyFee?: number | null;
}

export interface RegisterTenantResult {
  message: string;
  tenantId: number;
  subscriptionId: number;
  userUsername: string;
  status: string;
}

// POST /api/tenants/register-tenant — Admin/SuperAdmin only. Creates the
// Merchant account (Inactive) + a subscription shell + the owner's login.
// Categories/features/pricing are separate follow-up steps (below).
export async function registerTenant(
  client: AxiosInstance,
  input: RegisterTenantInput,
): Promise<RegisterTenantResult> {
  const response = await client.post<RegisterTenantResult>(
    "/api/tenants/register-tenant",
    input,
  );
  return response.data;
}

export interface TenantSummary {
  id: number;
  brandName: string;
  domainName: string;
  email?: string;
  phoneNumber?: string;
  subscription?: {
    status?: string;
    isPaid?: boolean;
    endDate?: string;
  } | null;
}

// GET /api/tenants — any authenticated user (no explicit role gate in the
// backend). Lists every tenant with its subscription included; used here
// as the admin's merchant directory.
export async function listTenants(
  client: AxiosInstance,
): Promise<TenantSummary[]> {
  const response = await client.get<TenantSummary[]>("/api/tenants");
  return response.data;
}

export interface SystemCategory {
  id: number;
  name: string;
  description: string;
}

export interface Feature {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  systemCategoryId: number;
}

export interface MerchantFeatureSummary {
  featureId: number;
  featureName: string;
  systemCategoryId: number;
  systemCategoryName: string;
  monthlyPrice: number;
  isPaid: boolean;
  paidAt: string | null;
}

export interface MerchantSubscriptionSummary {
  categories: { systemCategoryId: number; name: string }[];
  features: MerchantFeatureSummary[];
  totalMonthlyCost: number;
}

// GET /api/system-categories — Admin/SuperAdmin only. The shared category
// catalog every merchant picks from in step 1 of onboarding.
export async function listSystemCategories(
  client: AxiosInstance,
): Promise<SystemCategory[]> {
  const response = await client.get<SystemCategory[]>(
    "/api/system-categories",
  );
  return response.data;
}

// GET /api/features — Admin/SuperAdmin only. The shared feature catalog
// (grouped by category) merchants pick from, each priced per-merchant.
export async function listFeatures(client: AxiosInstance): Promise<Feature[]> {
  const response = await client.get<Feature[]>("/api/features");
  return response.data;
}

// PUT /api/tenants/{id}/subscription/categories — step 1 of onboarding.
// Replaces the full category selection for this merchant.
export async function setMerchantCategories(
  client: AxiosInstance,
  tenantId: number,
  systemCategoryIds: number[],
): Promise<MerchantSubscriptionSummary> {
  const response = await client.put<MerchantSubscriptionSummary>(
    `/api/tenants/${tenantId}/subscription/categories`,
    { systemCategoryIds },
  );
  return response.data;
}

// PUT /api/tenants/{id}/subscription/features — step 2 of onboarding.
// Replaces the full feature selection, each at its own merchant-specific
// price. Every featureId must belong to a category already selected above.
export async function setMerchantFeatures(
  client: AxiosInstance,
  tenantId: number,
  features: { featureId: number; monthlyPrice: number }[],
): Promise<MerchantSubscriptionSummary> {
  const response = await client.put<MerchantSubscriptionSummary>(
    `/api/tenants/${tenantId}/subscription/features`,
    { features },
  );
  return response.data;
}

export interface RegisterAgentInput {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  agentCode: string;
}

export interface RegisterAgentResult {
  id: number;
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  agentCode: string;
  isActive: boolean;
  createdAt: string;
}

// POST /api/merchants/agents — Merchant owner only. Registers a new
// cashier/staff login under the caller's own tenant. No merchant-facing
// app hosts a UI for this yet; exported for future use.
export async function registerAgent(
  client: AxiosInstance,
  input: RegisterAgentInput,
): Promise<RegisterAgentResult> {
  const response = await client.post<RegisterAgentResult>(
    "/api/merchants/agents",
    input,
  );
  return response.data;
}

export interface RegisterAdminInput {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  isSuperAdmin?: boolean;
}

// POST /api/Auth/register — anyone until the first Admin/SuperAdmin
// exists, then Solvuri Admin/SuperAdmin only. No dedicated UI; exported
// for completeness.
export async function registerAdmin(
  client: AxiosInstance,
  input: RegisterAdminInput,
): Promise<void> {
  await client.post("/api/Auth/register", input);
}

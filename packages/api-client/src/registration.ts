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
    // Not yet confirmed via a live response — GET /api/tenants has 500'd
    // every time it's been probed so far (see the known-bug note below).
    // Included on the assumption every other entity in this API exposes
    // its own id; verify once the bug clears before relying on it.
    id?: number;
    status?: string;
    isPaid?: boolean;
    endDate?: string;
  } | null;
}

// GET /api/tenants — any authenticated user (no explicit role gate in the
// backend). Lists every tenant with its subscription included; used here
// as the admin's merchant directory.
//
// Known real-backend bug, not a frontend issue: this returns a bare `500`
// (no body) once *any* tenant has a subscription attached — confirmed via
// direct curl, independent of any frontend code. Callers should surface
// the failure honestly (Promise.allSettled/try-catch) rather than treat it
// as a bug in this wrapper.
export async function listTenants(
  client: AxiosInstance,
): Promise<TenantSummary[]> {
  const response = await client.get<TenantSummary[]>("/api/tenants");
  return response.data;
}

export interface UpdateTenantInput {
  brandName?: string;
  businessDescription?: string;
  email?: string;
  phoneNumber?: string;
  domainName?: string;
  customMonthlyFee?: number | null;
}

// PUT /api/tenants/{id} — no explicit role gate in the backend, used by
// Solvuri admin in practice. Partial update of a merchant's brand/contact/
// domain info. No documented response body — callers should refetch
// (e.g. listTenants) after a successful call rather than trust a return
// value here.
export async function updateTenant(
  client: AxiosInstance,
  tenantId: number,
  input: UpdateTenantInput,
): Promise<void> {
  await client.put(`/api/tenants/${tenantId}`, input);
}

export interface TenantSubscriptionOverrideInput {
  startDate?: string;
  endDate?: string;
  status?: string;
  isPaid?: boolean;
  paymentMethod?: string;
  customMonthlyFee?: number | null;
  totalPaid?: number;
}

// PUT /api/tenants/subscription/{subscriptionId} — no explicit role gate
// in the backend, used by Solvuri admin in practice. Direct admin-level
// override of subscription fields (status/dates/isPaid/totalPaid/etc.),
// separate from the payment-driven flow in payments.ts — for correcting
// data, not for collecting money. Takes a subscriptionId, not a tenantId.
// No documented response body — callers should refetch after success.
export async function overrideTenantSubscription(
  client: AxiosInstance,
  subscriptionId: number,
  input: TenantSubscriptionOverrideInput,
): Promise<void> {
  await client.put(`/api/tenants/subscription/${subscriptionId}`, input);
}

// GET /api/tenants/{id}/subscription — any authenticated user (no explicit
// role gate in the backend). Returns the same shape as the category/feature
// selection endpoints below, but as a read-only fetch for a single tenant.
export async function getTenantSubscription(
  client: AxiosInstance,
  tenantId: number,
): Promise<MerchantSubscriptionSummary> {
  const response = await client.get<MerchantSubscriptionSummary>(
    `/api/tenants/${tenantId}/subscription`,
  );
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
// cashier/staff login under the caller's own tenant. Used by
// apps/clearracks' merchant portal (app/merchant/(portal)/agents).
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

// GET /api/merchants/agents — Merchant owner only. Lists the caller's own
// agents (never another tenant's).
export async function listAgents(
  client: AxiosInstance,
): Promise<RegisterAgentResult[]> {
  const response = await client.get<RegisterAgentResult[]>(
    "/api/merchants/agents",
  );
  return response.data;
}

// PUT /api/merchants/agents/{agentId}/deactivate — Merchant owner only.
// Blocks the agent's ability to log in entirely (not just POS access).
export async function deactivateAgent(
  client: AxiosInstance,
  agentId: number,
): Promise<void> {
  await client.put(`/api/merchants/agents/${agentId}/deactivate`);
}

// PUT /api/merchants/agents/{agentId}/reactivate — Merchant owner only.
export async function reactivateAgent(
  client: AxiosInstance,
  agentId: number,
): Promise<void> {
  await client.put(`/api/merchants/agents/${agentId}/reactivate`);
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

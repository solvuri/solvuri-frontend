// packages/types/src/tenantRequests.ts
// Public "apply to become a Solvuri merchant" lead-capture form (§1.2 of
// API_DOCUMENTATION.md), reviewed by a Solvuri Admin/SuperAdmin before an
// actual tenant account is created via the separate registration flow.
// Approving a request does NOT auto-create the merchant account.

export interface CreateTenantRequestInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  brandName: string;
  email: string;
  phoneNumber: string;
  businessDescription: string;
  requestedSystems: string;
}

export type TenantRequestStatus = "Pending" | "Approved" | "Rejected";

export interface TenantRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  firstName: string;
  middleName: string | null;
  lastName: string;
  brandName: string;
  email: string;
  phoneNumber: string;
  businessDescription: string;
  requestedSystems: string;
  status: TenantRequestStatus;
}

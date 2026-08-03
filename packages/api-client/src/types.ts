// packages/api-client/src/types.ts

// The four roles the backend's AppRole enum can carry. Every authorization
// check in the API reads this claim, not the free-text `role` claim.
export type AppRole = "Merchant" | "MerchantAgent" | "Admin" | "SuperAdmin";

export interface AuthTokenPayload {
  userId: string;
  merchantId: string;
  username: string;
  role: string;
  appRole: AppRole;
}

// Every endpoint in the API returns this same envelope, success or failure.
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
}

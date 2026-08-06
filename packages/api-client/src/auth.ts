// packages/api-client/src/auth.ts
import type { AxiosInstance } from "axios";

export interface LoginResult {
  token?: string;
  requiresOtp?: boolean;
}

// POST /api/Auth/login — the single login endpoint for all four roles.
// Merchant/MerchantAgent accounts get a token back immediately; Admin/
// SuperAdmin accounts get `requiresOtp: true` and must follow up with
// verifyOtp() below.
export async function login(
  client: AxiosInstance,
  email: string,
  password: string,
): Promise<LoginResult> {
  const response = await client.post<LoginResult>("/api/Auth/login", {
    email,
    password,
  });
  return response.data;
}

// POST /api/Auth/login/verify-otp — exchanges the OTP an Admin/SuperAdmin
// account receives on login for the actual JWT.
export async function verifyOtp(
  client: AxiosInstance,
  email: string,
  otp: string,
): Promise<{ token: string }> {
  const response = await client.post<{ token: string }>(
    "/api/Auth/login/verify-otp",
    { email, otp },
  );
  return response.data;
}

export interface PlatformUser {
  id: number;
  username: string;
  email: string;
  tenantId: number | null;
  isActive: boolean;
}

// GET /api/Auth/users — Solvuri Admin/SuperAdmin only. Every platform user
// across every tenant (support/ops visibility). tenantId: null = a
// platform-level Admin/SuperAdmin account; non-null = belongs to that
// Merchant tenant (owner or agent — this list doesn't distinguish which).
export async function listPlatformUsers(
  client: AxiosInstance,
): Promise<PlatformUser[]> {
  const response = await client.get<PlatformUser[]>("/api/Auth/users");
  return response.data;
}

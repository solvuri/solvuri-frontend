// packages/api-client/src/mpesaSettings.ts
import type { AxiosInstance } from "axios";
import type { MerchantMpesaSettings, MpesaSettingsInput } from "@repo/types";

// GET /api/clearack/merchant/mpesa-settings — Merchant owner, own settings
// only. Secrets are never returned, only a hasSecrets flag.
export async function getMpesaSettings(
  client: AxiosInstance,
): Promise<MerchantMpesaSettings> {
  const response = await client.get<MerchantMpesaSettings>(
    "/api/clearack/merchant/mpesa-settings",
  );
  return response.data;
}

// POST /api/clearack/merchant/mpesa-settings — Merchant owner. Submitting
// resets isVerified/isEnabled to false server-side, since a changed secret
// needs re-verification.
export async function submitMpesaSettings(
  client: AxiosInstance,
  input: MpesaSettingsInput,
): Promise<MerchantMpesaSettings> {
  const response = await client.post<MerchantMpesaSettings>(
    "/api/clearack/merchant/mpesa-settings",
    input,
  );
  return response.data;
}

// GET /api/clearack/merchant/mpesa-settings/{merchantId} — Solvuri admin
// inspecting any merchant's settings before verifying.
export async function getMerchantMpesaSettings(
  client: AxiosInstance,
  merchantId: number,
): Promise<MerchantMpesaSettings> {
  const response = await client.get<MerchantMpesaSettings>(
    `/api/clearack/merchant/mpesa-settings/${merchantId}`,
  );
  return response.data;
}

// POST /api/clearack/merchant/mpesa-settings/{merchantId}/verify — Solvuri
// admin only. Fires a real 1-KES STK push to confirm the merchant's
// credentials actually work end-to-end.
export async function verifyMpesaSettings(
  client: AxiosInstance,
  merchantId: number,
  testPhoneNumber: string,
): Promise<void> {
  await client.post(
    `/api/clearack/merchant/mpesa-settings/${merchantId}/verify`,
    { testPhoneNumber },
  );
}

// PUT /api/clearack/merchant/mpesa-settings/{merchantId}/enabled — Solvuri
// admin only. Go live / take down online checkout. 400s if not yet verified.
export async function setMpesaEnabled(
  client: AxiosInstance,
  merchantId: number,
  isEnabled: boolean,
): Promise<void> {
  await client.put(
    `/api/clearack/merchant/mpesa-settings/${merchantId}/enabled`,
    { isEnabled },
  );
}

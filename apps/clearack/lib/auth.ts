import { useMemo } from "react";
import { decodeToken, getAuthToken } from "@repo/api-client";

// Merchant portal auth (app/merchant/**) — separate concern from the
// anonymous storefront (app/storefront/[subdomain]/**), which never
// reads a token at all. merchantId comes from the logged-in owner's own
// JWT claim, same pattern as apps/pos/lib/auth.ts.
export function getMerchantId(): number | null {
  const token = getAuthToken();
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  const merchantId = Number(payload.merchantId);
  return merchantId > 0 ? merchantId : null;
}

export function useCurrentUser() {
  return useMemo(() => {
    const token = getAuthToken();
    const payload = token ? decodeToken(token) : null;
    if (!payload) return null;
    const merchantId = Number(payload.merchantId);
    return {
      username: payload.username,
      appRole: payload.appRole,
      merchantId: merchantId > 0 ? merchantId : null,
    };
  }, []);
}

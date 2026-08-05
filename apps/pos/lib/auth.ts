import { useMemo } from "react";
import { decodeToken, getAuthToken } from "@repo/api-client";

// merchantId comes from the logged-in cashier's own JWT claim, never from
// the subdomain — every POS endpoint requires an authenticated Merchant/
// MerchantAgent caller, so there's no anonymous domain-lookup problem to
// solve here (unlike apps/clearack's subdomain -> merchantId stand-in).
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

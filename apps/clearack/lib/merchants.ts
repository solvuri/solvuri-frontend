// apps/clearack/lib/merchants.ts
//
// Stand-in for a real anonymous "resolve this domain to a merchantId"
// endpoint — the documented API has no such endpoint (GET /api/tenants
// requires an authenticated caller, and a storefront visitor is
// anonymous by design). Real merchants register a full custom domain
// (e.g. "onestop.clearack.com"), not a subdomain label under one shared
// root the way this map assumes — reconciling real custom-domain DNS
// routing is a separate, bigger infra topic. Until a real lookup exists,
// map the subdomain this app's proxy.ts already extracts straight to a
// known merchantId.
export const KNOWN_MERCHANTS: Record<string, number> = {
  onestop: 1,
};

export function resolveMerchantId(subdomain: string): number | null {
  return KNOWN_MERCHANTS[subdomain] ?? null;
}

// No anonymous "get this merchant's brand name" endpoint exists either —
// same stand-in story as resolveMerchantId above. Derives a display name
// from the subdomain itself (e.g. "onestop" -> "Onestop") rather than
// showing a fabricated brand name.
export function displayName(subdomain: string): string {
  return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
}

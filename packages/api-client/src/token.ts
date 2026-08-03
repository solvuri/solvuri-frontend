// packages/api-client/src/token.ts
import type { AppRole, AuthTokenPayload } from "./types";

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

// ASP.NET's ClaimTypes constants (NameIdentifier/Name/Role) serialize into
// the JWT as their full XML-namespace URIs, not the short names — check
// both forms. AppRole/MerchantId are custom claims, so they use the short
// name directly.
const NAMEIDENTIFIER_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

// Decodes a JWT's payload for client-side UI/role-gating only — no
// signature verification happens here, and none should: the backend is the
// actual enforcement point for every request.
export function decodeToken(token: string): AuthTokenPayload | null {
  try {
    const [, payloadSegment] = token.split(".");
    if (!payloadSegment) return null;

    const claims = JSON.parse(base64UrlDecode(payloadSegment));

    const userId =
      claims[NAMEIDENTIFIER_CLAIM] ?? claims.nameidentifier ?? claims.sub;
    const username = claims[NAME_CLAIM] ?? claims.name;
    const role = claims[ROLE_CLAIM] ?? claims.role;
    const appRole = claims.AppRole;
    const merchantId = claims.MerchantId;

    if (!userId || !appRole) return null;

    return {
      userId: String(userId),
      merchantId: merchantId != null ? String(merchantId) : "0",
      username: username ? String(username) : "",
      role: role ? String(role) : "",
      appRole: appRole as AppRole,
    };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "solvuri_auth_token";

export function setAuthToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1));
}

export function clearAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

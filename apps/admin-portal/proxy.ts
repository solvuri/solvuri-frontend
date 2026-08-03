import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Kept as a local constant rather than importing @repo/api-client's
// AUTH_COOKIE_NAME — this file runs in the Edge runtime, and there's no
// reason to pull axios into an Edge middleware bundle just for a string.
const AUTH_COOKIE = "solvuri_auth_token";
const ADMIN_ROLES = new Set(["Admin", "SuperAdmin"]);

// Minimal, self-contained JWT payload decode for role-gating only — no
// signature verification (the backend is the real enforcement point for
// every request). Deliberately not shared with @repo/api-client's
// decodeToken to keep this file free of any Node-oriented dependency.
function getAppRole(token: string): string | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const claims = JSON.parse(atob(padded));
    return claims.AppRole ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const appRole = token ? getAppRole(token) : null;

  if (!appRole || !ADMIN_ROLES.has(appRole)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

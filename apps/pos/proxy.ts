import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The production root domain differs per environment, so it's an env var
// rather than a compile-time constant (falls back to the current default).
// Deliberately a separate env var from apps/clearracks's ROOT_DOMAIN so the
// two apps' subdomain schemes don't collide.
const POS_ROOT_DOMAIN = process.env.POS_ROOT_DOMAIN || "solvuripos.xyz";

// Kept as a local constant rather than importing @repo/api-client's
// AUTH_COOKIE_NAME — this file runs in the Edge runtime, and there's no
// reason to pull axios into an Edge middleware bundle just for a string.
const AUTH_COOKIE = "solvuri_auth_token";
const CASHIER_ROLES = new Set(["Merchant", "MerchantAgent"]);

// Minimal, self-contained JWT payload decode for role-gating only — no
// signature verification (the backend is the real enforcement point for
// every request). Deliberately not shared with @repo/api-client's
// decodeToken to keep this file free of any Node-oriented dependency,
// same approach as apps/admin-portal's proxy.ts.
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
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // 1. Exclude system/static files
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Identify root domain (solvuripos.xyz, www.solvuripos.xyz, or local —
  // matches any localhost port so this still works when the app isn't
  // running on its default port, e.g. via `pnpm --filter pos dev`)
  const isRootDomain =
    hostname === POS_ROOT_DOMAIN ||
    hostname === `www.${POS_ROOT_DOMAIN}` ||
    hostname === "localhost" ||
    /^localhost:\d+$/.test(hostname);

  if (!isRootDomain) {
    // 3. Extract subdomain from hostname (e.g., demo.solvuripos.xyz -> demo)
    const subdomain = hostname.split(".")[0];

    // 4. Auth gate — every register/sales route requires an authenticated
    // Merchant or MerchantAgent (IsCashier() on the real backend). The
    // login page itself is exempt, or nobody could ever sign in.
    if (url.pathname !== "/login") {
      const token = request.cookies.get(AUTH_COOKIE)?.value;
      const appRole = token ? getAppRole(token) : null;
      if (!appRole || !CASHIER_ROLES.has(appRole)) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    // Rewrite internal request to the tenant's register
    url.pathname = `/register/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Allow root traffic (the minimal landing page) to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

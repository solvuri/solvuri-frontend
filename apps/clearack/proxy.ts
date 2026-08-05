import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The production root domain differs per environment, so it's an env var
// rather than a compile-time constant (falls back to the current default).
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "clearack.xyz";

// Kept as a local constant rather than importing @repo/api-client's
// AUTH_COOKIE_NAME — this file runs in the Edge runtime, and there's no
// reason to pull axios into an Edge middleware bundle just for a string.
const AUTH_COOKIE = "solvuri_auth_token";
const MERCHANT_ROLES = new Set(["Merchant", "MerchantAgent"]);

// Minimal, self-contained JWT payload decode for role-gating only — no
// signature verification (the backend is the real enforcement point for
// every request). Same approach as apps/admin-portal's/apps/pos's proxy.ts.
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

  // 2. Identify root domain (clearack.xyz, www.clearack.xyz, or local —
  // matches any localhost port so this still works when the app isn't
  // running on its default port, e.g. via `pnpm --filter clearack dev`)
  const isRootDomain =
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost" ||
    /^localhost:\d+$/.test(hostname);

  if (!isRootDomain) {
    // 3. Extract subdomain from hostname (e.g., test-store.clearack.xyz -> test-store)
    const subdomain = hostname.split(".")[0];

    // Rewrite internal request to your dynamic storefront folder
    url.pathname = `/storefront/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // 4. Merchant portal auth gate — root-domain only (a merchant managing
  // their own account isn't "visiting a store" on a subdomain). Skip the
  // gate for the login page itself, or nobody could ever sign in.
  if (url.pathname.startsWith("/merchant") && url.pathname !== "/merchant/login") {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const appRole = token ? getAppRole(token) : null;
    if (!appRole || !MERCHANT_ROLES.has(appRole)) {
      return NextResponse.redirect(new URL("/merchant/login", request.url));
    }
  }

  // Allow root traffic (marketing site + merchant portal) to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

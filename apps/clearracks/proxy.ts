import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The production root domain differs per environment, so it's an env var
// rather than a compile-time constant (falls back to the current default).
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "clearrack.xyz";

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

  // 2. Identify root domain (clearrack.xyz, www.clearrack.xyz, or local —
  // matches any localhost port so this still works when the app isn't
  // running on its default port, e.g. via `pnpm --filter clearracks dev`)
  const isRootDomain =
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost" ||
    /^localhost:\d+$/.test(hostname);

  if (!isRootDomain) {
    // 3. Extract subdomain from hostname (e.g., test-store.clearrack.xyz -> test-store)
    const subdomain = hostname.split(".")[0];

    // Rewrite internal request to your dynamic storefront folder
    url.pathname = `/storefront/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Allow root traffic (marketing site) to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

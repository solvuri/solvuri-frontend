import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// The production root domain differs per environment, so it's an env var
// rather than a compile-time constant (falls back to the current default).
// Deliberately a separate env var from apps/clearracks's ROOT_DOMAIN so the
// two apps' subdomain schemes don't collide.
const POS_ROOT_DOMAIN = process.env.POS_ROOT_DOMAIN || "solvuripos.xyz";

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

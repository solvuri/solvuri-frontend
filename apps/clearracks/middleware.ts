import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROOT_DOMAIN } from "@repo/utils";

export function middleware(request: NextRequest) {
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

  // 2. Identify root domain (clearrack.xyz, www.clearrack.xyz, or local)
  const isRootDomain =
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === "localhost:3000";

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

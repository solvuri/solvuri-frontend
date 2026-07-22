import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Placeholder session-cookie gate — no real backend yet. Swap the cookie
// check below for real session verification once auth is wired in (see
// AGENTS.md for the intended pattern).
const SESSION_COOKIE = "solvuri_admin_session";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

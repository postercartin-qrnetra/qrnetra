import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/** Supabase may fall back to Site URL root with `?code=` when redirectTo is not allowlisted. */
function redirectOAuthCodeToCallback(request: NextRequest): NextResponse | null {
  const code = request.nextUrl.searchParams.get("code");
  if (!code || request.nextUrl.pathname === "/auth/callback") {
    return null;
  }

  const callback = request.nextUrl.clone();
  callback.pathname = "/auth/callback";
  return NextResponse.redirect(callback);
}

export async function proxy(request: NextRequest) {
  const oauthRedirect = redirectOAuthCodeToCallback(request);
  if (oauthRedirect) {
    return oauthRedirect;
  }
  return await updateSession(request);
}

export const config = {
  /**
   * Run Proxy on app routes that need a refreshed Supabase session. Explicitly
   * skip:
   *  - Next.js internals (`_next/*`)
   *  - The favicon and static assets shipped from `/public`
   *  - Public QR scan pages (`/s/[slug]`) — these are anon-only and must work
   *    even with no auth cookies
   *  - API routes (each route handles auth itself)
   *  - The OAuth callback (it reads/writes its own session cookies)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|auth/callback|s/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
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

import {
  createServerClient,
  parseCookieHeader,
  type CookieMethodsServer,
} from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

function hasAuthCookies(
  list: { name: string; value: string }[],
): boolean {
  return list.some((c) => c.name.startsWith("sb-"));
}

/**
 * Authed Supabase client for App Router server components, route handlers,
 * and server actions. Reads session cookies from `cookies()` with a
 * `Cookie` header fallback so server actions receive the same session as RSC.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return null;
  }

  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      const fromStore = cookieStore.getAll();
      const cookieHeader = headerStore.get("cookie") ?? "";
      const fromHeader = cookieHeader
        ? parseCookieHeader(cookieHeader).map(({ name, value }) => ({
            name,
            value: value ?? "",
          }))
        : [];

      if (hasAuthCookies(fromHeader)) {
        return fromHeader;
      }
      if (hasAuthCookies(fromStore)) {
        return fromStore;
      }
      return fromStore.length > 0 ? fromStore : fromHeader;
    },
    setAll(cookiesToSet, _cacheHeaders) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      } catch {
        // Server Components cannot set cookies; proxy.ts refreshes on navigation.
      }
    },
  };

  return createServerClient(url, anon, { cookies: cookieMethods });
}

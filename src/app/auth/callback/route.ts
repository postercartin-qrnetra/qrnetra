import { getRequestOrigin } from "@/lib/auth/callback-url";
import { createServerClient } from "@supabase/ssr";
import { safeNextPath } from "@/lib/onboarding/safe-next";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRequestOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const nextRaw = requestUrl.searchParams.get("next");
  const next = safeNextPath(nextRaw);

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("supabase_not_configured")}`,
    );
  }

  const redirectTo = `${origin}${next}`;
  let response = NextResponse.redirect(redirectTo);

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              response.headers.set(key, value),
            );
          }
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("auth/callback exchange failed:", error.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("auth_exchange_failed")}`,
      );
    }
  } catch (e) {
    console.error("auth/callback exchange threw", e);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("auth_exchange_failed")}`,
    );
  }

  return response;
}

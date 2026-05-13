import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Throws a friendly error (caught by the nearest
 * error boundary) if the public env vars are missing at runtime — typically
 * because the deployment was built without `NEXT_PUBLIC_SUPABASE_URL` set.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY). Configure them in the Vercel project and redeploy.",
    );
  }
  return createBrowserClient(url, anon);
}

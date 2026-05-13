import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client for server contexts without a user session (e.g.
 * the public scan RPC and the `/api/scan` insert).
 *
 * Returns `null` when env vars are missing so callers can fall back gracefully
 * instead of crashing the request. The previous version threw synchronously,
 * which surfaced as a bare "Internal Server Error" in production whenever the
 * Vercel project was missing `NEXT_PUBLIC_SUPABASE_URL`.
 */
export function createPublicServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

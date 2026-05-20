import type { SupabaseClient } from "@supabase/supabase-js";
import { generateQnrSlug } from "@/lib/qr/slug";

const MAX_ATTEMPTS = 12;

/**
 * Server-only: allocate a unique QNR-XXXXXX slug across qr_codes and legacy qrs.
 */
export async function allocateUniqueQnrSlug(
  supabase: SupabaseClient,
): Promise<string | null> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const slug = generateQnrSlug();

    const [{ data: inCodes }, { data: inLegacy }] = await Promise.all([
      supabase.from("qr_codes").select("id").eq("slug", slug).maybeSingle(),
      supabase.from("qrs").select("id").eq("public_slug", slug).maybeSingle(),
    ]);

    if (!inCodes && !inLegacy) {
      return slug;
    }
  }

  return null;
}

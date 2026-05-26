import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return { user: null, error: "ADMIN_EMAIL is not configured." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { user: null, error: "Supabase is not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || user.email.toLowerCase() !== adminEmail) {
    return { user: null, error: "This area is restricted to the configured admin email." };
  }

  return { user, error: null };
}

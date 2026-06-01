"use server";

import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

export async function exportProfilesJsonAction(): Promise<
  { ok: true; json: string } | { ok: false; error: string }
> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Not signed in." };

  const { data, error } = await ctx.supabase
    .from("qr_profiles")
    .select("id, name, phone, profile_type, slug, data_json, created_at, updated_at")
    .eq("user_id", ctx.user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, json: JSON.stringify(data ?? [], null, 2) };
}

export async function exportOrdersJsonAction(): Promise<
  { ok: true; json: string } | { ok: false; error: string }
> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Not signed in." };

  const { data, error } = await ctx.supabase
    .from("orders")
    .select(
      "id, order_number, payment_status, fulfillment_status, amount_paise, tracking_number, courier_name, qr_slug, created_at, paid_at, shipped_at, delivered_at",
    )
    .eq("user_id", ctx.user.id)
    .order("created_at", { ascending: false });

  if (error) return { ok: false, error: error.message };
  return { ok: true, json: JSON.stringify(data ?? [], null, 2) };
}

export async function exportScanHistoryJsonAction(): Promise<
  { ok: true; json: string } | { ok: false; error: string }
> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "Not signed in." };

  const { data, error } = await ctx.supabase.rpc("get_owner_finder_events", {
    p_user_id: ctx.user.id,
    p_limit: 500,
    p_offset: 0,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, json: JSON.stringify(data ?? {}, null, 2) };
}

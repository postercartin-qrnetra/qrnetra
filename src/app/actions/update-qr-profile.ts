"use server";

import { createClient } from "@/lib/supabase/server";
import {
  validateCreateForm,
  validatedFormToProfile,
} from "@/lib/qr/validate-create-form";

export type UpdateQrProfileResult = {
  error: string | null;
};

/**
 * Updates emergency profile fields only. Slug and qr_url are never changed.
 */
export async function updateQrProfileAction(
  qrId: string,
  formData: FormData,
): Promise<UpdateQrProfileResult> {
  const validation = validateCreateForm(formData);
  if (!validation.ok) {
    return { error: validation.error };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Server configuration error." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated." };
  }

  const { data: code, error: codeErr } = await supabase
    .from("qr_codes")
    .select("id, slug, profile_id")
    .eq("id", qrId)
    .single();

  if (codeErr || !code) {
    return { error: "QR not found." };
  }

  const { data: existing, error: profErr } = await supabase
    .from("qr_profiles")
    .select("id, user_id, profile_type, slug")
    .eq("id", code.profile_id)
    .single();

  if (profErr || !existing || existing.user_id !== user.id) {
    return { error: "QR not found." };
  }

  const profile = validatedFormToProfile(validation.data);

  if (profile.profileType !== existing.profile_type) {
    return { error: "Profile type cannot be changed after creation." };
  }

  const { error: updateErr } = await supabase
    .from("qr_profiles")
    .update({
      name: profile.name,
      phone: profile.phone,
      data_json: profile.dataJson,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (updateErr) {
    return { error: updateErr.message };
  }

  const legacyExtra = { ...profile.dataJson };
  if (profile.whatsapp) legacyExtra.whatsapp = profile.whatsapp;

  await supabase
    .from("qrs")
    .update({
      title: profile.name,
      finder_message: profile.emergencyNote,
      vehicle_registration: profile.vehicleNumber,
      owner_phone: profile.phone,
      whatsapp_e164: profile.whatsapp,
      profile_extra: legacyExtra,
      updated_at: new Date().toISOString(),
    })
    .eq("public_slug", existing.slug)
    .eq("owner_user_id", user.id);

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: profile.name,
      phone: profile.phone,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  return { error: null };
}

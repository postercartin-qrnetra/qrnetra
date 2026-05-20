"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generatePublicSlug,
  isPlausiblePhone,
  normalizeIndiaPhone,
} from "@/lib/qr/slug";
import { isQrKind, type QrKind } from "@/lib/qr/types";

export type { QrKind };

function optPhone(raw: string): string | null {
  const n = normalizeIndiaPhone(raw.trim());
  if (!n || !isPlausiblePhone(n)) return null;
  return n;
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export type CreateQrResult = { error: string | null; slug: string | null };

export async function createQrAction(
  formData: FormData,
): Promise<CreateQrResult> {
  const rawType = str(formData, "type");
  if (!isQrKind(rawType)) {
    return { error: "Invalid profile type.", slug: null };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      error: "Server is missing Supabase configuration. Contact support.",
      slug: null,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated. Please sign in and try again.", slug: null };
  }

  const profileExtra: Record<string, string> = {};
  let title: string | null = null;
  let vehicle_registration: string | null = null;
  let owner_phone: string | null = null;
  let whatsapp_e164: string | null = null;
  let finder_message: string | null = null;

  if (rawType === "vehicle") {
    title = str(formData, "full_name") || null;
    owner_phone = normalizeIndiaPhone(str(formData, "phone"));
    whatsapp_e164 = optPhone(str(formData, "whatsapp"));
    vehicle_registration = str(formData, "vehicle_number") || null;
    const alt = optPhone(str(formData, "alternate_contact"));
    if (alt) profileExtra.alternate_contact = alt;
    const note = str(formData, "emergency_note");
    if (note) finder_message = note;
  } else if (rawType === "child") {
    title = str(formData, "child_name") || null;
    owner_phone = normalizeIndiaPhone(str(formData, "parent_contact"));
    const parentName = str(formData, "parent_name");
    if (parentName) profileExtra.parent_name = parentName;
    const emerg = optPhone(str(formData, "emergency_contact"));
    if (emerg) profileExtra.emergency_contact = emerg;
    const bg = str(formData, "blood_group");
    if (bg) profileExtra.blood_group = bg;
    const allergies = str(formData, "allergies");
    if (allergies) profileExtra.allergies = allergies;
    const school = str(formData, "school_name");
    if (school) profileExtra.school_name = school;
    const instructions = str(formData, "emergency_instructions");
    if (instructions) profileExtra.emergency_instructions = instructions;
    const note = str(formData, "emergency_note");
    if (note) finder_message = note;
  } else if (rawType === "pet") {
    title = str(formData, "pet_name") || null;
    owner_phone = normalizeIndiaPhone(str(formData, "owner_contact"));
    const breed = str(formData, "breed");
    if (breed) profileExtra.breed = breed;
    const vet = optPhone(str(formData, "vet_contact"));
    if (vet) profileExtra.vet_contact = vet;
    const notes = str(formData, "medical_notes");
    if (notes) profileExtra.medical_notes = notes;
    const reward = str(formData, "reward_note");
    if (reward) profileExtra.reward_note = reward;
    const wa = optPhone(str(formData, "whatsapp"));
    if (wa) whatsapp_e164 = wa;
    const note = str(formData, "emergency_note");
    if (note) finder_message = note;
  } else if (rawType === "business") {
    title = str(formData, "company_name") || null;
    owner_phone = normalizeIndiaPhone(str(formData, "admin_contact"));
    const escalation = optPhone(str(formData, "escalation_contact"));
    if (escalation) profileExtra.escalation_contact = escalation;
    const assetId = str(formData, "asset_id");
    if (assetId) {
      profileExtra.asset_id = assetId;
      vehicle_registration = assetId;
    }
    const dept = str(formData, "department");
    if (dept) profileExtra.department = dept;
    const fleet = str(formData, "fleet_size");
    if (fleet) profileExtra.fleet_size = fleet;
    const wa = optPhone(str(formData, "whatsapp"));
    if (wa) whatsapp_e164 = wa;
    const note = str(formData, "emergency_note");
    if (note) finder_message = note;
  }

  if (!title || !owner_phone || !isPlausiblePhone(owner_phone)) {
    return {
      error: "Please fill the required fields with a valid phone number (10+ digits).",
      slug: null,
    };
  }

  let slug = "";
  let created = false;

  for (let attempt = 0; attempt < 8 && !created; attempt++) {
    slug = generatePublicSlug(7);
    const { error } = await supabase.from("qrs").insert({
      owner_user_id: user.id,
      public_slug: slug,
      kind: rawType,
      status: "active",
      title,
      finder_message,
      vehicle_registration,
      channel_call: true,
      channel_whatsapp: Boolean(whatsapp_e164),
      channel_sms: false,
      channel_email: false,
      notify_owner_on_scan: true,
      owner_phone,
      whatsapp_e164: whatsapp_e164 ?? null,
      profile_extra: profileExtra,
    });

    if (!error) {
      created = true;
      break;
    }

    if (error.code !== "23505") {
      return { error: error.message, slug: null };
    }
  }

  if (!created) {
    return { error: "Could not allocate a unique QR code. Try again.", slug: null };
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: title ?? undefined,
      phone: owner_phone ?? undefined,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  return { error: null, slug };
}

/** Toggle a QR between active and disabled. */
export async function toggleQrStatusAction(
  qrId: string,
  currentStatus: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "Server configuration error." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const newStatus = currentStatus === "active" ? "disabled" : "active";
  const { error } = await supabase
    .from("qrs")
    .update({ status: newStatus })
    .eq("id", qrId)
    .eq("owner_user_id", user.id);

  return { error: error?.message ?? null };
}

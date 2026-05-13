"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  generatePublicSlug,
  isPlausiblePhone,
  normalizeIndiaPhone,
} from "@/lib/qr/slug";
import { isQrKind, type QrKind } from "@/lib/qr/types";

export type { QrKind };

function optPhone(raw: string): string | null {
  const n = normalizeIndiaPhone(raw);
  if (!n || !isPlausiblePhone(n)) return null;
  return n;
}

export type CreateQrState = { error: string | null };

export async function createQrProfileAction(
  _prevState: CreateQrState,
  formData: FormData,
): Promise<CreateQrState> {
  const rawType = String(formData.get("type") ?? "");
  if (!isQrKind(rawType)) {
    return { error: "Invalid profile type." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      error:
        "Server is missing Supabase environment variables. Contact support.",
    };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const profileExtra: Record<string, string> = {};
  let title: string | null = null;
  let vehicle_registration: string | null = null;
  let owner_phone: string | null = null;
  let whatsapp_e164: string | null = null;
  const finder_message: string | null = null;

  if (rawType === "vehicle") {
    title = String(formData.get("full_name") ?? "").trim() || null;
    owner_phone = normalizeIndiaPhone(String(formData.get("phone") ?? "").trim());
    whatsapp_e164 = optPhone(String(formData.get("whatsapp") ?? ""));
    vehicle_registration =
      String(formData.get("vehicle_number") ?? "").trim() || null;
    const alt = String(formData.get("alternate_contact") ?? "").trim();
    const altN = optPhone(alt);
    if (altN) profileExtra.alternate_contact = altN;
  } else if (rawType === "child") {
    title = String(formData.get("child_name") ?? "").trim() || null;
    owner_phone = normalizeIndiaPhone(
      String(formData.get("parent_contact") ?? "").trim(),
    );
    const emerg = optPhone(String(formData.get("emergency_contact") ?? ""));
    if (emerg) profileExtra.emergency_contact = emerg;
    const bg = String(formData.get("blood_group") ?? "").trim();
    if (bg) profileExtra.blood_group = bg;
    const allergies = String(formData.get("allergies") ?? "").trim();
    if (allergies) profileExtra.allergies = allergies;
  } else if (rawType === "pet") {
    title = String(formData.get("pet_name") ?? "").trim() || null;
    owner_phone = normalizeIndiaPhone(
      String(formData.get("owner_contact") ?? "").trim(),
    );
    const breed = String(formData.get("breed") ?? "").trim();
    if (breed) profileExtra.breed = breed;
    const vet = optPhone(String(formData.get("vet_contact") ?? ""));
    if (vet) profileExtra.vet_contact = vet;
    const notes = String(formData.get("medical_notes") ?? "").trim();
    if (notes) profileExtra.medical_notes = notes;
  } else if (rawType === "business") {
    title = String(formData.get("company_name") ?? "").trim() || null;
    owner_phone = normalizeIndiaPhone(
      String(formData.get("admin_contact") ?? "").trim(),
    );
    const fleet = String(formData.get("fleet_size") ?? "").trim();
    if (fleet) profileExtra.fleet_size = fleet;
    const emerg = optPhone(String(formData.get("emergency_number") ?? ""));
    if (emerg) profileExtra.emergency_number = emerg;
  }

  if (!title || !owner_phone || !isPlausiblePhone(owner_phone)) {
    return {
      error: "Please fill required fields with valid phone numbers (10+ digits).",
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
      whatsapp_e164: whatsapp_e164 || null,
      profile_extra: profileExtra,
    });

    if (!error) {
      created = true;
      break;
    }

    if (error.code !== "23505") {
      return { error: error.message };
    }
  }

  if (!created) {
    return { error: "Could not allocate a unique QR code. Try again." };
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

  redirect(`/dashboard/tags?new=${encodeURIComponent(slug)}`);
}

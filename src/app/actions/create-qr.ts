"use server";

import { createClient } from "@/lib/supabase/server";
import { runQrGenerationPipeline } from "@/lib/qr/pipeline";
import {
  validateCreateForm,
  validatedFormToProfile,
} from "@/lib/qr/validate-create-form";
import type { QrKind } from "@/lib/qr/types";

export type { QrKind };

export type CreateQrResult = {
  error: string | null;
  slug: string | null;
};

export async function createQrAction(
  formData: FormData,
): Promise<CreateQrResult> {
  const validation = validateCreateForm(formData);
  if (!validation.ok) {
    return { error: validation.error, slug: null };
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
    return {
      error: "Not authenticated. Please sign in and try again.",
      slug: null,
    };
  }

  const profile = validatedFormToProfile(validation.data);
  const pipeline = await runQrGenerationPipeline(supabase, user.id, profile);

  if (!pipeline.ok) {
    return { error: pipeline.error, slug: null };
  }

  return { error: null, slug: pipeline.result.slug };
}

export type QrStatus = "active" | "paused" | "disabled";

export async function setQrStatusAction(
  qrId: string,
  status: QrStatus,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "Server configuration error." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: code } = await supabase
    .from("qr_codes")
    .select("id, slug, profile_id")
    .eq("id", qrId)
    .single();

  if (!code) {
    return { error: "QR not found." };
  }

  const { data: prof } = await supabase
    .from("qr_profiles")
    .select("user_id")
    .eq("id", code.profile_id)
    .single();

  if (!prof || prof.user_id !== user.id) {
    return { error: "QR not found." };
  }

  const owned = code;

  const { error: codeErr } = await supabase
    .from("qr_codes")
    .update({ status })
    .eq("id", qrId);

  if (codeErr) return { error: codeErr.message };

  await supabase
    .from("qr_profiles")
    .update({ status })
    .eq("id", owned.profile_id);

  await supabase
    .from("qrs")
    .update({ status })
    .eq("public_slug", owned.slug)
    .eq("owner_user_id", user.id);

  return { error: null };
}

/** Toggle active ↔ disabled (legacy one-click control). */
export async function toggleQrStatusAction(
  qrId: string,
  currentStatus: string,
): Promise<{ error: string | null }> {
  const next: QrStatus =
    currentStatus === "active" ? "disabled" : "active";
  return setQrStatusAction(qrId, next);
}

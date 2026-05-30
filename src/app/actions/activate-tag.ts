"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizePublicTagId } from "@/lib/inventory/types";

export type VerifyActivationResult = {
  error: string | null;
  ok?: boolean;
  presetSlug?: string | null;
  productType?: string | null;
};

export async function verifyTagActivationAction(
  publicTagId: string,
  activationCode: string,
): Promise<VerifyActivationResult> {
  const supabase = await createClient();
  if (!supabase) return { error: "Server configuration error." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to continue." };

  const { data, error } = await supabase.rpc("verify_tag_activation", {
    p_public_tag_id: normalizePublicTagId(publicTagId),
    p_activation_code: activationCode.trim(),
  });

  if (error) return { error: error.message };

  const payload =
    data && typeof data === "object"
      ? (data as {
          ok?: boolean;
          error?: string;
          preset_slug?: string;
          product_type?: string;
        })
      : null;

  if (!payload?.ok) {
    return { error: payload?.error ?? "Verification failed." };
  }

  return {
    error: null,
    ok: true,
    presetSlug: payload.preset_slug ?? null,
    productType: payload.product_type ?? null,
  };
}

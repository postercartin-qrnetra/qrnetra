"use server";

import { createClient } from "@/lib/supabase/server";
import { parseQrnetraScanTarget } from "@/lib/qr/scan-target";

export type ResolveScanResult = {
  error: string | null;
  destination: string | null;
};

export async function resolveScanDestinationAction(
  scannedValue: string,
): Promise<ResolveScanResult> {
  const parsed = parseQrnetraScanTarget(scannedValue);

  if (parsed.kind === "unsupported") {
    return {
      error: "This QR does not look like a QRNetra tag or activation code.",
      destination: null,
    };
  }

  if (parsed.kind === "activation_tag") {
    return {
      error: null,
      destination: `/activate/${encodeURIComponent(parsed.tagId)}`,
    };
  }

  if (parsed.kind === "activation") {
    return {
      error: null,
      destination: `/activate/legacy?code=${encodeURIComponent(parsed.code)}`,
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "Server configuration error.", destination: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: code } = await supabase
    .from("qr_codes")
    .select("id, slug, qr_profiles!inner(user_id)")
    .eq("slug", parsed.slug)
    .maybeSingle();

  const qrProfile = code?.qr_profiles;
  const profile = Array.isArray(qrProfile) ? qrProfile[0] : qrProfile;

  if (user && code?.id && profile?.user_id === user.id) {
    return {
      error: null,
      destination: `/dashboard/my-qrs/${code.id}`,
    };
  }

  return {
    error: null,
    destination: `/s/${encodeURIComponent(parsed.slug)}`,
  };
}

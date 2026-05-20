import type { SupabaseClient } from "@supabase/supabase-js";
import { allocateUniqueQnrSlug } from "@/lib/qr/allocate-slug";
import { generateQrImageAssets } from "@/lib/qr/generate-qr-image";
import type { ParsedProfilePayload } from "@/lib/qr/validate-create-form";
import { buildPublicScanUrl } from "@/lib/qr/slug";
import { getPublicSiteUrl } from "@/lib/site-url";

export type QrPipelineResult = {
  slug: string;
  qrId: string;
  profileId: string;
  scanUrl: string;
  qrUrl: string;
  pngDataUrl: string;
  svg: string;
};

/**
 * Steps 2–7: profile → unique slug → qr_codes row → QR images (URL only).
 */
export async function runQrGenerationPipeline(
  supabase: SupabaseClient,
  userId: string,
  profile: ParsedProfilePayload,
): Promise<{ ok: true; result: QrPipelineResult } | { ok: false; error: string }> {
  const slug = await allocateUniqueQnrSlug(supabase);
  if (!slug) {
    return {
      ok: false,
      error: "Could not allocate a unique QR ID. Please try again.",
    };
  }

  const site = getPublicSiteUrl();
  const scanUrl = buildPublicScanUrl(site, slug);

  const { data: qrProfile, error: profileError } = await supabase
    .from("qr_profiles")
    .insert({
      user_id: userId,
      profile_type: profile.profileType,
      name: profile.name,
      phone: profile.phone,
      slug,
      status: "active",
      data_json: profile.dataJson,
    })
    .select("id")
    .single();

  if (profileError || !qrProfile) {
    return {
      ok: false,
      error: profileError?.message ?? "Failed to save emergency profile.",
    };
  }

  const { data: qrCode, error: qrError } = await supabase
    .from("qr_codes")
    .insert({
      profile_id: qrProfile.id,
      slug,
      qr_url: scanUrl,
      status: "active",
      scans: 0,
    })
    .select("id")
    .single();

  if (qrError || !qrCode) {
    await supabase.from("qr_profiles").delete().eq("id", qrProfile.id);
    return {
      ok: false,
      error: qrError?.message ?? "Failed to create QR record.",
    };
  }

  // Legacy mirror so existing dashboard/RPC paths keep working during transition
  const legacyExtra = { ...profile.dataJson };
  if (profile.whatsapp) legacyExtra.whatsapp = profile.whatsapp;

  const { error: legacyError } = await supabase.from("qrs").insert({
    owner_user_id: userId,
    public_slug: slug,
    kind: profile.profileType,
    status: "active",
    title: profile.name,
    finder_message: profile.emergencyNote,
    vehicle_registration: profile.vehicleNumber,
    channel_call: true,
    channel_whatsapp: Boolean(profile.whatsapp),
    channel_sms: false,
    channel_email: false,
    notify_owner_on_scan: true,
    owner_phone: profile.phone,
    whatsapp_e164: profile.whatsapp,
    profile_extra: legacyExtra,
  });

  if (legacyError && legacyError.code !== "23505") {
    console.error("legacy qrs mirror insert:", legacyError.message);
  }

  await supabase.from("profiles").upsert(
    {
      id: userId,
      display_name: profile.name,
      phone: profile.phone,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  let pngDataUrl = "";
  let svg = "";
  try {
    const assets = await generateQrImageAssets(scanUrl);
    pngDataUrl = assets.pngDataUrl;
    svg = assets.svg;
  } catch (e) {
    console.error("QR image generation failed (success page will retry):", e);
  }

  return {
    ok: true,
    result: {
      slug,
      qrId: qrCode.id,
      profileId: qrProfile.id,
      scanUrl,
      qrUrl: scanUrl,
      pngDataUrl,
      svg,
    },
  };
}

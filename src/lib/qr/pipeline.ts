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
const AUDIT = process.env.QR_PIPELINE_AUDIT === "1";

function audit(step: string, detail?: Record<string, unknown>) {
  if (!AUDIT) return;
  console.log(`[QR-AUDIT] ${step}`, detail ?? "");
}

export async function runQrGenerationPipeline(
  supabase: SupabaseClient,
  userId: string,
  profile: ParsedProfilePayload,
  options?: { presetSlug?: string | null },
): Promise<{ ok: true; result: QrPipelineResult } | { ok: false; error: string }> {
  audit("[STEP 4] slug allocation started");

  const presetSlug = options?.presetSlug?.trim() || null;
  const slug =
    presetSlug ??
    (await allocateUniqueQnrSlug(supabase));
  if (!slug) {
    audit("[STEP 5] slug allocation failed");
    return {
      ok: false,
      error: "Could not allocate a unique QR ID. Please try again.",
    };
  }

  const site = getPublicSiteUrl();
  const scanUrl = buildPublicScanUrl(site, slug);
  audit("[STEP 5] slug generated", { slug, site, scanUrl });

  const profileInsertPayload = {
    user_id: userId,
    profile_type: profile.profileType,
    name: profile.name,
    phone: profile.phone,
    slug,
    status: "active",
    data_json: profile.dataJson,
  };
  console.log("[QR INSERT] qr_profiles payload", profileInsertPayload);
  audit("[STEP 6] qr_profiles insert started");

  const { data: qrProfile, error: profileError } = await supabase
    .from("qr_profiles")
    .insert(profileInsertPayload)
    .select("id")
    .single();

  console.log("[QR INSERT] qr_profiles response", {
    id: qrProfile?.id ?? null,
    error: profileError?.message ?? null,
    code: profileError?.code ?? null,
  });

  if (profileError || !qrProfile) {
    audit("[STEP 6] qr_profiles insert failed", {
      message: profileError?.message,
      code: profileError?.code,
      details: profileError?.details,
    });
    return {
      ok: false,
      error: profileError?.message ?? "Failed to save emergency profile.",
    };
  }
  audit("[STEP 6] qr_profiles insert succeeded", { profileId: qrProfile.id });

  const qrCodeInsertPayload = {
    profile_id: qrProfile.id,
    slug,
    qr_url: scanUrl,
    status: "active",
    scans: 0,
  };
  console.log("[QR INSERT] qr_codes payload", qrCodeInsertPayload);
  audit("[STEP 7] qr_codes insert started", { profile_id: qrProfile.id });

  const { data: qrCode, error: qrError } = await supabase
    .from("qr_codes")
    .insert(qrCodeInsertPayload)
    .select("id")
    .single();

  console.log("[QR INSERT] qr_codes response", {
    id: qrCode?.id ?? null,
    error: qrError?.message ?? null,
    code: qrError?.code ?? null,
  });

  if (qrError || !qrCode) {
    audit("[STEP 7] qr_codes insert failed", {
      message: qrError?.message,
      code: qrError?.code,
      details: qrError?.details,
    });
    await supabase.from("qr_profiles").delete().eq("id", qrProfile.id);
    return {
      ok: false,
      error: qrError?.message ?? "Failed to create QR record.",
    };
  }
  audit("[STEP 7] qr_codes insert succeeded", { qrId: qrCode.id });

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
    audit("[STEP 7b] QR image generation succeeded", {
      pngLength: pngDataUrl.length,
      svgLength: svg.length,
      encodes: scanUrl,
    });
  } catch (e) {
    audit("[STEP 7b] QR image generation failed (non-fatal)", {
      error: e instanceof Error ? e.message : String(e),
    });
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

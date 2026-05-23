import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl } from "@/lib/site-url";
import { buildPublicScanUrl } from "@/lib/qr/slug";
import { QrDeliveryCard } from "@/components/qr-delivery-card";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `QR Ready · ${slug} · QRNetra`,
  };
}

const AUDIT = process.env.QR_PIPELINE_AUDIT === "1";

function audit(step: string, detail?: Record<string, unknown>) {
  if (!AUDIT) return;
  console.log(`[QR-AUDIT] ${step}`, detail ?? "");
}

export default async function CreateSuccessPage({ params }: Props) {
  const { slug } = await params;
  audit("[STEP 9] success page render", { slug, slugEmpty: !slug?.trim() });

  const supabase = await createClient();
  if (!supabase) {
    audit("[STEP 9] supabase null — redirect /create");
    redirect("/create");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    audit("[STEP 9] no user — redirect login");
    redirect(`/login?next=/create/success/${encodeURIComponent(slug)}`);
  }

  const { data: qrCode, error: codeErr } = await supabase
    .from("qr_codes")
    .select("id, slug, qr_url, status, profile_id")
    .eq("slug", slug)
    .single();

  audit("[STEP 9] qr_codes lookup", {
    found: Boolean(qrCode),
    codeErr: codeErr?.message,
    code: codeErr?.code,
  });

  if (!codeErr && qrCode) {
    const { data: profile } = await supabase
      .from("qr_profiles")
      .select("name, profile_type, data_json, phone, user_id")
      .eq("id", qrCode.profile_id)
      .single();

    audit("[STEP 9] qr_profiles lookup", {
      found: Boolean(profile),
      ownerMatch: profile?.user_id === user.id,
    });

    if (!profile || profile.user_id !== user.id) {
      audit("[STEP 9] profile missing or wrong owner — notFound");
      notFound();
    }

    const site = getPublicSiteUrl();
    const scanUrl = buildPublicScanUrl(site, qrCode.slug);
    const extra = (profile.data_json ?? {}) as Record<string, string>;
    const whatsapp =
      typeof extra.whatsapp === "string" ? extra.whatsapp : null;

    return (
      <QrDeliveryCard
        qrId={qrCode.id}
        slug={qrCode.slug}
        scanUrl={scanUrl}
        status={qrCode.status}
        title={profile.name ?? "Emergency QR"}
        kind={profile.profile_type ?? "vehicle"}
        vehicleReg={extra.vehicle_number ?? extra.asset_id ?? null}
        whatsappNumber={whatsapp ?? profile.phone}
      />
    );
  }

  // Legacy qrs fallback
  const { data: qr, error } = await supabase
    .from("qrs")
    .select(
      "id, public_slug, kind, title, vehicle_registration, whatsapp_e164, status",
    )
    .eq("public_slug", slug)
    .eq("owner_user_id", user.id)
    .single();

  audit("[STEP 9] legacy qrs fallback", {
    found: Boolean(qr),
    error: error?.message,
  });

  if (error || !qr) {
    audit("[STEP 9] no qr_codes or legacy qrs — notFound");
    notFound();
  }

  const site = getPublicSiteUrl();
  const scanUrl = buildPublicScanUrl(site, qr.public_slug);

  return (
    <QrDeliveryCard
      qrId={qr.id}
      slug={qr.public_slug}
      scanUrl={scanUrl}
      title={qr.title ?? qr.vehicle_registration ?? "Emergency QR"}
      kind={qr.kind}
      vehicleReg={qr.vehicle_registration}
      whatsappNumber={qr.whatsapp_e164}
    />
  );
}

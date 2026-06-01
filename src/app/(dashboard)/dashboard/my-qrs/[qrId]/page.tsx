import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditQrProfileForm } from "@/components/edit-qr-profile-form";
import { ProfileCompletenessCard } from "@/components/profile-completeness-card";
import { computeProfileCompleteness } from "@/lib/qr/profile-completeness";
import { QrAssetDownloads } from "@/components/qr-asset-downloads";
import { QrPreview } from "@/components/qr-preview";
import { QrDashboardActions } from "@/components/qr-dashboard-actions";
import { getPublicSiteUrl } from "@/lib/site-url";
import { buildPublicScanUrl } from "@/lib/qr/slug";
import { isQrKind } from "@/lib/qr/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ qrId: string }> };

export default async function QrDetailPage({ params }: Props) {
  const { qrId } = await params;
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: code, error } = await supabase
    .from("qr_codes")
    .select(
      "id, slug, qr_url, status, qr_profiles!inner(name, phone, profile_type, data_json, user_id)",
    )
    .eq("id", qrId)
    .single();

  if (error || !code) {
    notFound();
  }

  const rawProfile = code.qr_profiles;
  const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;

  if (!profile || profile.user_id !== user.id) {
    notFound();
  }

  const kind = isQrKind(profile.profile_type)
    ? profile.profile_type
    : "vehicle";
  const dataJson = (profile.data_json ?? {}) as Record<string, string>;
  const site = getPublicSiteUrl();
  const scanUrl = buildPublicScanUrl(site, code.slug);
  const subtitle = dataJson.vehicle_number ?? dataJson.asset_id ?? null;
  const completeness = computeProfileCompleteness(kind, dataJson);

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/tags"
        className="text-sm font-semibold text-qn-muted-2 hover:text-white"
      >
        ← Back to tags
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
        Edit emergency profile
      </h1>
      <p className="mt-1 font-mono text-xs text-qn-muted-2">{code.slug}</p>

      <div className="mt-6">
        <ProfileCompletenessCard completeness={completeness} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <EditQrProfileForm
            qrId={code.id}
            kind={kind}
            name={profile.name}
            phone={profile.phone}
            dataJson={dataJson}
          />
        </div>
        <div className="space-y-6">
          <QrPreview url={scanUrl} slug={code.slug} />
          <QrAssetDownloads
            scanUrl={scanUrl}
            slug={code.slug}
            kind={kind}
            title={profile.name}
            subtitle={subtitle}
          />
          <QrDashboardActions
            qrId={code.id}
            slug={code.slug}
            scanUrl={scanUrl}
            status={code.status}
            kind={kind}
            title={profile.name}
            subtitle={subtitle}
            hideEdit
          />
        </div>
      </div>
    </div>
  );
}

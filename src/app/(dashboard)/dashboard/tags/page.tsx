import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QrPreview } from "@/components/qr-preview";
import { QrDashboardActions } from "@/components/qr-dashboard-actions";
import { getPublicSiteUrl } from "@/lib/site-url";
import { buildPublicScanUrl } from "@/lib/qr/slug";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ new?: string }> };

type QrProfileEmbed = {
  name: string;
  profile_type: string;
  data_json: Record<string, string> | null;
};

function embedProfile(
  raw: QrProfileEmbed | QrProfileEmbed[] | null,
): QrProfileEmbed | null {
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw;
}

export default async function DashboardTagsPage({ searchParams }: Props) {
  const { new: newSlug } = await searchParams;
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: codes, error: codesError } = await supabase
    .from("qr_codes")
    .select(
      "id, slug, status, scans, created_at, qr_profiles!inner(name, profile_type, data_json, user_id)",
    )
    .eq("qr_profiles.user_id", user.id)
    .order("created_at", { ascending: false });

  let tags: Array<{
    id: string;
    slug: string;
    kind: string;
    title: string | null;
    status: string;
    scans: number;
    vehicle_registration: string | null;
    publicTagId: string | null;
    tagUnitStatus: string | null;
    activatedAt: string | null;
  }> = [];

  const { data: ownedUnits } = await supabase
    .from("tag_units")
    .select("qr_code_id, public_tag_id, status, activated_at")
    .eq("owner_user_id", user.id);

  const unitByQrId = new Map(
    (ownedUnits ?? []).map((u) => [u.qr_code_id, u]),
  );

  if (!codesError && codes?.length) {
    tags = codes.map((c) => {
      const p = embedProfile(
        c.qr_profiles as QrProfileEmbed | QrProfileEmbed[] | null,
      );
      const extra = p?.data_json ?? {};
      const unit = unitByQrId.get(c.id);
      return {
        id: c.id,
        slug: c.slug,
        kind: p?.profile_type ?? "vehicle",
        title: p?.name ?? null,
        status: c.status,
        scans: c.scans ?? 0,
        vehicle_registration:
          extra.vehicle_number ?? extra.asset_id ?? null,
        publicTagId: unit?.public_tag_id ?? null,
        tagUnitStatus: unit?.status ?? null,
        activatedAt: unit?.activated_at ?? null,
      };
    });
  } else {
    const { data: legacy, error } = await supabase
      .from("qrs")
      .select(
        "id, public_slug, kind, title, created_at, vehicle_registration, status",
      )
      .eq("owner_user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return (
        <p className="text-sm text-qn-danger">
          Could not load tags: {error.message}
        </p>
      );
    }

    tags = (legacy ?? []).map((t) => ({
      id: t.id,
      slug: t.public_slug,
      kind: t.kind,
      title: t.title,
      status: t.status,
      scans: 0,
      vehicle_registration: t.vehicle_registration,
      publicTagId: null,
      tagUnitStatus: null,
      activatedAt: null,
    }));
  }

  const site = getPublicSiteUrl();
  const activeCount = tags.filter((tag) => tag.status === "active").length;
  const disabledCount = tags.filter((tag) => tag.status === "disabled").length;
  const totalScans = tags.reduce((sum, tag) => sum + tag.scans, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
            My Tags
          </p>
          <h1 className="qn-page-title text-white">My Tags</h1>
          <p className="mt-1 text-sm text-qn-muted">
            Physical tags and digital QRs — edit profile data anytime; your scan
            link stays the same.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/scan" className="qn-btn-secondary h-10 shrink-0 px-5">
            Scan a tag
          </Link>
          <Link href="/create" className="qn-btn-primary h-10 shrink-0 px-5">
            + New QR
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qn-muted-2">
            Total tags
          </p>
          <p className="mt-2 text-2xl font-extrabold text-white">{tags.length}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qn-muted-2">
            Active
          </p>
          <p className="mt-2 text-2xl font-extrabold text-white">{activeCount}</p>
          <p className="mt-1 text-xs text-qn-muted-2">
            {disabledCount} disabled
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qn-muted-2">
            Total scans
          </p>
          <p className="mt-2 text-2xl font-extrabold text-white">{totalScans}</p>
        </div>
      </div>

      {!tags.length ? (
        <div className="qn-card mt-10 border-dashed p-10 text-center">
          <p className="text-sm text-qn-muted">No tags yet.</p>
          <Link
            href="/create"
            className="qn-btn-primary mt-4 px-6"
          >
            Create your first QR
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 lg:grid-cols-2">
          {tags.map((tag) => {
            const url = buildPublicScanUrl(site, tag.slug);
            const isNew = newSlug === tag.slug;
            const isDisabled = tag.status === "disabled";
            const isPaused = tag.status === "paused";

            return (
              <li
                key={tag.id}
                className={`qn-card p-5 ${
                  isNew
                    ? "border-qn-accent ring-2 ring-qn-accent/30"
                    : isDisabled
                      ? "border-white/[0.08] opacity-70"
                      : "border-white/[0.08]"
                }`}
              >
                {isNew && (
                  <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-qn-accent px-3 py-1 text-xs font-bold text-white">
                    ✓ Just created
                  </p>
                )}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <QrPreview url={url} slug={tag.slug} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
                        {tag.kind}
                      </span>
                      <span className="rounded-full bg-qn-surface px-2 py-0.5 text-xs font-semibold text-qn-muted">
                        {tag.scans} scan{tag.scans !== 1 ? "s" : ""}
                      </span>
                      {isPaused && (
                        <span className="rounded-full bg-qn-warning/15 px-2 py-0.5 text-xs font-semibold text-qn-warning">
                          paused
                        </span>
                      )}
                      {isDisabled && (
                        <span className="rounded-full bg-qn-surface px-2 py-0.5 text-xs font-semibold text-qn-muted-2">
                          disabled
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-white">
                      {tag.title ?? "Untitled tag"}
                    </h2>
                    {tag.publicTagId && (
                      <p className="mt-0.5 font-mono text-xs text-qn-muted-2">
                        {tag.publicTagId}
                        {tag.activatedAt
                          ? ` · activated ${new Date(tag.activatedAt).toLocaleDateString()}`
                          : null}
                      </p>
                    )}
                    {tag.vehicle_registration && (
                      <p className="mt-0.5 text-sm text-qn-muted">
                        {tag.vehicle_registration}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="font-mono text-xs text-qn-muted-2">
                        {tag.slug}
                      </p>
                    </div>
                    <Link
                      href={`/s/${tag.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-white underline-offset-4 hover:underline"
                    >
                      View public scan page →
                    </Link>
                    <QrDashboardActions
                      qrId={tag.id}
                      slug={tag.slug}
                      scanUrl={url}
                      status={tag.status}
                      kind={tag.kind}
                      title={tag.title ?? "Emergency QR"}
                      subtitle={tag.vehicle_registration}
                      isPhysicalTag={Boolean(tag.publicTagId)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QrPreview } from "@/components/qr-preview";
import { QrTagActions } from "@/components/qr-tag-actions";
import { getPublicSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ new?: string }> };

type TagRow = {
  id: string;
  public_slug: string;
  kind: string;
  title: string | null;
  created_at: string;
  vehicle_registration: string | null;
  status: string;
  scan_events: { count: number }[];
};

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

  const { data: tags, error } = await supabase
    .from("qrs")
    .select(
      "id, public_slug, kind, title, created_at, vehicle_registration, status, scan_events(count)",
    )
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<TagRow[]>();

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Could not load tags: {error.message}
      </p>
    );
  }

  const site = getPublicSiteUrl();

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            My QR tags
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Share the public link or print the QR. Scans are logged automatically.
          </p>
        </div>
        <Link
          href="/create"
          className="mt-1 inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#ffd400] px-5 text-sm font-semibold text-[#111111] shadow-sm transition hover:opacity-90"
        >
          + New QR
        </Link>
      </div>

      {!tags?.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
          <p className="text-sm text-zinc-600">No tags yet.</p>
          <Link
            href="/create"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#ffd400] px-6 text-sm font-semibold text-[#111111]"
          >
            Create your first QR
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 lg:grid-cols-2">
          {tags.map((tag) => {
            const url = `${site}/s/${tag.public_slug}`;
            const isNew = newSlug === tag.public_slug;
            const scanCount = tag.scan_events?.[0]?.count ?? 0;
            const isDisabled = tag.status !== "active";

            return (
              <li
                key={tag.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${
                  isNew
                    ? "border-[#ffd400] ring-2 ring-[#ffd400]/30"
                    : isDisabled
                      ? "border-zinc-200 opacity-70"
                      : "border-zinc-200"
                }`}
              >
                {isNew && (
                  <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-[#ffd400] px-3 py-1 text-xs font-bold text-[#111111]">
                    ✓ Just created
                  </p>
                )}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <QrPreview url={url} slug={tag.public_slug} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {tag.kind}
                      </span>
                      {isDisabled && (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500">
                          disabled
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-[#111111]">
                      {tag.title ?? "Untitled tag"}
                    </h2>
                    {tag.vehicle_registration && (
                      <p className="mt-0.5 text-sm text-zinc-600">
                        {tag.vehicle_registration}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <p className="font-mono text-xs text-zinc-400">
                        {tag.public_slug}
                      </p>
                      <span className="text-zinc-200">·</span>
                      <p className="text-xs font-semibold text-zinc-500">
                        {scanCount} scan{scanCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link
                      href={`/s/${tag.public_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
                    >
                      View public scan page →
                    </Link>
                    <QrTagActions
                      qrId={tag.id}
                      slug={tag.public_slug}
                      status={tag.status}
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

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QrPreview } from "@/components/qr-preview";
import { getPublicSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ new?: string }> };

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
      "id, public_slug, kind, title, created_at, vehicle_registration, status",
    )
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Could not load tags: {error.message}. Run Supabase migrations if
        `profile_extra` is missing.
      </p>
    );
  }

  const site = getPublicSiteUrl();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
        My QR tags
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Share the public link or print the QR. Scans are logged automatically.
      </p>

      {!tags?.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
          <p className="text-sm text-zinc-600">No tags yet.</p>
          <Link
            href="/create/type"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#ffd400] px-6 text-sm font-semibold text-[#111111]"
          >
            Create your first QR
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-8 lg:grid-cols-2">
          {tags.map((tag) => {
            const url = `${site}/s/${tag.public_slug}`;
            const isNew = newSlug === tag.public_slug;
            return (
              <li
                key={tag.id}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                  isNew
                    ? "border-[#ffd400] ring-2 ring-[#ffd400]/30"
                    : "border-zinc-200"
                }`}
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <QrPreview url={url} slug={tag.public_slug} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {tag.kind}
                      {tag.status !== "active" ? ` · ${tag.status}` : ""}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[#111111]">
                      {tag.title ?? "Untitled tag"}
                    </h2>
                    {tag.vehicle_registration ? (
                      <p className="mt-1 text-sm text-zinc-600">
                        {tag.vehicle_registration}
                      </p>
                    ) : null}
                    <p className="mt-3 font-mono text-xs text-zinc-500">
                      {tag.public_slug}
                    </p>
                    <Link
                      href={`/s/${tag.public_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
                    >
                      View public QR page →
                    </Link>
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

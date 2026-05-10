import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ScanHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: qrs } = await supabase
    .from("qrs")
    .select("id, public_slug, title")
    .eq("owner_user_id", user.id);

  const ids = qrs?.map((q) => q.id) ?? [];
  const slugById = new Map(qrs?.map((q) => [q.id, q]) ?? []);

  if (ids.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#111111]">Scan history</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Scans will appear here after someone opens your public tag link.
        </p>
      </div>
    );
  }

  const { data: events, error } = await supabase
    .from("scan_events")
    .select("id, qr_id, created_at, device_type")
    .in("qr_id", ids)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-sm text-red-600">Could not load scans: {error.message}</p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111111]">Scan history</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Recent opens of your public pages (finder devices).
      </p>

      <ul className="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
        {!events?.length ? (
          <li className="px-4 py-8 text-center text-sm text-zinc-500">
            No scans recorded yet.
          </li>
        ) : (
          events.map((ev) => {
            const q = slugById.get(ev.qr_id);
            return (
              <li
                key={ev.id}
                className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[#111111]">
                    {q?.title ?? "Tag"}
                  </p>
                  <p className="text-xs font-mono text-zinc-500">
                    /s/{q?.public_slug}
                  </p>
                </div>
                <div className="text-right text-sm text-zinc-600">
                  <p>
                    {new Date(ev.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {ev.device_type ? (
                    <p className="text-xs capitalize text-zinc-400">
                      {ev.device_type}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

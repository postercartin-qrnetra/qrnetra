import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ScanHistoryPage() {
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

  const { data: qrs } = await supabase
    .from("qrs")
    .select("id, public_slug, title")
    .eq("owner_user_id", user.id);

  const ids = qrs?.map((q) => q.id) ?? [];
  const slugById = new Map(qrs?.map((q) => [q.id, q]) ?? []);

  if (ids.length === 0) {
    return (
      <div>
        <h1 className="qn-page-title text-white">Scan history</h1>
        <p className="mt-2 text-sm text-qn-muted">
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
      <p className="text-sm text-qn-danger">
        Could not load scans: {error.message}
      </p>
    );
  }

  return (
    <div>
      <h1 className="qn-page-title text-white">Scan history</h1>
      <p className="mt-2 text-sm text-qn-muted">
        Recent opens of your public pages (finder devices).
      </p>

      <div className="qn-table-wrap mt-8">
        {!events?.length ? (
          <p className="px-4 py-8 text-center text-sm text-qn-muted">
            No scans recorded yet.
          </p>
        ) : (
          events.map((ev) => {
            const q = slugById.get(ev.qr_id);
            return (
              <div key={ev.id} className="qn-table-row">
                <div>
                  <p className="font-medium text-white">{q?.title ?? "Tag"}</p>
                  <p className="text-xs font-mono text-qn-muted-2">
                    /s/{q?.public_slug}
                  </p>
                </div>
                <div className="text-sm text-qn-muted sm:text-right">
                  <p>
                    {new Date(ev.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {ev.device_type ? (
                    <p className="text-xs capitalize text-qn-muted-2">
                      {ev.device_type}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

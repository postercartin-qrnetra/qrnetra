import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { sendScanNotificationEmail, shouldSendNotification } from "@/lib/email/scan-notifications";
import { resolveGeoFromRequest } from "@/lib/geo/ip-lookup";
import { isFinderEventType, type ScanEventPayload } from "@/lib/scan/events";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicServerClient } from "@/lib/supabase/public-server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

async function maybeNotifyOwner(input: {
  qrId: string;
  eventType: ScanEventPayload["event_type"];
  reason?: string;
  city: string | null;
  country: string | null;
  shouldNotify: boolean;
}) {
  if (!input.shouldNotify || !shouldSendNotification(input.eventType)) return;

  const admin = createAdminClient();
  if (!admin) return;

  const { data: ctxRaw } = await admin.rpc("get_finder_event_notify_context", {
    p_qr_id: input.qrId,
  });

  const ctx =
    ctxRaw && typeof ctxRaw === "object"
      ? (ctxRaw as {
          owner_email?: string;
          notify_owner?: boolean;
          kind?: string;
          title?: string;
        })
      : null;

  if (!ctx?.owner_email || ctx.notify_owner === false) return;

  await sendScanNotificationEmail({
    to: ctx.owner_email,
    eventType: input.eventType,
    kind: ctx.kind ?? "other",
    title: ctx.title ?? "Your tag",
    reason: input.reason,
    city: input.city,
    country: input.country,
  }).catch(() => {
    /* non-blocking */
  });
}

export async function handleScanEvent(req: NextRequest, body: Partial<ScanEventPayload>) {
  const qrId = body.qr_id;
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const eventType = body.event_type;

  if (!qrId || typeof qrId !== "string" || !UUID_RE.test(qrId)) {
    return { ok: false as const, status: 400, error: "invalid qr_id" };
  }

  if (!slug) {
    return { ok: false as const, status: 400, error: "slug is required" };
  }

  if (!eventType || !isFinderEventType(eventType)) {
    return { ok: false as const, status: 400, error: "invalid event_type" };
  }

  const device =
    typeof body.device === "string" ? body.device.slice(0, 64) || null : null;
  const browser =
    typeof body.browser === "string" ? body.browser.slice(0, 128) || null : null;
  const reason =
    typeof body.reason === "string" ? body.reason.slice(0, 256) || null : null;
  const latitude =
    typeof body.latitude === "number" && Number.isFinite(body.latitude)
      ? body.latitude
      : null;
  const longitude =
    typeof body.longitude === "number" && Number.isFinite(body.longitude)
      ? body.longitude
      : null;

  const rawIp = clientIp(req);
  const ip_hash = createHash("sha256").update(rawIp).digest("hex").slice(0, 48);
  const geo = await resolveGeoFromRequest(req.headers, rawIp);

  const supabase = createPublicServerClient();
  if (!supabase) {
    return { ok: false as const, status: 503, error: "Supabase env vars not configured" };
  }

  const { data: resultRaw, error } = await supabase.rpc("record_finder_event", {
    p_qr_id: qrId,
    p_slug: slug,
    p_event_type: eventType,
    p_reason: reason,
    p_device: device,
    p_browser: browser,
    p_country: geo.country,
    p_city: geo.city,
    p_latitude: latitude,
    p_longitude: longitude,
    p_ip_hash: ip_hash,
  });

  if (error) {
    return { ok: false as const, status: 400, error: error.message };
  }

  const result =
    resultRaw && typeof resultRaw === "object"
      ? (resultRaw as {
          ok?: boolean;
          error?: string;
          qr_id?: string;
          should_notify?: boolean;
        })
      : null;

  if (!result?.ok) {
    return {
      ok: false as const,
      status: 400,
      error: result?.error ?? "record_failed",
    };
  }

  void maybeNotifyOwner({
    qrId: result.qr_id ?? qrId,
    eventType,
    reason: reason ?? undefined,
    city: geo.city,
    country: geo.country,
    shouldNotify: result.should_notify ?? false,
  });

  return { ok: true as const, status: 200 };
}

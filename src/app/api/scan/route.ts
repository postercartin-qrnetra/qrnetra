import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createPublicServerClient } from "@/lib/supabase/public-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b =
    typeof body === "object" && body !== null
      ? (body as { qr_id?: string; device_type?: string })
      : {};

  const qrId = b.qr_id;
  const device =
    typeof b.device_type === "string"
      ? b.device_type.slice(0, 64) || null
      : null;

  if (!qrId || typeof qrId !== "string") {
    return NextResponse.json({ error: "qr_id is required" }, { status: 400 });
  }

  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRe.test(qrId)) {
    return NextResponse.json({ error: "invalid qr_id" }, { status: 400 });
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const rawIp =
    forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const ip_hash = createHash("sha256").update(rawIp).digest("hex").slice(0, 48);

  try {
    const supabase = createPublicServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase env vars not configured" },
        { status: 503 },
      );
    }

    const { error } = await supabase.rpc("record_qr_scan", {
      p_qr_id: qrId,
      p_device: device,
      p_ip_hash: ip_hash,
    });

    if (error) {
      // Fallback for projects not yet migrated
      const { error: legacyErr } = await supabase.from("scan_events").insert({
        qr_id: qrId,
        ip_hash,
        user_agent: req.headers.get("user-agent")?.slice(0, 512) ?? "",
        device_type: device,
      });
      if (legacyErr) {
        return NextResponse.json({ error: legacyErr.message }, { status: 400 });
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

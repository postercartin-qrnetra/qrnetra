import { NextRequest, NextResponse } from "next/server";
import { handleScanEvent } from "@/lib/scan/handle-scan-event";
import type { ScanEventPayload } from "@/lib/scan/events";

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
      ? (body as Partial<ScanEventPayload>)
      : {};

  try {
    const result = await handleScanEvent(req, b);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

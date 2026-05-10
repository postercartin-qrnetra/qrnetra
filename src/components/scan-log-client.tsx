"use client";

import { useEffect } from "react";

function detectDeviceType(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return "mobile";
  return "desktop";
}

/** Records a scan event once when the public scan page loads (finder device). */
export function ScanLogClient({ qrId }: { qrId: string }) {
  useEffect(() => {
    void fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qr_id: qrId,
        device_type: detectDeviceType(),
      }),
      keepalive: true,
    }).catch(() => {
      /* non-blocking */
    });
  }, [qrId]);

  return null;
}

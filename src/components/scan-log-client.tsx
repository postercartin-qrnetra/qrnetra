"use client";

import { useEffect } from "react";

/** Records a scan event once when the public scan page loads (finder device). */
export function ScanLogClient({ qrId }: { qrId: string }) {
  useEffect(() => {
    void fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_id: qrId }),
      keepalive: true,
    }).catch(() => {
      /* non-blocking */
    });
  }, [qrId]);

  return null;
}

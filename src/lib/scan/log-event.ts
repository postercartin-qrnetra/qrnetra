"use client";

import type { FinderEventType } from "@/lib/scan/events";

function detectDeviceType(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/")) return "Safari";
  return "Other";
}

export async function logFinderEvent(input: {
  qrId: string;
  slug: string;
  eventType: FinderEventType;
  reason?: string;
  latitude?: number;
  longitude?: number;
}) {
  const payload = {
    qr_id: input.qrId,
    slug: input.slug,
    event_type: input.eventType,
    reason: input.reason,
    device: detectDeviceType(),
    browser: detectBrowser(),
    latitude: input.latitude,
    longitude: input.longitude,
  };

  try {
    await fetch("/api/scan-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    /* non-blocking */
  }
}

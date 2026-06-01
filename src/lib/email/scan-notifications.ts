import "server-only";

import { Resend } from "resend";
import { formatScanTimestamp } from "@/lib/datetime/scan-timestamp";
import { countryLabel, formatEventLocation } from "@/lib/geo/labels";
import type { FinderEventType } from "@/lib/scan/events";
import { getPublicSiteUrl } from "@/lib/site-url";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function fromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.ORDER_FROM_EMAIL?.trim() ||
    "QRNetra <hello@qrnetra.com>"
  );
}

function kindLabel(kind: string): string {
  switch (kind) {
    case "vehicle":
      return "Vehicle";
    case "pet":
      return "Pet";
    case "child":
      return "Child";
    case "business":
      return "Business";
    case "asset":
      return "Asset";
    default:
      return "QR";
  }
}

function buildSubject(input: {
  eventType: FinderEventType;
  kind: string;
  reason?: string | null;
}): string {
  const label = kindLabel(input.kind);

  if (input.eventType === "EMERGENCY_CLICKED") {
    return `Emergency alert on your ${label.toLowerCase()} tag`;
  }

  if (input.eventType === "REASON_SELECTED" && input.reason) {
    if (input.kind === "vehicle") {
      return `${input.reason} reported on your vehicle`;
    }
    if (input.kind === "pet") {
      return "Someone found your pet";
    }
    if (input.kind === "child") {
      return "Someone accessed your emergency profile";
    }
    if (input.kind === "business" || input.kind === "asset") {
      return "Someone reported your asset";
    }
    return `${input.reason} — ${label} QR activity`;
  }

  if (input.eventType === "CALL_CLICKED") {
    return `Someone tried to call you via your ${label.toLowerCase()} QR`;
  }

  if (input.eventType === "WHATSAPP_CLICKED") {
    return `Someone opened WhatsApp on your ${label.toLowerCase()} QR`;
  }

  return `Someone scanned your ${label} QR`;
}

function formatLocation(
  city: string | null,
  country: string | null,
  region?: string | null,
): string {
  return (
    formatEventLocation({ city, region, country: countryLabel(country) ?? country }) ??
    "Unknown"
  );
}

export async function sendScanNotificationEmail(input: {
  to: string;
  eventType: FinderEventType;
  kind: string;
  title: string;
  reason?: string | null;
  city?: string | null;
  country?: string | null;
  region?: string | null;
  scannerTimezone?: string | null;
  occurredAt?: string;
}) {
  const resend = getResendClient();
  if (!resend || !input.to) return;

  const site = getPublicSiteUrl();
  const dashboardUrl = `${site}/dashboard/scan-activity`;
  const iso = input.occurredAt ?? new Date().toISOString();
  const ts = formatScanTimestamp(iso, {
    scannerTimezone: input.scannerTimezone,
    country: input.country,
  });
  const when = `${ts.date}, ${ts.time} ${ts.tzLabel}`;
  const location = formatLocation(
    input.city ?? null,
    input.country ?? null,
    input.region,
  );
  const subject = buildSubject(input);

  const reasonBlock =
    input.reason && input.eventType !== "PROFILE_VIEWED"
      ? `<p style="margin: 0 0 12px; color: #cbd5e1;"><strong>Reason:</strong> ${input.reason}</p>`
      : "";

  const actionLine =
    input.eventType === "PROFILE_VIEWED"
      ? `Someone scanned your ${kindLabel(input.kind)} QR (${input.title}).`
      : input.eventType === "EMERGENCY_CLICKED"
        ? `Someone tapped the emergency contact on your ${kindLabel(input.kind).toLowerCase()} tag.`
        : input.eventType === "CALL_CLICKED"
          ? `Someone tapped call on your ${kindLabel(input.kind).toLowerCase()} tag.`
          : input.eventType === "WHATSAPP_CLICKED"
            ? `Someone tapped WhatsApp on your ${kindLabel(input.kind).toLowerCase()} tag.`
            : `Activity on your ${kindLabel(input.kind).toLowerCase()} tag (${input.title}).`;

  await resend.emails.send({
    from: fromAddress(),
    to: input.to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background: #020817; color: #fff; padding: 32px;">
        <div style="max-width: 640px; margin: 0 auto; background: #0f172a; border-radius: 20px; padding: 32px;">
          <p style="color: #ff6b2c; font-size: 12px; font-weight: 700; text-transform: uppercase;">QRNetra scan alert</p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">${subject}</h1>
          <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 16px;">${actionLine}</p>
          ${reasonBlock}
          <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;"><strong>Time:</strong> ${when}</p>
          <p style="margin: 0 0 24px; color: #94a3b8; font-size: 14px;"><strong>Location:</strong> ${location}</p>
          <a href="${dashboardUrl}" style="background: #ff6b2c; color: #fff; padding: 12px 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">View Dashboard</a>
        </div>
      </div>
    `,
  });
}

export function shouldSendNotification(eventType: FinderEventType): boolean {
  return eventType !== "LOCATION_SHARED";
}

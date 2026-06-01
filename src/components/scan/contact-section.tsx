"use client";

import { TrackedContactAction } from "@/components/scan/tracked-contact-action";
import type { PublicQrScanPayload } from "@/lib/qr/public-payload";
import { digitsForWhatsApp } from "@/lib/qr/public-payload";

type Props = {
  data: PublicQrScanPayload;
  selectedReason: string | null;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function ContactSection({ data, selectedReason }: Props) {
  const ch = data.channels ?? {};
  const kind = data.kind;
  const waDigits = digitsForWhatsApp(data.whatsapp_phone ?? data.owner_phone);
  const waHref =
    ch.whatsapp && waDigits ? `https://wa.me/${waDigits}` : null;

  const reason = selectedReason ?? undefined;

  function emergencyPhone(): string | null {
    if (kind === "child") return data.emergency_phone;
    if (kind === "business")
      return data.business_emergency ?? data.escalation_contact;
    if (kind === "vehicle" || kind === "asset") return data.alternate_contact;
    if (kind === "pet") return data.alternate_contact;
    return null;
  }

  const emergency = emergencyPhone();

  const callLabel =
    kind === "child"
      ? `📞  Call${data.parent_name ? ` ${data.parent_name}` : " guardian"}`
      : kind === "business"
        ? "📞  Contact owner"
        : kind === "asset"
          ? "📞  Contact owner"
          : "📞  Call owner";

  const waLabel =
    kind === "child" ? "💬  WhatsApp guardian" : "💬  WhatsApp owner";

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
        Contact
      </p>

      {emergency ? (
        <TrackedContactAction
          href={telHref(emergency)}
          label="🚨  Emergency contact"
          qrId={data.id}
          slug={data.slug}
          eventType="EMERGENCY_CLICKED"
          reason={reason}
          variant="emergency"
        />
      ) : null}

      {ch.call && data.owner_phone ? (
        <TrackedContactAction
          href={telHref(data.owner_phone)}
          label={callLabel}
          qrId={data.id}
          slug={data.slug}
          eventType="CALL_CLICKED"
          reason={reason}
          primary={!emergency}
        />
      ) : null}

      {waHref ? (
        <TrackedContactAction
          href={waHref}
          label={waLabel}
          qrId={data.id}
          slug={data.slug}
          eventType="WHATSAPP_CLICKED"
          reason={reason}
          variant="green"
        />
      ) : null}

      {kind === "pet" && data.vet_phone ? (
        <TrackedContactAction
          href={telHref(data.vet_phone)}
          label="🏥  Vet contact"
          qrId={data.id}
          slug={data.slug}
          eventType="CALL_CLICKED"
          reason={reason}
        />
      ) : null}

      {kind === "business" && data.escalation_contact && !emergency ? (
        <TrackedContactAction
          href={telHref(data.escalation_contact)}
          label="📞  Escalation contact"
          qrId={data.id}
          slug={data.slug}
          eventType="CALL_CLICKED"
          reason={reason}
        />
      ) : null}

      {kind === "asset" && data.alternate_contact && !emergency ? (
        <TrackedContactAction
          href={telHref(data.alternate_contact)}
          label="📞  Alternate contact"
          qrId={data.id}
          slug={data.slug}
          eventType="CALL_CLICKED"
          reason={reason}
        />
      ) : null}
    </div>
  );
}

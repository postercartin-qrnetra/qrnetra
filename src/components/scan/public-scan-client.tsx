"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QnLogoStatic } from "@/components/ui/logo";
import { ContactSection } from "@/components/scan/contact-section";
import { KindDisplay } from "@/components/scan/kind-display";
import { ReasonCards } from "@/components/scan/reason-cards";
import type { PublicQrScanPayload } from "@/lib/qr/public-payload";
import { logFinderEvent } from "@/lib/scan/log-event";

type Props = {
  data: PublicQrScanPayload;
};

function kindBadge(kind: string): { emoji: string; label: string } {
  switch (kind) {
    case "vehicle":
      return { emoji: "🚗", label: "Vehicle QR" };
    case "child":
      return { emoji: "👶", label: "Child Safety" };
    case "pet":
      return { emoji: "🐾", label: "Pet Tag" };
    case "asset":
      return { emoji: "🎒", label: "Personal Asset" };
    case "business":
      return { emoji: "🏢", label: "Business / Fleet" };
    default:
      return { emoji: "🏷️", label: "Safety Tag" };
  }
}

function pageTitle(data: PublicQrScanPayload): string {
  const kind = data.kind;
  if (kind === "vehicle" && data.vehicle_registration) {
    return `Vehicle · ${data.vehicle_registration}`;
  }
  if (kind === "child") return data.title ?? "Child safety";
  if (kind === "pet") return data.title ?? "Pet tag";
  if (kind === "asset") return data.title ?? "Personal asset";
  if (kind === "business") return data.title ?? "Fleet contact";
  return data.title ?? "Safety tag";
}

export function PublicScanClient({ data }: Props) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const badge = kindBadge(data.kind);

  useEffect(() => {
    void logFinderEvent({
      qrId: data.id,
      slug: data.slug,
      eventType: "PROFILE_VIEWED",
    });
  }, [data.id, data.slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 pb-16 pt-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <QnLogoStatic layout="compact" textClassName="text-qn-bg" />
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-qn-card px-3 py-1 text-xs font-semibold text-qn-muted shadow-sm">
            <span>{badge.emoji}</span>
            {badge.label}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {pageTitle(data)}
          </h1>
          <p className="mt-2 text-sm text-qn-muted-2">
            Emergency contact · scanned by you
          </p>
        </div>

        {data.message ? (
          <div className="mb-6 rounded-2xl border border-amber-100 bg-qn-warning/15 px-4 py-4 text-sm leading-relaxed text-qn-warning shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
              Message from owner
            </p>
            {data.message}
          </div>
        ) : null}

        <KindDisplay
          kind={data.kind}
          title={data.title ?? "Tag"}
          data={data}
        />

        <ReasonCards
          kind={data.kind}
          qrId={data.id}
          slug={data.slug}
          selectedReason={selectedReason}
          onSelectReason={setSelectedReason}
        />

        <ContactSection data={data} selectedReason={selectedReason} />

        <div className="mt-10 space-y-3 border-t border-white/[0.08] pt-6 text-center">
          <p className="text-xs leading-relaxed text-qn-muted-2">
            If this is a life-threatening emergency, contact local emergency
            services immediately. QR Netra helps reach the owner — it is not a
            substitute for emergency services.
          </p>
          <Link
            href="/"
            className="inline-flex text-xs font-semibold text-qn-muted-2 underline-offset-4 hover:text-white hover:underline"
          >
            Powered by QR Netra — create your own safety QR →
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { FinderEventType } from "@/lib/scan/events";
import { logFinderEvent } from "@/lib/scan/log-event";
import { LocationShareModal } from "@/components/scan/location-share-modal";

type Props = {
  href: string;
  label: string;
  qrId: string;
  slug: string;
  eventType: Extract<
    FinderEventType,
    "CALL_CLICKED" | "WHATSAPP_CLICKED" | "EMERGENCY_CLICKED"
  >;
  reason?: string;
  primary?: boolean;
  variant?: "green" | "emergency";
  askLocation?: boolean;
};

export function TrackedContactAction({
  href,
  label,
  qrId,
  slug,
  eventType,
  reason,
  primary,
  variant,
  askLocation = true,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  function openLink() {
    window.location.href = href;
  }

  async function logAndProceed(lat?: number, lng?: number) {
    if (lat != null && lng != null) {
      await logFinderEvent({
        qrId,
        slug,
        eventType: "LOCATION_SHARED",
        reason,
        latitude: lat,
        longitude: lng,
      });
    }
    await logFinderEvent({
      qrId,
      slug,
      eventType,
      reason,
      latitude: lat,
      longitude: lng,
    });
    openLink();
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (askLocation && eventType !== "EMERGENCY_CLICKED") {
      setModalOpen(true);
      return;
    }
    void logAndProceed();
  }

  const className =
    variant === "emergency"
      ? "flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-red-600 text-base font-bold text-white shadow-lg shadow-red-600/25 transition-transform active:scale-[0.99]"
      : primary
        ? "flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-qn-accent text-base font-semibold text-white shadow-lg shadow-qn-accent/20 transition-transform active:scale-[0.99]"
        : variant === "green"
          ? "flex min-h-[52px] w-full items-center justify-center rounded-2xl border-2 border-[#25D366] bg-qn-card text-base font-semibold text-white transition-transform active:scale-[0.99]"
          : "flex min-h-[52px] w-full items-center justify-center rounded-2xl border-2 border-white/[0.08] bg-qn-card text-base font-semibold text-white transition-transform active:scale-[0.99]";

  return (
    <>
      <a href={href} onClick={handleClick} className={className}>
        {label}
      </a>
      <LocationShareModal
        open={modalOpen}
        onShare={(lat, lng) => {
          setModalOpen(false);
          void logAndProceed(lat, lng);
        }}
        onSkip={() => {
          setModalOpen(false);
          void logAndProceed();
        }}
      />
    </>
  );
}

"use client";

import { REASONS_BY_KIND } from "@/lib/scan/events";
import { logFinderEvent } from "@/lib/scan/log-event";

type Props = {
  kind: string;
  qrId: string;
  slug: string;
  selectedReason: string | null;
  onSelectReason: (reason: string) => void;
};

export function ReasonCards({
  kind,
  qrId,
  slug,
  selectedReason,
  onSelectReason,
}: Props) {
  const reasons = REASONS_BY_KIND[kind] ?? REASONS_BY_KIND.vehicle;

  function handleSelect(reason: string) {
    onSelectReason(reason);
    void logFinderEvent({
      qrId,
      slug,
      eventType: "REASON_SELECTED",
      reason,
    });
  }

  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
        What happened?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {reasons.map((reason) => {
          const selected = selectedReason === reason;
          const isEmergency = reason === "Emergency" || reason === "Medical Emergency";
          return (
            <button
              key={reason}
              type="button"
              onClick={() => handleSelect(reason)}
              className={`min-h-[52px] rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                selected
                  ? isEmergency
                    ? "bg-red-600 text-white"
                    : "bg-qn-accent text-white"
                  : isEmergency
                    ? "border border-red-200 bg-red-50 text-red-800"
                    : "border border-white/[0.08] bg-qn-card text-white hover:border-qn-accent/40"
              }`}
            >
              {reason}
            </button>
          );
        })}
      </div>
    </div>
  );
}

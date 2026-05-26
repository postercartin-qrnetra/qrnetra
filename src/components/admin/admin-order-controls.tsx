"use client";

import { updateAdminOrderAction } from "@/app/actions/admin-orders";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "printed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export function AdminOrderControls({
  orderId,
  initialStatus,
  initialTrackingNumber,
  initialCourierName,
}: {
  orderId: string;
  initialStatus: string;
  initialTrackingNumber: string | null;
  initialCourierName: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber ?? "");
  const [courierName, setCourierName] = useState(initialCourierName ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateAdminOrderAction({
        orderId,
        fulfillmentStatus: status,
        trackingNumber,
        courierName,
      });

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage("Order updated.");
      router.refresh();
    });
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-qn-muted-2">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-3 py-2 text-sm text-white outline-none"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-qn-muted-2">Courier</span>
          <input
            value={courierName}
            onChange={(event) => setCourierName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-3 py-2 text-sm text-white outline-none"
            placeholder="Delhivery"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-qn-muted-2">Tracking</span>
          <input
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-3 py-2 text-sm text-white outline-none"
            placeholder="Tracking number"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="qn-btn-primary px-4 text-sm"
        >
          {isPending ? "Saving…" : "Save update"}
        </button>
        {message ? <p className="text-sm text-qn-muted">{message}</p> : null}
      </div>
    </div>
  );
}

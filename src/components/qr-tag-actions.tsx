"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleQrStatusAction } from "@/app/actions/create-qr";

export function QrTagActions({
  qrId,
  slug,
  status,
}: {
  qrId: string;
  slug: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  async function toggle() {
    setBusy(true);
    const result = await toggleQrStatusAction(qrId, currentStatus);
    setBusy(false);
    if (!result.error) {
      setCurrentStatus((s) => (s === "active" ? "disabled" : "active"));
      router.refresh();
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <a
        href={`/create/success/${slug}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Get assets
      </a>
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={busy}
        className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition disabled:opacity-50 ${
          currentStatus === "active"
            ? "border-zinc-200 text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
        }`}
      >
        {busy ? (
          "…"
        ) : currentStatus === "active" ? (
          "Disable QR"
        ) : (
          "Re-enable QR"
        )}
      </button>
    </div>
  );
}

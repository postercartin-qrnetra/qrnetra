"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onShare: (lat: number, lng: number) => void;
  onSkip: () => void;
};

export function LocationShareModal({ open, onShare, onSkip }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleShare() {
    setError(null);
    if (!navigator.geolocation) {
      onSkip();
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onShare(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLoading(false);
        onSkip();
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        className="w-full max-w-sm rounded-2xl bg-qn-card p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-share-title"
      >
        <h2 id="location-share-title" className="text-lg font-bold text-white">
          Share your location with the owner?
        </h2>
        <p className="mt-2 text-sm text-qn-muted">
          This helps the owner find you faster. You can skip and contact them
          directly.
        </p>
        {error ? (
          <p className="mt-3 text-sm text-qn-danger">{error}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={loading}
            className="qn-btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Getting location…" : "Share location"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="qn-btn-secondary w-full"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

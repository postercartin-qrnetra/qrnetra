"use client";

import Link from "next/link";
import { useEffect } from "react";
import { persistSelectedProfileType } from "@/lib/onboarding/client-storage";
import type { QrKind } from "@/lib/qr/types";

const TYPE_LABELS: Record<QrKind, string> = {
  vehicle: "Vehicle QR",
  child: "Child Safety QR",
  pet: "Pet QR",
  asset: "Personal Asset QR",
  business: "Business / Fleet QR",
};

type Props = {
  type: QrKind;
  userEmail: string | null;
};

export function CreateProfilePlaceholder({ type, userEmail }: Props) {
  useEffect(() => {
    persistSelectedProfileType(type);
  }, [type]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-qn-muted-2">
        Step 2 of 2
      </p>
      <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Profile creation coming next
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-qn-muted">
        You&apos;re signed in and your tag type is saved. The emergency profile
        form ships in the next milestone.
      </p>

      <div className="mt-10 rounded-2xl border border-qn-accent/40 bg-qn-card p-6 shadow-sm ring-2 ring-qn-accent/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
          Selected profile type
        </p>
        <p className="mt-2 text-xl font-bold text-white">
          {TYPE_LABELS[type]}
        </p>
        <p className="mt-1 font-mono text-xs text-qn-muted-2">
          selectedProfileType = {type}
        </p>

        <div className="mt-6 border-t border-white/[0.08] pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
            Session verified
          </p>
          <p className="mt-2 text-sm text-qn-muted">
            {userEmail ?? "Signed in"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/create"
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.08] bg-qn-card px-6 text-sm font-semibold text-white hover:bg-white/[0.05]"
        >
          Change tag type
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full bg-qn-card-2 px-6 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

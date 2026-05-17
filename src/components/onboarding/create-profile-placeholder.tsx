"use client";

import Link from "next/link";
import { useEffect } from "react";
import { persistSelectedProfileType } from "@/lib/onboarding/client-storage";
import type { QrKind } from "@/lib/qr/types";

const TYPE_LABELS: Record<QrKind, string> = {
  vehicle: "Vehicle QR",
  child: "Child Safety QR",
  pet: "Pet QR",
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
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Step 2 of 2
      </p>
      <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
        Profile creation coming next
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-zinc-600">
        You&apos;re signed in and your tag type is saved. The emergency profile
        form ships in the next milestone.
      </p>

      <div className="mt-10 rounded-2xl border border-[#ffd400]/40 bg-white p-6 shadow-sm ring-2 ring-[#ffd400]/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Selected profile type
        </p>
        <p className="mt-2 text-xl font-bold text-[#111111]">
          {TYPE_LABELS[type]}
        </p>
        <p className="mt-1 font-mono text-xs text-zinc-500">
          selectedProfileType = {type}
        </p>

        <div className="mt-6 border-t border-zinc-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Session verified
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            {userEmail ?? "Signed in"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/create/type"
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-[#111111] hover:bg-zinc-50"
        >
          Change tag type
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#111111] px-6 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

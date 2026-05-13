"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          QRNetra
        </p>
        <h1 className="mt-2 text-xl font-bold text-[#111111]">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          The page failed to load. The issue has been logged. You can retry, or
          head back to the home page.
        </p>
        {error?.digest ? (
          <p className="mt-3 break-all rounded-xl bg-zinc-50 px-3 py-2 font-mono text-[11px] text-zinc-500">
            Error ID: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#ffd400] text-sm font-semibold text-[#111111]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-[#111111]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

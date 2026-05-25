"use client";

import { QnLogoStatic } from "@/components/ui/logo";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-qn-card p-8 shadow-xl">
        <QnLogoStatic layout="compact" />
        <h1 className="mt-2 text-xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-qn-muted">
          The page failed to load. The issue has been logged. You can retry, or
          head back to the home page.
        </p>
        {error?.digest ? (
          <p className="mt-3 break-all rounded-xl bg-qn-surface px-3 py-2 font-mono text-[11px] text-qn-muted-2">
            Error ID: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-qn-accent text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-white/[0.08] bg-qn-card text-sm font-semibold text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

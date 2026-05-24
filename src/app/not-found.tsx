import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-qn-card p-8 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-qn-muted-2">
          QRNetra
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Tag not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-qn-muted">
          The link you scanned doesn&apos;t match an active QRNetra tag. It may
          have expired, been disabled, or never existed.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full bg-qn-card-2 px-6 text-sm font-semibold text-white"
          >
            Go home
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.08] bg-qn-card px-6 text-sm font-semibold text-white"
          >
            Shop tags
          </Link>
        </div>
      </div>
    </div>
  );
}

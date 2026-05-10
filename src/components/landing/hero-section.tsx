import Link from "next/link";
import { Section } from "./section";

function QrPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="64" height="64" rx="4" fill="#111111" />
      <rect x="6" y="6" width="18" height="18" rx="1" fill="#ffd400" />
      <rect x="40" y="6" width="18" height="18" rx="1" fill="#ffd400" />
      <rect x="6" y="40" width="18" height="18" rx="1" fill="#ffd400" />
      <rect x="28" y="28" width="8" height="8" fill="#fafafa" />
      <rect x="40" y="28" width="6" height="6" fill="#fafafa" />
      <rect x="28" y="40" width="6" height="6" fill="#fafafa" />
      <rect x="48" y="40" width="10" height="10" fill="#fafafa" />
      <rect x="40" y="48" width="6" height="6" fill="#ffd400" />
    </svg>
  );
}

function FloatingCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] ${className ?? ""}`}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  );
}

const TRUST = [
  "100,000+ scans",
  "Privacy protected",
  "Waterproof tags",
  "Instant setup",
];

export function HeroSection() {
  return (
    <Section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#fafafa] to-[#fafafa]"
      innerClassName="py-12 sm:py-16 lg:py-20"
    >
      <div
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#ffd400]/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-zinc-200/40 blur-3xl"
        aria-hidden
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Smart safety · India-first
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Scan. Contact. Protect.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Smart QR stickers and safety tags for vehicles, kids, pets, and
            emergency situations — without exposing personal phone numbers
            publicly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] px-8 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Buy Now
            </Link>
            <Link
              href="/create/type"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-zinc-200 bg-white px-8 text-sm font-semibold text-[#111111] transition-colors hover:border-zinc-300"
            >
              Create Your QR
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {TRUST.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm"
              >
                <span
                  className="mr-2 h-1.5 w-1.5 rounded-full bg-[#ffd400]"
                  aria-hidden
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-square max-h-[520px] lg:ml-auto lg:mr-0">
            {/* Product cluster mockup */}
            <div className="absolute left-0 top-8 z-10 w-[42%] animate-qn-float rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-white p-3 shadow-xl sm:top-12">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-3">
                <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-2">
                  <QrPattern className="h-14 w-14 rounded-md" />
                  <p className="text-[10px] font-medium text-[#ffd400]">
                    VEHICLE
                  </p>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] font-medium text-zinc-600">
                QR Sticker
              </p>
            </div>

            <div className="absolute right-4 top-0 z-20 w-[38%] animate-qn-float-delayed rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
              <div className="aspect-square rounded-xl bg-gradient-to-b from-sky-50 to-white p-3">
                <div className="flex h-full flex-col items-center justify-center rounded-lg border border-sky-100">
                  <div className="h-16 w-4 rounded-full bg-gradient-to-b from-sky-400 to-sky-600" />
                  <div className="mt-2 h-3 w-20 rounded-full bg-zinc-200" />
                  <QrPattern className="mt-2 h-10 w-10 rounded" />
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] font-medium text-zinc-600">
                Wristband
              </p>
            </div>

            <div className="absolute bottom-6 left-[18%] z-10 w-[36%] rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg">
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg">
                  🐕
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-amber-900">
                    Pet tag
                  </p>
                  <QrPattern className="mt-1 h-8 w-8 rounded" />
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="absolute left-1/2 top-1/2 z-30 w-[48%] -translate-x-1/2 -translate-y-[40%]">
              <div className="rounded-[2rem] border-4 border-zinc-800 bg-zinc-900 p-1 shadow-2xl">
                <div className="overflow-hidden rounded-[1.5rem] bg-zinc-950">
                  <div className="flex h-6 items-center justify-center gap-1">
                    <span className="h-1 w-8 rounded-full bg-zinc-800" />
                  </div>
                  <div className="bg-zinc-900 px-3 pb-4 pt-1">
                    <div className="rounded-xl bg-zinc-800/80 p-3">
                      <p className="text-[10px] font-medium text-zinc-400">
                        Dashboard
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="h-10 rounded-lg bg-[#ffd400]/20" />
                        <div className="h-10 rounded-lg bg-zinc-700/50" />
                        <div className="col-span-2 h-16 rounded-lg bg-zinc-700/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating notification cards */}
          <FloatingCard className="absolute -left-2 bottom-[18%] z-40 max-w-[200px] sm:left-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              Incoming
            </p>
            <p className="mt-1 text-sm font-semibold text-[#111111]">
              Emergency call
            </p>
            <p className="mt-1 text-xs text-zinc-500">Masked relay · secure</p>
          </FloatingCard>

          <FloatingCard className="absolute -right-1 top-[22%] z-40 max-w-[180px] sm:right-0">
            <p className="text-[10px] font-semibold text-emerald-600">
              Scan success
            </p>
            <p className="mt-1 text-sm font-semibold text-[#111111]">
              Finder connected
            </p>
          </FloatingCard>

          <FloatingCard className="absolute right-[8%] bottom-[6%] z-40 hidden max-w-[200px] sm:block">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white text-xs">
                W
              </span>
              <div>
                <p className="text-xs font-semibold text-[#111111]">
                  WhatsApp
                </p>
                <p className="text-[11px] text-zinc-500">Owner notified</p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </Section>
  );
}

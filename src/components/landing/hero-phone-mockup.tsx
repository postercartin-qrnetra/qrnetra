"use client";

import { HeartPulse, Phone, QrCode, User } from "lucide-react";

function MiniQr() {
  return (
    <div
      className="relative mx-auto h-16 w-16 rounded-lg border border-white/[0.12] bg-white p-1"
      aria-hidden
    >
      <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-px">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className={`rounded-[1px] ${
              [0, 1, 2, 4, 7, 8, 10, 11, 13, 14, 15].includes(i)
                ? "bg-qn-bg-deep"
                : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-qn-accent text-[8px] font-bold text-white">
          QN
        </span>
      </span>
    </div>
  );
}

export function HeroPhoneMockup() {
  return (
    <div className="absolute left-1/2 top-1/2 z-30 w-[52%] max-w-[240px] -translate-x-1/2 -translate-y-[42%]">
      <div className="rounded-[2rem] border-4 border-qn-surface-2 bg-qn-card p-1 shadow-2xl shadow-black/50">
        <div className="overflow-hidden rounded-[1.5rem] bg-qn-bg-deep">
          <div className="flex h-6 items-center justify-center">
            <span className="h-1 w-10 rounded-full bg-white/10" />
          </div>
          <div className="space-y-3 px-3 pb-4 pt-1">
            <div className="rounded-xl border border-white/[0.08] bg-qn-surface p-3">
              <div className="flex items-center justify-between">
                <MiniQr />
                <span className="rounded-full bg-qn-success/15 px-2 py-0.5 text-[9px] font-semibold text-qn-success">
                  Active
                </span>
              </div>
              <p className="mt-2 text-center text-[10px] text-qn-muted">
                Scanned · Privacy relay on
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-qn-card-2 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-qn-accent/15 text-qn-accent">
                  <User className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    Rahul K. · Vehicle
                  </p>
                  <p className="text-[10px] text-qn-muted">MH-12-AB-1234</p>
                </div>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-qn-muted">
                Finder sees masked contact only — your number stays private.
              </p>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-qn-accent text-[11px] font-semibold text-white shadow-md shadow-qn-accent/20"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                Contact Owner
              </button>
              <button
                type="button"
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-qn-danger/40 bg-qn-danger/10 text-[11px] font-semibold text-red-200"
              >
                <HeartPulse className="h-3.5 w-3.5" strokeWidth={2} />
                Emergency Contact
              </button>
              <button
                type="button"
                className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.1] bg-qn-surface text-[10px] font-medium text-qn-muted"
              >
                <QrCode className="h-3 w-3" strokeWidth={1.75} />
                Medical Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

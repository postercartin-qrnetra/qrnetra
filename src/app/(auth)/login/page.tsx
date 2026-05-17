import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthLoginForm } from "@/components/auth-login-form";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/onboarding/safe-next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Continue · QRNetra",
};

function LeftPanel() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#111111] px-12 py-14 text-white lg:px-14">
      <div
        className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#ffd400]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <p className="text-xl font-bold tracking-tight">QRNetra</p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
          Protect what matters with privacy-first QR safety — vehicles,
          children, pets, and teams.
        </p>
      </div>

      <div className="relative mt-16 space-y-6">
        <div className="flex items-end gap-4">
          <div className="h-36 w-28 rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-800 to-zinc-950 p-3 shadow-2xl">
            <div className="h-16 w-full rounded-lg bg-white/90" />
            <p className="mt-2 text-center text-[9px] font-medium uppercase tracking-wider text-[#ffd400]">
              Vehicle
            </p>
          </div>
          <div className="h-28 w-20 rounded-2xl border border-white/10 bg-gradient-to-b from-sky-900/40 to-zinc-900 p-2 shadow-xl">
            <div className="mx-auto mt-2 h-10 w-3 rounded-full bg-sky-400/80" />
            <div className="mx-auto mt-2 h-6 w-6 rounded bg-white/90" />
          </div>
          <div className="h-32 w-24 rounded-2xl border border-white/10 bg-amber-950/40 p-2 shadow-xl">
            <div className="flex h-full items-center justify-center text-2xl">
              🐕
            </div>
          </div>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-zinc-500">
          You’re one step away from your dynamic QR and secure public scan page.
        </p>
      </div>

      <p className="relative text-xs text-zinc-600">
        © {new Date().getFullYear()} QRNetra
      </p>
    </div>
  );
}

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next: nextRaw } = await searchParams;
  const supabase = await createClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(safeNextPath(nextRaw ?? null));
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <LeftPanel />
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 lg:py-10">
        <Suspense
          fallback={
            <div className="text-sm font-medium text-zinc-500">Loading…</div>
          }
        >
          <AuthLoginForm />
        </Suspense>
      </div>
    </div>
  );
}

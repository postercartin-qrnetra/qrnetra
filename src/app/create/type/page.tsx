import type { Metadata } from "next";
import { ProfileTypeContinueButton } from "@/components/onboarding/profile-type-continue-button";

export const metadata: Metadata = {
  title: "Choose profile type",
};

const OPTIONS = [
  {
    type: "vehicle" as const,
    title: "Vehicle QR",
    desc: "Wrong parking, roadside help — masked contact without printing your number.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 13l2-7h12l2 7M4 13v4a1 1 0 001 1h1M4 13h16m0 0v4a1 1 0 01-1 1h-1m-14 0h14" strokeLinecap="round" />
        <circle cx="7" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" />
      </svg>
    ),
  },
  {
    type: "child" as const,
    title: "Child Safety QR",
    desc: "Wristband-friendly profile with parent and emergency contacts.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    type: "pet" as const,
    title: "Pet QR",
    desc: "Collar tags with vet details and fast owner contact if lost.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11c-1.5 0-3-1-3-3s1.5-2 3-2 3 1 3 3-1.5 2-3 2zm6 0c1.5 0 3-1 3-3s-1.5-2-3-2-3 1-3 3 1.5 2 3 2z" strokeLinecap="round" />
        <path d="M12 13c-4 0-6 2.5-6 5v1h12v-1c0-2.5-2-5-6-5z" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    type: "business" as const,
    title: "Business / Fleet QR",
    desc: "Fleet visibility, admin contact, and emergency escalation for teams.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2M7 12h2m4 0h2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function CreateTypePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Step 1 of 2
      </p>
      <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
        Select profile type
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-zinc-600">
        Choose what this QR tag protects. Next, you&apos;ll sign in securely —
        then we&apos;ll collect emergency details. You can add more tags anytime
        from your dashboard.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <div
            key={o.type}
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111111] text-[#ffd400] transition-transform group-hover:scale-105">
              {o.icon}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#111111]">{o.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
              {o.desc}
            </p>
            <ProfileTypeContinueButton
              type={o.type}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#ffd400] text-sm font-semibold text-[#111111] transition-transform hover:scale-[1.02] disabled:opacity-70"
            >
              Continue
            </ProfileTypeContinueButton>
          </div>
        ))}
      </div>
    </div>
  );
}

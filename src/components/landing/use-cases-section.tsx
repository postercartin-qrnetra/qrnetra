import Link from "next/link";
import { Section } from "./section";

const VEHICLE_POINTS = [
  "Secure masked contact",
  "WhatsApp alert",
  "Emergency call option",
  "No number exposed publicly",
  "Instant scan access",
  "Dynamic profile editing",
];

export function VehicleUseCaseSection() {
  return (
    <Section className="border-t border-zinc-100 bg-white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-50 p-8 shadow-xl">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-6 shadow-inner">
              <div className="flex h-full flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-center">
                  <div className="h-32 w-32 rounded-xl bg-white p-2 shadow-lg">
                    <div className="h-full w-full rounded-md bg-[#111111]" />
                  </div>
                </div>
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#ffd400]">
                  Scan to contact owner
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Vehicle
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Wrong Parking? Solve It In Seconds.
          </h2>
          <ul className="mt-8 space-y-3">
            {VEHICLE_POINTS.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-zinc-700">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffd400]"
                  aria-hidden
                />
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/create/type"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#ffd400] px-8 text-sm font-semibold text-[#111111] transition-transform hover:scale-[1.02]"
          >
            Activate Your Tag
          </Link>
        </div>
      </div>
    </Section>
  );
}

export function ChildUseCaseSection() {
  return (
    <Section className="bg-gradient-to-b from-sky-50/80 to-white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700/80">
            Child safety
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Wristbands parents trust.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Medical info access, SOS support, and a calm dashboard for
            guardians — school-safe branding without loud alarms.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-700">
            <li className="flex gap-2">
              <span className="text-[#ffd400]" aria-hidden>
                ●
              </span>
              Parent emergency dashboard
            </li>
            <li className="flex gap-2">
              <span className="text-[#ffd400]" aria-hidden>
                ●
              </span>
              Controlled medical visibility
            </li>
            <li className="flex gap-2">
              <span className="text-[#ffd400]" aria-hidden>
                ●
              </span>
              Soft, kid-friendly materials
            </li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="flex h-40 w-16 items-end justify-center rounded-full border-4 border-sky-200 bg-gradient-to-b from-sky-100 to-white shadow-inner">
                <div className="mb-4 h-12 w-12 rounded-lg bg-[#111111]" />
              </div>
              <p className="mt-4 text-center text-xs font-medium text-zinc-500">
                Parent view: live status & contacts
              </p>
              <div className="mt-4 w-full rounded-xl border border-zinc-100 bg-[#fafafa] p-4">
                <div className="h-2 w-1/3 rounded bg-zinc-200" />
                <div className="mt-3 h-8 w-full rounded-lg bg-sky-100/80" />
                <div className="mt-2 h-8 w-full rounded-lg bg-zinc-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function PetUseCaseSection() {
  return (
    <Section className="border-t border-zinc-100 bg-[#fafafa]">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <div className="mx-auto max-w-md rounded-3xl border border-amber-100 bg-white p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-4xl">
                🐕
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-zinc-200" />
                <div className="h-3 w-1/2 rounded bg-zinc-100" />
                <div className="mt-2 inline-flex rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  Owner notified
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-zinc-100 bg-[#fafafa] p-4">
              <p className="text-xs font-semibold text-zinc-500">Recovery flow</p>
              <p className="mt-1 text-sm text-zinc-700">
                Scan → profile → one-tap WhatsApp or call relay
              </p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/90">
            Pets
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
            Lost pet recovery, simplified.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Collar-mounted QR, vaccination details on your terms, and instant
            owner contact when every minute counts.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-700">
            <li>● QR on collar — durable & visible</li>
            <li>● Vaccination & vet fields (privacy toggles)</li>
            <li>● One-tap owner contact for finders</li>
          </ul>
          <Link
            href="/shop"
            className="mt-6 inline-flex text-sm font-semibold text-[#111111] underline-offset-4 hover:underline"
          >
            Shop pet tags →
          </Link>
        </div>
      </div>
    </Section>
  );
}

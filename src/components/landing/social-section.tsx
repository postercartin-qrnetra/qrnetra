import { Section } from "./section";

const TESTIMONIALS = [
  {
    quote:
      "Finally a parking tag that doesn’t broadcast my number. Setup took under five minutes.",
    name: "Priya S.",
    role: "Vehicle owner, Mumbai",
    initials: "PS",
  },
  {
    quote:
      "The wristband gives us peace of mind at school events. Medical notes are there if needed.",
    name: "Rahul M.",
    role: "Parent, Bengaluru",
    initials: "RM",
  },
  {
    quote:
      "Our society is piloting fleet stickers for delivery partners. Support has been excellent.",
    name: "Anita K.",
    role: "RWA secretary, Pune",
    initials: "AK",
  },
];

const STATS = [
  { value: "100K+", label: "Users" },
  { value: "1M+", label: "Scans" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Emergency access" },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-[#ffd400]" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function SocialSection() {
  return (
    <Section className="border-t border-zinc-100 bg-white">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Social proof
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          Trusted by thousands
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-600">
          Real families and fleets rely on QRNetra when contact speed and
          privacy both matter.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.name}
            className="flex flex-col rounded-2xl border border-zinc-200 bg-[#fafafa] p-6 shadow-sm"
          >
            <Stars />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700">
              “{t.quote}”
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-xs font-bold text-[#ffd400]"
                aria-hidden
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}</p>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-zinc-200 bg-[#111111] px-6 py-10 sm:grid-cols-4 sm:gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-[#ffd400] sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

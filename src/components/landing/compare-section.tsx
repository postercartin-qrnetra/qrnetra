import { Section } from "./section";

const ROWS = [
  { feature: "Privacy", us: true, them: false },
  { feature: "Dynamic updates", us: true, them: false },
  { feature: "WhatsApp support", us: true, them: false },
  { feature: "Emergency features", us: true, them: false },
  { feature: "QR scanning", us: true, them: true },
  { feature: "Dashboard management", us: true, them: false },
];

function Check({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
      ✓
    </span>
  ) : (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
      —
    </span>
  );
}

export function CompareSection() {
  return (
    <Section className="border-t border-zinc-100 bg-white">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Compare
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
          QRNetra vs traditional parking cards
        </h2>
      </div>

      <div className="mt-12 overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-[#fafafa]">
              <th className="px-4 py-4 font-semibold text-zinc-600 sm:px-6">
                Capability
              </th>
              <th className="bg-[#111111] px-4 py-4 text-center font-semibold text-[#ffd400] sm:px-6">
                QRNetra
              </th>
              <th className="px-4 py-4 text-center font-semibold text-zinc-600 sm:px-6">
                Traditional card
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r.feature}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-4 py-4 font-medium text-[#111111] sm:px-6">
                  {r.feature}
                </td>
                <td className="bg-[#ffd400]/[0.08] px-4 py-4 text-center sm:px-6">
                  <div className="flex justify-center">
                    <Check on={r.us} />
                  </div>
                </td>
                <td className="px-4 py-4 text-center sm:px-6">
                  <div className="flex justify-center">
                    <Check on={r.them} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

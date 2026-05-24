import { FadeIn } from "@/components/ui/motion";
import { Check, Minus } from "lucide-react";
import { Section } from "./section";

const ROWS = [
  { feature: "Privacy", us: true, them: false },
  { feature: "Dynamic updates", us: true, them: false },
  { feature: "WhatsApp support", us: true, them: false },
  { feature: "Emergency features", us: true, them: false },
  { feature: "QR scanning", us: true, them: true },
  { feature: "Dashboard management", us: true, them: false },
];

function StatusIcon({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-qn-success/15 text-qn-success">
      <Check className="h-4 w-4" strokeWidth={2} />
    </span>
  ) : (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-qn-muted-2">
      <Minus className="h-4 w-4" strokeWidth={2} />
    </span>
  );
}

export function CompareSection() {
  return (
    <Section className="border-t border-white/[0.08] bg-qn-bg-deep">
      <FadeIn className="text-center">
        <span className="qn-badge">Compare</span>
        <h2 className="qn-section-title mt-4 text-white">
          QRNetra vs traditional parking cards
        </h2>
      </FadeIn>

      <FadeIn delay={0.1} className="qn-table-wrap mt-12 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-qn-surface">
              <th className="px-4 py-4 font-semibold text-qn-muted sm:px-6">
                Capability
              </th>
              <th className="bg-[rgba(255,107,44,0.15)] px-4 py-4 text-center font-semibold text-qn-accent sm:px-6">
                QRNetra
              </th>
              <th className="px-4 py-4 text-center font-semibold text-qn-muted sm:px-6">
                Traditional card
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r.feature}
                className="border-b border-white/[0.08] last:border-0"
              >
                <td className="px-4 py-4 font-medium text-white sm:px-6">
                  {r.feature}
                </td>
                <td className="bg-[rgba(255,107,44,0.06)] px-4 py-4 text-center sm:px-6">
                  <div className="flex justify-center">
                    <StatusIcon on={r.us} />
                  </div>
                </td>
                <td className="px-4 py-4 text-center sm:px-6">
                  <div className="flex justify-center">
                    <StatusIcon on={r.them} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FadeIn>
    </Section>
  );
}

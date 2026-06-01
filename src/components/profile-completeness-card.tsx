import type { ProfileCompleteness } from "@/lib/qr/profile-completeness";

export function ProfileCompletenessCard({
  completeness,
}: {
  completeness: ProfileCompleteness;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-qn-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">Profile completion</p>
        <p className="text-lg font-bold text-qn-accent">{completeness.percent}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-qn-accent transition-all"
          style={{ width: `${completeness.percent}%` }}
        />
      </div>
      {completeness.missing.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
            Missing
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-qn-muted">
            {completeness.missing.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-xs text-green-400">
          Your profile has all recommended details.
        </p>
      )}
    </div>
  );
}

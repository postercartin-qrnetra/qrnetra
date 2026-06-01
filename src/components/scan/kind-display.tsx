function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="min-w-[110px] text-xs font-semibold text-qn-muted-2">
        {label}
      </span>
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}

type Props = {
  kind: string;
  title: string;
  data: {
    vehicle_registration?: string | null;
    vehicle_type?: string | null;
    finder_instructions?: string | null;
    message?: string | null;
    parent_name?: string | null;
    school_name?: string | null;
    blood_group?: string | null;
    allergies?: string | null;
    medical_notes?: string | null;
    class_name?: string | null;
    teacher_contact?: string | null;
    emergency_instructions?: string | null;
    breed?: string | null;
    pet_color?: string | null;
    reward_note?: string | null;
    owner_name?: string | null;
    asset_id?: string | null;
    department?: string | null;
    responsible_person?: string | null;
    fleet_size?: string | null;
  };
};

export function KindDisplay({ kind, title, data }: Props) {
  if (kind === "vehicle") {
    return (
      <div className="mb-6 space-y-3">
        {data.vehicle_registration ? (
          <InfoRow label="Vehicle no." value={data.vehicle_registration} />
        ) : null}
        {data.vehicle_type ? (
          <InfoRow label="Vehicle type" value={data.vehicle_type} />
        ) : null}
        <div className="rounded-2xl border border-white/[0.08] bg-qn-card px-4 py-3 text-sm leading-relaxed text-qn-muted">
          {data.finder_instructions ??
            "Need to contact the vehicle owner? Use the options below. Contact information is provided by the owner. Use responsibly."}
        </div>
      </div>
    );
  }

  if (kind === "pet") {
    const initials = title.slice(0, 2).toUpperCase();
    return (
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-qn-accent/15 text-2xl font-bold text-qn-accent">
            {initials || "🐾"}
          </div>
          <div>
            <p className="text-lg font-bold text-white">{title}</p>
            {data.breed ? (
              <p className="text-sm text-qn-muted">{data.breed}</p>
            ) : null}
            {data.pet_color ? (
              <p className="text-sm text-qn-muted-2">Color: {data.pet_color}</p>
            ) : null}
          </div>
        </div>
        {data.reward_note ? (
          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm leading-relaxed text-green-900">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-600">
              Reward note
            </p>
            {data.reward_note}
          </div>
        ) : null}
        {data.medical_notes ? (
          <div className="rounded-2xl border border-white/[0.08] bg-qn-card px-4 py-3 text-sm text-qn-muted">
            <p className="mb-1 text-xs font-semibold text-qn-muted-2">
              Medical instructions
            </p>
            {data.medical_notes}
          </div>
        ) : null}
      </div>
    );
  }

  if (kind === "child") {
    return (
      <div className="mb-6 space-y-2">
        {data.parent_name ? (
          <InfoRow label="Guardian" value={data.parent_name} />
        ) : null}
        {data.school_name ? (
          <InfoRow label="School" value={data.school_name} />
        ) : null}
        {(data.medical_notes || data.allergies || data.emergency_instructions) && (
          <details className="rounded-2xl border border-white/[0.08] bg-qn-card p-4 shadow-sm open:shadow-md">
            <summary className="cursor-pointer text-sm font-semibold text-white">
              Medical &amp; emergency info
            </summary>
            <div className="mt-4 space-y-2.5">
              {data.blood_group ? (
                <InfoRow label="Blood group" value={data.blood_group} />
              ) : null}
              {data.allergies ? (
                <InfoRow label="Allergies" value={data.allergies} />
              ) : null}
              {data.medical_notes ? (
                <div className="rounded-xl border border-white/[0.08] bg-qn-surface px-3 py-2.5 text-sm text-qn-muted">
                  {data.medical_notes}
                </div>
              ) : null}
              {data.emergency_instructions ? (
                <div className="rounded-xl border border-white/[0.08] bg-qn-surface px-3 py-2.5 text-sm text-qn-muted">
                  {data.emergency_instructions}
                </div>
              ) : null}
            </div>
          </details>
        )}
      </div>
    );
  }

  if (kind === "business" || kind === "asset") {
    return (
      <div className="mb-6 rounded-2xl border border-white/[0.08] bg-qn-card p-4 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-qn-muted-2">
          Asset info
        </p>
        <div className="space-y-2">
          <InfoRow label="Asset name" value={title} />
          {data.asset_id ? <InfoRow label="Asset ID" value={data.asset_id} /> : null}
          {data.department ? (
            <InfoRow label="Department" value={data.department} />
          ) : null}
          {data.responsible_person ? (
            <InfoRow label="Responsible person" value={data.responsible_person} />
          ) : null}
        </div>
      </div>
    );
  }

  return null;
}

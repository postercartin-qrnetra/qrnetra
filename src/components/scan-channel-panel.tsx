type Channels = {
  call?: boolean;
  whatsapp?: boolean;
  sms?: boolean;
  email?: boolean;
};

export function ScanChannelPanel({ channels }: { channels: Channels | null }) {
  const c = channels ?? {};
  const items: { key: keyof Channels; label: string }[] = [
    { key: "call", label: "Phone relay" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "sms", label: "SMS" },
    { key: "email", label: "Email" },
  ];

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Owner-enabled channels
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map(({ key, label }) => {
          const on = Boolean(c[key]);
          return (
            <li
              key={key}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                on
                  ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                  : "bg-zinc-100 text-zinc-400 line-through"
              }`}
            >
              {label}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        Actions dial/masked relay ship next — your phone number is not shown on this page.
      </p>
    </div>
  );
}

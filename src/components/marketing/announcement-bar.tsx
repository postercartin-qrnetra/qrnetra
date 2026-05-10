const ITEMS = [
  "Privacy-first QR emergency system",
  "Works without app",
  "COD Available",
  "Made for India",
];

export function AnnouncementBar() {
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className="relative z-[60] overflow-hidden border-b border-zinc-200/80 bg-[#111111] py-2 text-[11px] font-medium tracking-wide text-white sm:text-xs"
      aria-label="Announcements"
    >
      <div className="flex w-max animate-qn-marquee gap-10 whitespace-nowrap px-4 sm:gap-16">
        {doubled.map((text, i) => (
          <span key={`${text}-${i}`} className="flex items-center gap-2">
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-[#ffd400]"
              aria-hidden
            />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

const COUNTRY_DEFAULT_TZ: Record<string, string> = {
  IN: "Asia/Kolkata",
  US: "America/New_York",
  GB: "Europe/London",
  AE: "Asia/Dubai",
  SG: "Asia/Singapore",
  AU: "Australia/Sydney",
};

export type ScanTimestampParts = {
  date: string;
  time: string;
  tzLabel: string;
  timezone: string;
};

export function resolveDisplayTimezone(input: {
  scannerTimezone?: string | null;
  country?: string | null;
}): string {
  const tz = input.scannerTimezone?.trim();
  if (tz) return tz;
  const code = input.country?.trim().toUpperCase();
  if (code && COUNTRY_DEFAULT_TZ[code]) return COUNTRY_DEFAULT_TZ[code];
  if (code === "IN") return "Asia/Kolkata";
  return "UTC";
}

export function formatScanTimestamp(
  utcIso: string,
  input: { scannerTimezone?: string | null; country?: string | null },
): ScanTimestampParts {
  const timezone = resolveDisplayTimezone(input);
  const date = new Date(utcIso);

  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeFmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  const parts = timeFmt.formatToParts(date);
  const tzLabel =
    parts.find((p) => p.type === "timeZoneName")?.value ?? timezone;
  const time = parts
    .filter((p) => p.type !== "timeZoneName")
    .map((p) => p.value)
    .join("")
    .trim();

  return {
    date: dateFmt.format(date),
    time,
    tzLabel,
    timezone,
  };
}

export function formatScanTimestampLine(
  utcIso: string,
  input: { scannerTimezone?: string | null; country?: string | null },
): string {
  const { date, time, tzLabel } = formatScanTimestamp(utcIso, input);
  return `${date}\n${time} ${tzLabel}`;
}

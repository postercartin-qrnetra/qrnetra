const COUNTRY_NAMES: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  AE: "UAE",
  SG: "Singapore",
  AU: "Australia",
};

export function countryLabel(code: string | null | undefined): string | null {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  return COUNTRY_NAMES[upper] ?? upper;
}

export function formatEventLocation(input: {
  city?: string | null;
  region?: string | null;
  country?: string | null;
}): string | null {
  const country = countryLabel(input.country) ?? input.country?.trim();
  const parts = [input.city, input.region, country].filter(Boolean);
  if (!parts.length) return null;
  return parts.join(", ");
}

const KIND_SCAN_LABELS: Record<string, string> = {
  vehicle: "Vehicle scan",
  child: "Child scan",
  pet: "Pet scan",
  business: "Business scan",
  asset: "Asset scan",
};

export function scanSourceLabel(
  kind: string | null | undefined,
  reason?: string | null,
): string {
  const base = KIND_SCAN_LABELS[kind ?? ""] ?? "Scan";
  if (reason?.trim()) return `${base} · ${reason.trim()}`;
  return base;
}

export function deviceLabel(
  browser: string | null | undefined,
  device: string | null | undefined,
): string | null {
  const parts = [browser, device].filter(Boolean);
  if (!parts.length) return null;
  return parts.join(" · ");
}

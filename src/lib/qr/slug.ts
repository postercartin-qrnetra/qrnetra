const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const QNR_PREFIX = "QNR-";
const QNR_SUFFIX_LENGTH = 6;

/** Random segment for QNR-XXXXXX (server-only). */
function randomSegment(length: number): string {
  let s = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    s += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return s;
}

/**
 * Server-side slug: QNR-XXXXXX (uppercase, human-readable).
 * Never call from the browser.
 */
export function generateQnrSlug(): string {
  return `${QNR_PREFIX}${randomSegment(QNR_SUFFIX_LENGTH)}`;
}

/** @deprecated Use generateQnrSlug — kept for legacy rows without prefix. */
export function generatePublicSlug(length = 7): string {
  return randomSegment(length);
}

export function isQnrSlug(slug: string): boolean {
  return /^QNR-[A-Z0-9]{6}$/.test(slug.toUpperCase());
}

/** Normalizes to E.164-style with leading +. Returns empty string if input empty. */
export function normalizeIndiaPhone(input: string): string {
  const t = input.trim();
  if (!t) return "";
  const digits = t.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (t.startsWith("+")) {
    return `+${digits}`;
  }
  if (digits.length >= 10) {
    return `+${digits}`;
  }
  return t;
}

export function isPlausiblePhone(e164ish: string): boolean {
  const digits = e164ish.replace(/\D/g, "");
  return digits.length >= 10;
}

export function buildPublicScanUrl(siteOrigin: string, slug: string): string {
  const base = siteOrigin.replace(/\/$/, "");
  return `${base}/s/${slug}`;
}

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

export {
  normalizeIndiaPhone,
  isPlausiblePhone,
  isValidIndianMobile,
  formatIndiaPhoneDisplay,
} from "@/lib/validation/phones";

export function buildPublicScanUrl(siteOrigin: string, slug: string): string {
  const base = siteOrigin.replace(/\/$/, "");
  return `${base}/s/${slug}`;
}

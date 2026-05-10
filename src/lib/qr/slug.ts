const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generatePublicSlug(length = 7): string {
  let s = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    s += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return s;
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

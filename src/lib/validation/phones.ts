/** Indian mobile: 10 digits starting with 6–9. Stored as +91XXXXXXXXXX. */

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
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return t;
}

export function isValidIndianMobile(input: string): boolean {
  const normalized = normalizeIndiaPhone(input);
  const digits = normalized.replace(/\D/g, "");
  if (digits.length !== 12 || !digits.startsWith("91")) return false;
  const local = digits.slice(2);
  return /^[6-9]\d{9}$/.test(local);
}

/** @deprecated Use isValidIndianMobile */
export function isPlausiblePhone(e164ish: string): boolean {
  return isValidIndianMobile(e164ish);
}

export function formatIndiaPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 10
        ? digits
        : null;
  if (!local || local.length !== 10) return e164;
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

export const PHONE_ERROR =
  "Enter a valid 10-digit Indian mobile number (e.g. 9876543210).";

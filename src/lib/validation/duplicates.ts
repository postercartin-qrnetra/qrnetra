import { normalizeIndiaPhone } from "@/lib/validation/phones";

export function phonesMatch(a: string, b: string): boolean {
  const na = normalizeIndiaPhone(a);
  const nb = normalizeIndiaPhone(b);
  if (!na || !nb) return false;
  return na === nb;
}

export const DUPLICATE_EMERGENCY_WARNING =
  "Emergency contact is the same as the primary number. Consider using a different contact for emergencies.";

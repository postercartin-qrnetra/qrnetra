const INDIAN_PLATE_RE = /^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{1,4}$/;

export function normalizeVehicleNumber(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export function isValidIndianVehicleNumber(input: string): boolean {
  const normalized = normalizeVehicleNumber(input);
  if (!normalized) return false;
  return INDIAN_PLATE_RE.test(normalized);
}

export const VEHICLE_NUMBER_ERROR =
  "Enter a valid Indian vehicle registration number. Example: TN74AS3933";

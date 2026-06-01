import { normalizeAssetId } from "@/lib/validation/asset-id";
import { normalizeUpperName } from "@/lib/validation/names";
import { normalizeVehicleNumber } from "@/lib/validation/vehicle";

export type FieldNormalizeKind =
  | "upper"
  | "vehicle"
  | "assetId"
  | "phone"
  | "none";

const UPPER_FIELDS = new Set([
  "full_name",
  "child_name",
  "parent_name",
  "pet_name",
  "owner_name",
  "asset_name",
  "company_name",
  "responsible_person",
  "vehicle_number",
  "vehicle_type",
  "breed",
  "pet_color",
  "blood_group",
  "school_name",
  "class_name",
]);

export function normalizeFieldValue(
  name: string,
  value: string,
  kind?: FieldNormalizeKind,
): string {
  if (name === "email" || name.endsWith("_email")) return value;
  const resolved =
    kind ??
    (name === "vehicle_number"
      ? "vehicle"
      : name === "asset_id"
        ? "assetId"
        : UPPER_FIELDS.has(name)
          ? "upper"
          : "none");

  switch (resolved) {
    case "vehicle":
      return normalizeVehicleNumber(value);
    case "assetId":
      return normalizeAssetId(value);
    case "upper":
      return normalizeUpperName(value);
    case "phone":
      return value.replace(/\D/g, "").slice(0, 10);
    default:
      return value;
  }
}

export function fieldNormalizeKind(name: string): FieldNormalizeKind {
  if (name === "vehicle_number") return "vehicle";
  if (name === "asset_id") return "assetId";
  if (UPPER_FIELDS.has(name)) return "upper";
  if (name.includes("contact") || name === "phone" || name === "whatsapp")
    return "phone";
  return "none";
}

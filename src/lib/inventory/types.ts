export const TAG_PRODUCT_TYPES = [
  "vehicle_sticker",
  "pet_tag",
  "child_wristband",
  "child_bag_tag",
  "business_asset_tag",
] as const;

export type TagProductType = (typeof TAG_PRODUCT_TYPES)[number];

export const TAG_FAMILIES = ["V", "P", "C", "B"] as const;
export type TagFamily = (typeof TAG_FAMILIES)[number];

export const INVENTORY_CHANNELS = [
  "amazon",
  "flipkart",
  "website",
  "retail",
  "distributor",
  "internal",
] as const;

export type InventoryChannel = (typeof INVENTORY_CHANNELS)[number];

export const TAG_STATUSES = [
  "generated",
  "printed",
  "reserved",
  "sold",
  "activated",
  "disabled",
  "locked",
  "transferred",
  "replaced",
] as const;

export type TagUnitStatus = (typeof TAG_STATUSES)[number];

export const PRODUCT_TYPE_LABELS: Record<TagProductType, string> = {
  vehicle_sticker: "Vehicle QR Sticker",
  pet_tag: "Pet QR Tag",
  child_wristband: "Child Safety Wristband",
  child_bag_tag: "Child School Bag Tag",
  business_asset_tag: "Business Asset Tag",
};

export function productTypeToFamily(productType: TagProductType): TagFamily {
  switch (productType) {
    case "vehicle_sticker":
      return "V";
    case "pet_tag":
      return "P";
    case "child_wristband":
      return "C";
    case "child_bag_tag":
    case "business_asset_tag":
      return "B";
    default:
      return "V";
  }
}

export function formatPublicTagId(family: TagFamily, serial: number): string {
  return `${family}-QRN-${String(serial).padStart(6, "0")}`;
}

export function normalizePublicTagId(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function productTypeToQrKind(
  productType: TagProductType | null | undefined,
): "vehicle" | "pet" | "child" | "asset" {
  switch (productType) {
    case "pet_tag":
      return "pet";
    case "child_wristband":
    case "child_bag_tag":
      return "child";
    case "business_asset_tag":
      return "asset";
    case "vehicle_sticker":
    default:
      return "vehicle";
  }
}

export function productTypeToProfileVariant(
  productType: TagProductType | null | undefined,
): "vehicle" | "pet" | "child_wristband" | "child_school_bag" | undefined {
  switch (productType) {
    case "vehicle_sticker":
      return "vehicle";
    case "pet_tag":
      return "pet";
    case "child_wristband":
      return "child_wristband";
    case "child_bag_tag":
      return "child_school_bag";
    default:
      return undefined;
  }
}

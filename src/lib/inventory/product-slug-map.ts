import type { TagProductType } from "@/lib/inventory/types";

const SLUG_TO_PRODUCT_TYPE: Record<string, TagProductType> = {
  "vehicle-qr-sticker": "vehicle_sticker",
  "pet-collar-qr-tag": "pet_tag",
  "child-safety-wristband": "child_wristband",
  "child-school-bag-tag": "child_bag_tag",
};

export function catalogSlugToProductType(slug: string): TagProductType | null {
  return SLUG_TO_PRODUCT_TYPE[slug] ?? null;
}

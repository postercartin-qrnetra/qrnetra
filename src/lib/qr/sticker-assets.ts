import type { QrKind } from "@/lib/qr/types";

export type StickerAssetMeta = {
  /** Download filename segment, e.g. vehicle-sticker */
  assetKey: string;
  /** Print / sticker headline */
  title: string;
  /** Short finder instructions on sticker and PDF */
  instructions: string[];
  /** Accent label under QRNetra brand */
  categoryLabel: string;
};

const STICKER_BY_PRODUCT: Record<string, StickerAssetMeta> = {
  "vehicle-qr-sticker": {
    assetKey: "vehicle-qr-sticker",
    title: "Vehicle QR Sticker",
    categoryLabel: "Scan To Contact Owner",
    instructions: [
      "Place on the inside windshield or another visible clean vehicle surface.",
      "A finder can scan for wrong parking, emergency contact, or urgent help.",
      "Update your profile anytime from the dashboard without replacing the sticker.",
    ],
  },
  "pet-collar-qr-tag": {
    assetKey: "pet-collar-qr-tag",
    title: "Pet Collar QR Tag",
    categoryLabel: "Scan If Found",
    instructions: [
      "Attach to a collar or harness where the QR remains visible.",
      "A finder can scan to view owner contact and pet recovery details.",
      "Keep pet, vet, and reward notes updated from your dashboard anytime.",
    ],
  },
  "child-safety-wristband": {
    assetKey: "child-safety-wristband",
    title: "Child Safety Wristband",
    categoryLabel: "Emergency Contact QR",
    instructions: [
      "Use during travel, outings, events, and crowded public spaces.",
      "A scan opens the linked child safety profile with guardian details.",
      "Update emergency notes and contacts from your dashboard without reprinting.",
    ],
  },
  "child-school-bag-tag": {
    assetKey: "child-school-bag-tag",
    title: "Child School Bag Tag",
    categoryLabel: "School Safety QR",
    instructions: [
      "Attach to a school bag, zipper loop, or ID holder.",
      "A scan can reveal parent, school, and emergency contact information.",
      "Keep school and class details current from your dashboard without changing the tag.",
    ],
  },
};

const STICKER_BY_KIND: Record<QrKind, StickerAssetMeta> = {
  vehicle: {
    assetKey: "vehicle-sticker",
    title: "Vehicle Sticker",
    categoryLabel: "Emergency Vehicle QR",
    instructions: [
      "Peel and place on the inside windshield (driver side, lower corner).",
      "Scan with any phone camera — no app required.",
      "Finder sees your emergency contacts and notes instantly.",
    ],
  },
  child: {
    assetKey: "child-safety-sticker",
    title: "Child Safety Sticker",
    categoryLabel: "Child Safety QR",
    instructions: [
      "Attach to bag, ID card, or clothing label (waterproof sleeve recommended).",
      "Scan to reach parent/guardian and see medical details.",
      "Update details anytime from your dashboard — this QR stays the same.",
    ],
  },
  pet: {
    assetKey: "pet-tag-sticker",
    title: "Pet Tag Sticker",
    categoryLabel: "Pet Tag QR",
    instructions: [
      "Affix to collar tag or laminate for outdoor use.",
      "Finder can call owner or vet contacts after scanning.",
      "Reward note and medical info appear on the scan page.",
    ],
  },
  asset: {
    assetKey: "asset-recovery-sticker",
    title: "Personal Asset Sticker",
    categoryLabel: "Asset Recovery QR",
    instructions: [
      "Attach to bags, wallets, laptops, luggage, or keys.",
      "Scan helps the finder contact the owner without exposing personal details.",
      "Update instructions anytime from your dashboard.",
    ],
  },
  business: {
    assetKey: "business-asset-sticker",
    title: "Business Asset Sticker",
    categoryLabel: "Business Asset QR",
    instructions: [
      "Place on equipment, fleet vehicles, or facility assets.",
      "Scan routes to escalation contacts and asset details.",
      "Ideal for warehouses, rentals, and shared equipment.",
    ],
  },
};

export function getStickerAssetMeta(
  kind: string,
  productSlug?: string | null,
): StickerAssetMeta {
  if (productSlug && productSlug in STICKER_BY_PRODUCT) {
    return STICKER_BY_PRODUCT[productSlug];
  }
  if (kind in STICKER_BY_KIND) {
    return STICKER_BY_KIND[kind as QrKind];
  }
  return STICKER_BY_KIND.vehicle;
}

export const STICKER_KINDS: QrKind[] = [
  "vehicle",
  "child",
  "pet",
  "asset",
  "business",
];

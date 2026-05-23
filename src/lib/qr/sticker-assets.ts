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

export function getStickerAssetMeta(kind: string): StickerAssetMeta {
  if (kind in STICKER_BY_KIND) {
    return STICKER_BY_KIND[kind as QrKind];
  }
  return STICKER_BY_KIND.vehicle;
}

export const STICKER_KINDS: QrKind[] = ["vehicle", "child", "pet", "business"];

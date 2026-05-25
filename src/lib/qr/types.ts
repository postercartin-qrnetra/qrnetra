export type QrKind = "vehicle" | "child" | "pet" | "asset" | "business";

export const QR_KINDS: QrKind[] = [
  "vehicle",
  "child",
  "pet",
  "asset",
  "business",
];

export function isQrKind(v: string): v is QrKind {
  return QR_KINDS.includes(v as QrKind);
}

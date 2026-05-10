export type QrKind = "vehicle" | "child" | "pet" | "business";

export const QR_KINDS: QrKind[] = ["vehicle", "child", "pet", "business"];

export function isQrKind(v: string): v is QrKind {
  return QR_KINDS.includes(v as QrKind);
}

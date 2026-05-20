import QRCode from "qrcode";

export type QrImageAssets = {
  /** Data URL — use for PNG download */
  pngDataUrl: string;
  /** Raw SVG string */
  svg: string;
};

/**
 * Encode ONLY the public scan URL — never phone numbers or profile data.
 */
export async function generateQrImageAssets(
  scanUrl: string,
): Promise<QrImageAssets> {
  const [pngDataUrl, svg] = await Promise.all([
    QRCode.toDataURL(scanUrl, {
      margin: 2,
      width: 512,
      color: { dark: "#111111", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }),
    QRCode.toString(scanUrl, {
      type: "svg",
      margin: 2,
      color: { dark: "#111111", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }),
  ]);

  return { pngDataUrl, svg };
}

import { getStickerAssetMeta } from "@/lib/qr/sticker-assets";
import type { QrKind } from "@/lib/qr/types";

export type StickerDownloadInput = {
  qrDataUrl: string;
  scanUrl: string;
  slug: string;
  kind: QrKind | string;
  productSlug?: string | null;
  title: string;
  subtitle?: string | null;
};

const BRAND = "QRNetra";
const BRAND_YELLOW = "#ff6b2c";
const BRAND_DARK = "#020817";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load QR image"));
    img.src = src;
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let cy = y;

  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[n] + " ";
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy + lineHeight;
}

/**
 * Renders a print-ready sticker PNG (900×1200) with branding, QR, and instructions.
 */
export async function renderStickerPng(
  input: StickerDownloadInput,
): Promise<string> {
  const meta = getStickerAssetMeta(input.kind, input.productSlug);
  const W = 900;
  const H = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = BRAND_DARK;
  ctx.fillRect(0, 0, W, 56);
  ctx.fillStyle = BRAND_YELLOW;
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.fillText(BRAND, 40, 36);

  ctx.fillStyle = "#666";
  ctx.font = "600 14px system-ui, sans-serif";
  ctx.fillText(meta.categoryLabel.toUpperCase(), 40, 88);

  ctx.fillStyle = BRAND_DARK;
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillText(meta.title, 40, 132);

  if (input.subtitle?.trim()) {
    ctx.fillStyle = "#444";
    ctx.font = "600 22px system-ui, sans-serif";
    ctx.fillText(input.subtitle.trim(), 40, 168);
  }

  const qrImg = await loadImage(input.qrDataUrl);
  const qrSize = 420;
  const qrX = (W - qrSize) / 2;
  const qrY = 200;
  ctx.fillStyle = BRAND_DARK;
  ctx.beginPath();
  ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 20);
  ctx.fill();
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "#333";
  ctx.font = "600 16px system-ui, sans-serif";
  let y = qrY + qrSize + 56;
  const pad = 48;
  const maxW = W - pad * 2;

  ctx.fillStyle = "#888";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("HOW TO USE", pad, y);
  y += 28;

  ctx.fillStyle = "#333";
  ctx.font = "15px system-ui, sans-serif";
  for (let i = 0; i < meta.instructions.length; i++) {
    const line = `${i + 1}. ${meta.instructions[i]}`;
    y = wrapCanvasText(ctx, line, pad, y, maxW, 22);
    y += 8;
  }

  ctx.fillStyle = "#aaa";
  ctx.font = "12px monospace, sans-serif";
  ctx.fillText(`Scan ID · ${input.slug}`, pad, H - 48);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText(input.scanUrl, pad, H - 28);

  return canvas.toDataURL("image/png");
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export async function downloadStickerPng(input: StickerDownloadInput): Promise<void> {
  const meta = getStickerAssetMeta(input.kind, input.productSlug);
  const png = await renderStickerPng(input);
  triggerDownload(png, `qrnetra-${meta.assetKey}-${input.slug}.png`);
}

export async function downloadRawQrPng(
  qrDataUrl: string,
  slug: string,
): Promise<void> {
  triggerDownload(qrDataUrl, `qrnetra-qr-${slug}.png`);
}

/**
 * Print-friendly A5 PDF with branding, QR, category title, instructions, and slug.
 */
export async function downloadStickerPdf(
  input: StickerDownloadInput,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const meta = getStickerAssetMeta(input.kind, input.productSlug);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;

  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageW, 12, "F");
  doc.setTextColor(255, 212, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(BRAND.toUpperCase(), margin, 8);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.text(meta.categoryLabel.toUpperCase(), margin, 20);

  doc.setTextColor(17, 17, 17);
  doc.setFontSize(16);
  doc.text(meta.title, margin, 30);

  if (input.subtitle?.trim()) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(input.subtitle.trim(), margin, 38);
  }

  const qrSize = 72;
  const qrX = (pageW - qrSize) / 2;
  doc.setFillColor(17, 17, 17);
  doc.roundedRect(qrX - 3, 44, qrSize + 6, qrSize + 6, 3, 3, "F");
  doc.addImage(input.qrDataUrl, "PNG", qrX, 47, qrSize, qrSize);

  doc.setTextColor(17, 17, 17);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("How to use", margin, 130);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let y = 137;
  meta.instructions.forEach((line, i) => {
    const wrapped = doc.splitTextToSize(
      `${i + 1}. ${line}`,
      pageW - margin * 2,
    ) as string[];
    doc.text(wrapped, margin, y);
    y += wrapped.length * 5 + 2;
  });

  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y + 4, pageW - margin, y + 4);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text("QRNetra · Privacy-first emergency identity", margin, y + 12);
  doc.setFont("courier", "normal");
  doc.text(`Scan ID · ${input.slug}`, margin, y + 18);
  doc.setFont("helvetica", "normal");
  const urlLines = doc.splitTextToSize(input.scanUrl, pageW - margin * 2) as string[];
  doc.text(urlLines, margin, y + 24);

  doc.save(`qrnetra-${meta.assetKey}-${input.slug}.pdf`);
}

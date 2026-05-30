import "server-only";

import { jsPDF } from "jspdf";
import JSZip from "jszip";
import QRCode from "qrcode";
import { PRODUCT_TYPE_LABELS, type TagProductType } from "@/lib/inventory/types";
import { getPublicSiteUrl } from "@/lib/site-url";

export type BatchUnitRow = {
  public_tag_id: string;
  activation_code: string;
  preset_slug: string | null;
  product_type: string | null;
};

function productLabel(productType: string | null): string {
  if (productType && productType in PRODUCT_TYPE_LABELS) {
    return PRODUCT_TYPE_LABELS[productType as TagProductType];
  }
  return "QRNetra Tag";
}

function categoryLine(productType: string | null): string {
  switch (productType) {
    case "vehicle_sticker":
      return "Scan To Contact Owner";
    case "pet_tag":
      return "I Am Lost — Scan To Help";
    case "child_wristband":
      return "Emergency Information";
    case "child_bag_tag":
      return "School Safety QR";
    default:
      return "Scan For Contact";
  }
}

async function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 280,
    color: { dark: "#020817", light: "#ffffff" },
  });
}

/** One sticker per PDF page (production sheet). */
export async function buildBatchPrintPdf(units: BatchUnitRow[]): Promise<Uint8Array> {
  const site = getPublicSiteUrl();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  for (let i = 0; i < units.length; i++) {
    const unit = units[i]!;
    if (i > 0) doc.addPage();

    const tagId = unit.public_tag_id;
    const activationUrl = `${site}/activate/${encodeURIComponent(tagId)}`;
    const qr = await qrDataUrl(activationUrl);
    const label = productLabel(unit.product_type);
    const category = categoryLine(unit.product_type);

    doc.setFillColor(2, 8, 23);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("QRNetra", 105, 28, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(255, 107, 44);
    doc.text(category, 105, 36, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(label, 105, 46, { align: "center" });

    doc.addImage(qr, "PNG", 55, 58, 100, 100);

    doc.setFontSize(12);
    doc.text(`Tag ID: ${tagId}`, 105, 172, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Activation code: ${unit.activation_code}`, 105, 180, { align: "center" });
    doc.text("For factory / packaging — not for public display after sale", 105, 188, {
      align: "center",
    });
  }

  return new Uint8Array(doc.output("arraybuffer"));
}

export async function buildBatchPrintZip(units: BatchUnitRow[]): Promise<Uint8Array> {
  const site = getPublicSiteUrl();
  const zip = new JSZip();
  const qrFolder = zip.folder("qr-png");
  const csvRows = [
    "Tag ID,Activation Code,Activation URL,Public Scan URL",
  ];

  for (const unit of units) {
    const tagId = unit.public_tag_id;
    const activationUrl = `${site}/activate/${encodeURIComponent(tagId)}`;
    const scanUrl = unit.preset_slug ? `${site}/s/${unit.preset_slug}` : "";
    const png = await QRCode.toBuffer(activationUrl, { width: 512, margin: 2 });
    qrFolder?.file(`${tagId}.png`, png);
    csvRows.push(
      `"${tagId}","${unit.activation_code}","${activationUrl}","${scanUrl}"`,
    );
  }

  zip.file("inventory.csv", csvRows.join("\n"));
  return zip.generateAsync({ type: "uint8array" });
}

/** Welcome insert for all physical products. */
export async function buildPackagingInsertPdf(): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  doc.setFillColor(2, 8, 23);
  doc.rect(0, 0, 148, 210, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Welcome To QRNetra", 74, 24, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(220, 220, 220);
  const steps = [
    "1. Scan the QR code on your product",
    "2. Sign in with your email",
    "3. Enter your activation code from this card",
    "4. Fill in your emergency profile details",
    "5. Attach the product as directed",
  ];
  let y = 42;
  for (const step of steps) {
    doc.text(step, 20, y);
    y += 12;
  }
  doc.setTextColor(255, 107, 44);
  doc.text("Need help? qrnetra.com/activation-guide", 74, 190, { align: "center" });
  return new Uint8Array(doc.output("arraybuffer"));
}

import { ScanPageClient } from "@/components/scan/scan-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan Tag · QR Netra",
  description:
    "Scan QRNetra safety tags to open the public scan page, jump into your owner dashboard, or activate a newly purchased sticker.",
};

export default function ScanPage() {
  return <ScanPageClient />;
}

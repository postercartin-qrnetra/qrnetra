import { LegalPageLayout } from "@/components/content/legal-page-layout";
import { disclaimerContent } from "@/content/legal/disclaimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | QRNetra",
  description: disclaimerContent.description,
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      content={disclaimerContent}
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/disclaimer", label: "Disclaimer" },
      ]}
    />
  );
}

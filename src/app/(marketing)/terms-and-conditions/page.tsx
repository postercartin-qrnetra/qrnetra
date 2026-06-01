import { LegalPageLayout } from "@/components/content/legal-page-layout";
import { termsContent } from "@/content/legal/terms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | QRNetra",
  description: termsContent.description,
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      content={termsContent}
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/terms-and-conditions", label: "Terms" },
      ]}
    />
  );
}

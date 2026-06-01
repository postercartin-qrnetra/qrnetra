import { LegalPageLayout } from "@/components/content/legal-page-layout";
import { refundPolicyContent } from "@/content/legal/refund";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | QRNetra",
  description: refundPolicyContent.description,
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      content={refundPolicyContent}
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/refund-policy", label: "Refund Policy" },
      ]}
    />
  );
}

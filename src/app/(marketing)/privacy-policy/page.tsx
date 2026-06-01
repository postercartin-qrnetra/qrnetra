import { LegalPageLayout } from "@/components/content/legal-page-layout";
import { privacyPolicyContent } from "@/content/legal/privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | QRNetra",
  description: privacyPolicyContent.description,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      content={privacyPolicyContent}
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/privacy-policy", label: "Privacy" },
      ]}
    />
  );
}

import { LegalPageLayout } from "@/components/content/legal-page-layout";
import { cookiePolicyContent } from "@/content/legal/cookies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | QRNetra",
  description: cookiePolicyContent.description,
};

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      content={cookiePolicyContent}
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/cookie-policy", label: "Cookies" },
      ]}
    />
  );
}

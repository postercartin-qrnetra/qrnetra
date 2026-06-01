import { LegalPageLayout } from "@/components/content/legal-page-layout";
import { shippingPolicyContent } from "@/content/legal/shipping";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | QRNetra",
  description: shippingPolicyContent.description,
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      content={shippingPolicyContent}
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/shipping-policy", label: "Shipping" },
      ]}
    />
  );
}

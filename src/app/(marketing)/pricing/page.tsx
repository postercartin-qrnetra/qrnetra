import { StubPage } from "@/components/stub-page";

export default function PricingPage() {
  return (
    <StubPage
      title="Pricing"
      description="Starter packs, family bundles, and fleet pricing — INR, COD options, and GST-compliant invoicing will appear here."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/pricing", label: "Pricing" }]}
    />
  );
}

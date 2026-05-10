import { StubPage } from "@/components/stub-page";

export default function ShippingPolicyPage() {
  return (
    <StubPage
      title="Shipping policy"
      description="Dispatch timelines, carriers, and COD handling."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/shipping-policy", label: "Shipping" }]}
    />
  );
}

import { StubPage } from "@/components/stub-page";

export default function RefundPolicyPage() {
  return (
    <StubPage
      title="Refund policy"
      description="Returns and refunds for physical QR products — India ecommerce clarity."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/refund-policy", label: "Refunds" }]}
    />
  );
}

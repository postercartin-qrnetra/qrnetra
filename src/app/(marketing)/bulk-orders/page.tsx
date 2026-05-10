import { StubPage } from "@/components/stub-page";

export default function BulkOrdersPage() {
  return (
    <StubPage
      title="Bulk orders"
      description="Schools, RWAs, fleets, and companies — lead capture and custom branding will live here."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/bulk-orders", label: "Bulk orders" }]}
    />
  );
}

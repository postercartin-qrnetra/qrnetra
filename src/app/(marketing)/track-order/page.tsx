import { StubPage } from "@/components/stub-page";

export default function TrackOrderPage() {
  return (
    <StubPage
      title="Track order"
      description="Look up dispatch status by order ID or phone — carrier integration later."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/track-order", label: "Track order" }]}
    />
  );
}

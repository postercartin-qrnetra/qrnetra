import { StubPage } from "@/components/stub-page";

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <StubPage
        title="Activate your tag"
        description="Scan the physical QR or enter your activation code to bind this tag to your account."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/activate", label: "Activate" }]}
      />
    </div>
  );
}

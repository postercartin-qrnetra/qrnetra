import { StubPage } from "@/components/stub-page";

export default function CreateQrPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <StubPage
        title="Create dynamic QR profile"
        description="Wizard: choose type → emergency fields → privacy → preview. Persist requires authentication — see master plan."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/create", label: "Create" }]}
      />
    </div>
  );
}

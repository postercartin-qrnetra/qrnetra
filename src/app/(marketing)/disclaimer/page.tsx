import { StubPage } from "@/components/stub-page";

export default function DisclaimerPage() {
  return (
    <StubPage
      title="Disclaimer"
      description="Limits of liability for emergency contact relay — legal review required."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/disclaimer", label: "Disclaimer" }]}
    />
  );
}

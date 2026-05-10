import { StubPage } from "@/components/stub-page";

export default function HowItWorksPage() {
  return (
    <StubPage
      title="How it works"
      description="Buy a physical tag, activate your QR, and manage your emergency profile from the dashboard. Finders scan — your details stay private."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/how-it-works", label: "How it works" }]}
    />
  );
}

import { StubPage } from "@/components/stub-page";

export default function AboutPage() {
  return (
    <StubPage
      title="About QRNetra"
      description="Mission, safety-first vision, and why we built privacy-preserving QR emergency contact for Indian families and fleets."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/about", label: "About" }]}
    />
  );
}

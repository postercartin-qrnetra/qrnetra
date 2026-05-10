import { StubPage } from "@/components/stub-page";

export default function ContactPage() {
  return (
    <StubPage
      title="Contact"
      description="Support form, WhatsApp, and email — wire-up coming soon."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]}
    />
  );
}

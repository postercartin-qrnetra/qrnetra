import { StubPage } from "@/components/stub-page";

export default function TermsPage() {
  return (
    <StubPage
      title="Terms & conditions"
      description="Terms of sale and service — replace with counsel-reviewed copy."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/terms-and-conditions", label: "Terms" }]}
    />
  );
}

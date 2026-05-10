import { StubPage } from "@/components/stub-page";

export default function PrivacyPolicyPage() {
  return (
    <StubPage
      title="Privacy policy"
      description="DPDP-aligned policy draft — replace with counsel-reviewed copy before launch."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/privacy-policy", label: "Privacy" }]}
    />
  );
}

import { StubPage } from "@/components/stub-page";

export default function CookiePolicyPage() {
  return (
    <StubPage
      title="Cookie policy"
      description="Cookies and analytics — minimal footprint for a safety brand."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/cookie-policy", label: "Cookies" }]}
    />
  );
}

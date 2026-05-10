import { StubPage } from "@/components/stub-page";

export default function BlogIndexPage() {
  return (
    <StubPage
      title="Blog"
      description="SEO articles — parking safety, child safety, pet recovery, QR in India."
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }]}
    />
  );
}
